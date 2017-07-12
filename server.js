/**
 * Created by tinyiko on 2017/03/28.
 */
/**
 * Dispatch module for taxi request dispatching and queuing.
 * Some of the functions of this module are listed below:-
 *
 * -Search closest drivers using redis (i.e. memcache)
 * -Do all distance calculations
 * -Push distance/trip logs to billing engine using RabbitMQ
 * -Log all gps data
 * -Push to RabbitMQ
 * -Kalmer filter (algorithm to smooth gps points along a route)
 * -Rider/driver matching algorithms when doing car pooling
 * -create a directed trip graph that represents (trip pooling)
 * -Optimal route estimates
 * -Display driver location to riders all the time in real-time
 * -Keep trip logs in redis hash-map
 * -Keep driver logs in redis hash-map
 * -Keep rider logs in redis hash-map
 * -
 * Author: Tinykov
 */
"use strict";

var http = require("http");
var express = require("express");
var TChannel = require("tchannel");
var TChannelThrift = require("tchannel/as/thrift");
var fs = require("fs");
var redis = require("./redis/redisProvider").provider;
var s2circle = require("./s2geometry/s2circlecoverer");
var init = require("./config/init");
var path = require('path');
var logger = require("./config/logutil").logger;
var constant = require('constants');
var tripRequest = require("./api/tripRequest").tripRequest;
var driverRequest = require("./api/driverLocation").driverLocation;

//var grid = null;
var tchannel_port = 4040;
var rider_radius = constant.RIDER_GEO_RADIUS;

var app = express();
//logger.log(JSON.stringify(init.server));

/*var t_server = new TChannel();
var t_client = new TChannel();*/

/*
redis.getCityGrid().then(function(grid_cells){
   global.grid = grid_cells;
});
*/

var vehiclePosition = function (id, key, lat, lon) {
    this.vehicle_id = id;
    this.s2_position = key;
    this.latitude = lat;
    this.longitude = lon;
};

var server = new TChannel({
    serviceName: "t-server"
})

var thriftChannel = new TChannelThrift({
    channel: server,
    source: fs.readFileSync(
        path.join(__dirname, './api/thrift', 'tripService.thrift'), 'utf8'
    )
});

var context = {
    logger: logger
};
thriftChannel.register(server, "tripService::getVehiclesNearRider", context, getVehiclesNearRider);
thriftChannel.register(server, "tripService::updateDriverLocation", context, updateDriverLocation)

/**
 * TChannel RPC implementation of getVehiclesNearRider over Thrift IDL
 * @param context
 * @param req
 * @param head
 * @param body
 * @param callback
 */
function getVehiclesNearRider(context, req, head, body, callback) {
    logger.log("Thrift::->tripServices fired...");
    console.log("req:" + req);
    console.log("head" + JSON.stringify(head));
    console.log("body" + JSON.stringify(body));

    tripRequest.callGetVehiclesNear(body.lat, body.lon, rider_radius, global.grid, function (vehicles) {
        callback(null, {
            ok: true,
            head: head,
            body: vehicles
        });
    });
}

/**
 * TChannel RPC implementation of updateDriverLocation over Thrift IDL
 * @param context
 * @param req
 * @param head
 * @param body
 * @param callback
 */
function updateDriverLocation(context, req, head, body, callback) {
    var lat = body.lat;
    var lng = body.lon;
    var vehicle_id = body.vehicle_id;

    //console.log("thrift function call, body" + JSON.stringify(body));
    driverRequest.logDriverLocation(vehicle_id,lat,lng);
    callback(null, {
        ok: true,
        head: head,
        body: "ok"
    });
}

server.listen(tchannel_port, "127.0.0.1", function onListen() {
    var lat = init.city.lat;
    var lon = init.city.lon;
    var radius = init.city.radius;
    var cityhub = init.city.name;
    var hub_centre = init.city.centre;

    logger.log(JSON.stringify(init));
    s2circle.S2CircleCoverer.initialise(lat, lon, radius, function (grid_data) {
        global.grid = grid_data;
    });
    logger.log("TChannel server running on port:" + tchannel_port);
});


