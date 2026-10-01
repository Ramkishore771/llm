import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Workflow,
  Code2,
  FlaskConical,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { LEARNING_TOPICS } from '../data/learningRoadmap';
import { useLearningProgress } from '../context/LearningProgressContext';

export const TopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { isTopicCompleted, toggleCompleteTopic, saveQuizScore } = useLearningProgress();

  const currentTopic = LEARNING_TOPICS.find((t) => t.id === topicId) || LEARNING_TOPICS[0];
  const currentIndex = LEARNING_TOPICS.findIndex((t) => t.id === currentTopic.id);
  const prevTopic = currentIndex > 0 ? LEARNING_TOPICS[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < LEARNING_TOPICS.length - 1 ? LEARNING_TOPICS[currentIndex + 1] : null;

  const isCompleted = isTopicCompleted(currentTopic.id);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    currentTopic.miniQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    saveQuizScore(currentTopic.id, correctCount, currentTopic.miniQuiz.length, selectedAnswers);
  };

  const handleCopyCode = () => {
    if (currentTopic.codeExample?.code) {
      navigator.clipboard.writeText(currentTopic.codeExample.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </Link>

        {/* Mark as completed toggle */}
        <button
          onClick={() => toggleCompleteTopic(currentTopic.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-[#161f33] hover:bg-[#1f2b47] text-slate-300 border border-[#232f48]'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{isCompleted ? 'Topic Completed' : 'Mark as Completed'}</span>
        </button>
      </div>

      {/* Topic Title Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-sky-400 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/25">
            Topic #{currentTopic.number}
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {currentTopic.category} • {currentTopic.readingTimeMinutes} min read
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {currentTopic.title}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{currentTopic.summary}</p>
      </div>

      {/* Section 1: Simple Explanation */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <span>Core Concept & Explanation</span>
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {currentTopic.explanation}
        </p>
      </div>

      {/* Section 2: Real-World Example */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>Real-World Industry Application</span>
        </h2>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-sm leading-relaxed">
          {currentTopic.realWorldExample}
        </div>
      </div>

      {/* Section 3: Architecture & Visualization */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
          <Workflow className="w-5 h-5 text-purple-400" />
          <span>Architecture & Diagram Flow</span>
        </h2>
        <div className="p-5 rounded-xl bg-[#090d16] border border-[#1e293d] font-mono text-xs text-sky-300 whitespace-pre-wrap leading-relaxed">
          {currentTopic.diagramExplanation}
        </div>
      </div>

      {/* Section 4: Code Example (if present) */}
      {currentTopic.codeExample && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Production Code Implementation</span>
            </h2>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161f33] hover:bg-[#1e2b47] text-slate-300 text-xs font-semibold border border-[#232f48] transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#090d16] border border-[#1e293d] p-4 overflow-x-auto text-xs font-mono text-emerald-400">
            <pre>{currentTopic.codeExample.code}</pre>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {currentTopic.codeExample.explanation}
          </p>
        </div>
      )}

      {/* Section 5: Hands-on Experiment Link */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
            <FlaskConical className="w-4 h-4" />
            <span>Interactive Experiment Lab</span>
          </div>
          <h3 className="text-base font-bold text-white">Experience this concept in action</h3>
          <p className="text-xs text-slate-400">
            Test real tokenization, embedding vectors, or self-attention calculations directly.
          </p>
        </div>
        <button
          onClick={() => navigate('/tokenization')}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Open Interactive Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Section 6: Key Points Checklist */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Key Takeaways</span>
        </h2>
        <ul className="space-y-2.5 text-sm text-slate-300">
          {currentTopic.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 7: Mini Quiz */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <span>Concept Mastery Mini-Quiz</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {currentTopic.miniQuiz.length} Questions
          </span>
        </div>

        <div className="space-y-6">
          {currentTopic.miniQuiz.map((quiz, qIdx) => {
            const chosen = selectedAnswers[qIdx];
            const isCorrect = chosen === quiz.correctIndex;

            return (
              <div key={qIdx} className="p-5 rounded-xl bg-[#131b2e] border border-[#1e293d] space-y-3">
                <div className="font-semibold text-sm text-white">
                  Q{qIdx + 1}: {quiz.question}
                </div>

                <div className="space-y-2">
                  {quiz.options.map((opt, optIdx) => {
                    const isOptionSelected = chosen === optIdx;
                    let style = 'bg-[#182238] border-[#232f48] text-slate-300 hover:bg-[#1e2b47]';

                    if (submittedQuiz) {
                      if (optIdx === quiz.correctIndex) {
                        style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                      } else if (isOptionSelected && !isCorrect) {
                        style = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                      }
                    } else if (isOptionSelected) {
                      style = 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
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

        {!submittedQuiz ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < currentTopic.miniQuiz.length}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            Submit Mini Quiz
          </button>
        ) : (
          <button
            onClick={() => {
              setSubmittedQuiz(false);
              setSelectedAnswers({});
            }}
            className="w-full py-3 rounded-xl bg-[#161f33] hover:bg-[#1d2943] border border-[#232f48] text-slate-300 font-semibold text-sm transition"
          >
            Retry Quiz
          </button>
        )}
      </div>

      {/* Prev / Next Pagination Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-[#1f293d]">
        {prevTopic ? (
          <button
            onClick={() => navigate(`/learn/${prevTopic.id}`)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              Previous: Topic #{prevTopic.number} {prevTopic.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextTopic && (
          <button
            onClick={() => navigate(`/learn/${nextTopic.id}`)}
            className="flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
          >
            <span>
              Next: Topic #{nextTopic.number} {nextTopic.title}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
