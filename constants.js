/**
 * Created by tinyiko on 2017/04/15.
 */
"use strict";

const EARTH_RADIUS = 1000 * 6378.1; // (km = 6378.1) - radius of the earth
//const default_dispatch_radius = 31885;    //meters
const DEFAULT_DISPATCH_RADIUS = 31885;
//const kEarthCircumferenceMeters = 1000 * 40075.017;
const KEARTH_CIRCUMFERENCE_METERS = 1000 * 40075.017;

const S2_CELL_MIN_LEVEL = 12; //5541846 sqm (5.5 km2)
const S2_CELL_MIDDLE_LEVEL = 13; //1386091 sqm (1.3 km2)
const S2_CELL_MAX_LEVEL = 14;  //346697 sqm
const S2_CELL_BLOCK_LEVEL = 17; //5417 sqm
const S2_CELL_HOUSE_LEVEL = 18; //1377 sqm
const DEFAULT_CITY_MAX_CELLS = 1000;

const RIDER_GEO_RADIUS = 2680;
const DEFAULT_RIDER_MAX_CELLS = 100;

const EXPIRE_DRIVER_GPS = 3600; //60 minutes
const EXPIRE_PASSENGER_GPS = 600; //10 minutes

exports.S2_CELL_MIN_LEVEL = S2_CELL_MIN_LEVEL;
exports.S2_CELL_MAX_LEVEL = S2_CELL_MAX_LEVEL
exports.DEFAULT_CITY_MAX_CELLS = DEFAULT_CITY_MAX_CELLS;
exports.DEFAULT_RIDER_MAX_CELLS = DEFAULT_RIDER_MAX_CELLS;
exports.S2_CELL_MIDDLE_LEVEL = S2_CELL_MIDDLE_LEVEL;

exports.RIDER_GEO_RADIUS = RIDER_GEO_RADIUS;
exports.EXPIRE_DRIVER_GPS = EXPIRE_DRIVER_GPS;
exports.EXPIRE_PASSENGER_GPS = EXPIRE_PASSENGER_GPS;

exports.KEARTH_CIRCUMFERENCE_METERS = KEARTH_CIRCUMFERENCE_METERS;
exports.EARTH_RADIUS = EARTH_RADIUS;




