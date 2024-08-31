"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidBase64Image(base64) {
    const imageRegex = /^data:image\/(png|webp|jpeg|heic|heif);base64,/;
    if (!imageRegex.test(base64)) {
        return false;
    }
    const base64Data = base64.replace(/^data:image\/(png|webp|jpeg|heic|heif);base64,/, '');
    try {
        const buffer = Buffer.from(base64Data, 'base64');
        return buffer.length > 0;
    }
    catch (e) {
        return false;
    }
}
function getMimeType(base64) {
    const mimeTypeMatch = base64.match(/^data:(.+);base64,/);
    return mimeTypeMatch ? mimeTypeMatch[1] : null;
}
exports.default = {
    isValidBase64Image,
    getMimeType
};
