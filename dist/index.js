"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseClients = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const providerRoutes_1 = __importDefault(require("./routes/providerRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://127.0.0.1:8080' }));
app.use(express_1.default.json());
exports.sseClients = [];
db_1.default.getConnection()
    .then(connection => {
    console.log('Database connected successfully');
    connection.release();
})
    .catch(err => {
    console.error('Database connection failed:', err);
});
app.use('/api', adminRoutes_1.default);
app.use('/api', clientRoutes_1.default); // Add this line
app.use('/api', loginRoutes_1.default);
app.use('/api', productRoutes_1.default);
app.use('/api', providerRoutes_1.default);
app.get('/api/clients/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    exports.sseClients.push(res);
    console.log('New SSE client connected. Total clients:', exports.sseClients.length);
    const sendUpdates = () => {
        db_1.default.query('SELECT * FROM clientes')
            .then(([rows]) => {
            if (!res.headersSent) {
                res.write(`data: ${JSON.stringify(rows || [])}\n\n`);
            }
        })
            .catch(err => {
            console.error('SSE query error:', err);
            if (!res.headersSent)
                res.status(500).end();
        });
    };
    sendUpdates();
    const interval = setInterval(sendUpdates, 5000);
    req.on('close', () => {
        const index = exports.sseClients.indexOf(res);
        if (index !== -1)
            exports.sseClients.splice(index, 1);
        console.log('SSE client disconnected. Total clients:', exports.sseClients.length);
        clearInterval(interval);
        res.end();
    });
    req.on('error', (err) => {
        console.error('SSE request error:', err);
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
