// Chat API types
export interface ChatMessage {
  role: "human" | "ai";
  content: string;
}

export interface ChatRequest {
  question: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
}

export interface ChatErrorResponse {
  error: string;
}
