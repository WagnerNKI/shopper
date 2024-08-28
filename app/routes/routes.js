"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router
    .post('/upload', (req, res) => res.send('uploaded'))
    .patch('/confirm', (req, res) => res.send('confirmed'))
    .get('/:customerCode/list', (req, res) => res.send('list'));
exports.default = router;
