const { User, userError } = require("../../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
    it("should return valid jwt", () => {
        const caseObject = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            email: "test@gmail.com",
            name: "Name",
            role: "guest"
        }
        const user = new User(caseObject);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get("PRIVATE_KEY"));
        expect(decoded).toMatchObject(caseObject);
    });
});

describe("user validation function", () => {
    it("should return false if valid user is entered for registration", () => {
        const err = userError({
            name: "Mahmoud",
            email: "mahmoud.yusof27@gmail.com",
            password: "mypassword"
        });
        expect(err).toBe(false);
    });

    it("should return false if valid user is entered for login", () => {
        const err = userError({
            email: "mahmoud.yusof27@gmail.com",
            password: "mypassword"
        }, true);
        expect(err).toBe(false);
    });

    it("should return an error message if data invalid for login", () => {
        const err = userError({
            email: "m",
            password: "mypassword"
        }, true);
        expect(err).toBeTruthy();
    });

    it("should return an error message if data invalid for registration", () => {
        const err = userError({
            email: "mahmoud.yusof27@gmail.com",
            password: "mypassword"
        });
        expect(err).toBeTruthy();
    });
});
