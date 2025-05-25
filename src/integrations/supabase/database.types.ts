
import { Database as OriginalDatabase } from './types';
import type { Json } from './types';

// Extended Database interface that includes our tables
export interface Database {
  public: {
    Tables: {
      saved_regulations: {
        Row: {
          id: string;
          user_id: string;
          regulation_id: string;
          created_at: string;
          updated_at: string;
          progress: number;
          next_review_date: string | null;
          completion_date: string | null;
          notes: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          regulation_id: string;
          created_at?: string;
          updated_at?: string;
          progress?: number;
          next_review_date?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          regulation_id?: string;
          created_at?: string;
          updated_at?: string;
          progress?: number;
          next_review_date?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_regulations_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      regulations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string;
          motivation: string;
          requirements: string;
          sanctions: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description: string;
          motivation: string;
          requirements: string;
          sanctions?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string;
          motivation?: string;
          requirements?: string;
          sanctions?: string;
        };
        Relationships: [];
      };
      alert_settings: {
        Row: {
          id: string;
          user_id: string;
          alerts_enabled: boolean | null;
          created_at: string;
          updated_at: string;
          deadline_alerts_enabled: boolean | null;
          risk_alerts_enabled: boolean | null;
          compliance_alerts_enabled: boolean | null;
          system_alerts_enabled: boolean | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          alerts_enabled?: boolean | null;
          created_at?: string;
          updated_at?: string;
          deadline_alerts_enabled?: boolean | null;
          risk_alerts_enabled?: boolean | null;
          compliance_alerts_enabled?: boolean | null;
          system_alerts_enabled?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          alerts_enabled?: boolean | null;
          created_at?: string;
          updated_at?: string;
          deadline_alerts_enabled?: boolean | null;
          risk_alerts_enabled?: boolean | null;
          compliance_alerts_enabled?: boolean | null;
          system_alerts_enabled?: boolean | null;
        };
        Relationships: [];
      };
      ai_responses: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string | null;
          checklist_item: string;
          user_query: string;
          legal_analysis: string;
          practical_implementation: string;
          risk_assessment: string;
          combined_response: string;
          response_time_ms: number | null;
          model_version: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id?: string | null;
          checklist_item: string;
          user_query: string;
          legal_analysis: string;
          practical_implementation: string;
          risk_assessment: string;
          combined_response: string;
          response_time_ms?: number | null;
          model_version?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          user_id?: string | null;
          checklist_item?: string;
          user_query?: string;
          legal_analysis?: string;
          practical_implementation?: string;
          risk_assessment?: string;
          combined_response?: string;
          response_time_ms?: number | null;
          model_version?: string | null;
        };
        Relationships: [];
      };
      business_analyses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          description: string;
          analysis: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          description: string;
          analysis?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          description?: string;
          analysis?: string | null;
        };
        Relationships: [];
      };
      business_regulations: {
        Row: {
          id: string;
          business_analysis_id: string | null;
          regulation_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_analysis_id?: string | null;
          regulation_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_analysis_id?: string | null;
          regulation_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_regulations_business_analysis_id_fkey";
            columns: ["business_analysis_id"];
            isOneToOne: false;
            referencedRelation: "business_analyses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_regulations_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      checklist_items: {
        Row: {
          id: string;
          regulation_id: string | null;
          created_at: string;
          updated_at: string;
          importance: number | null;
          description: string;
          category: string | null;
          estimated_effort: string | null;
          expert_verified: boolean | null;
        };
        Insert: {
          id?: string;
          regulation_id?: string | null;
          created_at?: string;
          updated_at?: string;
          importance?: number | null;
          description: string;
          category?: string | null;
          estimated_effort?: string | null;
          expert_verified?: boolean | null;
        };
        Update: {
          id?: string;
          regulation_id?: string | null;
          created_at?: string;
          updated_at?: string;
          importance?: number | null;
          description?: string;
          category?: string | null;
          estimated_effort?: string | null;
          expert_verified?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_items_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      checklist_item_responses: {
        Row: {
          id: string;
          checklist_item_id: string;
          user_id: string;
          status: 'completed' | 'will_do' | 'will_not_do';
          completion_date: string | null;
          created_at: string;
          updated_at: string;
          notes: string | null;
          justification: string | null;
        };
        Insert: {
          id?: string;
          checklist_item_id: string;
          user_id: string;
          status?: 'completed' | 'will_do' | 'will_not_do';
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
          notes?: string | null;
          justification?: string | null;
        };
        Update: {
          id?: string;
          checklist_item_id?: string;
          user_id?: string;
          status?: 'completed' | 'will_do' | 'will_not_do';
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
          notes?: string | null;
          justification?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_item_responses_checklist_item_id_fkey";
            columns: ["checklist_item_id"];
            isOneToOne: false;
            referencedRelation: "checklist_items";
            referencedColumns: ["id"];
          }
        ];
      };
      compliance_documents: {
        Row: {
          id: string;
          user_id: string;
          regulation_id: string | null;
          uploaded_at: string;
          updated_at: string;
          file_name: string;
          file_path: string;
          document_type: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          regulation_id?: string | null;
          uploaded_at?: string;
          updated_at?: string;
          file_name: string;
          file_path: string;
          document_type: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          regulation_id?: string | null;
          uploaded_at?: string;
          updated_at?: string;
          file_name?: string;
          file_path?: string;
          document_type?: string;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "compliance_documents_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      document_reviews: {
        Row: {
          id: string;
          document_id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          content: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          content: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_reviews_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "compliance_documents";
            referencedColumns: ["id"];
          }
        ];
      };
      generated_documents: {
        Row: {
          id: string;
          user_id: string;
          regulation_id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          regulation_id: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          regulation_id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generated_documents_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      risks: {
        Row: {
          id: string;
          user_id: string;
          regulation_id: string | null;
          likelihood: number;
          impact: number;
          category: 'compliance' | 'operational' | 'financial' | 'reputational';
          level: 'low' | 'medium' | 'high' | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          mitigation_measures: string | null;
          action_items: string | null;
          status: string | null;
          is_generated: boolean | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          regulation_id?: string | null;
          likelihood: number;
          impact: number;
          category: 'compliance' | 'operational' | 'financial' | 'reputational';
          level?: 'low' | 'medium' | 'high' | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          mitigation_measures?: string | null;
          action_items?: string | null;
          status?: string | null;
          is_generated?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          regulation_id?: string | null;
          likelihood?: number;
          impact?: number;
          category?: 'compliance' | 'operational' | 'financial' | 'reputational';
          level?: 'low' | 'medium' | 'high' | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          mitigation_measures?: string | null;
          action_items?: string | null;
          status?: string | null;
          is_generated?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "risks_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      structured_business_assessments: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          business_structure: string;
          employee_count: number;
          annual_revenue: number | null;
          year_established: number;
          business_model: string;
          handles_personal_data: boolean;
          handles_financial_data: boolean;
          handles_sensitive_data: boolean;
          has_third_party_vendors: boolean;
          data_storage: string;
          has_cyber_security_policy: boolean;
          existing_assessments: string | null;
          known_regulations: string | null;
          primary_country: string;
          primary_state: string;
          operating_locations: string | null;
          industry_classification: string;
          company_name: string;
          sub_industry: string | null;
          business_activities: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          business_structure: string;
          employee_count: number;
          annual_revenue?: number | null;
          year_established: number;
          business_model: string;
          handles_personal_data?: boolean;
          handles_financial_data?: boolean;
          handles_sensitive_data?: boolean;
          has_third_party_vendors?: boolean;
          data_storage: string;
          has_cyber_security_policy?: boolean;
          existing_assessments?: string | null;
          known_regulations?: string | null;
          primary_country: string;
          primary_state: string;
          operating_locations?: string | null;
          industry_classification: string;
          company_name: string;
          sub_industry?: string | null;
          business_activities: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          business_structure?: string;
          employee_count?: number;
          annual_revenue?: number | null;
          year_established?: number;
          business_model?: string;
          handles_personal_data?: boolean;
          handles_financial_data?: boolean;
          handles_sensitive_data?: boolean;
          has_third_party_vendors?: boolean;
          data_storage?: string;
          has_cyber_security_policy?: boolean;
          existing_assessments?: string | null;
          known_regulations?: string | null;
          primary_country?: string;
          primary_state?: string;
          operating_locations?: string | null;
          industry_classification?: string;
          company_name?: string;
          sub_industry?: string | null;
          business_activities?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
        };
        Relationships: [];
      };
      custom_regulations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          sanctions: string;
          name: string;
          description: string;
          requirements: string;
          motivation: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          sanctions?: string;
          name: string;
          description: string;
          requirements: string;
          motivation: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          sanctions?: string;
          name?: string;
          description?: string;
          requirements?: string;
          motivation?: string;
        };
        Relationships: [];
      };
      document_embeddings: {
        Row: {
          id: string;
          content: string;
          embedding: any;
          created_at: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          content: string;
          embedding?: any;
          created_at?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          content?: string;
          embedding?: any;
          created_at?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      checklist_item_history: {
        Row: {
          id: string;
          checklist_item_id: string;
          description: string;
          version_note: string | null;
          category: string | null;
          importance: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          checklist_item_id: string;
          description: string;
          version_note?: string | null;
          category?: string | null;
          importance?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          checklist_item_id?: string;
          description?: string;
          version_note?: string | null;
          category?: string | null;
          importance?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_item_history_checklist_item_id_fkey";
            columns: ["checklist_item_id"];
            isOneToOne: false;
            referencedRelation: "checklist_items";
            referencedColumns: ["id"];
          }
        ];
      };
      policy_evaluations: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          regulation_id: string;
          created_at: string;
          updated_at: string;
          overall_compliance_score: number | null;
          total_sections_analyzed: number | null;
          compliant_sections: number | null;
          non_compliant_sections: number | null;
          needs_review_sections: number | null;
          metadata: Json | null;
          status: string;
          summary: string | null;
          recommendations: string | null;
          regulation?: {
            id: string;
            name: string;
            description: string;
            requirements: string;
            motivation: string;
            sanctions: string;
          };
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id: string;
          regulation_id: string;
          created_at?: string;
          updated_at?: string;
          overall_compliance_score?: number | null;
          total_sections_analyzed?: number | null;
          compliant_sections?: number | null;
          non_compliant_sections?: number | null;
          needs_review_sections?: number | null;
          metadata?: Json | null;
          status?: string;
          summary?: string | null;
          recommendations?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string;
          regulation_id?: string;
          created_at?: string;
          updated_at?: string;
          overall_compliance_score?: number | null;
          total_sections_analyzed?: number | null;
          compliant_sections?: number | null;
          non_compliant_sections?: number | null;
          needs_review_sections?: number | null;
          metadata?: Json | null;
          status?: string;
          summary?: string | null;
          recommendations?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "policy_evaluations_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "compliance_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "policy_evaluations_regulation_id_fkey";
            columns: ["regulation_id"];
            isOneToOne: false;
            referencedRelation: "regulations";
            referencedColumns: ["id"];
          }
        ];
      };
      policy_highlights: {
        Row: {
          id: string;
          evaluation_id: string;
          section_text: string;
          compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
          confidence_score: number;
          priority_level: number;
          gap_analysis: string | null;
          suggested_fixes: string | null;
          article_references: string[];
          section_start_position: number | null;
          section_end_position: number | null;
          ai_reasoning: string | null;
          regulation_excerpt: string | null;
          section_type: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          evaluation_id: string;
          section_text: string;
          compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
          confidence_score?: number;
          priority_level?: number;
          gap_analysis?: string | null;
          suggested_fixes?: string | null;
          article_references?: string[];
          section_start_position?: number | null;
          section_end_position?: number | null;
          ai_reasoning?: string | null;
          regulation_excerpt?: string | null;
          section_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          evaluation_id?: string;
          section_text?: string;
          compliance_status?: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
          confidence_score?: number;
          priority_level?: number;
          gap_analysis?: string | null;
          suggested_fixes?: string | null;
          article_references?: string[];
          section_start_position?: number | null;
          section_end_position?: number | null;
          ai_reasoning?: string | null;
          regulation_excerpt?: string | null;
          section_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "policy_highlights_evaluation_id_fkey";
            columns: ["evaluation_id"];
            isOneToOne: false;
            referencedRelation: "policy_evaluations";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_documents: {
        Args: {
          query_embedding: any;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
