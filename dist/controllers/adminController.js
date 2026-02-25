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
exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdmins = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM administrador');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching admins' });
    }
});
exports.getAdmins = getAdmins;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO administrador SET ?', [admin]);
        res.status(201).json({ id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating admin' });
    }
});
exports.createAdmin = createAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_administrador } = req.params;
    const admin = req.body;
    try {
        yield db_1.default.query('UPDATE administrador SET ? WHERE codigo_administrador = ?', [admin, codigo_administrador]);
        res.json({ message: 'Admin updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating admin' });
    }
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_administrador } = req.params;
    try {
        yield db_1.default.query('DELETE FROM administrador WHERE codigo_administrador = ?', [codigo_administrador]);
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting admin' });
    }
});
exports.deleteAdmin = deleteAdmin;
