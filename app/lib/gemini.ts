import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import utils from '../lib/utils';

async function getMeasurementValueFromImage(base64Image: string, ) {
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  
  if (!geminiApiKey) {
    throw new Error('Gemini api key not configured');
  }
  
  const genAi = new GoogleGenerativeAI(geminiApiKey);
  const model = genAi.getGenerativeModel({model: 'gemini-1.5-pro'})

  const uploadedImage = await uploadImage(base64Image);

  const result = await model.generateContent(
    [
      {
        fileData: {
          mimeType: uploadedImage.file.mimeType,
          fileUri: uploadedImage.file.uri
        }
      },
      {
        text: "Get the value for the measurement"
      }
    ]
  )

  return {
    measureValue: Number(result.response.text()),
    imageUrl: uploadedImage.file.uri
  };
}

async function uploadImage(base64Image: string) {
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  
  if (!geminiApiKey) {
    throw new Error('Gemini api key not configured');
  }

  const fileManager = new GoogleAIFileManager(geminiApiKey);
  const uploadResponse = await fileManager.uploadFile(base64Image, {
    mimeType: utils.getMimeType(base64Image) || '',
    displayName: 'measurement'
  })

  return uploadResponse;
}

export default getMeasurementValueFromImage