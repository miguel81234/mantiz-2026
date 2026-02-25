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
exports.createProduct = exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const index_1 = require("../index"); // Ensure this import is correct
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM producto');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_producto, precio_producto } = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO producto (nombre_producto, precio_producto) VALUES (?, ?)', [nombre_producto, precio_producto]);
        const newProductId = result.insertId;
        res.status(201).json({ codigo_producto: newProductId, nombre_producto, precio_producto });
        // Broadcast to all SSE clients
        console.log('Broadcasting to', index_1.sseClients.length, 'clients');
        index_1.sseClients.forEach(client => {
            if (!client.headersSent) {
                client.write(`data: ${JSON.stringify([{ codigo_producto: newProductId, nombre_producto, precio_producto }])}\n\n`);
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
});
exports.createProduct = createProduct;
