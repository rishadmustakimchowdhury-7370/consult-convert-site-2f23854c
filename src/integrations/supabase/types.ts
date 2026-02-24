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
      blogs: {
        Row: {
          author_name: string | null
          canonical_url: string | null
          category_id: string | null
          content: string | null
          cover_image: string | null
          cover_image_alt: string | null
          created_at: string | null
          excerpt: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          seo_score: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          cover_image_alt?: string | null
          created_at?: string | null
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          seo_score?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          cover_image_alt?: string | null
          created_at?: string | null
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          seo_score?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          available_date: string | null
          available_time: string | null
          budget: string | null
          created_at: string | null
          email: string
          form_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          subject: string | null
        }
        Insert: {
          available_date?: string | null
          available_time?: string | null
          budget?: string | null
          created_at?: string | null
          email: string
          form_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          subject?: string | null
        }
        Update: {
          available_date?: string | null
          available_time?: string | null
          budget?: string | null
          created_at?: string | null
          email?: string
          form_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          button_link: string | null
          button_text: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          section_key: string
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          service_name: string
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          service_name: string
          sort_order?: number | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          service_name?: string
          sort_order?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_address: string | null
          client_company: string | null
          client_email: string
          client_name: string
          created_at: string
          currency: string
          discount_amount: number | null
          discount_percentage: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_company?: string | null
          client_email: string
          client_name: string
          created_at?: string
          currency?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_company?: string | null
          client_email?: string
          client_name?: string
          created_at?: string
          currency?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string | null
          id: string
          name: string
          size: number | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          size?: number | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          size?: number | null
          type?: string | null
          url?: string
        }
        Relationships: []
      }
      navigation_menu: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          link: string
          location: string | null
          parent_id: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link: string
          location?: string | null
          parent_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link?: string
          location?: string | null
          parent_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          seo_score: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          seo_score?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          seo_score?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          project_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          project_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_email: string | null
          client_name: string
          client_phone: string | null
          cost_amount: number | null
          cover_image: string | null
          created_at: string
          creation_date: string
          delivery_date: string | null
          earning_amount: number | null
          id: string
          is_public: boolean | null
          project_description: string | null
          project_name: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          cost_amount?: number | null
          cover_image?: string | null
          created_at?: string
          creation_date?: string
          delivery_date?: string | null
          earning_amount?: number | null
          id?: string
          is_public?: boolean | null
          project_description?: string | null
          project_name: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          cost_amount?: number | null
          cover_image?: string | null
          created_at?: string
          creation_date?: string
          delivery_date?: string | null
          earning_amount?: number | null
          id?: string
          is_public?: boolean | null
          project_description?: string | null
          project_name?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          canonical_url: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          faqs: Json | null
          features: Json | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          process_steps: Json | null
          seo_score: number | null
          short_description: string | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          faqs?: Json | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          process_steps?: Json | null
          seo_score?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          faqs?: Json | null
          features?: Json | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          process_steps?: Json | null
          seo_score?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          admin_email: string | null
          bing_verification_file: string | null
          bing_verification_meta: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_phone_secondary: string | null
          discourage_search_engines: boolean | null
          facebook_url: string | null
          favicon_url: string | null
          global_meta_description: string | null
          global_meta_title: string | null
          google_analytics_script: string | null
          google_verification_file: string | null
          google_verification_meta: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_height: number | null
          logo_url: string | null
          logo_width: number | null
          pinterest_url: string | null
          site_description: string | null
          site_title: string | null
          updated_at: string | null
          whatsapp_url: string | null
        }
        Insert: {
          admin_email?: string | null
          bing_verification_file?: string | null
          bing_verification_meta?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_phone_secondary?: string | null
          discourage_search_engines?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          global_meta_description?: string | null
          global_meta_title?: string | null
          google_analytics_script?: string | null
          google_verification_file?: string | null
          google_verification_meta?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_height?: number | null
          logo_url?: string | null
          logo_width?: number | null
          pinterest_url?: string | null
          site_description?: string | null
          site_title?: string | null
          updated_at?: string | null
          whatsapp_url?: string | null
        }
        Update: {
          admin_email?: string | null
          bing_verification_file?: string | null
          bing_verification_meta?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_phone_secondary?: string | null
          discourage_search_engines?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          global_meta_description?: string | null
          global_meta_title?: string | null
          google_analytics_script?: string | null
          google_verification_file?: string | null
          google_verification_meta?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_height?: number | null
          logo_url?: string | null
          logo_width?: number | null
          pinterest_url?: string | null
          site_description?: string | null
          site_title?: string | null
          updated_at?: string | null
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          invitation_status: string | null
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invitation_status?: string | null
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invitation_status?: string | null
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          name: string
          rating: number | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name?: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "super_admin"
        | "manager"
        | "seo_manager"
        | "editor"
      content_status: "draft" | "published"
      invoice_status: "draft" | "sent" | "paid" | "overdue"
      project_status:
        | "lead"
        | "proposal"
        | "approved"
        | "in_progress"
        | "review"
        | "completed"
        | "cancelled"
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
      app_role: [
        "admin",
        "user",
        "super_admin",
        "manager",
        "seo_manager",
        "editor",
      ],
      content_status: ["draft", "published"],
      invoice_status: ["draft", "sent", "paid", "overdue"],
      project_status: [
        "lead",
        "proposal",
        "approved",
        "in_progress",
        "review",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
