'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';




///
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
};

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}




///
interface VoiceState {
  isListening: boolean;
  currentField: string;
  isProcessing: boolean;
}

interface FormData {
  role: string;
  type: string;
  experience: string;
  technology: string;
  questionCount: string;
}

export default function Generate() {
  const isRecognizing = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    role: '',
    type: '',
    experience: '',
    technology: '',
    questionCount: '',
  });
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    currentField: '',
    isProcessing: false,
  });
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const router = useRouter();

  const fields = [
    { key: 'role', label: 'role', question: 'What role are you interviewing for?' },
    { key: 'type', label: 'interview type', question: 'What type of interview is this? Say technical, behavioral, or system design.' },
    { key: 'experience', label: 'experience level', question: 'What is your experience level? Say junior, mid, or senior.' },
    { key: 'technology', label: 'technology', question: 'What technology or programming language should we focus on?' },
    { key: 'questionCount', label: 'number of questions', question: 'How many questions would you like? Say a number between 3 and 10.' },
  ];

  const MAX_VOICE_QUESTIONS = fields.length;

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //     if (SpeechRecognition) {
  //       const recognition = new SpeechRecognition();
  //       recognition.continuous = false;
  //       recognition.interimResults = false;
  //       recognition.lang = 'en-US';
  //       setRecognition(recognition);
  //     }
  //     setSynthesis(window.speechSynthesis);
  //   }
  // }, []);

  // Initialize SpeechRecognition and SpeechSynthesis
  
 // useEffect(() => {
    // if (typeof window !== "undefined") {
    //   const SpeechRecognitionClass =
    //     window.SpeechRecognition || window.webkitSpeechRecognition;

  //   let recognition: any = null;

  //   if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
  //     const SpeechRecognitionClass =
  //    window.SpeechRecognition || window.webkitSpeechRecognition;

  //    recognition = new SpeechRecognitionClass();

  //     if (SpeechRecognitionClass) {
  //       const recog = new SpeechRecognitionClass();
  //       recog.continuous = false;
  //       recog.interimResults = false;
  //       recog.lang = "en-US";

  //       recog.onstart = () => {
  //         console.log("Speech recognition started");
  //         isRecognizing.current = true;
  //       };

  //       recog.onend = () => {
  //         console.log("Speech recognition ended");
  //         isRecognizing.current = false;
  //       };

  //       setRecognition(recog);
  //     }

  //     setSynthesis(window.speechSynthesis);
  //   }
  // }, []);



// {  useEffect(() => {
//   if (typeof window === "undefined") return; // Run only on client side

//   const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

//   if (!SpeechRecognitionClass) {
//     console.error("SpeechRecognition is not supported in this browser.");
//     return;
//   }

//   const recog = new SpeechRecognitionClass();
//   recog.continuous = false;
//   recog.interimResults = false;
//   recog.lang = "en-IN";

//   // Event listeners
//   recog.onstart = () => {
//     console.log("Speech recognition started");
//     isRecognizing.current = true;
//   };

//   recog.onend = () => {
//     console.log("Speech recognition ended");
//     isRecognizing.current = false;
//   };

//   setRecognition(recog);
//   setSynthesis(window.speechSynthesis);
// }, []);}


// Removed duplicate recognition state declaration

