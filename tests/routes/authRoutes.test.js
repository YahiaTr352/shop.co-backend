const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../../App");
const User = require("../../models/User");

beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/shopco_test");
});

beforeEach(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("signupUser - integration test", () => {

    it("should return 400 if fields are missing", async () => {
        const res = await request(app).post("/api/users/signup").send({});
        expect(res.status).toBe(400);
    });

    it("should return 400 if email already exists", async () => {
        await User.create({
            name: "Ali",
            email: "ali@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "User",
        });

        const res = await request(app).post("/api/users/signup").send({
            name: "Ali",
            email: "ali@test.com",
            password: "123456",
            passwordC: "123456",
        });

        expect(res.status).toBe(400);
        expect(res.body.email).toBe("email is registerd");
    });

    it("should create user and return token", async () => {
        const res = await request(app).post("/api/users/signup").send({
            name: "Omar",
            email: "omar@test.com",
            password: "123456",
            passwordC: "123456",
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user.email).toBe("omar@test.com");

        const userInDb = await User.findOne({ email: "omar@test.com" });
        expect(userInDb).not.toBeNull();
        expect(userInDb.name).toBe("Omar");
    });
});


describe("signupAdmin - integration test", () => {

    it("should return 400 if fields are missing", async () => {
        const res = await request(app).post("/api/users/add-admin").send({});
        expect(res.status).toBe(400);
    });

    it("should return 400 if name already exists", async () => {
        await User.create({
            name: "AdminAli",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "Admin",
        });

        const res = await request(app).post("/api/users/add-admin").send({
            name: "AdminAli",
            email: "newadmin@test.com",
            password: "123456",
            passwordC: "123456",
        });

        expect(res.status).toBe(400);
        expect(res.body.name).toBe("Name is used");
    });

    it("should return 400 if email already exists", async () => {
        await User.create({
            name: "OtherAdmin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "Admin",
        });

        const res = await request(app).post("/api/users/add-admin").send({
            name: "NewAdmin",
            email: "admin@test.com",
            password: "123456",
            passwordC: "123456",
        });

        expect(res.status).toBe(400);
        expect(res.body.email).toBe("Email is used");
    });

    it("should create admin and return token", async () => {
        const res = await request(app).post("/api/users/add-admin").send({
            name: "SuperAdmin",
            email: "super@test.com",
            password: "123456",
            passwordC: "123456",
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user.role).toBe("Admin");

        const adminInDb = await User.findOne({ email: "super@test.com" });
        expect(adminInDb).not.toBeNull();
        expect(adminInDb.role).toBe("Admin");
    });
});