import { useCallback, useEffect, useState } from 'react';
import { JLPTLevel } from '../types';

export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        const jaVoices = availableVoices.filter(v => v.lang.startsWith('ja'));
        setVoices(jaVoices.length > 0 ? jaVoices : availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getSpeedForLevel = (level?: JLPTLevel): number => {
    switch (level) {
      case 'Zero':
      case 'N5':
        return 0.8; // chậm rãi rõ từng âm
      case 'N4':
        return 0.9; // vừa phải
      case 'N3':
      default:
        return 1.0; // tốc độ bản xứ tự nhiên
    }
  };

  const speak = useCallback((text: string, level?: JLPTLevel, customRate?: number) => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = customRate ?? getSpeedForLevel(level);
    utterance.pitch = 1.0;

    // Prefer Japanese voice if found
    const jaVoice = voices.find(v => v.lang.toLowerCase().includes('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  return { speak, stop, isPlaying, isSupported };
};
