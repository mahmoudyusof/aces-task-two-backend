let server;
const request = require("supertest");
const { User } = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");


describe("api/auth/login", () => {
    beforeEach(() => server = require("../../index"));
    afterEach(async () => {
        server.close();
        await User.deleteMany({});
    });

    describe("GET, PUT, PATCH, DELETE /", () => {
        it("should retrun status code 404 not found for GET", async () => {
            const res = await request(server).get('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for PUT", async () => {
            const res = await request(server).put('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for PATCH", async () => {
            const res = await request(server).patch('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for DELETE", async () => {
            const res = await request(server).delete('/api/auth/register');
            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        it("should return proper response with x-auth-token header with valid jwt", async () => {
            const password = "mypassword";
            const email = "mahmoud.yusof@gmail.com";
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const user = new User({
                name: "Mahmoud",
                email: email,
                password: hashed,
                role: "guest"
            });
            await user.save();

            const res = await request(server).post("/api/auth/login").send({email, password});
            expect(res.status).toBe(200);
            expect(res.headers).toHaveProperty('x-auth-token');
            const decoded = jwt.decode(res.headers['x-auth-token'], config.get("PRIVATE_KEY"));
            expect(decoded).toHaveProperty("name", "Mahmoud");
            expect(decoded).toHaveProperty("email", email);
            expect(decoded).toHaveProperty("role", "guest");
            expect(decoded).not.toHaveProperty("password");

        });

        it("should return invalid username or password with status 400", async () => {
            const password = "mypassword";
            const email = "mahmoud.yusof@gmail.com";
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const user = new User({
                name: "Mahmoud",
                email: email,
                password: hashed,
                role: "guest"
            });
            await user.save();

            const res = await request(server).post("/api/auth/login").send({email, password: "somethingelse"});
            expect(res.status).toBe(400);
        });

        it("should return invalid username or password with status 400", async () => {
            const password = "mypassword";
            const email = "mahmoud.yusof@gmail.com";
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const user = new User({
                name: "Mahmoud",
                email: email,
                password: hashed,
                role: "guest"
            });
            await user.save();

            const res = await request(server).post("/api/auth/login").send({email: "mahmoud@gmail.com", password});
            expect(res.status).toBe(400);
        });
    });
    
});

describe("/api/auth/register", () => {
    beforeEach(() => { server = require("../../index"); });
    afterEach(async () => {
        server.close();
        await User.deleteMany({});
    });


    describe("GET, PUT, PATCH, DELETE /", () => {
        it("should retrun status code 404 not found for GET", async () => {
            const res = await request(server).get('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for PUT", async () => {
            const res = await request(server).put('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for PATCH", async () => {
            const res = await request(server).patch('/api/auth/register');
            expect(res.status).toBe(404);
        });

        it("should retrun status code 404 not found for DELETE", async () => {
            const res = await request(server).delete('/api/auth/register');
            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        it("should return a valid response with jwt token in header", async () => {
            const data = {
                name: "Mahmoud",
                email: "mahmoud.y@gmail.com",
                password: "mypassword"
            };
            const res = await request(server).post("/api/auth/register").send(data);
            expect(res.status).toBe(200);
            expect(res.text).toBe("Signed up successfully!");
            expect(res.headers).toHaveProperty('x-auth-token');
            const decoded = jwt.decode(res.headers['x-auth-token'], config.get("PRIVATE_KEY"));
            expect(decoded).toHaveProperty("name", "Mahmoud");
            expect(decoded).toHaveProperty("email", "mahmoud.y@gmail.com");
            expect(decoded).toHaveProperty("role", "guest");
            expect(decoded).not.toHaveProperty("password");
        });

        it("should return an error that the user is already in db", async () => {

            const data = {
                name: "Mahmoud",
                email: "mahmoud.yusof@gmail.com",
                password: "mypasswordmypasswordmypasswordmypasswordmypasswordmypasswordmypassword"
            };
            const user = new User(data);
            await user.save();

            const res = await request(server).post("/api/auth/register").send(data);
            expect(res.status).toBe(400);
            expect(res.text).toBe(`User with email '${data.email}' already exists`);
        });
    });
});




