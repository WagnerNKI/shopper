"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measure = void 0;
const uuid_1 = require("uuid");
const measures_database_1 = __importDefault(require("../database/measures-database"));
const utils_1 = __importDefault(require("../lib/utils"));
class Measure {
    constructor(customer_code, measure_datetime, measure_type, has_confirmed, image_url, measure_value, measure_uuid) {
        this.customer_code = customer_code;
        this.measure_datetime = measure_datetime;
        this.measure_type = measure_type;
        this.has_confirmed = has_confirmed;
        this.image_url = image_url;
        this.measure_value = measure_value;
        this.measure_uuid = measure_uuid || '';
    }
    static findByCustomerCodeAndType(customerCode, measureType) {
        return measures_database_1.default.filter((doc) => {
            if ((measureType && doc.measure_type === measureType)
                && doc.customer_code === customerCode) {
                return doc;
            }
            else if (!measureType && doc.customer_code === customerCode) {
                return doc;
            }
        });
    }
    static findByUuid(measureUuid) {
        return measures_database_1.default.find((doc) => doc.measure_uuid === measureUuid);
    }
    static getMeasureTypeFromQuery(queryParam) {
        if (!queryParam)
            return null;
        if (Array.isArray(queryParam.measure_type))
            return queryParam.measure_type[0];
        return queryParam.measure_type;
    }
    static isInputValid(property, valueToValidate) {
        const propertiesValidation = {
            customer_code: (valueToValidate) => { return typeof valueToValidate === 'string'; },
            measure_datetime: (valueToValidate) => { return new Date(valueToValidate).toString() === 'Invalid Date' ? false : true; },
            measure_type: (valueToValidate) => { return typeof valueToValidate === 'string'; },
            image: (valueToValidate) => { return utils_1.default.isValidBase64Image(valueToValidate); },
            confirmed_value: (valueToValidate) => { return typeof valueToValidate === 'number' && !isNaN(valueToValidate); },
            measure_uuid: (valueToValidate) => { return typeof valueToValidate === 'string'; },
        };
        return propertiesValidation[property](valueToValidate);
    }
    static saveMeasurement(measure) {
        measure.measure_uuid = (0, uuid_1.v4)() || '';
        //forcing type assertion because the database lib should be responsible for creating the uuid
        measures_database_1.default.push(measure);
        return measure;
    }
}
exports.Measure = Measure;
