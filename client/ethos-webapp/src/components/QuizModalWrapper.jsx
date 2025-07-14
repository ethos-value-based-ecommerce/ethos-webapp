import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import QuizModal from './QuizModal.jsx';
import AuthPromptModal from './AuthPromptModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const QuizModalWrapper = ({ onQuizComplete }) => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { user } = useAuth();

  const handleQuizButtonClick = () => {
    if (user) {
      // User is authenticated, show the quiz directly
      setShowQuiz(true);
    } else {
      // User is not authenticated, show auth prompt
      setShowAuthPrompt(true);
    }
  };

  const handleContinueAsGuest = () => {
    // Allow guest to take quiz without authentication
    setShowAuthPrompt(false);
    setShowQuiz(true);
  };

  const handleCloseAuthPrompt = () => {
    // If user closes the auth prompt without choosing, don't show the quiz
    setShowAuthPrompt(false);
    setShowQuiz(false);
  };

  // Watch for user changes to automatically show quiz after auth
  useEffect(() => {
    if (user && showAuthPrompt) {
      setShowAuthPrompt(false);
      setShowQuiz(true);
    }
  }, [user, showAuthPrompt]);

  const handleQuizComplete = (quizAnswers) => {
    setShowQuiz(false);
    onQuizComplete(quizAnswers);
  };

  return (
    <>
      <Button type="primary" onClick={handleQuizButtonClick}>
        Let's Do a Quiz
      </Button>

      <AuthPromptModal
        isVisible={showAuthPrompt}
        onClose={handleCloseAuthPrompt}
        onContinueAsGuest={handleContinueAsGuest}
      />

      {showQuiz && (
        <QuizModal onQuizComplete={handleQuizComplete} />
      )}
    </>
  );
};

export default QuizModalWrapper;
