"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const measures_controller_1 = require("../controllers/measures.controller");
const router = (0, express_1.Router)();
router
    .get('/:customerCode/list', measures_controller_1.MeasureController.validateInput, measures_controller_1.MeasureController.listMeasurements)
    .post('/upload', measures_controller_1.MeasureController.validateInput, measures_controller_1.MeasureController.checkMeasurementAndCallGemini)
    .patch('/confirm', measures_controller_1.MeasureController.validateInput, measures_controller_1.MeasureController.confirmAndCorrectMeasurement);
exports.default = router;
