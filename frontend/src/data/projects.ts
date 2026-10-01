import { ProjectDefinition } from '../types';

export const AI_PROJECTS: ProjectDefinition[] = [
  {
    id: 'proj_chatbot',
    title: 'Custom AI Chatbot',
    description: 'Design and deploy an intelligent persona-driven conversational chatbot with system prompts and memory.',
    difficulty: 'Beginner',
    estimatedHours: '2-3 hours',
    problemStatement:
      'Users need an empathetic, knowledgeable academic mentor that answers questions without giving away direct answers, guiding them to self-discovery.',
    objective:
      'Master prompt engineering, persona framing, conversational state management, and parameter tuning (temperature, max tokens).',
    technologies: ['FastAPI', 'React', 'Prompt Engineering', 'State Management'],
    steps: [
      {
        stepNumber: 1,
        title: 'Define Persona & System Prompt',
        instruction: 'Establish guardrails and pedagogical tone in the system instruction.',
        codeSnippet: `system_instruction = (\n    "You are Socrates AI, an inquisitive tutor. Never give direct answers. "\n    "Always ask thoughtful questions that guide the student to deduce the solution."\n)`,
      },
      {
        stepNumber: 2,
        title: 'Maintain Multi-Turn Dialogue History',
        instruction: 'Append user queries and assistant responses into a list of messages.',
        codeSnippet: `messages = [\n    {"role": "system", "content": system_instruction},\n    {"role": "user", "content": "How do transformers work?"},\n    {"role": "assistant", "content": "Before we look at transformers, how do you think human attention works?"}\n]`,
      },
      {
        stepNumber: 3,
        title: 'Deploy and Test Conversational Flow',
        instruction: 'Run interactive multi-turn conversations and verify that the persona is maintained.',
      },
    ],
    defaultInputs: {
      systemInstruction: 'You are an encouraging academic AI advisor.',
      userMessage: 'I am struggling to understand self-attention. Can you give me a simple analogy?',
    },
    runnerType: 'custom',
  },
  {
    id: 'proj_rag_qa',
    title: 'Document Q&A with RAG',
    description: 'Build an end-to-end Retrieval-Augmented Generation pipeline to query custom PDF/TXT documents.',
    difficulty: 'Intermediate',
    estimatedHours: '3-4 hours',
    problemStatement:
      'Standard LLMs hallucinate or cannot answer queries about private company handbooks or university syllabi.',
    objective:
      'Implement document chunking, semantic vector indexing, cosine similarity retrieval, and context-grounded synthesis.',
    technologies: ['Python', 'pypdf', 'Tiktoken', 'Vector Embeddings', 'RAG'],
    steps: [
      {
        stepNumber: 1,
        title: 'Text Extraction & Ingestion',
        instruction: 'Parse PDF/DOCX pages into clean raw text strings.',
        codeSnippet: `import pypdf\nreader = pypdf.PdfReader("syllabus.pdf")\ntext = "".join([page.extract_text() for page in reader.pages])`,
      },
      {
        stepNumber: 2,
        title: 'Chunking with Sliding Window',
        instruction: 'Segment raw text into overlapping windows of 150 words with 30-word overlap.',
      },
      {
        stepNumber: 3,
        title: 'Similarity Search & Augmentation',
        instruction: 'Retrieve top-3 chunks by cosine similarity and format the prompt.',
      },
    ],
    defaultInputs: {
      sampleDoc: 'University Academic Integrity Policy: Plagiarism carries immediate disciplinary review...',
      query: 'What is the penalty for copying code from external forums?',
    },
    runnerType: 'custom',
  },
  {
    id: 'proj_summarizer',
    title: 'AI Multi-Format Summarizer',
    description: 'Create an intelligent summarization engine that extracts executive briefs, bullet points, and key takeaways.',
    difficulty: 'Beginner',
    estimatedHours: '1-2 hours',
    problemStatement:
      'Students and researchers are overwhelmed by 40-page papers and require concise, structured summaries formatted for quick digestion.',
    objective:
      'Harness structured output prompting, constraints, and length controls to produce high-density summaries.',
    technologies: ['FastAPI', 'Structured Prompting', 'Text Processing'],
    steps: [
      {
        stepNumber: 1,
        title: 'Format Specification',
        instruction: 'Define the target output schema: TL;DR, Core Insights, Action Items.',
      },
      {
        stepNumber: 2,
        title: 'Information Density Control',
        instruction: 'Tune temperature to 0.3 for high factual fidelity and minimal embellishment.',
      },
      {
        stepNumber: 3,
        title: 'Execute & Compare',
        instruction: 'Run against complex technical passages and verify extraction precision.',
      },
    ],
    defaultInputs: {
      text: 'Transformers have fundamentally altered deep learning. Introduced by Vaswani et al. in 2017, the architecture eschews sequential recurrence for parallelized multi-head self-attention. This design allows training across thousands of GPUs, scaling to trillions of tokens. The subsequent foundation models, such as GPT-4, LLaMA, and Gemini, demonstrate emergent reasoning, code synthesis, and multilingual capabilities.',
      format: 'Executive Summary with 3 Key Takeaways',
    },
    runnerType: 'summarizer',
  },
  {
    id: 'proj_resume',
    title: 'Resume & Job Fit Analyzer',
    description: 'An ATS-style career evaluator that scores resumes against target job descriptions and provides actionable critiques.',
    difficulty: 'Intermediate',
    estimatedHours: '2-3 hours',
    problemStatement:
      'College graduates struggle to identify skill gaps and ATS keyword mismatches when applying for tech roles.',
    objective:
      'Use role prompting, evaluation rubrics, and structured JSON generation to provide an objective score and recommendations.',
    technologies: ['LLM-as-a-Judge', 'FastAPI', 'JSON Schema', 'Prompt Lab'],
    steps: [
      {
        stepNumber: 1,
        title: 'Construct ATS Persona',
        instruction: 'Instruct the model to act as a Senior Technical Recruiter with high evaluation standards.',
      },
      {
        stepNumber: 2,
        title: 'Score Multi-Dimensional Criteria',
        instruction: 'Evaluate: Core Tech Stack match, Project Impact, Quantified Results, Formatting.',
      },
      {
        stepNumber: 3,
        title: 'Generate Concrete Improvements',
        instruction: 'Produce 3 actionable revised bullet points demonstrating strong action verbs and metrics.',
      },
    ],
    defaultInputs: {
      job_title: 'Junior Machine Learning Engineer',
      resume: 'CS Senior at State University. Experience with Python, NumPy, Pandas. Built a small image classifier in PyTorch with 85% accuracy. Familiar with Git and Linux.',
    },
    runnerType: 'resume',
  },
  {
    id: 'proj_study',
    title: 'AI Study Assistant & Flashcard Generator',
    description: 'Generate structured pedagogical curriculum, interactive flashcards, and conceptual quizzes on any subject.',
    difficulty: 'Beginner',
    estimatedHours: '2 hours',
    problemStatement:
      'Studying complex STEM topics requires active recall and spaced repetition flashcards that take hours to prepare manually.',
    objective:
      'Leverage few-shot prompting and pedagogical formatting to create study material in seconds.',
    technologies: ['React', 'FastAPI', 'Curriculum Design', 'Active Recall'],
    steps: [
      {
        stepNumber: 1,
        title: 'Curriculum Decomposition',
        instruction: 'Break the chosen topic into core sub-modules.',
      },
      {
        stepNumber: 2,
        title: 'Flashcard Formulation',
        instruction: 'Formulate Front (Concept/Question) and Back (Intuition/Answer) pairs.',
      },
      {
        stepNumber: 3,
        title: 'Practice Problems',
        instruction: 'Generate 3 graded conceptual challenges with step-by-step solutions.',
      },
    ],
    defaultInputs: {
      topic: 'Backpropagation and Gradient Descent in Neural Networks',
      level: 'Undergraduate Computer Science',
    },
    runnerType: 'study',
  },
  {
    id: 'proj_interview',
    title: 'AI Technical Interview Assistant',
    description: 'A mock technical interview simulator that presents challenging questions, evaluates candidate answers, and gives live feedback.',
    difficulty: 'Advanced',
    estimatedHours: '3-4 hours',
    problemStatement:
      'Students preparing for machine learning interviews need realistic practice explaining algorithms and trade-offs verbally.',
    objective:
      'Simulate an interactive interview bar-raiser with follow-up probing questions and structured evaluation rubrics.',
    technologies: ['FastAPI', 'Interactive Dialogue', 'Evaluation', 'Prompt Design'],
    steps: [
      {
        stepNumber: 1,
        title: 'Select Track & Difficulty',
        instruction: 'Configure interview focus (e.g. LLM Inference Optimization or Attention Math).',
      },
      {
        stepNumber: 2,
        title: 'Prompt Generation & Follow-Up',
        instruction: 'Generate a scenario question and expect a candidate response.',
      },
      {
        stepNumber: 3,
        title: 'Rubric-Based Critique',
        instruction: 'Score technical precision, communication clarity, and optimal solutions.',
      },
    ],
    defaultInputs: {
      role: 'Foundational LLM Research Engineer',
      topic: 'FlashAttention and GPU Memory Hierarchy (SRAM vs HBM)',
    },
    runnerType: 'interview',
  },
];
