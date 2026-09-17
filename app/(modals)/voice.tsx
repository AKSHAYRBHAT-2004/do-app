import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedOrb from '@/components/ui/AnimatedOrb';
import { useVoice } from '@/hooks/useVoice';
import { useEffect } from 'react';

export default function VoiceModal() {
  const router = useRouter();
  const { isRecording, transcript, error, startRecording, stopRecording, cancelRecording, isProcessing } = useVoice();

  useEffect(() => {
    startRecording();
    return () => {
      cancelRecording();
    };
  }, []);

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleDone = async () => {
    const result = await stopRecording();
    const finalText = result || transcript;
    if (finalText && finalText.trim()) {
      router.replace(`/chat/${Date.now()}?query=${encodeURIComponent(finalText.trim())}`);
    } else {
      safeBack();
    }
  };

  const handleCancel = () => {
    cancelRecording();
    safeBack();
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]/96 justify-center items-center px-6">
      <View className="flex-1 justify-center items-center w-full">
        <AnimatedOrb size={150} isActive={isRecording} />

        <View className="mt-12 min-h-[80px] items-center justify-center w-full px-4">
          {error ? (
            <View className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 w-full">
              <Text className="text-red-300 text-sm font-medium text-center">{error.message}</Text>
            </View>
          ) : isProcessing ? (
            <Text className="text-purple-400 text-xl font-medium text-center">Processing...</Text>
          ) : transcript ? (
            <Text className="text-white text-xl font-medium text-center leading-relaxed">
              "{transcript}"
            </Text>
          ) : (
            <View className="items-center">
              <Text className="text-gray-400 text-xl font-medium text-center mb-2">
                🎤 Listening...
              </Text>
              <Text className="text-gray-600 text-xs text-center">
                Speak clearly — say what you need done
              </Text>
            </View>
          )}
        </View>

        {/* Tips */}
        {!transcript && !error && (
          <View className="mt-8 bg-white/5 rounded-2xl p-4 w-full max-w-xs border border-white/10">
            <Text className="text-gray-500 text-xs text-center mb-2">Try saying:</Text>
            {['"What should I eat tonight?"', '"Plan a trip to Goa"', '"Pay my electricity bill"'].map((tip, i) => (
              <Text key={i} className="text-gray-400 text-xs text-center italic mb-1">{tip}</Text>
            ))}
          </View>
        )}
      </View>

      <View className="pb-16 w-full flex-row justify-between items-center px-8">
        <TouchableOpacity onPress={handleCancel} className="px-6 py-4">
          <Text className="text-gray-400 text-lg">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isRecording ? handleDone : handleDone}
          className={`w-20 h-20 rounded-full items-center justify-center ${
            isRecording ? 'bg-red-500/20 border-red-500' : 'bg-purple-600/20 border-purple-500'
          } border-2`}
          activeOpacity={0.7}
        >
          <Text className="text-3xl">{isRecording ? '⏹' : '✓'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
