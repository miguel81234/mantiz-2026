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
exports.login = void 0;
const db_1 = __importDefault(require("../config/db"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { documento, password } = req.body;
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM clientes WHERE documento = ? AND password = ?', [documento, password]);
        if (Array.isArray(rows) && rows.length > 0) {
            const client = rows[0];
            res.status(200).json({ success: true, client });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error during login', error });
    }
});
exports.login = login;
