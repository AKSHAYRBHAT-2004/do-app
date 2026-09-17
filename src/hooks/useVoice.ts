import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');

    // ── Web: use browser Web Speech API ──
    if (Platform.OS === 'web') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError(new Error('Voice input is not supported in this browser. Try Chrome or Edge.'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN'; // Indian English — great for INR amounts, place names
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
        } else if (interimTranscript) {
          setTranscript(interimTranscript.trim()); // show live interim
        }
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setError(new Error('Microphone access denied. Please allow microphone in your browser settings.'));
        } else if (event.error === 'no-speech') {
          setError(new Error('No speech detected. Please speak clearly and try again.'));
        } else {
          setError(new Error(`Voice error: ${event.error}`));
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      return;
    }

    // ── Native: placeholder (would use expo-av + Whisper API) ──
    setIsRecording(true);
    // TODO: integrate expo-av for native recording + Whisper/Deepgram for transcription
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setIsProcessing(false);
      // Return whatever was transcribed so far
      const currentTranscript = transcript;
      return currentTranscript;
    }

    // Native fallback
    setIsRecording(false);
    setIsProcessing(false);
    return transcript;
  }, [transcript]);

  const cancelRecording = useCallback(() => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsProcessing(false);
    setTranscript('');
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
