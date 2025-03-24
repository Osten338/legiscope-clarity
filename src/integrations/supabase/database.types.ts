
import { Database as OriginalDatabase } from './types';

// Extended Database interface that includes our tables
export interface Database extends OriginalDatabase {
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
        };
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
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
