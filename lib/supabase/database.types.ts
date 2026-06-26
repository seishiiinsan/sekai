export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attempts: {
        Row: {
          country_id: number
          created_at: string
          direction: Database["public"]["Enums"]["direction"]
          id: number
          is_correct: boolean
          mode: Database["public"]["Enums"]["game_mode"]
          response_ms: number | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          country_id: number
          created_at?: string
          direction: Database["public"]["Enums"]["direction"]
          id?: never
          is_correct: boolean
          mode: Database["public"]["Enums"]["game_mode"]
          response_ms?: number | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          country_id?: number
          created_at?: string
          direction?: Database["public"]["Enums"]["direction"]
          id?: never
          is_correct?: boolean
          mode?: Database["public"]["Enums"]["game_mode"]
          response_ms?: number | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "attempts_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          aliases: string[]
          area: number | null
          capital: string[]
          cca2: string
          cca3: string
          created_at: string
          difficulty: number
          flag_alt: string | null
          flag_png_url: string | null
          flag_svg_url: string | null
          has_capital: boolean | null
          id: number
          lat: number | null
          lng: number | null
          name_common: string
          name_fr: string
          name_official: string
          population: number
          region: string | null
          subregion: string | null
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          area?: number | null
          capital?: string[]
          cca2: string
          cca3: string
          created_at?: string
          difficulty?: number
          flag_alt?: string | null
          flag_png_url?: string | null
          flag_svg_url?: string | null
          has_capital?: boolean | null
          id?: never
          lat?: number | null
          lng?: number | null
          name_common: string
          name_fr: string
          name_official: string
          population?: number
          region?: string | null
          subregion?: string | null
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          area?: number | null
          capital?: string[]
          cca2?: string
          cca3?: string
          created_at?: string
          difficulty?: number
          flag_alt?: string | null
          flag_png_url?: string | null
          flag_svg_url?: string | null
          has_capital?: boolean | null
          id?: never
          lat?: number | null
          lng?: number | null
          name_common?: string
          name_fr?: string
          name_official?: string
          population?: number
          region?: string | null
          subregion?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      daily_activity: {
        Row: {
          activity_date: string
          series_played: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_date: string
          series_played?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_date?: string
          series_played?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          answer_key: Json
          combo: number
          created_at: string
          direction: Database["public"]["Enums"]["direction"]
          finished_at: string | null
          id: string
          mode: Database["public"]["Enums"]["game_mode"]
          status: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          answer_key: Json
          combo?: number
          created_at?: string
          direction: Database["public"]["Enums"]["direction"]
          finished_at?: string | null
          id?: string
          mode: Database["public"]["Enums"]["game_mode"]
          status?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          answer_key?: Json
          combo?: number
          created_at?: string
          direction?: Database["public"]["Enums"]["direction"]
          finished_at?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["game_mode"]
          status?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      mastery_items: {
        Row: {
          country_id: number
          due_at: string
          ease: number
          interval_days: number
          lapses: number
          last_reviewed_at: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          reps: number
          srs_level: number
          user_id: string
        }
        Insert: {
          country_id: number
          due_at?: string
          ease?: number
          interval_days?: number
          lapses?: number
          last_reviewed_at?: string | null
          mode: Database["public"]["Enums"]["game_mode"]
          reps?: number
          srs_level?: number
          user_id: string
        }
        Update: {
          country_id?: number
          due_at?: string
          ease?: number
          interval_days?: number
          lapses?: number
          last_reviewed_at?: string | null
          mode?: Database["public"]["Enums"]["game_mode"]
          reps?: number
          srs_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mastery_items_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          locale: string
          longest_streak: number
          streak_freezes: number
          total_xp: number
          updated_at: string
          username: string
        }
        Insert: {
          avatar?: string
          created_at?: string
          current_streak?: number
          id: string
          last_activity_date?: string | null
          level?: number
          locale?: string
          longest_streak?: number
          streak_freezes?: number
          total_xp?: number
          updated_at?: string
          username: string
        }
        Update: {
          avatar?: string
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          locale?: string
          longest_streak?: number
          streak_freezes?: number
          total_xp?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_series_result: {
        Args: { p_series?: number; p_user: string; p_xp: number }
        Returns: {
          avatar: string
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          locale: string
          longest_streak: number
          streak_freezes: number
          total_xp: number
          updated_at: string
          username: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      level_for_xp: { Args: { p_xp: number }; Returns: number }
    }
    Enums: {
      direction: "direct" | "inverse"
      game_mode: "flags" | "capitals"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      direction: ["direct", "inverse"],
      game_mode: ["flags", "capitals"],
    },
  },
} as const