useEffect(() => {
  if (typeof window === "undefined") return; // Only run on client

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    console.error("SpeechRecognition is not supported in this browser.");
    return;
  }

  const recog = new SpeechRecognitionClass();
  recog.continuous = false;
  recog.interimResults = false;
  recog.lang = "en-US";

  // Event listeners
  recog.onstart = () => {
    console.log("Speech recognition started");
    isRecognizing.current = true;
  };

  recog.onend = () => {
   console.log("Speech recognition ended");
   isRecognizing.current = false;
   };


  setRecognition(recog);
  setSynthesis(window.speechSynthesis);
}, []);





   useEffect(() => {
    if (currentStep < fields.length) {
      askCurrentQuestion(currentStep);
    }
  }, [currentStep]);


  const speak = (text: string) => {
    if (synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = synthesis.getVoices().find(voice => voice.name.includes('Google')) || synthesis.getVoices()[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      synthesis.speak(utterance);
    }
  };

  const startVoiceGeneration = () => {
    if (!recognition || !synthesis) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsVoiceMode(true);
    setCurrentStep(0);
    speak('Hello! I\'m your AI assistant. I\'ll help you generate a custom interview. Let\'s start with the first question.');
    
    setTimeout(() => {
      askCurrentQuestion(currentStep);
    }, 3000);
  };

  // 1. const askCurrentQuestion = () => {
  //   if (currentStep < MAX_VOICE_QUESTIONS) {
  //     const currentField = fields[currentStep];
  //     speak(currentField.question);
      
  //     setTimeout(() => {
  //       startListening(currentField.key);
  //     }, 2000);
  //   }
  // };


 // Ask current question for a given step

 const askCurrentQuestion = (step: number) => {
  if (!recognition || step >= fields.length) return;

  const field = fields[step];
  console.log("Asking question:", field.question);

  // Stop previous recognition if running
  if (isRecognizing.current) {
    recognition.stop();
  }

  // Speak the question first
  if (synthesis) {
    const utterance = new SpeechSynthesisUtterance(field.question);
    
    utterance.onend = () => {
      // Only start listening if recognition is not already running
      if (!isRecognizing.current) {
        console.log(`Listening started for: ${field.key}`);
        isRecognizing.current = true;
        recognition.start();
      }
    };

    synthesis.speak(utterance);
  }

  // Handle recognition result
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const spokenText = event.results[0][0].transcript;
    console.log(`Captured response for ${field.key}:`, spokenText);

    // Save response
    setFormData(prev => ({ ...prev, [field.key]: spokenText }));

    // Stop recognition
    recognition.stop();
    isRecognizing.current = false;

    // Go to next question
    setCurrentStep(prev => prev + 1);
    // Ask next question after small delay to avoid overlap
    setTimeout(() => askCurrentQuestion(step + 1), 300);
  };

  // Handle recognition end (if user stays silent, etc.)
  recognition.onend = () => {
    console.log(`Listening ended for: ${field.key}`);
    isRecognizing.current = false;
  };
};



  // 2.const startListening = (fieldKey: string) => {
  //   if (!recognition) return;

  //   setVoiceState({
  //     isListening: true,
  //     currentField: fieldKey,
  //     isProcessing: false,
  //   });

  //   recognition.onresult = (event:SpeechRecognitionEvent) => {
  //     const transcript = event.results[0][0].transcript.toLowerCase().trim();
  //     processVoiceInput(fieldKey, transcript);
  //   };

  //   recognition.onerror = () => {
  //     setVoiceState(prev => ({ ...prev, isListening: false }));
  //     speak('Sorry, I didn\'t catch that. Let me ask again.');
  //     setTimeout(() => askCurrentQuestion(), 2000);
  //   };

  //   recognition.start();
  // };

// const startListening = (fieldKey: string) => {
//   if (!recognition) return;

//   // Reset voice state to indicate listening
//   setVoiceState({
//     isListening: true,
//     currentField: fieldKey,
//     isProcessing: false,
//   });

//   // Ensure recognition is stopped before starting
//   recognition.stop();

//   recognition.onstart = () => {
//     console.log('Voice recognition started');
//   };

//   recognition.onresult = (event: SpeechRecognitionEvent) => {
//     const transcript = event.results[0][0].transcript.toLowerCase().trim();
//     console.log('Captured transcript:', transcript);

//     // Immediately stop listening once we get a result
//     recognition.stop();

//     // Process the captured response
//     processVoiceInput(fieldKey, transcript);
//   };

//   recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//     console.error('Speech recognition error:', event.error);
//     setVoiceState(prev => ({ ...prev, isListening: false }));

//     speak("Sorry, I didn't catch that. Let's try again.");
//     setTimeout(() => askCurrentQuestion(), 2000);
//   };

