export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface LearningTopic {
  id: string;
  number: number;
  title: string;
  category: 'Beginner' | 'Core LLM Concepts' | 'Advanced';
  summary: string;
  readingTimeMinutes: number;
  explanation: string;
  realWorldExample: string;
  diagramExplanation: string;
  codeExample?: {
    language: string;
    code: string;
    explanation: string;
  };
  interactiveExperimentType?: 'tokenization' | 'embeddings' | 'attention' | 'prompt' | 'rag';
  keyTakeaways: string[];
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: number;
  answers: Record<number, number>;
}

export interface ProjectDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: string;
  problemStatement: string;
  objective: string;
  technologies: string[];
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    codeSnippet?: string;
  }[];
  defaultInputs: Record<string, any>;
  runnerType: 'summarizer' | 'resume' | 'study' | 'interview' | 'custom';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: number;
  progressPercent: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface TokenMapping {
  index: number;
  token: string;
  token_id: number;
  byte_length: number;
  is_whitespace_prefix: boolean;
}

export interface TokenizeResponse {
  text: string;
  tokens: string[];
  token_ids: number[];
  token_count: number;
  character_count: number;
  char_per_token: number;
  encoding: string;
  vocabulary_mapping: TokenMapping[];
}

export interface VocabularyResponse {
  total_tokens: number;
  unique_tokens: number;
  type_token_ratio: number;
  vocabulary_size: number;
  most_frequent: {
    token_id: number;
    token: string;
    count: number;
    percentage: number;
  }[];
  frequency_distribution: {
    rank: number;
    token: string;
    count: number;
  }[];
}

export interface EmbeddingPoint {
  id: number;
  text: string;
  x: number;
  y: number;
  vector: number[];
}

export interface EmbeddingResponse {
  items: string[];
  points_2d: EmbeddingPoint[];
  similarity_matrix: number[][];
  dimensions: number;
}

export interface RAGChunk {
  chunk_id: string;
  index: number;
  text: string;
  similarity_score?: number;
  relevance_percent?: number;
  word_count?: number;
}

export interface RAGQueryResponse {
  query: string;
  answer: string;
  retrieved_chunks: RAGChunk[];
  context_used: string;
  model: string;
  doc_id: string;
  filename: string;
  pipeline_steps: {
    step: number;
    title: string;
    detail: string;
  }[];
}

export interface AttentionResponse {
  sentence: string;
  tokens: string[];
  token_count: number;
  attention_matrix: number[][];
  heads: {
    head_1_local: number[][];
    head_2_syntactic: number[][];
    head_3_coreference: number[][];
  };
  token_connections: {
    source_index: number;
    source_token: string;
    self_attention: number;
    top_connections: {
      target_index: number;
      target_token: string;
      weight: number;
    }[];
  }[];
  explanation: string;
}
