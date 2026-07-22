import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import { 
  Send, 
  Sparkles, 
  User, 
  Play, 
  Award, 
  RefreshCw, 
  BrainCircuit, 
  Loader2, 
  MessageSquare,
  FileText,
  AlertCircle,
  Trophy,
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

export default function MockInterviewPage() {
  const [topic, setTopic] = useState('arrays');
  const [difficulty, setDifficulty] = useState('Medium');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [loadingEval, setLoadingEval] = useState(false);
  
  // Audio & Video controls
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [avatarMouthHeight, setAvatarMouthHeight] = useState(2);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const handleSendRef = useRef<any>(null);

  // Animate mouth when AI speaks
  useEffect(() => {
    if (!isInterviewerSpeaking) {
      setAvatarMouthHeight(2);
      return;
    }
    const interval = setInterval(() => {
      setAvatarMouthHeight(Math.floor(Math.random() * 16) + 4);
    }, 120);
    return () => clearInterval(interval);
  }, [isInterviewerSpeaking]);

  // Monitor device permissions and physical existence
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setMicError("Media devices API not supported in this browser.");
      return;
    }
    
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some(d => d.kind === 'audioinput');
        if (!hasMic) {
          setMicError("No microphone detected on your system. Please connect a microphone to dictate voice responses.");
        } else {
          // Check permissions if Supported
          if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'microphone' as any }).then((permissionStatus) => {
              if (permissionStatus.state === 'denied') {
                setMicError("Microphone permission has been blocked by your browser. Please click the camera/mic icon in the browser address bar and choose 'Allow'.");
              } else {
                setMicError(null);
              }
              permissionStatus.onchange = () => {
                if (permissionStatus.state === 'denied') {
                  setMicError("Microphone permission has been blocked by your browser. Please click the camera/mic icon in the browser address bar and choose 'Allow'.");
                } else {
                  setMicError(null);
                }
              };
            }).catch(() => {
              // Permission query error fallback
            });
          } else {
            setMicError(null);
          }
        }
      } catch (e) {
        console.warn("Failed to check media devices:", e);
      }
    };

    checkDevices();
    
    navigator.mediaDevices.addEventListener('devicechange', checkDevices);
    return () => {
      if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', checkDevices);
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Webcam stream activation
  useEffect(() => {
    if (interviewStarted && isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn })
        .then(stream => {
          setCameraStream(stream);
        })
        .catch(err => {
          console.warn("Webcam access failed with audio. Retrying video only...", err);
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              setCameraStream(stream);
            })
            .catch(err2 => {
              console.error("Webcam video-only fallback failed:", err2);
              setIsCamOn(false);
            });
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewStarted, isCamOn]);

  useEffect(() => {
    if (videoRef.current) {
      if (cameraStream) {
        if (videoRef.current.srcObject !== cameraStream) {
          videoRef.current.srcObject = cameraStream;
        }
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraStream]);

  // Audio Analyser to visually verify mic registers noise
  useEffect(() => {
    if (!cameraStream || !isMicOn) {
      setMicVolume(0);
      return;
    }
    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
      source = audioContext.createMediaStreamSource(cameraStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Map average volume (0-255) to a clean percentage scale (0-100)
        setMicVolume(Math.min(100, Math.round((average / 80) * 100)));
        animationFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn("Failed to initialize audio level analysis:", e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [cameraStream, isMicOn]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          const normalized = final.toLowerCase().trim();
          if (normalized === "clear text" || normalized === "clear input") {
            setInput('');
            return;
          }
          if (normalized === "send answer" || normalized === "submit answer") {
            if (handleSendRef.current) handleSendRef.current();
            return;
          }
          if (normalized === "leave call" || normalized === "exit interview") {
            window.speechSynthesis.cancel();
            window.location.reload();
            return;
          }
          setInput(prev => prev + (prev ? ' ' : '') + final);
        } else if (interim) {
          // You could optionally display interim text, but setting input directly is best for now
          // to give real-time feedback. But since input is controlled, we'd need a separate state.
          // To keep it simple and bug-free, we'll just set it to the input temporarily.
          // Actually, appending final is safer to prevent text cursor jumping.
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error", err);
        let msg = "Speech dictation failed.";
        if (err.error === 'not-allowed') {
          msg = "Microphone access denied for Speech Recognition. Please click the camera/microphone icon in the address bar and select 'Allow'.";
        } else if (err.error === 'no-speech') {
          msg = "No speech was detected. Please ensure your microphone is connected, unmuted, and speak directly into it.";
        } else if (err.error === 'network') {
          msg = "Network communication error. Speech Recognition requires Google Chrome or Microsoft Edge. Privacy browsers (like Brave) or Firefox block this service by default.";
        } else {
          msg = `Speech recognition error: ${err.error || 'Unknown error code'}`;
        }
        setMicError(msg);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text to Speech
  const speakText = (text: string) => {
    if (!isVoiceOn) return;
    const cleanText = text.replace(/[*#`_\-]/g, '').replace(/\[.*\]\(.*\)/g, '');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onstart = () => setIsInterviewerSpeaking(true);
    utterance.onend = () => setIsInterviewerSpeaking(false);
    utterance.onerror = () => setIsInterviewerSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    setMessages([]);
    setEvaluation(null);
    setIsTyping(true);

    const systemPrompt = `You are a friendly, professional Senior Software Engineer conducting a technical mock interview.\nTopic: ${topic}\nDifficulty: ${difficulty}\n\nAct as the interviewer. Start by greeting the candidate warmly, introducing yourself, and asking a single, clear technical coding or system design question appropriate for the topic and difficulty. Wait for the candidate's response. Do not output anything other than your interview dialogue. Keep it short and conversational so it is easy to listen to.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Let\'s start the interview.' }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          { role: 'interviewer', content: data.text, timestamp: new Date() }
        ]);
        speakText(data.text);
      } else {
        setMessages([
          { role: 'interviewer', content: 'System: Failed to start the interview. Make sure your GROQ_API_KEY is configured in .env and restart the server.', timestamp: new Date() }
        ]);
      }
    } catch (e) {
      setMessages([
        { role: 'interviewer', content: 'System error contacting the interviewer agent.', timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      role: 'candidate',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (overrideText === undefined) setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'interviewer' ? 'assistant' : 'user',
      content: m.content
    }));

    const systemPrompt = `You are a friendly, professional Senior Software Engineer conducting a technical mock interview.\nTopic: ${topic}\nDifficulty: ${difficulty}\n\nAct as the interviewer. Guide the candidate, give subtle hints if they struggle, ask follow-up questions about space/time complexity, or suggest optimizations. Keep it conversational.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: textToSend }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'interviewer', content: data.text, timestamp: new Date() }]);
        speakText(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [input, messages, topic, difficulty]);

  const toggleSpeechDictation = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setIsListening(true);
        recognitionRef.current.start();
      }
    } catch (e) {
      console.warn("Speech recognition toggle error:", e);
      setIsListening(false);
    }
  };

  const finishAndEvaluate = async () => {
    setLoadingEval(true);
    setEvaluation(null);
    window.speechSynthesis.cancel();

    const historyText = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n\n');
    const systemPrompt = `You are an expert technical interview evaluator. Analyze the following transcript of a mock interview on ${topic} (${difficulty}).\n\nProvide a professional evaluation report using markdown with the following sections:\n1. Overall Score (out of 100)\n2. Key Strengths\n3. Areas of Improvement\n4. Recommended Resources/Next Steps.\nKeep your tone constructive and motivating.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Here is the transcript:\n\n${historyText}` }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.text);
      } else {
        setEvaluation("Failed to retrieve evaluation. Please check server connections.");
      }
    } catch (e) {
      setEvaluation("Error generating evaluation.");
    } finally {
      setLoadingEval(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[var(--color-bg-primary)] text-gray-200">
      
      {/* Left Sidebar Panel */}
      <div className="w-80 border-r border-[#242428] bg-[#1A1A1E] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <BrainCircuit className="text-blue-400" size={20} />
              AI Video Interview
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Experience an interactive video and voice call technical interview session powered by Groq. Dictate your answers using speech recognition.
            </p>
          </div>

          {!interviewStarted ? (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Choose Topic</label>
                <select 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)}
                  className="w-full bg-[#2C2C32] text-sm text-white font-bold border border-white/5 outline-none rounded-xl px-3 py-2.5 cursor-pointer focus:border-blue-500 transition-colors"
                >
                  <option value="Arrays & HashMaps">Arrays & HashMaps</option>
                  <option value="Linked Lists & Pointers">Linked Lists & Pointers</option>
                  <option value="Trees & Binary Search Trees">Trees & Recursion</option>
                  <option value="Graph BFS/DFS & Dijkstra">Graphs & Paths</option>
                  <option value="Dynamic Programming (Knapsack/LCS)">Dynamic Programming</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        difficulty === d 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={startInterview} className="w-full mt-4 flex items-center justify-center gap-2">
                <Play size={14} /> Start Call Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-white/5">
              {/* Active Video Feed of the AI Interviewer */}
              <div className="relative aspect-video w-full rounded-2xl bg-[#0A051A] border border-indigo-500/20 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center group">
                <svg viewBox="0 0 100 100" className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  {/* Glowing head contour */}
                  <rect x="15" y="15" width="70" height="70" rx="20" fill="#130D33" stroke="currentColor" strokeWidth="1.5" />
                  
                  {/* Cybernetic Ear antennas */}
                  <rect x="8" y="35" width="7" height="30" rx="3" fill="currentColor" opacity="0.8" />
                  <rect x="85" y="35" width="7" height="30" rx="3" fill="currentColor" opacity="0.8" />
                  
                  {/* Glowing Eyes */}
                  <motion.ellipse 
                    cx="35" 
                    cy="45" 
                    rx="6" 
                    ry="6" 
                    fill="#60A5FA" 
                    animate={{ scaleY: [1, 1, 0.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
                  />
                  <motion.ellipse 
                    cx="65" 
                    cy="45" 
                    rx="6" 
                    ry="6" 
                    fill="#60A5FA" 
                    animate={{ scaleY: [1, 1, 0.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
                  />

                  {/* Cybernetic Head band */}
                  <rect x="25" y="25" width="50" height="3" rx="1.5" fill="currentColor" opacity="0.2" />

                  {/* Mouth speaking animation path */}
                  <rect 
                    x="38" 
                    y="65" 
                    width="24" 
                    height={avatarMouthHeight} 
                    rx={avatarMouthHeight / 2} 
                    fill="#60A5FA" 
                    className="transition-all duration-75"
                  />
                </svg>
                
                {/* Floating active mic speaker status */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded-md text-[9px] font-bold text-indigo-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${isInterviewerSpeaking ? 'bg-indigo-400 animate-ping' : 'bg-gray-500'}`} />
                  <span>Interviewer (AI)</span>
                </div>
              </div>

              {/* Active Video Feed of the Candidate */}
              <div className="relative aspect-video w-full rounded-2xl bg-[#0F0F11] border border-white/5 overflow-hidden shadow-inner group">
                {isCamOn ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
                    <VideoOff size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Camera Off</span>
                  </div>
                )}
                
                {/* Floating mic status indicator with volume bar */}
                <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/70 px-2.5 py-1 rounded-lg text-[9px] font-extrabold text-white border border-white/5">
                  {isMicOn ? (
                    <div className="flex items-center gap-1.5">
                      <Mic size={10} className="text-emerald-400 animate-pulse" />
                      {/* Realtime volume level bar */}
                      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden inline-block">
                        <div 
                          className="h-full bg-emerald-400 transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.max(0, micVolume))}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <MicOff size={10} className="text-red-400" />
                  )}
                  <span>Candidate</span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center gap-3 py-1 bg-white/[0.02] border border-white/5 rounded-2xl">
                <button 
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`p-2.5 rounded-xl transition-all ${isCamOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400'}`}
                  title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isCamOn ? <VideoIcon size={16} /> : <VideoOff size={16} />}
                </button>
                
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2.5 rounded-xl transition-all ${isMicOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-red-500/20 text-red-400'}`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                </button>

                <button 
                  onClick={() => {
                    const next = !isVoiceOn;
                    setIsVoiceOn(next);
                    if (!next) window.speechSynthesis.cancel();
                  }}
                  className={`p-2.5 rounded-xl transition-all ${isVoiceOn ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-amber-500/20 text-amber-400'}`}
                  title={isVoiceOn ? "Mute Interviewer Voice" : "Unmute Interviewer Voice"}
                >
                  {isVoiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              <div className="bg-[#1E1E22] border border-[#242428] p-4 rounded-2xl space-y-2">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Active Call Details</div>
                <div className="text-xs font-semibold text-gray-300">Topic: <span className="text-white font-bold">{topic}</span></div>
                <div className="text-xs font-semibold text-gray-300">Difficulty: <span className="text-white font-bold">{difficulty}</span></div>
              </div>

              <button 
                onClick={finishAndEvaluate}
                disabled={loadingEval || messages.length < 2}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                {loadingEval ? <Loader2 className="animate-spin" size={14} /> : <Award size={14} />}
                Submit & Evaluate
              </button>

              <button 
                onClick={() => {
                  setInterviewStarted(false);
                  window.speechSynthesis.cancel();
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Leave Call Session
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <Sparkles size={12} className="text-blue-500" />
          Senior Interviewer Agent
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#0F0F11]">
        
        {/* Chat / Evaluation Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence>
              {micError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3 text-amber-400"
                >
                  <div className="flex gap-3">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div className="text-xs font-semibold leading-relaxed">
                      {micError}
                      <p className="mt-1 text-amber-500/80 font-normal">You can still participate by typing your answers in the chat input below.</p>
                    </div>
                  </div>
                  <button onClick={() => setMicError(null)} className="text-amber-500 hover:text-amber-300 transition-colors p-1 rounded-md hover:bg-amber-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {!interviewStarted ? (
              <div className="h-96 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                  <VideoIcon size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Begin Video Interview Session</h3>
                  <p className="text-xs text-gray-400 max-w-sm">Launch a live webcam-monitored mock session. Speak aloud using Speech Recognition to formulate answers.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat transcript */}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                      msg.role === 'interviewer' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      {msg.role === 'interviewer' ? <Sparkles size={14} /> : <User size={14} />}
                    </div>
                    
                    <div className={`flex-1 rounded-xl p-4.5 text-sm leading-relaxed border shadow-sm ${
                      msg.role === 'interviewer' ? 'bg-[#1A1A1E] border-[#242428]' : 'bg-blue-600/10 border-blue-500/20 text-blue-50'
                    }`}>
                      <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 animate-pulse">
                      <Sparkles size={14} />
                    </div>
                    <div className="bg-[#1A1A1E] border border-[#242428] rounded-xl px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Evaluation Scorecard Overlay */}
            {evaluation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1A1A1E] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Trophy className="text-emerald-400" size={20} /> Interview Performance Scorecard
                </h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {evaluation}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with microphone speech to text indicator */}
        {interviewStarted && !evaluation && (
          <div className="p-4 border-t border-[#242428] bg-[#1A1A1E]">
            <div className="max-w-4xl mx-auto flex gap-3 relative items-center">
              {/* Speech Recognition dictation trigger button */}
              <button
                onClick={toggleSpeechDictation}
                disabled={isTyping}
                className={`p-3.5 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                  isListening 
                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
                title={isListening ? "Stop voice dictation" : "Dictate response using voice Speech-to-Text"}
              >
                <Mic size={16} />
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening aloud..." : "Type or speak your explanation, pseudocode, complexity analyzes..."}
                disabled={isTyping}
                className="flex-1 bg-[#2C2C32] border border-white/5 rounded-xl pl-4 pr-16 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-[var(--color-bg-hover)] disabled:text-[var(--color-text-muted)] transition-colors shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
