function isValidBase64Image(base64: string): boolean {
  const imageRegex = /^data:image\/(png|webp|jpeg|heic|heif);base64,/;
  
  if (!imageRegex.test(base64)) {
    return false;
  }
  
  const base64Data = base64.replace(/^data:image\/(png|webp|jpeg|heic|heif);base64,/, '');
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer.length > 0; 
  } catch (e) {
    return false;
  }
}

function getMimeType(base64: string): string | null {
  const mimeTypeMatch = base64.match(/^data:(.+);base64,/);
  return mimeTypeMatch ? mimeTypeMatch[1] : null;
}

export default {
  isValidBase64Image,
  getMimeType
}