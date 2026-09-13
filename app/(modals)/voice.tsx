import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedOrb from '@/components/ui/AnimatedOrb';
import { useVoice } from '@/hooks/useVoice';
import { useEffect } from 'react';

export default function VoiceModal() {
  const router = useRouter();
  const { isRecording, transcript, startRecording, stopRecording, isProcessing } = useVoice();

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
    };
  }, []);

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleDone = () => {
    stopRecording();
    if (transcript) {
      router.replace(`/chat/${Date.now()}?initialMessage=${encodeURIComponent(transcript)}`);
    } else {
      safeBack();
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0F]/95 justify-center items-center px-6">
      <View className="flex-1 justify-center items-center w-full">
        <AnimatedOrb size={150} isActive={isRecording} />

        <View className="mt-12 h-24 items-center justify-center w-full">
          {isProcessing ? (
            <Text className="text-purple-400 text-xl font-medium text-center">Processing...</Text>
          ) : transcript ? (
            <Text className="text-white text-2xl font-medium text-center leading-relaxed">
              "{transcript}"
            </Text>
          ) : (
            <Text className="text-gray-400 text-xl font-medium text-center animate-pulse">
              I'm listening...
            </Text>
          )}
        </View>
      </View>

      <View className="pb-16 w-full flex-row justify-between items-center px-8">
        <TouchableOpacity onPress={safeBack} className="px-6 py-4">
          <Text className="text-gray-400 text-lg">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isRecording ? stopRecording : handleDone}
          className={`w-20 h-20 rounded-full items-center justify-center ${isRecording ? 'bg-red-500/20 border-red-500' : 'bg-purple-600/20 border-purple-500'} border-2`}
        >
          <Text className="text-3xl">{isRecording ? '⏹' : '✓'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
