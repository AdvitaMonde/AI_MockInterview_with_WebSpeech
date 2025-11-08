'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, ArrowLeft, Play, Square } from 'lucide-react';
import Link from 'next/link';

///
declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;
///

interface Interview {
  id: string;
  role: string;
  type: string;
  experience: string;
  technology: string;
  questionCount: number;
  questions: string[];
  createdAt: string;
}

interface InterviewState {
  currentQuestion: number;
  answers: string[];
  isListening: boolean;
  isInterviewActive: boolean;
  hasStarted: boolean;
}

export default function InterviewPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    currentQuestion: 0,
    answers: [],
    isListening: false,
    isInterviewActive: false,
    hasStarted: false,
  });
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const interviews = JSON.parse(localStorage.getItem(`interviews_${user.username}`) || '[]');
    const foundInterview = interviews.find((i: Interview) => i.id === id);
    
    if (foundInterview) {
      setInterview(foundInterview);
      setInterviewState(prev => ({ 
        ...prev, 
        answers: new Array(foundInterview.questions.length).fill('') 
      }));
    } else {
      router.push('/');
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        setRecognition(recognition);
      }
      setSynthesis(window.speechSynthesis);
    }
  }, [id, router]);

  const speak = (text: string) => {
    if (synthesis) {
      synthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = synthesis.getVoices().find(voice => voice.name.includes('Google')) || synthesis.getVoices()[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      synthesis.speak(utterance);
    }
  };

  const startInterview = () => {
    if (!interview || !recognition || !synthesis) {
      alert('Unable to start interview. Speech recognition not supported.');
      return;
    }

    setInterviewState(prev => ({ 
      ...prev, 
      isInterviewActive: true, 
      hasStarted: true 
    }));

    speak(`Welcome to your ${interview.role} interview. I'll be asking you ${interview.questions.length} questions. Please answer each question clearly and take your time. Let's begin with the first question.`);
    
    setTimeout(() => {
      askQuestion(0);
    }, 5000);
  };

  const askQuestion = (questionIndex: number) => {
    if (!interview || questionIndex >= interview.questions.length) return;

    const question = interview.questions[questionIndex];
    speak(`Question ${questionIndex + 1}: ${question}`);
    
    setTimeout(() => {
      startListening();
    }, 3000);
  };

  const startListening = () => {
    if (!recognition) return;

    setCurrentAnswer('');
    setInterviewState(prev => ({ ...prev, isListening: true }));

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
          setCurrentAnswer(finalTranscript.trim());
        }
      }
    };

    // recognition.onerror = (event: any) => {
    //   console.error('Speech recognition error:', event.error);
    //   setInterviewState(prev => ({ ...prev, isListening: false }));
    // };

   recognition.onerror = (event: any) => {
     console.error('Speech recognition error:', event.error);

     if (event.error === 'no-speech') {
       alert('No speech detected. Please speak clearly into your microphone.');
       setInterviewState(prev => ({ ...prev, isListening: false }));
      } else if (event.error === 'not-allowed') {
        alert('Microphone access is blocked. Please allow microphone access.');
      } else {
        setInterviewState(prev => ({ ...prev, isListening: false }));
      }
    };
  
    recognition.onend = () => {
     if (interviewState.isListening) {
       console.log('Recognition ended unexpectedly. Restarting...');
       recognition.start();
      }
    };



    recognition.start();
  };

let isListening = false;

// const startListening = () => {
//   if (isListening) {
//     console.log("Recognition is already running. Restarting...");
//     recognition.stop(); // Stop the old session first
//   }

//   try {
//     recognition.start();
//     isListening = true;
//     console.log("Recognition started");
//   } catch (err) {
//     console.error("Error starting recognition:", err);
//   }
// };



// const stopListening = () => {
//   if (isListening) {
//     recognition.stop();
//     isListening = false;
//     console.log("Recognition stopped");
//   }
// };

// Event listeners
// recognition.onstart = () => {
//   isListening = true;
//   console.log("Speech recognition has started.");
// };

if (recognition) {
  recognition.onstart = () => {
    isListening = true;
    console.log("Speech recognition has started.");
  };
} else {
  console.error("SpeechRecognition is not initialized.");
}


// recognition.onend = () => {
//   isListening = false;
//   console.log("Speech recognition has ended.");
// };

