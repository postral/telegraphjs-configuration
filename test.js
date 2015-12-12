var assert = require("assert");
var extend = require("extend");
var fs = require("fs");
var config = require('./index');
var YAML = require('yamljs');


var sampleConfig = {
    channels: {
        channel1: {
            steps: [{
                package: 'package1',
                params: {
                    foo: "bar"
                }
            }]
        }
    }
};


describe('telegraphjs-configuration', function() {



    it('can load via loadFromObject', function(done) {

        config.loadFromObject(sampleConfig, function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });

    it('can load via loadFromString as YAML', function(done) {

        var configurationString = YAML.stringify(sampleConfig);

        config.loadFromString(configurationString, 'yaml', function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });

    it('can load via loadFromString as JSON', function(done) {

        var configurationString = JSON.stringify(sampleConfig);

        config.loadFromString(configurationString, 'json', function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });




    it('can load via loadFromFile as YAML', function(done) {

        fs.writeFileSync(__dirname + '/test.yaml', YAML.stringify(sampleConfig), 'utf-8');

        config.loadFromFile(__dirname + '/test.yaml', function(err, configuration) {

            fs.unlinkSync(__dirname + '/test.yaml');

            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });



    it('can load via loadFromFile as JSON', function(done) {

        fs.writeFileSync(__dirname + '/test.json', JSON.stringify(sampleConfig), 'utf-8');

        config.loadFromFile(__dirname + '/test.json', function(err, configuration) {

            fs.unlinkSync(__dirname + '/test.json');

            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });


    it('can load via loadFromUrl as YAML', function(done) {

        config.loadFromUrl('https://s3-us-west-2.amazonaws.com/telegraphjs/sample-configuration-files/very-simple-sample-configuration.yaml', function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration);
            assert.ok(configuration.channels);
            return done();
        });

    });








    it('can list packages in configuration file', function(done) {

        config.loadFromObject(sampleConfig, function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration.packages);
            assert.ok(configuration.packages.length);
            assert.equal(configuration.packages[0], 'package1');
            return done();
        });

    });



    it('can get a channel', function(done) {

        config.loadFromObject(sampleConfig, function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration.getChannel('channel1'));
            assert.ok(configuration.getChannel('channel1').steps);
            return done();
        });

    });

    it('can identify reserved words', function(done) {

        config.loadFromObject(sampleConfig, function(err, configuration) {
            assert.ifError(err);
            assert.ok(configuration.isReservedName('error'));
            assert.ok(!configuration.isReservedName('channel1'));
            assert.ok(!configuration.isReservedName('foo'));
            return done();
        });

    });



    it('can identify unavailable names', function(done) {

        config.loadFromObject(sampleConfig, function(err, configuration) {
            assert.ifError(err);
            assert.ok(!configuration.isAvailableName('channel1'));
            assert.ok(configuration.isAvailableName('foo'));
            return done();
        });

    });



    /*
        config.load(__dirname + '/test.json', function(err, config) {


    it('can load a config file from an object', function(done) {


        config.loadConfig({
            key: "value"
        }, function(err, config) {
            assert.ifError(err);
            assert.ok(config);
            assert.ok(config.key);
            assert.equal(config.key, 'value');
            return done();
        });


    });


    it('can load a config file by file name', function(done) {

        fs.writeFileSync(__dirname + '/test.json', 'key: value', 'utf-8');

        config.load(__dirname + '/test.json', function(err, config) {

            fs.unlinkSync(__dirname + '/test.json');

            assert.ok(config);
            assert.ok(config.key);
            assert.equal(config.key, 'value');

            return done();
        });


    });


    it('can load the default file if provided and no currentFilename', function(done) {

        fs.writeFileSync(__dirname + '/default.json', 'key: defaultvalue', 'utf-8');

        config.load({
            currentFilename: "gibberish so the load fails",
            defaultFilename: __dirname + '/default.json'
        }, function(err, config) {

            fs.unlinkSync(__dirname + '/default.json');

            assert.ok(config);
            assert.ok(config.key);
            assert.equal(config.key, 'defaultvalue');

            return done();
        });


    });



    it('will not allow reserved words', function(done) {


        config.loadConfig({}, function(err, config) {
            assert.ifError(err);
            assert.ok(config);
            assert.ok(!config.isNameAvailable('error'));
            assert.ok(!config.isNameAvailable('default'));
            assert.ok(config.isNameAvailable('foo'));
            return done();
        });



    });



    it('will not allow duplicate group names', function(done) {

        config.loadConfig({
            groups: {
                test: {}
            }
        }, function(err, config) {
            assert.ifError(err);
            assert.ok(config);
            assert.ok(!config.isNameAvailable('test'));
            assert.ok(config.isNameAvailable('foo'));
            return done();
        });

    });


    it('will not allow duplicate channel names', function(done) {

        config.loadConfig({
                channels: {
                    test: {}
                }
            },
            function(err, config) {
                assert.ifError(err);
                assert.ok(config);
                assert.ok(!config.isNameAvailable('test'));
                assert.ok(config.isNameAvailable('foo'));
                return done();
            });

    });


    /**/
});