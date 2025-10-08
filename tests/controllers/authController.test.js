const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSignUp } = require("../../utils/validation");
const { SignupUser, SignupAdmin } = require("../../controllers/AuthController");
const User = require("../../models/User");
const { mockRequest, mockResponse } = require("../../utils/testUtils");

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../utils/validation");


describe("signupUser - unit test", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = mockRequest({
            name: "Ali",
            email: "ali@test.com",
            password: "123456",
            passwordC: "123456",
        });
        res = mockResponse();
    });

    it("should return 400 if validation fails", async () => {
        validateSignUp.mockReturnValue({ email: "Invalid email" });

        await SignupUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ email: "Invalid email" });
    });

    it("should return 400 if email already exists", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne.mockResolvedValue({ email: "ali@test.com" });

        await SignupUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ email: "email is registerd" });
    });

    it("should create user and return token on success", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne.mockResolvedValue(null);

        bcrypt.genSalt.mockResolvedValue("salt");
        bcrypt.hash.mockResolvedValue("hashedPassword");

        const mockUser = {
            _id: "123",
            name: "Ali",
            email: "ali@test.com",
            role: "User",
            save: jest.fn().mockResolvedValue(true),
        };

        User.mockImplementation(() => mockUser);
        jwt.sign.mockReturnValue("fakeToken");

        await SignupUser(req, res);

        expect(User).toHaveBeenCalledWith({
            name: "Ali",
            email: "ali@test.com",
            password: "hashedPassword",
            role: "User",
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalledWith(
            { Id: mockUser._id, role: mockUser.role },
            process.env.TOKEN_SECRET_KEY
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: mockUser,
            token: "fakeToken",
        });
    });

    it("should return 500 if an exception occurs", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne.mockRejectedValue(new Error("DB error"));

        await SignupUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "something went wrong." });
    });
});


describe("signupAdmin - unit test", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = mockRequest({
            name: "AdminAli",
            email: "admin@test.com",
            password: "123456",
            passwordC: "123456",
        });
        res = mockResponse();
    });

    it("should return 400 if validation fails", async () => {
        validateSignUp.mockReturnValue({ email: "Invalid email" });

        await SignupAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ email: "Invalid email" });
    });

    it("should return 400 if name already exists", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne
            .mockResolvedValueOnce({ name: "AdminAli" })
            .mockResolvedValueOnce(null); 

        await SignupAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ name: "Name is used" });
    });

    it("should return 400 if email already exists", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne
            .mockResolvedValueOnce(null) // أول استدعاء للاسم
            .mockResolvedValueOnce({ email: "admin@test.com" }); // تاني استدعاء للإيميل

        await SignupAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ email: "Email is used" });
    });

    it("should create admin and return token", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        bcrypt.genSalt.mockResolvedValue("salt");
        bcrypt.hash.mockResolvedValue("hashedPassword");

        const mockUser = {
            _id: "123",
            name: "AdminAli",
            email: "admin@test.com",
            role: "Admin",
            save: jest.fn().mockResolvedValue(true),
        };

        User.mockImplementation(() => mockUser);
        jwt.sign.mockReturnValue("fakeToken");

        await SignupAdmin(req, res);

        expect(User).toHaveBeenCalledWith({
            name: "AdminAli",
            email: "admin@test.com",
            password: "hashedPassword",
            role: "Admin",
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: mockUser,
            token: "fakeToken",
        });
    });

    it("should return 500 if exception occurs", async () => {
        validateSignUp.mockReturnValue({});
        User.findOne.mockRejectedValue(new Error("DB error"));

        await SignupAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Something went wrong while signing up",
        });
    });
});