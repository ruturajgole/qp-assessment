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
const mssql_1 = __importDefault(require("mssql"));
const config_json_1 = __importDefault(require("./config.json"));
const api_1 = require("src/api");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use([express_1.default.json(), api_1.authApi, api_1.groceryApi, api_1.orderApi]);
const options = {
    encrypt: true,
    trustServerCertificate: true
};
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new mssql_1.default.ConnectionPool(Object.assign(Object.assign({}, config_json_1.default), { options }));
    try {
        yield connection.connect();
    }
    catch (error) {
        throw (error);
    }
    return connection;
});
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
exports.default = connect;
