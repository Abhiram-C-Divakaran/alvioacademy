// ============================================================
// AI Tutor & Chat Types
// ============================================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  /** Whether this message is still streaming in */
  isStreaming?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AiTutorContext {
  /** The current data structure being viewed */
  activeStructure: string | null;
  /** The last operation performed */
  lastOperation: string | null;
  /** Current topic */
  currentTopic: string | null;
  /** User's progress context for personalization */
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  context: AiTutorContext;
  isLoading: boolean;
  error: string | null;
}

export interface AiRequestPayload {
  message: string;
  conversationId: string;
  context: AiTutorContext;
}

export interface AiResponsePayload {
  message: ChatMessage;
  conversationId: string;
}
