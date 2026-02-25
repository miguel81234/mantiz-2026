"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const router = (0, express_1.Router)();
router.get('/clients', clientController_1.getClients);
router.post('/clients', clientController_1.createClient); // New endpoint for registration
exports.default = router;
