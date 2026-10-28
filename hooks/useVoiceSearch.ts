import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeechRecognitionLike, SpeechRecognitionEventLike } from "@/types/nexus";

interface UseVoiceSearchOptions {
  lang?: string;
  onTranscript?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (message: string) => void;
}

const UNSUPPORTED_MESSAGE =
  "Voice search is not supported in this browser environment. Please type your query directly.";

const PERMISSION_MESSAGE =
  "To use Voice Search, please click 'Open in New Tab' at the top right of your preview window.";

const noop = () => {};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceSearch(options: UseVoiceSearchOptions = {}) {
  const {
    lang = "en-US",
    onTranscript = noop,
    onFinal = noop,
    onError = noop,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const manualStopRef = useRef(false);
  const startingRef = useRef(false);
  const blockedRef = useRef(false);

  const onTranscriptRef = useRef<(text: string) => void>(onTranscript);
  const onFinalRef = useRef<(text: string) => void>(onFinal);
  const onErrorRef = useRef<(message: string) => void>(onError);

  useEffect(() => {
    onTranscriptRef.current =
      typeof onTranscript === "function" ? onTranscript : noop;
    onFinalRef.current = typeof onFinal === "function" ? onFinal : noop;
    onErrorRef.current = typeof onError === "function" ? onError : noop;
  }, [onTranscript, onFinal, onError]);

  const emitError = useCallback((message: string) => {
    const handler = onErrorRef.current;
    if (typeof handler === "function") {
      try {
        handler(message);
      } catch {
        /* swallow handler errors so recognition never crashes React state */
      }
    }
  }, []);

  const emitTranscript = useCallback((text: string) => {
    const handler = onTranscriptRef.current;
    if (typeof handler === "function") {
      try {
        handler(text);
      } catch {
        /* noop */
      }
    }
  }, []);

  const emitFinal = useCallback((text: string) => {
    const handler = onFinalRef.current;
    if (typeof handler === "function") {
      try {
        handler(text);
      } catch {
        /* noop */
      }
    }
  }, []);

  const teardown = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.onstart = null;
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.abort();
      } catch {
        /* noop */
      }
    }
    recognitionRef.current = null;
    startingRef.current = false;
  }, []);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (startingRef.current || recognitionRef.current) return;

    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      blockedRef.current = true;
      emitError(UNSUPPORTED_MESSAGE);
      return;
    }

    startingRef.current = true;

    let recognition: SpeechRecognitionLike;
    try {
      recognition = new Ctor();
    } catch {
      startingRef.current = false;
      blockedRef.current = true;
      emitError(UNSUPPORTED_MESSAGE);
      return;
    }

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalRef.current = "";
    manualStopRef.current = false;

    recognition.onstart = () => {
      startingRef.current = false;
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      try {
        let interim = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (!result) continue;
          const transcript = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }

        if (finalText) {
          finalRef.current = `${finalRef.current} ${finalText}`.trim();
        }

        const combined = `${finalRef.current} ${interim}`.trim();
        if (combined) {
          emitTranscript(combined);
        }
      } catch {
        /* ignore malformed recognition events */
      }
    };

    recognition.onerror = (event: { error?: string }) => {
      const errorCode = event?.error ?? "unknown";
      startingRef.current = false;
      setIsListening(false);

      if (errorCode === "aborted" && manualStopRef.current) {
        teardown();
        return;
      }

      if (
        errorCode === "not-allowed" ||
        errorCode === "service-not-allowed" ||
        errorCode === "audio-capture"
      ) {
        blockedRef.current = true;
        teardown();
        emitError(PERMISSION_MESSAGE);
        return;
      }

      teardown();

      if (errorCode === "no-speech") {
        emitError("No speech detected. Please try again.");
        return;
      }
      emitError(UNSUPPORTED_MESSAGE);
    };

    recognition.onend = () => {
      startingRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;

      const finalText = finalRef.current.trim();
      finalRef.current = "";

      if (finalText) {
        emitFinal(finalText);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      startingRef.current = false;
      teardown();
      blockedRef.current = true;
      emitError(UNSUPPORTED_MESSAGE);
    }
  }, [lang, emitError, emitTranscript, emitFinal, teardown]);

  const toggleListening = useCallback(() => {
    if (isListening || recognitionRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening,
  };
}