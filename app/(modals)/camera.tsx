import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useCamera } from '@/hooks/useCamera';

export default function CameraModal() {
  const router = useRouter();
  const {
    capturedImage,
    isProcessing,
    analysisResult,
    takePhoto,
    pickImage,
    pickDocument,
    analyzeImage,
    clearImage,
  } = useCamera();

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleAnalyze = async () => {
    if (capturedImage) {
      await analyzeImage(capturedImage);
      router.replace(`/chat/${Date.now()}?hasImage=true&query=Analyze this image and tell me what you see`);
    }
  };

  const handleTakePhoto = async () => {
    await takePhoto();
  };

  const handlePickImage = async () => {
    await pickImage();
  };

  const handlePickDocument = async () => {
    await pickDocument();
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]/98 px-6 pt-12 pb-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-white text-2xl font-bold">Snap & Solve</Text>
          <Text className="text-gray-400 text-xs mt-0.5">Take or upload a photo for instant AI analysis</Text>
        </View>
        <TouchableOpacity onPress={safeBack} className="bg-white/10 px-4 py-2 rounded-full">
          <Text className="text-gray-300 text-sm font-medium">Close</Text>
        </TouchableOpacity>
      </View>

      {!capturedImage ? (
        /* ─── No image yet — show picker options ─── */
        <View className="flex-1 justify-center gap-4">
          {/* Take Photo */}
          <TouchableOpacity onPress={handleTakePhoto} activeOpacity={0.8}>
            <GlassCard className="p-7 items-center border border-white/10">
              <Text className="text-5xl mb-3">📷</Text>
              <Text className="text-white text-lg font-bold mb-1">Take Photo</Text>
              <Text className="text-gray-400 text-sm text-center">
                Open camera to snap a bill, product, menu, or document
              </Text>
            </GlassCard>
          </TouchableOpacity>

          {/* Choose from Gallery */}
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <GlassCard className="p-7 items-center border border-white/10">
              <Text className="text-5xl mb-3">🖼️</Text>
              <Text className="text-white text-lg font-bold mb-1">Choose from Gallery</Text>
              <Text className="text-gray-400 text-sm text-center">
                Select an existing photo from your device
              </Text>
            </GlassCard>
          </TouchableOpacity>

          {/* Upload Document */}
          <TouchableOpacity onPress={handlePickDocument} activeOpacity={0.8}>
            <GlassCard className="p-7 items-center border border-white/10">
              <Text className="text-5xl mb-3">📄</Text>
              <Text className="text-white text-lg font-bold mb-1">Upload Document</Text>
              <Text className="text-gray-400 text-sm text-center">
                PDFs, receipts, contracts, or any photo
              </Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── Image captured — show preview + actions ─── */
        <View className="flex-1">
          {/* Image Preview */}
          <View className="flex-1 rounded-2xl overflow-hidden border border-white/10 mb-5 bg-black/60 min-h-[260px]">
            <Image
              source={{ uri: capturedImage }}
              className="flex-1 w-full"
              resizeMode="contain"
              style={{ minHeight: 260 }}
            />
            {isProcessing && (
              <View className="absolute inset-0 bg-black/60 items-center justify-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text className="text-purple-300 text-sm mt-3 font-medium">
                  AI is analyzing your image...
                </Text>
              </View>
            )}
          </View>

          {/* Analysis Result Preview */}
          {analysisResult && (
            <View className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3.5 mb-4">
              <Text className="text-purple-300 text-xs font-bold mb-1">✨ AI Ready</Text>
              <Text className="text-gray-200 text-sm">{analysisResult.summary}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={clearImage}
              className="flex-1"
              activeOpacity={0.8}
            >
              <GlassCard className="py-4 items-center bg-white/5 border border-white/10">
                <Text className="text-gray-300 font-semibold text-sm">🔄 Retake / Reset</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAnalyze}
              disabled={isProcessing}
              className="flex-[1.5]"
              activeOpacity={0.8}
            >
              <GlassCard className="py-4 items-center bg-purple-600/40 border border-purple-500/60">
                <Text className="text-purple-200 font-bold text-sm">
                  {isProcessing ? '⏳ Analyzing...' : '⚡ Analyze with AI'}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
