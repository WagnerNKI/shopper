function isValidBase64Image(base64: string): boolean {
  const imageRegex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
  
  if (!imageRegex.test(base64)) {
    return false;
  }
  
  const base64Data = base64.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer.length > 0; 
  } catch (e) {
    return false;
  }
}

export default isValidBase64Image