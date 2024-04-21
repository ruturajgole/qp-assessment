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
const express_1 = __importDefault(require("express"));
const src_1 = __importDefault(require("src"));
const auth_1 = require("src/api/auth");
const models_1 = require("src/models");
const router = express_1.default.Router();
router.get("/api/grocery/view", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"];
    const user = (0, auth_1.verifyJWT)(res, token);
    if (!user)
        return;
    try {
        const connection = yield (0, src_1.default)();
        const results = yield connection.request()
            .query(`SELECT * FROM Grocery_Items ${user.type === models_1.Type.User ? "WHERE stock > 0" : ""}`);
        yield connection.close();
        res.status(200).json(results.recordset);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/api/grocery/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock } = req.body;
    const token = req.headers["authorization"];
    if (!(0, auth_1.verifyJWT)(res, token, true))
        return;
    try {
        const connection = yield (0, src_1.default)();
        const query = "INSERT INTO GROCERY_ITEMS (name, price, stock) VALUES(@name, @price, @stock)";
        const request = connection.request();
        Object.entries({ name, price, stock }).forEach((param) => request.input(param[0], param[1]));
        yield request.query(query);
        yield connection.close();
        res.status(200).json({ message: "Grocery Item Added" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("api/grocery/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const token = req.headers["authorization"];
    if (!(0, auth_1.verifyJWT)(res, token))
        return;
    try {
        const connection = yield (0, src_1.default)();
        const query = "DELETE FROM Grocery_Items WHERE id=@id";
        const request = connection.request();
        request.input("id", id);
        yield request.query(query);
        yield connection.close();
        res.status(200).json({ message: "Grocery Item Removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("api/grocery/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name = null, price = null, stock = null } = req.body;
    try {
        const connection = yield (0, src_1.default)();
        const query = `UPDATE Grocery_Items SET 
    name = CASE WHEN @name IS NOT NULL THEN @name ELSE name END,
    price = CASE WHEN @price IS NOT NULL THEN @price ELSE price END,
    stock = CASE WHEN @stock IS NOT NULL THEN @stock ELSE stock END WHERE id=@id`;
        const request = connection.request();
        Object.entries({ id, name, price, stock }).forEach((param) => request.input(param[0], param[1]));
        yield request.query(query);
        yield connection.close();
        res.status(200).json({ message: "Grocery Item Updated" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