//   recognition.onend = () => {
//     console.log('Voice recognition ended');
//     setVoiceState(prev => ({ ...prev, isListening: false }));
//   };

//   // Start listening for a single response
//   recognition.start();
// };

// Start listening for a single field

const startListening = (fieldKey: string) => {
  if (!recognition) return;

  if (voiceState.isListening) return; // prevent multiple starts

  setVoiceState({ isListening: true, currentField: fieldKey, isProcessing: false });

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    if (!event.results || !event.results[0] || !event.results[0][0]) {
      speak("I didn't catch that. Please repeat.");
      setTimeout(() => startListening(fieldKey), 1000);
      return;
    }

    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    recognition.stop();
    setVoiceState(prev => ({ ...prev, isListening: false }));

    processVoiceInput(fieldKey, transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Recognition error:", event.error);
    setVoiceState(prev => ({ ...prev, isListening: false }));

    speak("I didn't hear that. Let's try again.");
    setTimeout(() => startListening(fieldKey), 1000);
  };

  recognition.onstart = () => console.log("Listening started for:", fieldKey);
  recognition.onend = () => console.log("Listening ended for:", fieldKey);

  recognition.start();
};


// 3. const processVoiceInput = (fieldKey: string, transcript: string) => {
//   console.log(`Processing input for ${fieldKey}:`, transcript);

//   // Stop listening state
//   setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: true }));

//   let processedValue = transcript;

//   // Handle field-specific logic
//   switch (fieldKey) {
//     case "type":
//       if (processedValue.includes("technical") || processedValue.includes("tech")) {
//         processedValue = "Technical";
//       } else if (processedValue.includes("behavioral") || processedValue.includes("behavior")) {
//         processedValue = "Behavioral";
//       } else if (processedValue.includes("system") || processedValue.includes("design")) {
//         processedValue = "System Design";
//       }
//       break;

//     case "experience":
//       if (processedValue.includes("junior") || processedValue.includes("entry")) {
//         processedValue = "Junior";
//       } else if (processedValue.includes("mid") || processedValue.includes("middle")) {
//         processedValue = "Mid-level";
//       } else if (processedValue.includes("senior") || processedValue.includes("lead")) {
//         processedValue = "Senior";
//       }
//       break;

//     case "questionCount":
//       const numbers = processedValue.match(/\d+/);
//       processedValue = numbers ? numbers[0] : "5";
//       break;

//     default:
//       processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
//   }

//   // Save response
//   setFormData(prev => ({ ...prev, [fieldKey]: processedValue }));

//   // Confirm via speech
//   speak(`Got it! ${processedValue}.`);

//   // Move to next question after a delay
//   setTimeout(() => {
//     setCurrentStep(prev => {
//       const nextStep = prev + 1;

//       setVoiceState(prevState => ({ ...prevState, isProcessing: false }));

//       if (nextStep < fields.length) {
//         speak("Next question coming up.");
//         setTimeout(() => askCurrentQuestion(), 1500);
//       } else {
//         speak("Perfect! I have all the information. Generating your interview questions now.");
//         setTimeout(() => generateInterview(), 2000);
//       }

//       return nextStep;
//     });
//   }, 1500);
// };

// Process the captured voice input

const processVoiceInput = (fieldKey: string, transcript: string) => {
  let processedValue = transcript;

  switch (fieldKey) {
    case "type":
      if (processedValue.includes("technical")) processedValue = "Technical";
      else if (processedValue.includes("behavioral")) processedValue = "Behavioral";
      else if (processedValue.includes("system")) processedValue = "System Design";
      break;

    case "experience":
      if (processedValue.includes("junior")) processedValue = "Junior";
      else if (processedValue.includes("mid")) processedValue = "Mid-level";
      else if (processedValue.includes("senior")) processedValue = "Senior";
      break;

    case "questionCount":
      const numbers = processedValue.match(/\d+/);
      processedValue = numbers ? numbers[0] : "5";
      break;

    default:
      processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
  }

  setFormData(prev => ({ ...prev, [fieldKey]: processedValue }));

  speak(`Got it! ${processedValue}.`);

  setTimeout(goToNextStep, 1500);
};

