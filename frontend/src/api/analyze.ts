import { apiPost } from "./client";
import { AnalyzeResponse } from "../types";

export async function analyzeImage(imageBase64: string): Promise<AnalyzeResponse> {
  return apiPost<AnalyzeResponse>("/api/v1/analyze", {
    image_base64: imageBase64,
  });
}



