// This library utilizes these public APIs:
// https://open-meteo.com/
// https://ip-api.com/

libName("geo");
depend("net");

const geo = {}

/***
 * Searches for real life locations with the given query and returns the results to the callback function
 * @param {String} query
 * @param {Function} callback Callback function called with the result array
 */
geo.searchLocations = function(query, callback) {
    const url = "http://geocoding-api.open-meteo.com/v1/search?name="; // using https gives response code 0 on the 3DS
    
    if(!net.isDomainAllowed(net.getDomain(url))) {
        throw new Error("Please add 'geocoding-api.open-meteo.com' to the allowed CORS domains");
    }
    
    net.httpGet(url+query, function(code, body) {
        const jsonBody = JSON.parse(body);
        var results = [];
        const gottenResults = jsonBody["results"];
        if(gottenResults) results = gottenResults;
        callback(results);
    });
}

/***
 * Searches for the first real life location with the given query and returns the location data to the callback function
 * @param {String} query
 * @param {Function} callback Callback function called with the result array
 */
geo.findFirstLocation = function(query, callback) {
    searchLocations(query, function(results){
        if(results.length === 0) callback(null);
        callback(results[0]);
    });
}

/***
 * Finds the approximate user's geolocation based on their IP address.
 * @param {Function} callback Callback function called with the result JSON object
 */
geo.approximateUserLocation = function(callback) {
    const url = "http://ip-api.com/json"; // Free tier of this API doesn't support SSL (so no HTTPS)

    if(!net.isDomainAllowed(net.getDomain(url))) {
        throw new Error("Please add 'ip-api.co' to the allowed CORS domains");
    }

    net.httpGet(url,function(code, body) {
        const jsonBody = JSON.parse(body);
        callback(jsonBody);
    }, true);
}