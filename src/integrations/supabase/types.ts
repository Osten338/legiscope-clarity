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
      ai_responses: {
        Row: {
          checklist_item: string
          combined_response: string
          created_at: string | null
          id: string
          legal_analysis: string
          model_version: string | null
          practical_implementation: string
          response_time_ms: number | null
          risk_assessment: string
          user_id: string | null
          user_query: string
        }
        Insert: {
          checklist_item: string
          combined_response: string
          created_at?: string | null
          id?: string
          legal_analysis: string
          model_version?: string | null
          practical_implementation: string
          response_time_ms?: number | null
          risk_assessment: string
          user_id?: string | null
          user_query: string
        }
        Update: {
          checklist_item?: string
          combined_response?: string
          created_at?: string | null
          id?: string
          legal_analysis?: string
          model_version?: string | null
          practical_implementation?: string
          response_time_ms?: number | null
          risk_assessment?: string
          user_id?: string | null
          user_query?: string
        }
        Relationships: []
      }
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
          category: string | null
          created_at: string
          description: string
          estimated_effort: string | null
          id: string
          importance: number | null
          regulation_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          estimated_effort?: string | null
          id?: string
          importance?: number | null
          regulation_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          estimated_effort?: string | null
          id?: string
          importance?: number | null
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
      compliance_documents: {
        Row: {
          description: string | null
          document_type: string
          file_name: string
          file_path: string
          id: string
          regulation_id: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          document_type: string
          file_name: string
          file_path: string
          id?: string
          regulation_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          regulation_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_regulation_id_fkey"
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
      document_embeddings: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      document_reviews: {
        Row: {
          content: string
          created_at: string
          document_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          document_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_reviews_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "compliance_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          regulation_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          regulation_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          regulation_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_regulation_id_fkey"
            columns: ["regulation_id"]
            isOneToOne: false
            referencedRelation: "regulations"
            referencedColumns: ["id"]
          },
        ]
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
      structured_business_assessments: {
        Row: {
          annual_revenue: number | null
          business_activities: string
          business_model: Database["public"]["Enums"]["business_model"]
          business_structure: Database["public"]["Enums"]["business_structure"]
          company_name: string
          created_at: string
          data_storage: Database["public"]["Enums"]["data_storage_type"]
          employee_count: number
          existing_assessments: string | null
          handles_financial_data: boolean
          handles_personal_data: boolean
          handles_sensitive_data: boolean
          has_cyber_security_policy: boolean
          has_third_party_vendors: boolean
          id: string
          industry_classification: string
          known_regulations: string | null
          operating_locations: string | null
          primary_country: string
          primary_state: string
          sub_industry: string | null
          updated_at: string
          user_id: string
          year_established: number
        }
        Insert: {
          annual_revenue?: number | null
          business_activities: string
          business_model: Database["public"]["Enums"]["business_model"]
          business_structure: Database["public"]["Enums"]["business_structure"]
          company_name: string
          created_at?: string
          data_storage: Database["public"]["Enums"]["data_storage_type"]
          employee_count: number
          existing_assessments?: string | null
          handles_financial_data?: boolean
          handles_personal_data?: boolean
          handles_sensitive_data?: boolean
          has_cyber_security_policy?: boolean
          has_third_party_vendors?: boolean
          id?: string
          industry_classification: string
          known_regulations?: string | null
          operating_locations?: string | null
          primary_country: string
          primary_state: string
          sub_industry?: string | null
          updated_at?: string
          user_id: string
          year_established: number
        }
        Update: {
          annual_revenue?: number | null
          business_activities?: string
          business_model?: Database["public"]["Enums"]["business_model"]
          business_structure?: Database["public"]["Enums"]["business_structure"]
          company_name?: string
          created_at?: string
          data_storage?: Database["public"]["Enums"]["data_storage_type"]
          employee_count?: number
          existing_assessments?: string | null
          handles_financial_data?: boolean
          handles_personal_data?: boolean
          handles_sensitive_data?: boolean
          has_cyber_security_policy?: boolean
          has_third_party_vendors?: boolean
          id?: string
          industry_classification?: string
          known_regulations?: string | null
          operating_locations?: string | null
          primary_country?: string
          primary_state?: string
          sub_industry?: string | null
          updated_at?: string
          user_id?: string
          year_established?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_regulation_progress: {
        Args: { p_regulation_id: string; p_user_id: string }
        Returns: number
      }
      calculate_risk_level: {
        Args: { likelihood: number; impact: number }
        Returns: Database["public"]["Enums"]["risk_level"]
      }
      generate_default_risks_for_analysis: {
        Args: { p_analysis_id: string; p_user_id: string }
        Returns: undefined
      }
      generate_default_risks_for_regulation: {
        Args: { p_regulation_id: string; p_user_id: string }
        Returns: undefined
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
      process_analysis_regulations: {
        Args: { p_analysis_id: string; p_regulations: Json }
        Returns: Json
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      business_model: "online" | "offline" | "hybrid"
      business_structure:
        | "limitedCompany"
        | "plc"
        | "partnership"
        | "soleTrader"
        | "other"
      checklist_item_status: "completed" | "will_do" | "will_not_do"
      data_storage_type: "onPremise" | "cloud" | "hybrid"
      risk_category: "compliance" | "operational" | "financial" | "reputational"
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_model: ["online", "offline", "hybrid"],
      business_structure: [
        "limitedCompany",
        "plc",
        "partnership",
        "soleTrader",
        "other",
      ],
      checklist_item_status: ["completed", "will_do", "will_not_do"],
      data_storage_type: ["onPremise", "cloud", "hybrid"],
      risk_category: ["compliance", "operational", "financial", "reputational"],
      risk_level: ["low", "medium", "high"],
    },
  },
} as const
