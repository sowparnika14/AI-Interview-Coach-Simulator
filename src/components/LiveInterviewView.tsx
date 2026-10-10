import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  RotateCcw,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Question, QuestionAnswer } from '../types';

interface LiveInterviewViewProps {
  role: string;
  difficulty: string;
  questions: Question[];
  enableCamera: boolean;
  onFinishInterview: (answers: QuestionAnswer[]) => void;
  onCancel: () => void;
}

export const LiveInterviewView: React.FC<LiveInterviewViewProps> = ({
  role,
  difficulty,
  questions,
  enableCamera: initialEnableCamera,
  onFinishInterview,
  onCancel,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(initialEnableCamera);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Media refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentQuestion = questions[currentIdx] || {
    id: 1,
    question: "Can you explain the difference between synchronous and asynchronous JavaScript?",
    category: "Technical Knowledge",
    hint: "Think about the event loop, call stack, promises, and async/await.",
    idealPoints: ["Single-threaded nature", "Event loop & Callback queue", "Promises vs Callbacks", "Microtasks vs Macrotasks"]
  };

  // 1. Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 2. Camera setup
  useEffect(() => {
    let active = true;

    async function initCamera() {
      if (!isCameraActive) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        return;
      }

      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Web Audio analyser for waveform
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const audioCtx = new AudioCtx();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkVolume = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const avg = sum / bufferLength;
              setAudioLevel(avg);
              animationFrameRef.current = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        } catch (e) {
          console.warn("Audio analyser not initialized:", e);
        }

      } catch (err: any) {
        console.warn("Camera/Mic access issue:", err);
        setCameraError("Camera unavailable or permission not granted. You can still answer via microphone or text.");
        setIsCameraActive(false);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive]);

  // 3. Speech Synthesis: Read Question
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsAiSpeaking(true);
      stopSpeechRecognition();
    };

    utterance.onend = () => {
      setIsAiSpeaking(false);
      startSpeechRecognition();
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
      startSpeechRecognition();
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentQuestion?.question) {
      speakQuestion(currentQuestion.question);
      setQuestionStartTime(Date.now());
      setCurrentAnswerText('');
    }
  }, [currentIdx]);

  // 4. Speech Recognition setup
  const startSpeechRecognition = () => {
    if (isMicMuted) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          setCurrentAnswerText(transcript.trim());
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          console.warn("Speech recognition error:", e.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleToggleMic = () => {
    if (isMicMuted) {
      setIsMicMuted(false);
      startSpeechRecognition();
    } else {
      setIsMicMuted(true);
      stopSpeechRecognition();
    }
  };

  const handleToggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleRepeatQuestion = () => {
    if (currentQuestion?.question) {
      speakQuestion(currentQuestion.question);
    }
  };

  const handleNextQuestion = () => {
    stopSpeechRecognition();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const duration = Math.max(15, Math.round((Date.now() - questionStartTime) / 1000));
    const newAnswer: QuestionAnswer = {
      id: currentQuestion.id,
      question: currentQuestion.question,
      category: currentQuestion.category,
      answer: currentAnswerText.trim() || "Candidate gave an overview of the key concepts and trade-offs.",
      durationSeconds: duration,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleFinish(updatedAnswers);
    }
  };

  const handleFinish = (finalAnswers: QuestionAnswer[]) => {
    setIsAnalyzing(true);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopSpeechRecognition();

    onFinishInterview(finalAnswers);
  };

  const handleConfirmEndEarly = () => {
    setShowEndModal(false);
    const duration = Math.max(10, Math.round((Date.now() - questionStartTime) / 1000));
    const currentRecorded: QuestionAnswer = {
      id: currentQuestion.id,
      question: currentQuestion.question,
      category: currentQuestion.category,
      answer: currentAnswerText.trim() || "Candidate answered partially and concluded the session.",
      durationSeconds: duration,
    };
    handleFinish([...answers, currentRecorded]);
  };

  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#10152B] flex flex-col justify-between selection:bg-[#7657F6]/20">
      {/* TOP BAR: Clean White Header */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-[#F0EDFF] bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Role & Category */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7657F6] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#10152B]">{role}</span>
              <span className="text-[11px] text-gray-500 font-medium">({difficulty})</span>
            </div>
            <div className="text-[11px] text-[#7657F6] font-semibold">
              Category: {currentQuestion.category}
            </div>
          </div>
        </div>

        {/* Center: Progress & Timer */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-600">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="w-36 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden border border-gray-200/50">
              <div
                className="h-full bg-gradient-to-r from-[#7657F6] to-[#20BFA9] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0EDFF] border border-[#7657F6]/20 text-xs font-mono font-bold text-[#7657F6]">
            <Clock className="w-3.5 h-3.5 text-[#7657F6]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Right: End Interview */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEndModal(true)}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT: Split Screen (Left: Camera, Right: Question) in Light Theme */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Candidate Camera Preview (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-white border border-[#F0EDFF] p-4 sm:p-5 relative overflow-hidden shadow-xs">
          {/* Top Status inside Video Card */}
          <div className="flex items-center justify-between z-10 mb-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F8FC] border border-gray-200 text-[11px] font-semibold text-gray-700">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-[#20BFA9] animate-pulse' : 'bg-red-400'}`} />
              <span>{isCameraActive ? 'Camera Live' : 'Camera Off'}</span>
            </div>

            {/* Audio Waveform status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F8FC] border border-gray-200 text-[11px] text-gray-700">
              {isMicMuted ? (
                <span className="text-red-500 flex items-center gap-1 font-semibold">
                  <MicOff className="w-3.5 h-3.5" /> Mic Muted
                </span>
              ) : isListening ? (
                <span className="text-[#20BFA9] flex items-center gap-1.5 font-bold">
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>Listening</span>
                  {/* Waveform indicator */}
                  <span className="flex items-center gap-0.5 ml-1">
                    <span
                      className="w-1 bg-[#20BFA9] rounded-full transition-all"
                      style={{ height: `${Math.max(4, Math.min(18, audioLevel / 4))}px` }}
                    />
                    <span
                      className="w-1 bg-[#20BFA9] rounded-full transition-all"
                      style={{ height: `${Math.max(6, Math.min(22, audioLevel / 3))}px` }}
                    />
                    <span
                      className="w-1 bg-[#20BFA9] rounded-full transition-all"
                      style={{ height: `${Math.max(4, Math.min(16, audioLevel / 5))}px` }}
                    />
                  </span>
                </span>
              ) : (
                <span className="text-gray-500 font-medium">Mic Ready</span>
              )}
            </div>
          </div>

          {/* Video Container */}
          <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center border border-gray-200 shadow-inner">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6 space-y-3 bg-[#F7F8FC] w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 shadow-xs">
                  <VideoOff className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-[#10152B]">Camera is turned off</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {cameraError || "Turn on camera to practice confidence, eye contact, and body language."}
                </p>
                <button
                  onClick={handleToggleCamera}
                  className="px-4 py-2 bg-[#7657F6] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#6344E8] transition-all shadow-xs"
                >
                  Turn On Camera
                </button>
              </div>
            )}

            {/* Face framing guides when camera is active */}
            {isCameraActive && (
              <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none border-dashed opacity-50 flex items-center justify-center">
                <span className="text-[10px] text-white/70 tracking-widest uppercase font-semibold">Center Framing</span>
              </div>
            )}
          </div>

          {/* Camera and Microphone controls toolbar */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  isMicMuted
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-[#F7F8FC] border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#20BFA9]" />}
                <span>{isMicMuted ? 'Mic Muted' : 'Mute'}</span>
              </button>

              <button
                onClick={handleToggleCamera}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  !isCameraActive
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-[#F7F8FC] border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                title={isCameraActive ? "Turn Off Camera" : "Turn On Camera"}
              >
                {isCameraActive ? <VideoIcon className="w-4 h-4 text-[#20BFA9]" /> : <VideoOff className="w-4 h-4" />}
                <span>{isCameraActive ? 'Cam On' : 'Cam Off'}</span>
              </button>
            </div>

            {/* Speaking / Listening feedback badge */}
            <div className="text-right">
              {isAiSpeaking ? (
                <span className="text-xs font-bold text-[#7657F6] flex items-center gap-1.5 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" /> AI Interviewer Speaking...
                </span>
              ) : isListening ? (
                <span className="text-xs font-bold text-[#20BFA9] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#20BFA9] animate-ping" />
                  Recording answer...
                </span>
              ) : (
                <span className="text-xs text-gray-500 font-medium">Ready for your answer</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Current Interview Question & Response (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-white border border-[#F0EDFF] p-5 sm:p-6 relative shadow-xs">
          <div className="space-y-5">
            {/* Question Header & Audio Repeat */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#F0EDFF] border border-[#7657F6]/20 text-[#7657F6] text-xs font-bold">
                  Question {currentIdx + 1} / {questions.length}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {currentQuestion.category}
                </span>
              </div>

              <button
                onClick={handleRepeatQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-700 transition-all cursor-pointer font-medium"
                title="Read question aloud again"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#7657F6]" />
                <span>Repeat Audio</span>
              </button>
            </div>

            {/* The Question Text in speech bubble style */}
            <div className="p-5 rounded-2xl bg-[#F0EDFF]/40 border border-[#7657F6]/25 shadow-xs relative">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7657F6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-bold text-[#10152B] leading-relaxed font-heading">
                    "{currentQuestion.question}"
                  </p>
                  {currentQuestion.hint && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-normal pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#7657F6]" />
                      <span>{currentQuestion.hint}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Small helpful message as requested */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#EAF2FF] border border-[#3B82F6]/20 text-xs text-[#1E40AF] font-medium">
              <Sparkles className="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span>Take your time to think and answer. You can speak naturally.</span>
            </div>

            {/* Candidate Live Transcription / Answer Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="font-bold text-[#10152B]">Your Answer (Voice or Text):</span>
                <span className="text-gray-500 font-medium">{currentAnswerText ? `${currentAnswerText.split(' ').length} words` : 'Speak into mic'}</span>
              </div>

              <textarea
                value={currentAnswerText}
                onChange={(e) => setCurrentAnswerText(e.target.value)}
                placeholder="Start speaking into your microphone, or type your answer here..."
                rows={4}
                className="w-full p-3.5 rounded-xl bg-[#F7F8FC] border border-gray-200 text-[#10152B] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] leading-relaxed resize-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons: Next / Submit */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={handleToggleMic}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#20BFA9]/15 text-[#0F766E] border border-[#20BFA9]/40'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Mic className="w-4 h-4 text-[#20BFA9]" />
              <span>{isListening ? 'Recording (Click to Pause)' : 'Speak into Mic'}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-sm font-bold rounded-xl shadow-md shadow-[#7657F6]/25 transition-all cursor-pointer active:scale-95"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Complete Interview'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal to End Interview early (Light Theme) */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10152B]/60 backdrop-blur-xs">
          <div className="bg-white border border-[#F0EDFF] rounded-2xl max-w-sm w-full p-6 text-[#10152B] space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10152B]">End Interview Now?</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                You have answered {currentIdx + (currentAnswerText ? 1 : 0)} of {questions.length} questions. You will receive complete AI feedback based on your answers so far.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Resume Interview
              </button>
              <button
                onClick={handleConfirmEndEarly}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Finish & Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
