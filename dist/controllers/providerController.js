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
exports.deleteProvider = exports.updateProvider = exports.createProvider = exports.getProviders = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProviders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM provedores');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching providers' });
    }
});
exports.getProviders = getProviders;
const createProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO provedores SET ?', [provider]);
        res.status(201).json({ id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating provider' });
    }
});
exports.createProvider = createProvider;
const updateProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_provedor } = req.params;
    const provider = req.body;
    try {
        yield db_1.default.query('UPDATE provedores SET ? WHERE codigo_provedor = ?', [provider, codigo_provedor]);
        res.json({ message: 'Provider updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating provider' });
    }
});
exports.updateProvider = updateProvider;
const deleteProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_provedor } = req.params;
    try {
        yield db_1.default.query('DELETE FROM provedores WHERE codigo_provedor = ?', [codigo_provedor]);
        res.json({ message: 'Provider deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting provider' });
    }
});
exports.deleteProvider = deleteProvider;
