import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/ui/GlassCard';
import { useCamera } from '@/hooks/useCamera';

export default function CameraModal() {
  const router = useRouter();
  const { capturedImage, isProcessing, analysisResult, takePhoto, pickImage, pickDocument, analyzeImage } = useCamera();

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
      router.replace(`/chat/${Date.now()}?hasImage=true`);
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]/95 px-6 pt-12 pb-8">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-white text-2xl font-bold">Input</Text>
        <TouchableOpacity onPress={safeBack}>
          <Text className="text-gray-400 text-lg">Close</Text>
        </TouchableOpacity>
      </View>

      {!capturedImage ? (
        <View className="flex-1 justify-center">
          <TouchableOpacity onPress={takePhoto} className="mb-4">
            <GlassCard className="p-8 items-center border border-white/10">
              <Text className="text-4xl mb-3">📷</Text>
              <Text className="text-white text-lg font-semibold">Take Photo</Text>
              <Text className="text-gray-400 text-sm mt-1">Snap anything to get answers</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage} className="mb-4">
            <GlassCard className="p-8 items-center border border-white/10">
              <Text className="text-4xl mb-3">🖼️</Text>
              <Text className="text-white text-lg font-semibold">Choose from Gallery</Text>
              <Text className="text-gray-400 text-sm mt-1">Select an existing photo</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage} className="mb-4">
            <GlassCard className="p-8 items-center border border-white/10">
              <Text className="text-4xl mb-3">📄</Text>
              <Text className="text-white text-lg font-semibold">Upload Document</Text>
              <Text className="text-gray-400 text-sm mt-1">PDFs, receipts, or notes</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 justify-between">
          <View className="flex-1 rounded-2xl overflow-hidden border border-white/10 mb-6 bg-gray-900">
            <Image source={{ uri: capturedImage }} className="flex-1 w-full h-full" resizeMode="contain" />
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={() => takePhoto()} className="flex-1 mr-2">
              <GlassCard className="p-4 items-center bg-gray-800/50">
                <Text className="text-white font-medium">Retake</Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAnalyze} className="flex-1 ml-2">
              <GlassCard className="p-4 items-center bg-purple-600/30 border border-purple-500/50">
                <Text className="text-purple-300 font-bold">Analyze</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