//4. Move to next step
const goToNextStep = () => {
  setCurrentStep(prev => {
    const next = prev + 1;
    if (next < fields.length) {
      askCurrentQuestion(next);
    } else {
      speak("Perfect! Generating your interview now.");
      setTimeout(generateInterview, 2000);
    }
    return next;
  });
};


  const generateInterview = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const questionCount = parseInt(formData.questionCount) || 5;
    
    // Generate questions based on form data
    const questions = generateQuestions(formData, questionCount);
    
    const interview = {
      id: `interview_${Date.now()}`,
      role: formData.role,
      type: formData.type,
      experience: formData.experience,
      technology: formData.technology,
      questionCount,
      questions,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (simulating Firebase)
    const existingInterviews = JSON.parse(localStorage.getItem(`interviews_${user.username}`) || '[]');
    existingInterviews.push(interview);
    localStorage.setItem(`interviews_${user.username}`, JSON.stringify(existingInterviews));

    if (isVoiceMode) {
      speak('Your interview has been generated successfully! Redirecting you to the home page.');
      setTimeout(() => router.push('/'), 2000);
    } else {
      router.push('/');
    }
  };

  const generateQuestions = (data: FormData, count: number): string[] => {
    const questionPool = {
      technical: [
        `Explain the core concepts of ${data.technology}`,
        `What are the best practices when working with ${data.technology}?`,
        `How do you handle errors in ${data.technology}?`,
        `Describe the performance optimization techniques in ${data.technology}`,
        `What are the common security concerns with ${data.technology}?`,
        `How do you test applications built with ${data.technology}?`,
        `Explain the difference between synchronous and asynchronous operations in ${data.technology}`,
        `What design patterns do you commonly use with ${data.technology}?`,
      ],
      behavioral: [
        'Tell me about a time when you faced a challenging problem at work',
        'Describe a situation where you had to work with a difficult team member',
        'How do you handle tight deadlines and pressure?',
        'Tell me about a time when you made a mistake and how you handled it',
        'Describe your approach to learning new technologies',
        'How do you prioritize tasks when you have multiple deadlines?',
        'Tell me about a successful project you led or contributed to significantly',
        'Describe a time when you had to give constructive feedback to a colleague',
      ],
      'system design': [
        'Design a scalable chat application',
        'How would you design a URL shortening service like bit.ly?',
        'Design a social media feed system',
        'How would you design a search autocomplete system?',
        'Design a distributed cache system',
        'How would you design a notification system?',
        'Design a ride-sharing service like Uber',
        'How would you design a video streaming platform?',
      ]
    };

    const selectedQuestions = questionPool[data.type.toLowerCase() as keyof typeof questionPool] || questionPool.technical;
    return selectedQuestions.slice(0, count);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInterview();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Generate Interview</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Create Your Custom Interview
              </CardTitle>
              <p className="text-gray-300 text-center">
                Fill out the form manually or use voice generation for a hands-free experience
              </p>
            </CardHeader>
            <CardContent>
              {/* {!isVoiceMode ? (
                <div className="space-y-6">
                  <Button
                    onClick={startVoiceGeneration}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                  >
                    <Mic className="w-6 h-6 mr-3" />
                    Start Voice Generation
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-800 px-2 text-gray-400">Or fill manually</span>
                    </div>
                  </div>

                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Role</label>
                      <Input
                        type="text"
                        placeholder="e.g., Software Engineer, Data Scientist"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Interview Type</label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="System Design">System Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Experience Level</label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid-level">Mid-level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Technology/Language</label>
                      <Input
                        type="text"
                        placeholder="e.g., JavaScript, Python, React"
                        value={formData.technology}
                        onChange={(e) => setFormData(prev => ({ ...prev, technology: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Number of Questions</label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, questionCount: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select question count" />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} Questions</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Generate Interview
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="text-white">
                    <h3 className="text-xl mb-4">Voice Generation in Progress</h3>
                    <p className="text-gray-300 mb-6">
                      Step {currentStep + 1} of {fields.length}: {fields[currentStep]?.label}
                    </p>
                  </div>

                  {voiceState.isListening && (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-lg">Listening...</p>
                    </div>
                  )}

                  {voiceState.isProcessing && (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-spin">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-lg">Processing...</p>
                    </div>
                  )}

                  {!voiceState.isListening && !voiceState.isProcessing && (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-lg">Speaking...</p>
                    </div>
                  )}

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white text-lg mb-2">Current Information:</h4>
                    <div className="space-y-2 text-left">
                      {Object.entries(formData).map(([key, value]) => (
                        value && (
                          <p key={key} className="text-gray-300">
                            <span className="text-purple-400 capitalize">{key}:</span> {value}
                          </p>
                        )
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsVoiceMode(false)}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                    Cancel Voice Mode
                  </Button>
                </div>
              )} */}

             {!isVoiceMode ? (
  <div className="space-y-6">
    <Button
      onClick={startVoiceGeneration}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
    >
      <Mic className="w-6 h-6 mr-3" />
      Start Voice Generation
    </Button>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-600" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gray-800 px-2 text-gray-400">Or fill manually</span>
      </div>
    </div>

    <form onSubmit={handleManualSubmit} className="space-y-4">
      <div>
        <label className="block text-white mb-2">Role</label>
        <Input
          type="text"
          placeholder="e.g., Software Engineer, Data Scientist"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Interview Type</label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder="Select interview type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Behavioral">Behavioral</SelectItem>
            <SelectItem value="System Design">System Design</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-white mb-2">Experience Level</label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Junior">Junior</SelectItem>
            <SelectItem value="Mid-level">Mid-level</SelectItem>
            <SelectItem value="Senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-white mb-2">Technology/Language</label>
        <Input
          type="text"
          placeholder="e.g., JavaScript, Python, React"
          value={formData.technology}
          onChange={(e) => setFormData(prev => ({ ...prev, technology: e.target.value }))}
          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Number of Questions</label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, questionCount: value }))}>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder="Select question count" />
          </SelectTrigger>
          <SelectContent>
            {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <SelectItem key={num} value={num.toString()}>{num} Questions</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        Generate Interview
      </Button>
    </form>
  </div>
) : (
  <div className="text-center space-y-6">
    <div className="text-white">
      <h3 className="text-xl mb-4">Voice Generation in Progress</h3>
      <p className="text-gray-300 mb-6">
        Step {currentStep + 1} of {fields.length}: {fields[currentStep]?.label}
      </p>
    </div>

    {voiceState.isListening && (
      <div className="flex items-center justify-center space-x-4">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <p className="text-white text-lg">Listening...</p>
      </div>
    )}

    {voiceState.isProcessing && (
      <div className="flex items-center justify-center space-x-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-spin">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-white text-lg">Processing...</p>
      </div>
    )}

    {!voiceState.isListening && !voiceState.isProcessing && (
      <div className="flex items-center justify-center space-x-4">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-white text-lg">Speaking...</p>
      </div>
    )}

    <div className="bg-gray-700/50 rounded-lg p-4">
      <h4 className="text-white text-lg mb-2">Current Information:</h4>
      <div className="space-y-2 text-left">
        {Object.entries(formData).map(([key, value]) => (
          value && (
            <p key={key} className="text-gray-300">
              <span className="text-purple-400 capitalize">{key}:</span> {value}
            </p>
          )
        ))}
      </div>
    </div>

    <Button
      onClick={() => setIsVoiceMode(false)}
      variant="outline"
      className="border-gray-600 text-white hover:bg-gray-700"
    >
      <MicOff className="w-4 h-4 mr-2" />
      Cancel Voice Mode
    </Button>
  </div>
)}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}