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
const generative_ai_1 = require("@google/generative-ai");
const server_1 = require("@google/generative-ai/server");
const utils_1 = __importDefault(require("../lib/utils"));
function getMeasurementValueFromImage(base64Image) {
    return __awaiter(this, void 0, void 0, function* () {
        const geminiApiKey = process.env.GEMINI_API_KEY || '';
        if (!geminiApiKey) {
            throw new Error('Gemini api key not configured');
        }
        const genAi = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
        const model = genAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const uploadedImage = yield uploadImage(base64Image);
        const result = yield model.generateContent([
            {
                fileData: {
                    mimeType: uploadedImage.file.mimeType,
                    fileUri: uploadedImage.file.uri
                }
            },
            {
                text: "Get the value for the measurement"
            }
        ]);
        return {
            measureValue: Number(result.response.text()),
            imageUrl: uploadedImage.file.uri
        };
    });
}
function uploadImage(base64Image) {
    return __awaiter(this, void 0, void 0, function* () {
        const geminiApiKey = process.env.GEMINI_API_KEY || '';
        if (!geminiApiKey) {
            throw new Error('Gemini api key not configured');
        }
        const fileManager = new server_1.GoogleAIFileManager(geminiApiKey);
        const uploadResponse = yield fileManager.uploadFile(base64Image, {
            mimeType: utils_1.default.getMimeType(base64Image) || '',
            displayName: 'measurement'
        });
        return uploadResponse;
    });
}
exports.default = getMeasurementValueFromImage;
