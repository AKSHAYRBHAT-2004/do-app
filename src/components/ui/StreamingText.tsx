import React, { useState, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';

export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  speed?: number;
  className?: string;
  style?: TextStyle;
}

export default function StreamingText({
  text,
  isStreaming,
  speed = 30,
  className = '',
  style
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, isStreaming, speed]);

  useEffect(() => {
    if (!isStreaming) return;
    
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [isStreaming]);

  return (
    <Text className={`text-white ${className}`} style={style}>
      {displayedText}
      {isStreaming && <Text className="text-[#8B5CF6] font-bold">{cursorVisible ? '▋' : ' '}</Text>}
    </Text>
  );
}
