'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Play, MessageSquare, Mic, User, LogOut } from 'lucide-react';

interface User {
  username: string;
  email: string;
}

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

interface InterviewResult {
  id: string;
  interviewId: string;
  role: string;
  answers: string[];
  feedback: string;
  confidence: number;
  completedAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      router.push('/auth/signin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Load user's interviews
    const userInterviews = localStorage.getItem(`interviews_${parsedUser.username}`);
    if (userInterviews) {
      setInterviews(JSON.parse(userInterviews));
    }

    // Load interview results
    const results = localStorage.getItem(`results_${parsedUser.username}`);
    if (results) {
      setInterviewResults(JSON.parse(results));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/auth/signin');
  };

  const startInterview = (interviewId: string) => {
    router.push(`/interview/${interviewId}`);
  };

  const viewFeedback = (resultId: string) => {
    router.push(`/feedback/${resultId}`);
  };

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">PrepWise</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span>{user.username}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-3xl p-8 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Practice for Interview with AI
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Get interview-ready with AI-powered practice sessions and instant feedback
              </p>
              <Link href="/generate">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Generate New Interview
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Mic className="w-24 h-24 text-white" />
                    </div>
                  </div>
                </div>
                {/* Floating icons */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  HTML
                </div>
                <div className="absolute top-1/2 -left-6 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  CSS
                </div>
                <div className="absolute -bottom-4 right-8 w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                  JS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Interviews Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-6">Generated Interviews</h3>
          {interviews.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg mb-4">No interviews generated yet</p>
                <Link href="/generate">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Generate Your First Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <Card key={interview.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">{interview.role}</h4>
                    <div className="space-y-2 text-gray-300 mb-4">
                      <p><span className="text-gray-400">Type:</span> {interview.type}</p>
                      <p><span className="text-gray-400">Experience:</span> {interview.experience}</p>
                      <p><span className="text-gray-400">Technology:</span> {interview.technology}</p>
                      <p><span className="text-gray-400">Questions:</span> {interview.questionCount}</p>
                    </div>
                    <Button 
                      onClick={() => startInterview(interview.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div>
          <h3 className="text-3xl font-bold text-white mb-6">Interview Feedback</h3>
          {interviewResults.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Complete an interview to see your feedback here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewResults.map((result) => {
                const interview = interviews.find(i => i.id === result.interviewId);
                return (
                  <Card key={result.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer"
                        onClick={() => viewFeedback(result.id)}>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-white mb-2">{result.role}</h4>
                      <div className="space-y-2 text-gray-300 mb-4">
                        <p><span className="text-gray-400">Confidence:</span> {result.confidence}%</p>
                        <p><span className="text-gray-400">Completed:</span> {new Date(result.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}