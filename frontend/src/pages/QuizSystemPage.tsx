import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Filter,
} from 'lucide-react';
import { ALL_QUIZZES } from '../data/quizzes';
import { useLearningProgress } from '../context/LearningProgressContext';

export const QuizSystemPage: React.FC = () => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { saveQuizScore } = useLearningProgress();

  const filteredQuizzes =
    selectedTopicFilter === 'All'
      ? ALL_QUIZZES
      : ALL_QUIZZES.filter((q) => q.topicTitle === selectedTopicFilter);

  const distinctTopics = ['All', ...Array.from(new Set(ALL_QUIZZES.map((q) => q.topicTitle)))];

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuizzes.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    return {
      correct,
      total: filteredQuizzes.length,
      percentage: Math.round((correct / (filteredQuizzes.length || 1)) * 100),
    };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const scoreData = calculateScore();
    saveQuizScore('system_comprehensive', scoreData.correct, scoreData.total);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const scoreData = calculateScore();

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Assessment Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            LLM Concept Mastery Quizzes
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Test your knowledge across architecture, tokenization, embeddings, attention mechanisms,
            prompt engineering, and production optimization with multi-format challenges.
          </p>
        </div>
      </div>

      {/* Filter by Topic */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-semibold shrink-0">Filter by Topic:</span>
        {distinctTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSelectedTopicFilter(topic);
              setSubmitted(false);
              setSelectedAnswers({});
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedTopicFilter === topic
                ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                : 'bg-[#101624] text-slate-400 hover:text-white border-[#232f48]'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Score Result Card (when submitted) */}
      {submitted && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/50 via-indigo-950/50 to-[#101624] border border-sky-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                scoreData.percentage >= 70
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {scoreData.percentage >= 70 ? '🏆' : '📚'}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quiz Evaluation Result
              </div>
              <div className="text-2xl font-extrabold text-white">
                Score: {scoreData.correct} / {scoreData.total} ({scoreData.percentage}%)
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {scoreData.percentage >= 70
                  ? 'Outstanding! You demonstrated solid mastery of these core concepts.'
                  : 'Review the explanations below and give it another try to reinforce your learning!'}
              </div>
            </div>
          </div>

          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuizzes.map((quiz, qIdx) => {
          const chosen = selectedAnswers[quiz.id];
          const isCorrect = chosen === quiz.correctAnswer;

          return (
            <div
              key={quiz.id}
              className="p-6 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    Q{qIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{quiz.topicTitle}</span>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    quiz.type === 'multiple-choice'
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : quiz.type === 'true-false'
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {quiz.type.replace('-', ' ')}
                </span>
              </div>

              <div className="text-sm font-semibold text-white leading-relaxed">{quiz.question}</div>

              <div className="space-y-2">
                {quiz.options.map((opt, optIdx) => {
                  const isSelected = chosen === optIdx;
                  let style = 'bg-[#141b2c] border-[#232f48] text-slate-300 hover:bg-[#192238]';

                  if (submitted) {
                    if (optIdx === quiz.correctAnswer) {
                      style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                    }
                  } else if (isSelected) {
                    style = 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {quiz.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < filteredQuizzes.length}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition disabled:opacity-50"
          >
            Submit Quiz for Evaluation ({Object.keys(selectedAnswers).length} /{' '}
            {filteredQuizzes.length} answered)
          </button>
        </div>
      )}
    </div>
  );
};
