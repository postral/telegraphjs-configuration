var YAML = require('yamljs');
var fs = require('fs');
var Configuration = require('./Configuration');
var request = require('request');

function getExtension(filename) {
    filename = filename || "";
    filename = filename.toLowerCase();
    var re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}


function loadFromUrl(url, parseType, done) {

    //parseType is optional
    if (typeof parseType == "function") {
        done = parseType;
        parseType = null;
    }

    request.get(url, function(err, response, configurationString) {
    	if (err) return done(err);
    	if (!configurationString) return done();
    	return loadFromString(configurationString, parseType || getExtension(url), done);
    });

}




function loadFromFile(filename, parseType, done) {

    //parseType is optional
    if (typeof parseType == "function") {
        done = parseType;
        parseType = null;
    }

    var configurationString = "";

    try {
        configurationString = require("fs").readFileSync(filename, "utf-8");
    } catch (e) {
        return done(e);
    }

    loadFromString(configurationString, parseType || getExtension(filename), done);

}


function loadFromString(configurationString, parseType, done) {
    parseType = parseType || "";
    parseType = parseType.toLowerCase();

    if (parseType == 'yaml') {
        try {
            return loadFromObject(YAML.parse(configurationString), done);
        } catch (e) {
            return done(e);
        }
    }

    if (parseType == 'json' || parseType == 'js') {
        try {
            return loadFromObject(JSON.parse(configurationString), done);
        } catch (e) {
            return done(e);
        }
    }

    return done(new Error("parseType `" + parseType + "` not recognized"));

}


function loadFromObject(config, done) {
    config = config || {};

    var c = null;

    try {
        c = new Configuration(config);
    } catch (e) {
        return done(e);
    }

    return done(null, c);
}


module.exports = {
	loadFromObject: loadFromObject,
	loadFromFile : loadFromFile,
	loadFromUrl : loadFromUrl,
	loadFromString : loadFromString,
};