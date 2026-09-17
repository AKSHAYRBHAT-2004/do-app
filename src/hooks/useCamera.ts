import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';

// Safely import expo-image-picker (works on web + native)
let ImagePicker: any = null;
try {
  ImagePicker = require('expo-image-picker');
} catch {
  ImagePicker = null;
}

export function useCamera() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const requestPermissions = async (): Promise<boolean> => {
    if (!ImagePicker) return false;
    if (Platform.OS === 'web') return true; // Web uses file input natively
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and photo library access are needed to scan photos. Please enable them in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const takePhoto = useCallback(async () => {
    if (!ImagePicker) {
      console.warn('expo-image-picker not available');
      return null;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setCapturedImage(uri);
        return uri;
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Could not access the camera. Please try again.');
    }
    return null;
  }, []);

  const pickImage = useCallback(async () => {
    if (!ImagePicker) {
      console.warn('expo-image-picker not available');
      return null;
    }

    if (Platform.OS !== 'web') {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setCapturedImage(uri);
        return uri;
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Gallery Error', 'Could not open photo library. Please try again.');
    }
    return null;
  }, []);

  const pickDocument = useCallback(async () => {
    if (!ImagePicker) return null;

    // For documents, we use the image library as a fallback on web
    // On native, expo-document-picker can be used separately
    return await pickImage();
  }, [pickImage]);

  const analyzeImage = useCallback(async (uri: string) => {
    setIsProcessing(true);
    // TODO: Connect to Gemini Vision API for real analysis
    // For now: simulate analysis with a brief delay
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const result = {
          objects: ['scanned document', 'text content'],
          text: 'Image captured successfully. AI analysis ready.',
          summary: 'Photo captured and ready for analysis.',
          uri,
        };
        setAnalysisResult(result);
        setIsProcessing(false);
        resolve(result);
      }, 1000);
    });
  }, []);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
  }, []);

  return {
    capturedImage,
    isProcessing,
    analysisResult,
    takePhoto,
    pickImage,
    pickDocument,
    analyzeImage,
    clearImage,
  };
}
