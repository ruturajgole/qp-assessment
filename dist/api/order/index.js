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
const auth_1 = require("src/api/auth");
const src_1 = __importDefault(require("src"));
const router = express_1.default.Router();
router.get("/api/order/view", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"];
    const user = (0, auth_1.verifyJWT)(res, token);
    if (!user)
        return;
    try {
        const connection = yield (0, src_1.default)();
        const query = `SELECT Users.name AS 'Ordered By', Grocery_Items.name AS 'Product', price, quantity, total 
    FROM Orders 
    INNER JOIN Users ON Orders.userId = Users.ID 
    INNER JOIN Grocery_Items ON Orders.itemId = Grocery_Items.ID 
    WHERE userId = @userId`;
        const request = connection.request();
        request.input("userId", user.ID);
        const results = yield request.query(query);
        yield connection.close();
        res.status(200).json(results.recordset);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/api/order/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"];
    const user = (0, auth_1.verifyJWT)(res, token);
    if (!user)
        return;
    const { itemId, quantity, total } = req.body;
    try {
        const connection = yield (0, src_1.default)();
        const query = `INSERT INTO Orders(userId, itemId, quantity, total) VALUES(@userId, @itemId, @quantity, @total)`;
        const request = connection.request();
        Object.entries({
            userId: user.ID,
            itemId,
            quantity,
            total
        }).forEach((param) => request.input(param[0], param[1]));
        yield request.query(query);
        yield connection.close();
        res.status(200).json({ message: "Order Added" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
