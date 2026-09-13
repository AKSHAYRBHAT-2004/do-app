import { useState, useCallback } from 'react';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');
    setIsRecording(true);
    // Simulate recording for MVP
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockTranscript = "Remind me to buy groceries tomorrow at 5 PM.";
        setTranscript(mockTranscript);
        setIsProcessing(false);
        resolve(mockTranscript);
      }, 1500);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    setIsRecording(false);
    setIsProcessing(false);
    setTranscript('');
  }, []);

  return { isRecording, isProcessing, transcript, error, startRecording, stopRecording, cancelRecording };
}
