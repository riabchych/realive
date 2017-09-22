var should = require("should");
var request = require("supertest");
var superagent = require("superagent");
var url = "http://127.0.0.1:8080";

describe("Check Login Functionality", function () {
    it("Check response on adding correct email and password", function (done) {
        request(url)
            .post("/login")
            .send({
                username: "email",
                password: "password"
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err);                   
                }
                should.not.exist(err);
                res.status.should.equal(302);
                done();
            });
    });
});