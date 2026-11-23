export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AttemptPayload = {
  id: string;
  status: "active" | "submitted";
  score: number | null;
  started_at: string;
  deadline_at: string;
  submitted_at: string | null;
  tryout: { id: string; title: string; duration_minutes: number };
  questions: {
    id: string;
    position: number;
    stimulus: string;
    statements: {
      id: string;
      position: number;
      text: string;
      answer: boolean | null;
      is_true?: boolean;
      explanation?: string;
    }[];
  }[];
};

export type RedeemResult = {
  ends_at: string;
  duration_days: number;
};

export type SubmitResult = {
  score: number;
  total: number;
  full_questions: number;
};

type ProfileRow = { id: string; full_name: string; created_at: string };
type RedeemCodeRow = {
  id: string;
  code: string;
  duration_days: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
};
type RedemptionRow = { id: string; user_id: string; code_id: string; redeemed_at: string };
type SubscriptionRow = { id: string; user_id: string; starts_at: string; ends_at: string };
type MaterialRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtube_id: string;
  position: number;
  is_published: boolean;
};
type TryoutRow = { id: string; title: string; duration_minutes: number; is_published: boolean };
type QuestionRow = { id: string; tryout_id: string; position: number; stimulus: string };
type StatementRow = {
  id: string;
  question_id: string;
  position: number;
  text: string;
  is_true: boolean;
  explanation: string;
};
type AttemptRow = {
  id: string;
  user_id: string;
  tryout_id: string;
  started_at: string;
  deadline_at: string;
  submitted_at: string | null;
  score: number | null;
};
type AttemptAnswerRow = { id: string; attempt_id: string; statement_id: string; answer: boolean };

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, { id: string; full_name: string }>;
      redeem_codes: Table<RedeemCodeRow>;
      redemptions: Table<RedemptionRow>;
      subscriptions: Table<SubscriptionRow>;
      materials: Table<MaterialRow>;
      tryouts: Table<TryoutRow>;
      questions: Table<QuestionRow>;
      statements: Table<StatementRow>;
      attempts: Table<AttemptRow>;
      attempt_answers: Table<AttemptAnswerRow>;
    };
    Views: Record<string, never>;
    Functions: {
      redeem_code: { Args: { p_code: string }; Returns: RedeemResult };
      start_attempt: { Args: { p_tryout: string }; Returns: AttemptPayload };
      get_attempt: { Args: { p_attempt: string }; Returns: AttemptPayload };
      save_answer: {
        Args: { p_attempt: string; p_statement: string; p_answer: boolean };
        Returns: { ok: boolean };
      };
      submit_attempt: { Args: { p_attempt: string }; Returns: SubmitResult };
      has_active_subscription: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
