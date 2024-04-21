"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderApi = exports.groceryApi = exports.authApi = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authApi = auth_1.default;
const grocery_1 = __importDefault(require("./grocery"));
exports.groceryApi = grocery_1.default;
const order_1 = __importDefault(require("./order"));
exports.orderApi = order_1.default;
