"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_json_1 = __importDefault(require("src/config.json"));
const models_1 = require("src/models");
const src_1 = __importDefault(require("src"));
const verifyJWT = (res, token, requiresAdmin = false) => {
    let user = null;
    if (!token) {
        res.status(401).json({ message: "Please provide the bearer token" });
        return null;
    }
    try {
        jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), config_json_1.default.jwtKey, (error, data) => {
            if (error) {
                res.json({ error });
            }
            else {
                if (data.iat > data.exp) {
                    res.status(440).json({ message: "Session expired. Please login again." });
                }
                else if (requiresAdmin && data.type === models_1.Type.Admin) {
                    res.status(401).json({ message: "You are not authorized to perfom this operation" });
                }
                else {
                    user = data;
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
    return user;
};
exports.verifyJWT = verifyJWT;
const router = express_1.default.Router();
router.post("/api/auth/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, password, type } = req.body;
    try {
        const connection = yield (0, src_1.default)();
        const request = connection.request();
        Object.entries({ name, username, password, type }).forEach((param) => request.input(param[0], param[1]));
        yield request.execute("Register");
        yield connection.close();
        res.status(200).json({ message: "User Created" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/api/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const connection = yield (0, src_1.default)();
        const request = connection.request();
        Object.entries({ username, password }).forEach((param) => request.input(param[0], param[1]));
        const result = yield request.execute("Login");
        console.log(result);
        yield connection.close();
        if (result.recordset.length) {
            const user = result.recordset[0];
            const token = jsonwebtoken_1.default.sign({ ID: user.ID, type: user.type, username: user.username, name: user.name }, config_json_1.default.jwtKey, { expiresIn: "1h" });
            res.status(200).json({ token });
            return null;
        }
        res.status(401).json({ message: "Login Failed. Please check your credentials and try again." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
