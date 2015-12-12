var extend = require("extend");
var RecursiveIterator = require('recursive-iterator');
var YAML = require('yamljs');


function Configuration(settings) {

    settings = settings || {};

    extend(true, this, settings);

    this.reservedNames = [
        'default',
        'error',
    ];

    this.packages = [];

    //iterate through the entire file and pull out any packages that will be used
    var r = null,
        iterator = new RecursiveIterator(
            settings
        );
    while (!(r = iterator.next()).done) {
        if (r.value.key == "package") this.packages.push(r.value.node);
        r = iterator.next();
    }

}


function getExtension(filename) {
    filename = filename || "";
    filename = filename.toLowerCase();
    var re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}


Configuration.prototype.save = function save(filename, done) {

    var configurationString = "";

    var extension = getExtension(filename);

    if (extension == 'yaml') {
        configurationString = YAML.stringify(this);
    } else if (extension == 'json' || extension == 'js') {
        configurationString = JSON.stringify(this);
    } else {
        return done(new Error('This extension is not supported. Supported extensions are `yaml`, `js`, `json`.'));
    }

    fs.writeFileSync(filename, configurationString, "utf-8");

    return done && done();
}


Configuration.prototype.getChannel = function getChannel(name) {
    name = name || "";
    name = name.toLowerCase();
    if (this.channels && this.channels[name]) return this.channels[name];
    return null;
}


Configuration.prototype.isReservedName = function isReservedName(name) {
    name = name || "";
    name = name.toLowerCase();
    if (this.reservedNames.indexOf(name) >= 0) {
        return true;
    }
    return false;
}


Configuration.prototype.isAvailableName = function isAvailableName(name) {
    name = name || "";
    name = name.toLowerCase();

    if (this.isReservedName(name) || this.getChannel(name)) {
        return false;
    }

    return true;

}

module.exports = Configuration;