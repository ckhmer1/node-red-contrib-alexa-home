const request = require('supertest');
var should = require("should");
var helper = require("node-red-node-test-helper");
var controllerNode = require("../alexa/alexa-home-controller.js");
var alexaNode = require("../alexa/alexa-home.js");

const nmap = require('node-libnmap');

const opts = {
    udp: true,
    ports: '1900'
};


function isURL(str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

helper.init(require.resolve('node-red'));

describe('alexa-home-controller Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded with correct default params', function (done) {
        var flow = [{ id: "n1", type: "alexa-home-controller", controllername: "Test" }];
        helper.load(controllerNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'Test');
            n1._hub.should.have.length(1);
            n1._hub[0].httpServer.should.have.property("_connectionKey", "6::::60000");
            n1._hub[0].ssdpServer.should.have.property("_started", true);
            n1._hub[0].ssdpServer.should.have.property("_sourcePort", 1900);

            request(n1._hub[0].app)
                .get("/")
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });

        });
    });
    it("should respond to setup request", function (done) {
        var flow = [{ id: "n1", type: "alexa-home-controller", controllername: "Test" }];
        helper.load(controllerNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'Test');
            n1._hub.should.have.length(1);
            request(n1._hub[0].app)
                .get("/alexa-home/setup.xml")
                .expect('Content-Type', /xml/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });
    it("should respond to config request", function (done) {
        var flow = [
            { id: "n1", type: "alexa-home-controller", controllername: "Test" }
        ];
        helper.load(controllerNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'Test');
            n1._hub.should.have.length(1);
            request(n1._hub[0].app)
                .get("/api")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });
    it("should respond to lights request", function (done) {
        var flow = [
            { id: "n1", type: "alexa-home-controller", controllername: "Test" }
        ];
        helper.load(controllerNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'Test');
            n1._hub.should.have.length(1);
            request(n1._hub[0].app)
                .get("/api/my-username/lights")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });
    it("should respond to registration request", function (done) {
        var flow = [
            { id: "n1", type: "alexa-home-controller", controllername: "Test" }
        ];
        helper.load(controllerNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'Test');
            n1._hub.should.have.length(1);
            request(n1._hub[0].app)
                .post("/api")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });
    // it("should respond to single lights request", function (done) {
    //     var flow = [
    //         { id: "n1", type: "alexa-home-controller", controllername: "Test" },
    //         { id: "n2", type: "helper" },
    //         { id: "n3", type: "alexa-home", devicename: "Kitchen Light", wires: [["n2"]] },
    //     ];
    //     helper.load(controllerNode, flow, function () {
    //         var n1 = helper.getNode("n1");
    //         n1.should.have.property('name', 'Test');
    //         n1._hub.should.have.length(1);
    //         request(n1._hub[0].app)
    //             .get("/api/my-username/lights/abc123")
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 done();
    //             });
    //     });
    // });
    // it("should respond to single lights update", function (done) {
    //     var flow = [
    //         { id: "n1", type: "alexa-home-controller", controllername: "Test" }
    //     ];
    //     helper.load(controllerNode, flow, function () {
    //         var n1 = helper.getNode("n1");
    //         n1.should.have.property('name', 'Test');
    //         n1._hub.should.have.length(1);
    //         request(n1._hub[0].app)
    //             .put("/api/my-username/lights/abc123/state")
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 done();
    //             });
    //     });
    // });

});