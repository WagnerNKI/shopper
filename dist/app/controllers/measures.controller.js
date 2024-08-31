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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureController = void 0;
const measure_model_1 = require("../models/measure-model");
const gemini_1 = __importDefault(require("../lib/gemini"));
class MeasureController {
}
exports.MeasureController = MeasureController;
_a = MeasureController;
MeasureController.checkMeasurementAndCallGemini = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const measuresByCustomerAndType = measure_model_1.Measure.findByCustomerCodeAndType(req.body.customer_code, req.body.measure_type);
        const measumentOnMonth = measuresByCustomerAndType.some((measure) => {
            const dateFromBody = new Date(req.body.measure_datetime);
            const measureDate = new Date(measure.measure_datetime);
            const measumentYear = measureDate.getFullYear();
            const newMeasumentYear = dateFromBody.getFullYear();
            const measumentMonth = measureDate.getMonth();
            const newMeasumentMonth = dateFromBody.getMonth();
            return measumentYear === newMeasumentYear
                && measumentMonth === newMeasumentMonth
                && measure.measure_type === req.body.measure_type;
        });
        if (measumentOnMonth) {
            const doubleReportError = {
                error_code: "INVALID_DATA",
                error_description: "Leitura do mês ja realizada"
            };
            return res.status(409).json(doubleReportError);
        }
        const { measureValue, imageUrl } = yield (0, gemini_1.default)(req.body.image);
        const savedMeasure = measure_model_1.Measure.saveMeasurement(new measure_model_1.Measure(req.body.customer_code, req.body.measure_datetime, req.body.measure_type, false, imageUrl, measureValue));
        const response = {
            image_url: savedMeasure.image_url,
            measure_value: savedMeasure.measure_value,
            measure_uuid: savedMeasure.measure_uuid
        };
        return res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
    }
});
MeasureController.confirmAndCorrectMeasurement = (req, res) => {
    try {
        const measumentByuuid = measure_model_1.Measure.findByUuid(req.body.measure_uuid);
        if (!measumentByuuid) {
            const measumentNotFoundError = {
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            };
            return res.status(404).json(measumentNotFoundError);
        }
        else {
            if (measumentByuuid.has_confirmed) {
                const measumentConfirmedError = {
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura do mês já realizada"
                };
                res.status(409).json(measumentConfirmedError);
            }
            measumentByuuid.measure_value = req.body.confirmed_value;
            measumentByuuid.has_confirmed = true;
            measure_model_1.Measure.saveMeasurement(measumentByuuid);
            return res.status(200).json({ success: true });
        }
    }
    catch (err) {
        console.log(err);
        res.end();
    }
};
MeasureController.listMeasurements = (req, res) => {
    try {
        const measureType = measure_model_1.Measure.getMeasureTypeFromQuery(req.query);
        const customerCode = req.params.customerCode;
        if (measureType && measureType.toUpperCase() !== 'GAS' && measureType.toUpperCase() !== 'WATER') {
            const measureTypeError = {
                error_code: "INVALID_TYPE",
                error_description: "Tipo de permissão não permitida"
            };
            return res.status(400).json(measureTypeError);
        }
        const measuresByCustomerAndType = measure_model_1.Measure.findByCustomerCodeAndType(customerCode, measureType);
        const response = {
            customer_code: customerCode,
            measures: measuresByCustomerAndType.map(measure => {
                return {
                    measure_uuid: measure.measure_uuid,
                    measure_datetime: measure.measure_datetime,
                    measure_type: measure.measure_type,
                    has_confirmed: measure.has_confirmed,
                    image_url: measure.image_url
                };
            })
        };
        return res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.end();
    }
};
MeasureController.validateInput = (req, res, next) => {
    const validationError = [];
    Object.keys(req.body).forEach(key => {
        if (!measure_model_1.Measure.isInputValid(key, req.body[key])) {
            validationError.push(key);
        }
    });
    if (validationError.length) {
        const error = {
            error_code: "INVALID_DATA",
            error_description: `Campo(s) ${validationError.join(', ')} inválido(s)`
        };
        res.status(400).json(error);
    }
    next();
};
