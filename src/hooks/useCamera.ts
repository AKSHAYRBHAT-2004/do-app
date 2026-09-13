import { useState, useCallback } from 'react';

export function useCamera() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const takePhoto = useCallback(async () => {
    // Simulate taking a photo for MVP
    const mockUri = 'file://mock/photo.jpg';
    setCapturedImage(mockUri);
    return mockUri;
  }, []);

  const pickImage = useCallback(async () => {
    // Simulate picking an image
    const mockUri = 'file://mock/gallery-image.jpg';
    setCapturedImage(mockUri);
    return mockUri;
  }, []);

  const pickDocument = useCallback(async () => {
    // Simulate picking a document
    const mockUri = 'file://mock/document.pdf';
    setCapturedImage(mockUri);
    return mockUri;
  }, []);

  const analyzeImage = useCallback(async (uri: string) => {
    setIsProcessing(true);
    // Simulate analysis delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          objects: ['receipt', 'text'],
          text: 'Total: $42.50',
          summary: 'A receipt for a meal.',
        };
        setAnalysisResult(result);
        setIsProcessing(false);
        resolve(result);
      }, 2000);
    });
  }, []);

  return { capturedImage, isProcessing, analysisResult, takePhoto, pickImage, pickDocument, analyzeImage };
}
