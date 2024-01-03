import request from "supertest";
import app from "../app";
import { User } from "../models/User";

describe("Testing api routes", () => {
    const email = "email@example.com";
    const password = "1234";
    beforeAll(async () => {
        await User.sync({ force: true });
    });

    //Route Ping
    it("should return pong", (done) => {
        request(app)
            .get("/ping")
            .then((response) => {
                expect(response.body.pong).toBeTruthy();
                return done();
            });
    });

    //Route Register
    it("should register a new user", (done) => {
        request(app)
            .post("/register")
            .send(`email=${email}&password=${password}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body).toHaveProperty("id");
                return done();
            });
    });

    it("should not allow a registration with an existing email", (done) => {
        request(app)
            .post("/register")
            .send(`email=${email}&password=${password}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("should not allow registration without a password", (done) => {
        request(app)
            .post("/register")
            .send(`email=${email}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("should not allow a registration without an email", (done) => {
        request(app)
            .post("/register")
            .send(`password=${password}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("should not allow registration without any data", (done) => {
        request(app)
            .post("/register")
            .send(``)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //Route Login

    it("should login correctly", (done) => {
        request(app)
            .post("/login")
            .send(`email=${email}&password=${password}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.status).toBeTruthy();
                return done();
            });
    });

    it("should not log in with incorrect data", (done) => {
        request(app)
            .post("/login")
            .send(`email=${email}&password=484888466`)
            .then((response) => {
                expect(response.body.status).toBeFalsy();
                return done();
            });
    });

    it("should not log in without email", (done) => {
        request(app)
            .post("/login")
            .send(`password=484888466`)
            .then((response) => {
                expect(response.body.status).toBeFalsy();
                return done();
            });
    });

    it("should not log in without password", (done) => {
        request(app)
            .post("/login")
            .send(`email=${email}`)
            .then((response) => {
                expect(response.body.status).toBeFalsy();
                return done();
            });
    });

    it("should not log in without any data", (done) => {
        request(app)
            .post("/login")
            .send(``)
            .then((response) => {
                expect(response.body.status).toBeFalsy();
                return done();
            });
    });

    //Route List

    it("should not log in without any data", (done) => {
        request(app)
            .get("/list")
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.list.length).toBeGreaterThanOrEqual(1);
                expect(response.body.list).toContain(email);
                return done();
            });
    });
});
