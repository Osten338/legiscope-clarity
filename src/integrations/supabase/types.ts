export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_settings: {
        Row: {
          alerts_enabled: boolean | null
          compliance_alerts_enabled: boolean | null
          created_at: string
          deadline_alerts_enabled: boolean | null
          id: string
          risk_alerts_enabled: boolean | null
          system_alerts_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alerts_enabled?: boolean | null
          compliance_alerts_enabled?: boolean | null
          created_at?: string
          deadline_alerts_enabled?: boolean | null
          id?: string
          risk_alerts_enabled?: boolean | null
          system_alerts_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alerts_enabled?: boolean | null
          compliance_alerts_enabled?: boolean | null
          created_at?: string
          deadline_alerts_enabled?: boolean | null
          id?: string
          risk_alerts_enabled?: boolean | null
          system_alerts_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_analyses: {
        Row: {
          analysis: string | null
          created_at: string
          description: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analysis?: string | null
          created_at?: string
          description: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analysis?: string | null
          created_at?: string
          description?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      business_regulations: {
        Row: {
          business_analysis_id: string | null
          created_at: string
          id: string
          regulation_id: string | null
        }
        Insert: {
          business_analysis_id?: string | null
          created_at?: string
          id?: string
          regulation_id?: string | null
        }
        Update: {
          business_analysis_id?: string | null
          created_at?: string
          id?: string
          regulation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_regulations_business_analysis_id_fkey"
            columns: ["business_analysis_id"]
            isOneToOne: false
            referencedRelation: "business_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_regulations_regulation_id_fkey"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_business_analysis"
            columns: ["business_analysis_id"]
            isOneToOne: false
            referencedRelation: "business_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_regulation"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_item_responses: {
        Row: {
          checklist_item_id: string
          completion_date: string | null
          created_at: string
          id: string
          justification: string | null
          notes: string | null
          status: Database["public"]["Enums"]["checklist_item_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_item_id: string
          completion_date?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["checklist_item_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_item_id?: string
          completion_date?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["checklist_item_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_responses_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string
          description: string
          id: string
          regulation_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          regulation_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          regulation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_regulation_id_fkey"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_regulation_checklist"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_regulations: {
        Row: {
          created_at: string
          description: string
          id: string
          motivation: string
          name: string
          requirements: string
          sanctions: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          motivation: string
          name: string
          requirements: string
          sanctions?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          motivation?: string
          name?: string
          requirements?: string
          sanctions?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      regulations: {
        Row: {
          created_at: string
          description: string
          id: string
          motivation: string
          name: string
          requirements: string
          sanctions: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          motivation: string
          name: string
          requirements: string
          sanctions?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          motivation?: string
          name?: string
          requirements?: string
          sanctions?: string
          updated_at?: string
        }
        Relationships: []
      }
      risks: {
        Row: {
          action_items: string | null
          category: Database["public"]["Enums"]["risk_category"]
          created_at: string
          description: string
          due_date: string | null
          id: string
          impact: number
          is_generated: boolean | null
          level: Database["public"]["Enums"]["risk_level"] | null
          likelihood: number
          mitigation_measures: string | null
          regulation_id: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_items?: string | null
          category: Database["public"]["Enums"]["risk_category"]
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          impact: number
          is_generated?: boolean | null
          level?: Database["public"]["Enums"]["risk_level"] | null
          likelihood: number
          mitigation_measures?: string | null
          regulation_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_items?: string | null
          category?: Database["public"]["Enums"]["risk_category"]
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          impact?: number
          is_generated?: boolean | null
          level?: Database["public"]["Enums"]["risk_level"] | null
          likelihood?: number
          mitigation_measures?: string | null
          regulation_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_regulation_id_fkey"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_regulations: {
        Row: {
          completion_date: string | null
          created_at: string
          id: string
          next_review_date: string | null
          notes: string | null
          progress: number
          regulation_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          notes?: string | null
          progress?: number
          regulation_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          notes?: string | null
          progress?: number
          regulation_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_regulations_regulation_id_fkey"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_regulation_progress: {
        Args: {
          p_regulation_id: string
          p_user_id: string
        }
        Returns: number
      }
      calculate_risk_level: {
        Args: {
          likelihood: number
          impact: number
        }
        Returns: Database["public"]["Enums"]["risk_level"]
      }
      generate_default_risks_for_analysis: {
        Args: {
          p_analysis_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      generate_default_risks_for_regulation: {
        Args: {
          p_regulation_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      process_analysis_regulations: {
        Args: {
          p_analysis_id: string
          p_regulations: Json
        }
        Returns: Json
      }
    }
    Enums: {
      checklist_item_status: "completed" | "will_do" | "will_not_do"
      risk_category: "compliance" | "operational" | "financial" | "reputational"
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