if (recognition) {
  recognition.onend = () => {
    isListening = false;
    console.log("Speech recognition has ended.");
  };
} else {
  console.error("SpeechRecognition is not initialized.");
}



  const stopListening = () => {
    if (!recognition) return;

    recognition.stop();
    setInterviewState(prev => ({ ...prev, isListening: false }));
    
    // Save the answer
    const newAnswers = [...interviewState.answers];
    newAnswers[interviewState.currentQuestion] = currentAnswer;
    setInterviewState(prev => ({ ...prev, answers: newAnswers }));

    speak('Thank you for your answer. Moving to the next question.');

    setTimeout(() => {
      const nextQuestion = interviewState.currentQuestion + 1;
      
      if (nextQuestion < interview!.questions.length) {
        setInterviewState(prev => ({ 
          ...prev, 
          currentQuestion: nextQuestion 
        }));
        askQuestion(nextQuestion);
      } else {
        finishInterview(newAnswers);
      }
    }, 2000);
  };

  const finishInterview = (answers: string[]) => {
    speak('Congratulations! You have completed the interview. I\'m now generating your feedback. Please wait a moment.');
    
    // Generate feedback
    const feedback = generateFeedback(interview!, answers);
    
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const interviewResult = {
      id: `result_${Date.now()}`,
      interviewId: interview!.id,
      role: interview!.role,
      answers,
      feedback: feedback.overallFeedback,
      confidence: feedback.confidenceScore,
      completedAt: new Date().toISOString(),
    };

    // Save result
    const existingResults = JSON.parse(localStorage.getItem(`results_${user.username}`) || '[]');
    existingResults.push(interviewResult);
    localStorage.setItem(`results_${user.username}`, JSON.stringify(existingResults));

    setTimeout(() => {
      router.push(`/feedback/${interviewResult.id}`);
    }, 3000);
  };

  const generateFeedback = (interview: Interview, answers: string[]) => {
    const answerLengths = answers.map(answer => answer.split(' ').length);
    const avgLength = answerLengths.reduce((a, b) => a + b, 0) / answerLengths.length;
    
    let confidenceScore = 70; // Base score
    
    // Adjust based on answer length
    if (avgLength > 50) confidenceScore += 15;
    else if (avgLength > 20) confidenceScore += 10;
    else if (avgLength < 10) confidenceScore -= 20;
    
    // Adjust based on interview type
    if (interview.type === 'Technical') {
      // Check for technical keywords
      const technicalKeywords = ['algorithm', 'data structure', 'optimization', 'performance', 'scalability'];
      const keywordCount = answers.join(' ').toLowerCase().split(' ').filter(word => 
        technicalKeywords.some(keyword => word.includes(keyword))
      ).length;
      confidenceScore += keywordCount * 2;
    }
    
    confidenceScore = Math.min(Math.max(confidenceScore, 0), 100);
    
    let overallFeedback = `Based on your ${interview.role} interview performance, here's your evaluation:\n\n`;
    
    if (confidenceScore >= 80) {
      overallFeedback += "Excellent performance! You demonstrated strong knowledge and communication skills. Your answers were comprehensive and showed deep understanding of the concepts.";
    } else if (confidenceScore >= 60) {
      overallFeedback += "Good performance overall. You showed solid understanding of the topics with room for improvement in providing more detailed explanations and examples.";
    } else {
      overallFeedback += "There's room for improvement. Consider preparing more thoroughly and practicing your responses to be more confident and detailed.";
    }
    
    overallFeedback += `\n\nAreas to focus on:\n`;
    if (avgLength < 20) {
      overallFeedback += "• Provide more detailed and comprehensive answers\n";
    }
    if (interview.type === 'Technical') {
      overallFeedback += "• Include more technical terminology and concepts\n";
      overallFeedback += "• Discuss implementation details and trade-offs\n";
    }
    overallFeedback += "• Practice speaking more confidently\n";
    overallFeedback += "• Use specific examples from your experience\n";

    return { confidenceScore, overallFeedback };
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading interview...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white">Interview Session</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Interview Info */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{interview.role} Interview</CardTitle>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <span>Type: {interview.type}</span>
                <span>Experience: {interview.experience}</span>
                <span>Technology: {interview.technology}</span>
                <span>Questions: {interview.questions.length}</span>
              </div>
            </CardHeader>
          </Card>

          {/* Interview Interface */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              {!interviewState.hasStarted ? (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                    <p className="text-gray-300 mb-6">
                      I'll ask you {interview.questions.length} questions one by one. 
                      Speak clearly and take your time to answer each question thoroughly.
                    </p>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h4 className="text-white text-lg mb-4">Questions Preview:</h4>
                    <div className="space-y-2 text-left max-h-60 overflow-y-auto">
                      {interview.questions.map((question, index) => (
                        <p key={index} className="text-gray-300">
                          <span className="text-purple-400">{index + 1}.</span> {question}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={startInterview}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Progress</span>
                      <span className="text-white">
                        {interviewState.currentQuestion + 1} / {interview.questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((interviewState.currentQuestion + 1) / interview.questions.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-white text-xl mb-4">
                      Question {interviewState.currentQuestion + 1}:
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {interview.questions[interviewState.currentQuestion]}
                    </p>
                  </div>

                  {/* Voice Interface */}
                  <div className="text-center space-y-6">
                    {interviewState.isListening ? (
                      <div className="space-y-4">
                        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <Mic className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-white text-xl">Listening... Speak your answer</p>
                        {currentAnswer && (
                          <div className="bg-gray-700/50 rounded-lg p-4 max-w-2xl mx-auto">
                            <p className="text-gray-300 text-left">{currentAnswer}</p>
                          </div>
                        )}
                        <Button
                          onClick={stopListening}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Square className="w-5 h-5 mr-2" />
                          Finish Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                          <Volume2 className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-white text-xl">
                          {interviewState.isInterviewActive ? 'Processing your answer...' : 'Preparing next question...'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Answered Questions */}
                  {interviewState.answers.filter(answer => answer).length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <h4 className="text-white text-lg mb-4">Your Previous Answers:</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {interviewState.answers.map((answer, index) => 
                          answer ? (
                            <div key={index} className="bg-gray-600/50 rounded p-3">
                              <p className="text-purple-400 text-sm mb-1">Question {index + 1}</p>
                              <p className="text-gray-300 text-sm">{answer}</p>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}