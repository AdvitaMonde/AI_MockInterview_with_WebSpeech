'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Award, TrendingUp, MessageCircle, Star, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface InterviewResult {
  id: string;
  interviewId: string;
  role: string;
  answers: string[];
  feedback: string;
  confidence: number;
  completedAt: string;
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

export default function FeedbackPage() {
  const params = useParams();
  const id = params && typeof params.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const router = useRouter();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const results = JSON.parse(localStorage.getItem(`results_${user.username}`) || '[]');
    const interviews = JSON.parse(localStorage.getItem(`interviews_${user.username}`) || '[]');
    
    const foundResult = results.find((r: InterviewResult) => r.id === id);
    
    if (foundResult) {
      setResult(foundResult);
      const foundInterview = interviews.find((i: Interview) => i.id === foundResult.interviewId);
      setInterview(foundInterview);
    } else {
      router.push('/');
    }
  }, [id, router]);

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-400" />;
    if (score >= 60) return <Star className="w-8 h-8 text-yellow-400" />;
    return <AlertCircle className="w-8 h-8 text-red-400" />;
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (!result || !interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading feedback...</div>
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
          <h1 className="text-3xl font-bold text-white">Interview Feedback</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white mb-2">{result.role}</CardTitle>
              <div className="text-gray-300">
                Completed on {new Date(result.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </CardHeader>
          </Card>

          {/* Interview Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-purple-400 mb-2">
                  <MessageCircle className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1">Type</h3>
                <p className="text-gray-300">{interview.type}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-blue-400 mb-2">
                  <TrendingUp className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1">Experience</h3>
                <p className="text-gray-300">{interview.experience}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-green-400 mb-2">
                  <Award className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1">Technology</h3>
                <p className="text-gray-300">{interview.technology}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-orange-400 mb-2">
                  <MessageCircle className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1">Questions</h3>
                <p className="text-gray-300">{interview.questions.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Confidence Score */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                {getConfidenceIcon(result.confidence)}
                <div>
                  <div className={`text-6xl font-bold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </div>
                  <div className="text-gray-300 text-xl">
                    {getPerformanceLevel(result.confidence)}
                  </div>
                </div>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      result.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      result.confidence >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-700/50 rounded-lg p-6">
                <div className="text-gray-300 whitespace-pre-line text-lg leading-relaxed">
                  {result.feedback}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions & Answers */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Your Interview Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interview.questions.map((question, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="text-purple-400 font-semibold mb-2">
                        Question {index + 1}:
                      </h4>
                      <p className="text-white text-lg">{question}</p>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-semibold mb-2">Your Answer:</h5>
                      <p className="text-gray-300 bg-gray-600/50 rounded p-4">
                        {result.answers[index] || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <Link href="/generate">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Take Another Interview
              </Button>
            </Link>
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Print Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}