/**
 * Shared domain types for Sekai's game engine.
 * Kept framework-agnostic so they can be imported by server actions,
 * pure logic in lib/game/*, and client components alike.
 */

export type GameMode = "flags" | "capitals";
export type Direction = "direct" | "inverse";
export type AnswerFormat = "qcm" | "free";

/** ISO region buckets used for filtering and distractor selection. */
export type Region =
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Oceania"
  | "Antarctic";

export const GAME_MODES: GameMode[] = ["flags", "capitals"];
export const DIRECTIONS: Direction[] = ["direct", "inverse"];

export const MODE_LABELS: Record<GameMode, string> = {
  flags: "Drapeaux",
  capitals: "Capitales",
};

/** Human-readable label for a (mode, direction) pair, in French. */
export const VARIANT_LABELS: Record<GameMode, Record<Direction, string>> = {
  flags: {
    direct: "Drapeau → Pays",
    inverse: "Pays → Drapeau",
  },
  capitals: {
    direct: "Pays → Capitale",
    inverse: "Capitale → Pays",
  },
};

export const REGION_LABELS: Record<Region, string> = {
  Africa: "Afrique",
  Americas: "Amériques",
  Asia: "Asie",
  Europe: "Europe",
  Oceania: "Océanie",
  Antarctic: "Antarctique",
};

/** One QCM option presented to the player. */
export interface QuestionOption {
  /** Country id this option refers to. */
  countryId: number;
  /** Text shown for capitals/country-name prompts. */
  label: string;
  /** Flag URL shown for "inverse flags" (pick the flag) questions. */
  flagUrl?: string;
}

/**
 * A single question as sent to the client. Crucially it never includes which
 * option is correct — validation happens server-side (spec §11 anti-cheat).
 */
export interface ClientQuestion {
  /** Stable id within the series, used when submitting an answer. */
  id: string;
  mode: GameMode;
  direction: Direction;
  // NB: the answer's country id is deliberately NOT sent to the client — it lives
  // only in the server-side answer key (spec §11). Exposing it here would let a
  // player match it against the QCM options' country ids and read the answer.
  /** Prompt text (e.g. a country name or a capital), when applicable. */
  prompt?: string;
  /** Flag URL shown as the prompt (direct flags mode). */
  promptFlagUrl?: string;
  /** Country name for alt text / accessibility on flag prompts. */
  promptCountryName?: string;
  /** QCM options (omitted for pure free-input questions). */
  options?: QuestionOption[];
  /** Whether free-text input is offered for this question. */
  allowsFreeInput: boolean;
}

export interface SeriesSettings {
  mode: GameMode;
  direction: Direction;
  region?: Region;
  includeMicroStates: boolean;
  length: number;
}

/** Payload sent from the client when answering a question. */
export interface SubmitAnswerInput {
  sessionId: string;
  qid: number;
  /** Selected country id for a QCM answer. */
  choiceCountryId?: number;
  /** Typed answer for free input. */
  freeText?: string;
  responseMs?: number;
}

/** The correct country, revealed only after an answer is submitted. */
export interface RevealedCountry {
  id: number;
  name: string;
  capital: string | null;
  flagUrl: string | null;
}

/** Result of grading a single answer (server-authoritative). */
export interface AnswerResult {
  correct: boolean;
  xpEarned: number;
  combo: number;
  answer: RevealedCountry;
}

export interface ReviewItem {
  countryId: number;
  name: string;
  correct: boolean;
}

/** End-of-series summary returned by finishSeries. */
export interface SeriesSummary {
  xpEarned: number;
  correct: number;
  total: number;
  level: number;
  leveledUp: boolean;
  currentStreak: number;
  reviewItems: ReviewItem[];
}

export interface StartedSeries {
  sessionId: string;
  questions: ClientQuestion[];
  settings: SeriesSettings;
}
