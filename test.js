var start = require("./bin/MochaTestServer.js")
var assert = require("assert")
var http = require('http');
var server = null


/*
Helper Functions
 */
/**
 * Makes a request and returns the result
 * @param  {[type]} path     Path for the request
 * @param  {[type]} method   Request method (POST, GET etc)
 * @param  {[type]} data     JSON to be sent with the request
 * @param  {[type]} complete Callback function, takes a response object
 */
function makeRequest(path, method, data, complete){
    var req = http.request({
        host: "localhost",
        port: 3000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }, complete)
    req.write(JSON.stringify(data))
    req.end()
}

/**
 * Shorthand for a POST request
 * @param  {[type]} path     Path for the request
 * @param  {[type]} data     JSON to be sent with the request
 * @param  {[type]} complete Callback function, takes a response object
 */
function post(path, data, complete) {
    makeRequest(path, 'POST', data, complete)
}

/**
 * Shorthand for a PUT request
 * @param  {[type]} path     Path for the request
 * @param  {[type]} data     JSON to be sent with the request
 * @param  {[type]} complete Callback function, takes a response object
 */
function put(path, data, complete) {
    makeRequest(path, 'PUT', data, complete)
}

/**
 * Shorthand for a GET request
 * @param  {[type]} path     Path for the request
 * @param  {[type]} data     JSON to be sent with the request
 * @param  {[type]} complete Callback function, takes a response object
 */
function get(path, data, complete) {
    makeRequest(path, 'GET', data, complete)
}

/**
 * Returns the body of a response as a javascript object
 * @param  {[type]} response A response object
 * @param  {[type]} complete Callback object, takes an Object
 */
function getBody(response, complete){
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        body = JSON.parse(body)
        complete(body)
    });
}

/*
End Helper Functions
 */

describe('Full Test', function () {
    before(function () {
        console.log(start)
        server = start()
        post('/auth/local/signup', {
            email: "adam@adam.com",
            password: "adam",
            username: "Adam"}, function () {})
    })

    after(function () {
        server.close()
    })

    describe('/', function () {
        it('Expecting a 200 OK', function (done) {
            http.get("http://localhost:3000/", function (response) {
                assert.equal(response.statusCode, 200)
                done()
            })
        })
    })

    describe('Login Tests', function () {
        describe('Successful Logins', function () {
            it("Logging in as Adam should give 200", function (done) {
                post('/auth/local/login', {
                    email: "adam@adam.com",
                    password: "adam"
                }, function (response) {
                    assert.equal(response.statusCode, 200)
                    done()
                })
            })

            it("Logging in as Adele should give 200", function (done) {
                post('/auth/local/login', {
                    email: "adele@gmail.com",
                    password: "dddd"
                }, function (response) {
                    assert.equal(response.statusCode, 200)
                    done()
                })
            })
        })

        describe('Failed Logins', function () {
            it("Logging in as fake account should give 401", function (done) {
                post('/auth/local/login', {
                    email: "g@g.com",
                    password: "g"
                }, function (response) {
                    assert.equal(response.statusCode, 401)
                    done()
                })
            })

            it("Logging in with wrong password should give message 'Invalid password! Try again!'", function (done) {
                post('/auth/local/login', {
                    email: "adam@adam.com",
                    password: "larry"
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(body.message, 'Invalid password! Try again!');
    					done();
                    })
                })
            })

            it("Logging in with non-existant email should give message 'No user found with those credentials!'", function (done) {
                post('/auth/local/login', {
                    email: "adam@gmail.com",
                    password: "larry"
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(body.message, 'No user found with those credentials!');
    					done();
                    })
                })
            })
        })
    })

    describe("Registration Tests", function () {
        describe("Successful Registrations", function () {
            it("Registering a new user properly should give 200", function (done) {
                post('/auth/local/signup', {
                    email: Math.random().toString(36).slice(2, 10) + "@test.com",
                    password: "test",
                    username: Math.random().toString(36).slice(2, 10)
                }, function (response) {
                    assert.equal(response.statusCode, 200)
                    done()
                })
            })
        })

        describe("Failed Registrations", function () {
            it("Registering without a username should fail 401 and give message 'Username missing!'", function (done) {
                post('/auth/local/signup', {
                    email: Math.random().toString(36).slice(2, 10) + "@test.com",
                    password: "test",
                    username: ""
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(response.statusCode, 401)
                        assert.equal(body.message, 'Username missing!')
                        done()
                    })
                })
            })

            it("Registering without an email should fail 401 and give message 'Missing credentials'", function (done) {
                post('/auth/local/signup', {
                    email: "",
                    password: "test",
                    username: Math.random().toString(36).slice(2, 10)
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(response.statusCode, 401)
                        assert.equal(body.message, 'Missing credentials')
                        done()
                    })
                })
            })

            it("Registering with an existing email should fail 401 and give message 'Email already in use!'", function (done) {
                post('/auth/local/signup', {
                    email: "adam@adam.com",
                    password: "test",
                    username: Math.random().toString(36).slice(2, 10)
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(response.statusCode, 401)
                        assert.equal(body.message, 'Email already in use!')
                        done()
                    })
                })
            })

            it("Registering with an existing username should fail 401 and give message 'Username already in use!'", function (done) {
                post('/auth/local/signup', {
                    email: Math.random().toString(36).slice(2, 10) + "@test.com",
                    password: "test",
                    username: "Adele"
                }, function (response) {
                    getBody(response, function (body) {
                        assert.equal(response.statusCode, 401)
                        assert.equal(body.message, 'Username already in use!')
                        done()
                    })
                })
            })
        })
    })

    describe("API calls", function () {
        describe("Test that API calls redirect to Login", function () {
            it("Response should not be JSON since not logged in", function (done) {
                /*get('/groups/', {}, function (response) {
                    assert.throws(getBody(response, function (body) {}), Error)
                    done()
                })*/
                http.get("http://localhost:3000/groups/", function (response) {
                    //assert.throws(function(){getBody(response, function (body) {})}, SyntaxError)
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        assert(body[0] == "<")
                        done()
                    });
                })
            })
        })
    })
})
