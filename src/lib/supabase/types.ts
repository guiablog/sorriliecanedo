// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          clinic_address: string | null
          clinic_phone: string | null
          id: number
          logo_url: string | null
          splash_screen_image_url: string | null
          updated_at: string | null
          whatsapp_button_enabled: boolean | null
          whatsapp_contact: string | null
          whatsapp_icon_url: string | null
        }
        Insert: {
          clinic_address?: string | null
          clinic_phone?: string | null
          id: number
          logo_url?: string | null
          splash_screen_image_url?: string | null
          updated_at?: string | null
          whatsapp_button_enabled?: boolean | null
          whatsapp_contact?: string | null
          whatsapp_icon_url?: string | null
        }
        Update: {
          clinic_address?: string | null
          clinic_phone?: string | null
          id?: number
          logo_url?: string | null
          splash_screen_image_url?: string | null
          updated_at?: string | null
          whatsapp_button_enabled?: boolean | null
          whatsapp_contact?: string | null
          whatsapp_icon_url?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          date: string
          id: string
          patient_id: string | null
          patient_name: string
          professional_name: string
          reschedule_history: Json | null
          service_name: string
          status: string
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          patient_id?: string | null
          patient_name: string
          professional_name: string
          reschedule_history?: Json | null
          service_name: string
          status: string
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          patient_id?: string | null
          patient_name?: string
          professional_name?: string
          reschedule_history?: Json | null
          service_name?: string
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_patient_id"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          is_resolved: boolean
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_resolved?: boolean
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_resolved?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          published_date: string
          status: string
          title: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_date: string
          status: string
          title: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_date?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          custom_data: Json | null
          id: string
          image_url: string | null
          message: string | null
          segment: string
          sound: string | null
          title: string
        }
        Insert: {
          created_at?: string
          custom_data?: Json | null
          id?: string
          image_url?: string | null
          message?: string | null
          segment: string
          sound?: string | null
          title: string
        }
        Update: {
          created_at?: string
          custom_data?: Json | null
          id?: string
          image_url?: string | null
          message?: string | null
          segment?: string
          sound?: string | null
          title?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          status: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          created_at: string
          cro: string
          id: string
          name: string
          photo_url: string | null
          specialty: string
          status: string
        }
        Insert: {
          created_at?: string
          cro: string
          id?: string
          name: string
          photo_url?: string | null
          specialty: string
          status?: string
        }
        Update: {
          created_at?: string
          cro?: string
          id?: string
          name?: string
          photo_url?: string | null
          specialty?: string
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          duration: string
          id: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          duration: string
          id?: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          duration?: string
          id?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      user_push_subscriptions: {
        Row: {
          created_at: string
          fcm_token: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fcm_token: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fcm_token?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: { Args: { user_id_to_delete: string }; Returns: undefined }
      update_admin_user: {
        Args: { new_email: string; new_name: string; user_id_to_update: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

