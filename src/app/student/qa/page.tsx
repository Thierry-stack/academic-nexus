'use client';

import { useState } from 'react';

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  answers: Answer[];
  tags: string[];
  votes: number;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  votes: number;
  isAccepted: boolean;
}

export default function QAPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' });

  // Mock data - in a real app, this would come from an API
  const questions: Question[] = [
    {
      id: '1',
      title: 'How to calculate time complexity of recursive algorithms?',
      content: 'I\'m having trouble understanding how to calculate the time complexity for recursive functions, especially when there are multiple recursive calls. Can someone explain with examples?',
      author: 'CS Student',
      timestamp: '2024-01-20T10:30:00Z',
      votes: 24,
      tags: ['Algorithms', 'Time Complexity', 'Recursion'],
      answers: [
        {
          id: '1-1',
          content: 'For recursive algorithms, you typically use recurrence relations. For example, for a function that makes two recursive calls with half the input size (like merge sort), the recurrence would be T(n) = 2T(n/2) + O(n), which solves to O(n log n) using the master theorem.',
          author: 'Algorithm Expert',
          timestamp: '2024-01-20T11:15:00Z',
          votes: 15,
          isAccepted: true
        },
        {
          id: '1-2',
          content: 'Don\'t forget to consider the base case! The time complexity also depends on when the recursion stops. For Fibonacci, it\'s O(2^n) without memoization because each call makes two more calls.',
          author: 'CS Tutor',
          timestamp: '2024-01-20T12:30:00Z',
          votes: 8,
          isAccepted: false
        }
      ]
    },
    {
      id: '2',
      title: 'Best resources for learning quantum mechanics?',
      content: 'I\'m a physics major looking for good textbooks and online resources to supplement my quantum mechanics course. Any recommendations?',
      author: 'Physics Student',
      timestamp: '2024-01-19T14:20:00Z',
      votes: 18,
      tags: ['Physics', 'Quantum Mechanics', 'Resources'],
      answers: [
        {
          id: '2-1',
          content: 'I highly recommend "Principles of Quantum Mechanics" by Shankar and "Quantum Mechanics: Concepts and Applications" by Zettili. For online, MIT OpenCourseWare has excellent lecture videos.',
          author: 'Physics Professor',
          timestamp: '2024-01-19T16:45:00Z',
          votes: 12,
          isAccepted: true
        }
      ]
    },
    {
      id: '3',
      title: 'How does blockchain ensure security in transactions?',
      content: 'Can someone explain in simple terms how blockchain technology provides security for financial transactions? What makes it tamper-proof?',
      author: 'Business Student',
      timestamp: '2024-01-18T09:15:00Z',
      votes: 31,
      tags: ['Blockchain', 'Security', 'Cryptocurrency'],
      answers: [
        {
          id: '3-1',
          content: 'Blockchain security comes from cryptographic hashing and decentralization. Each block contains a hash of the previous block, creating a chain. If someone tries to alter a block, they\'d need to alter all subsequent blocks and get majority network consensus, which is practically impossible.',
          author: 'Blockchain Developer',
          timestamp: '2024-01-18T10:30:00Z',
          votes: 22,
          isAccepted: true
        }
      ]
    },
    {
      id: '4',
      title: 'Solving differential equations with boundary conditions',
      content: 'I\'m stuck on this heat equation problem with specific boundary conditions. How do I approach solving PDEs with given boundary values?',
      author: 'Math Student',
      timestamp: '2024-01-17T13:45:00Z',
      votes: 12,
      tags: ['Mathematics', 'Differential Equations', 'PDE'],
      answers: []
    },
    {
      id: '5',
      title: 'Python vs R for data analysis - which to learn first?',
      content: 'I\'m starting my journey in data science. Should I learn Python or R first? What are the pros and cons of each for statistical analysis?',
      author: 'Data Science Beginner',
      timestamp: '2024-01-16T15:20:00Z',
      votes: 27,
      tags: ['Python', 'R', 'Data Science', 'Programming'],
      answers: [
        {
          id: '5-1',
          content: 'Both are great! Python is more versatile and better for production systems and machine learning. R has superior statistical packages and visualization (ggplot2). I\'d suggest starting with Python if you plan to work in industry, or R if you\'re focused purely on academic research.',
          author: 'Data Scientist',
          timestamp: '2024-01-16T17:10:00Z',
          votes: 18,
          isAccepted: true
        }
      ]
    }
  ];

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert('Question submitted! This would be saved to the database in a real application.');
    setNewQuestion({ title: '', content: '', tags: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Forum</h1>
        <p className="text-gray-600 mb-6">Ask questions and get help from the academic community</p>
        
        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions by topic, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Questions List */}
        <div className="lg:col-span-2">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredQuestions.length} of {questions.length} questions
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Questions */}
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No questions match your search for "${searchQuery}"`
                  : 'Be the first to ask a question!'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-academic-blue hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div 
                  key={question.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-6"
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Votes */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-academic-blue">{question.votes}</span>
                      <span className="text-xs text-gray-500">votes</span>
                    </div>
                    
                    {/* Answers Count */}
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-bold ${
                        question.answers.some(a => a.isAccepted) 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`}>
                        {question.answers.length}
                      </span>
                      <span className="text-xs text-gray-500">answers</span>
                    </div>
                    
                    {/* Question Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-academic-blue">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {question.content}
                      </p>
                      
                      {/* Tags and Meta */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {question.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>asked by {question.author}</span>
                        <span>{formatDate(question.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ask Question Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h3>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  className="input-field"
                  placeholder="Be specific and clear..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Question
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                  className="input-field"
                  placeholder="Describe your question in detail..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                  className="input-field"
                  placeholder="e.g., mathematics, programming, physics"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-academic-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Post Your Question
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Community Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be respectful and professional</li>
                <li>• Provide detailed explanations</li>
                <li>• Use appropriate tags</li>
                <li>• Search before asking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Question Details Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Question Details</h2>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Question */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {selectedQuestion.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {selectedQuestion.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedQuestion.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-academic-blue text-white text-sm px-3 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Asked by {selectedQuestion.author}</span>
                    <span>{formatDate(selectedQuestion.timestamp)}</span>
                  </div>
                </div>

                {/* Answers */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? 's' : ''}
                  </h4>
                  
                  {selectedQuestion.answers.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-2">💭</div>
                      <p className="text-gray-600">No answers yet. Be the first to answer!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedQuestion.answers.map((answer) => (
                        <div 
                          key={answer.id}
                          className={`border rounded-lg p-6 ${
                            answer.isAccepted 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {answer.isAccepted && (
                            <div className="flex items-center text-green-600 mb-3">
                              <span className="text-sm font-medium">✅ Accepted Answer</span>
                            </div>
                          )}
                          
                          <p className="text-gray-700 mb-4">
                            {answer.content}
                          </p>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <span>Answered by {answer.author}</span>
                              <span>•</span>
                              <span>{answer.votes} votes</span>
                            </div>
                            <span>{formatDate(answer.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Answer Form */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h4>
                  <form className="space-y-4">
                    <textarea
                      rows={6}
                      className="input-field"
                      placeholder="Write your answer here... Be detailed and provide explanations where possible."
                    />
                    <button
                      type="submit"
                      className="bg-academic-blue text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Post Your Answer
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}