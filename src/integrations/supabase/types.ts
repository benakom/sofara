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
      ambassador_applications: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          occupation: string
          phone: string
          ref_code: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          occupation: string
          phone: string
          ref_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          occupation?: string
          phone?: string
          ref_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      chatbot_leads: {
        Row: {
          country_code: string
          created_at: string
          email: string
          first_name: string
          id: string
          language: string | null
          last_name: string
          phone: string
          source_page: string | null
        }
        Insert: {
          country_code: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          language?: string | null
          last_name: string
          phone: string
          source_page?: string | null
        }
        Update: {
          country_code?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          language?: string | null
          last_name?: string
          phone?: string
          source_page?: string | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          created_at: string
          date: string
          deal_name: string
          id: string
          lead_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          date?: string
          deal_name: string
          id?: string
          lead_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          deal_name?: string
          id?: string
          lead_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      community_channels: {
        Row: {
          created_at: string
          created_by: string | null
          description_en: string
          description_fr: string
          emoji: string
          id: string
          is_locked: boolean
          sort_order: number
          title_en: string
          title_fr: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_en?: string
          description_fr?: string
          emoji?: string
          id?: string
          is_locked?: boolean
          sort_order?: number
          title_en: string
          title_fr: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_en?: string
          description_fr?: string
          emoji?: string
          id?: string
          is_locked?: boolean
          sort_order?: number
          title_en?: string
          title_fr?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "community_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      community_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description_en: string
          description_fr: string
          duration: string
          id: string
          is_published: boolean
          lessons_count: number
          level: string
          sort_order: number
          thumbnail_url: string | null
          title_en: string
          title_fr: string
          updated_at: string
          xp: number
          youtube_url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description_en?: string
          description_fr?: string
          duration?: string
          id?: string
          is_published?: boolean
          lessons_count?: number
          level?: string
          sort_order?: number
          thumbnail_url?: string | null
          title_en: string
          title_fr: string
          updated_at?: string
          xp?: number
          youtube_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description_en?: string
          description_fr?: string
          duration?: string
          id?: string
          is_published?: boolean
          lessons_count?: number
          level?: string
          sort_order?: number
          thumbnail_url?: string | null
          title_en?: string
          title_fr?: string
          updated_at?: string
          xp?: number
          youtube_url?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      kyc_submissions: {
        Row: {
          client_email: string
          client_phone: string
          emirates_id_path: string | null
          id: string
          is_uae_resident: boolean
          lead_id: string
          passport_path: string | null
          residence_visa_path: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email: string
          client_phone: string
          emirates_id_path?: string | null
          id?: string
          is_uae_resident?: boolean
          lead_id: string
          passport_path?: string | null
          residence_visa_path?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string
          client_phone?: string
          emirates_id_path?: string | null
          id?: string
          is_uae_resident?: boolean
          lead_id?: string
          passport_path?: string | null
          residence_visa_path?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_submissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_stage_events: {
        Row: {
          changed_by: string | null
          created_at: string
          from_stage: string | null
          id: string
          lead_id: string
          note: string | null
          to_stage: string
          user_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_stage?: string | null
          id?: string
          lead_id: string
          note?: string | null
          to_stage: string
          user_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_stage?: string | null
          id?: string
          lead_id?: string
          note?: string | null
          to_stage?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_stage_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          kyc_status: string | null
          last_name: string
          next_action: string | null
          notes: string | null
          phone: string | null
          score: string | null
          source: string | null
          stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          kyc_status?: string | null
          last_name: string
          next_action?: string | null
          notes?: string | null
          phone?: string | null
          score?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          kyc_status?: string | null
          last_name?: string
          next_action?: string | null
          notes?: string | null
          phone?: string | null
          score?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lib_areas: {
        Row: {
          city_id: string
          created_at: string
          description: string | null
          highlights: Json | null
          id: string
          image_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          city_id: string
          created_at?: string
          description?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          description?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lib_areas_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "lib_cities"
            referencedColumns: ["id"]
          },
        ]
      }
      lib_asset_categories: {
        Row: {
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      lib_assets: {
        Row: {
          area_id: string | null
          asset_type: string
          category_id: string | null
          city_id: string | null
          created_at: string
          description: string | null
          developer_id: string | null
          download_count: number
          file_format: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_approved: boolean
          is_featured: boolean
          language: string | null
          project_id: string | null
          sort_priority: number
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          version: number
          visibility: string
        }
        Insert: {
          area_id?: string | null
          asset_type?: string
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          download_count?: number
          file_format?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          language?: string | null
          project_id?: string | null
          sort_priority?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number
          visibility?: string
        }
        Update: {
          area_id?: string | null
          asset_type?: string
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          download_count?: number
          file_format?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          language?: string | null
          project_id?: string | null
          sort_priority?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "lib_assets_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "lib_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_assets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "lib_asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_assets_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "lib_cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_assets_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "lib_developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "lib_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lib_cities: {
        Row: {
          country: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      lib_developers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          trust_points: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          trust_points?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          trust_points?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      lib_download_logs: {
        Row: {
          asset_id: string
          downloaded_at: string
          id: string
          user_id: string
        }
        Insert: {
          asset_id: string
          downloaded_at?: string
          id?: string
          user_id: string
        }
        Update: {
          asset_id?: string
          downloaded_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lib_download_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lib_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      lib_projects: {
        Row: {
          ai_summary: string | null
          area_id: string
          bedrooms: string | null
          created_at: string
          description: string | null
          developer_id: string
          faq: Json | null
          handover_date: string | null
          hero_image_url: string | null
          id: string
          is_featured: boolean
          name: string
          objection_handling: Json | null
          price_from: number | null
          price_to: number | null
          property_type: string
          quick_pitch: string | null
          selling_points: Json | null
          social_captions: Json | null
          sort_order: number
          status: string
          target_buyer: string | null
          updated_at: string
          whatsapp_summary: string | null
        }
        Insert: {
          ai_summary?: string | null
          area_id: string
          bedrooms?: string | null
          created_at?: string
          description?: string | null
          developer_id: string
          faq?: Json | null
          handover_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name: string
          objection_handling?: Json | null
          price_from?: number | null
          price_to?: number | null
          property_type?: string
          quick_pitch?: string | null
          selling_points?: Json | null
          social_captions?: Json | null
          sort_order?: number
          status?: string
          target_buyer?: string | null
          updated_at?: string
          whatsapp_summary?: string | null
        }
        Update: {
          ai_summary?: string | null
          area_id?: string
          bedrooms?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string
          faq?: Json | null
          handover_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          objection_handling?: Json | null
          price_from?: number | null
          price_to?: number | null
          property_type?: string
          quick_pitch?: string | null
          selling_points?: Json | null
          social_captions?: Json | null
          sort_order?: number
          status?: string
          target_buyer?: string | null
          updated_at?: string
          whatsapp_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lib_projects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "lib_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_projects_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "lib_developers"
            referencedColumns: ["id"]
          },
        ]
      }
      lib_user_favorites: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lib_user_favorites_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lib_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      lib_user_recent_views: {
        Row: {
          asset_id: string | null
          id: string
          project_id: string | null
          user_id: string
          viewed_at: string
        }
        Insert: {
          asset_id?: string | null
          id?: string
          project_id?: string | null
          user_id: string
          viewed_at?: string
        }
        Update: {
          asset_id?: string | null
          id?: string
          project_id?: string | null
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lib_user_recent_views_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lib_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lib_user_recent_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "lib_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_campaigns: {
        Row: {
          audience: string
          created_at: string
          created_by: string | null
          error: string | null
          finished_at: string | null
          id: string
          issue_id: string
          scheduled_for: string
          sent_count: number
          status: string
        }
        Insert: {
          audience?: string
          created_at?: string
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          issue_id: string
          scheduled_for?: string
          sent_count?: number
          status?: string
        }
        Update: {
          audience?: string
          created_at?: string
          created_by?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          issue_id?: string
          scheduled_for?: string
          sent_count?: number
          status?: string
        }
        Relationships: []
      }
      newsletter_sends: {
        Row: {
          campaign_id: string | null
          email: string
          id: string
          issue_id: string
          lang: string
          message_id: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          email: string
          id?: string
          issue_id: string
          lang: string
          message_id?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          email?: string
          id?: string
          issue_id?: string
          lang?: string
          message_id?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "newsletter_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_settings: {
        Row: {
          id: number
          onboarding_enabled: boolean
          onboarding_since: string
          updated_at: string
        }
        Insert: {
          id?: number
          onboarding_enabled?: boolean
          onboarding_since?: string
          updated_at?: string
        }
        Update: {
          id?: number
          onboarding_enabled?: boolean
          onboarding_since?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          deal_name: string | null
          id: string
          reference: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          date?: string
          deal_name?: string | null
          id?: string
          reference: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          deal_name?: string | null
          id?: string
          reference?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepted_terms: boolean
          accepted_terms_at: string | null
          country: string | null
          created_at: string
          approved_email_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          language: string | null
          last_name: string | null
          occupation: string | null
          phone: string | null
          profile_type: string | null
          referral_code: string | null
          referred_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          under_review_email_at: string | null
          updated_at: string
        }
        Insert: {
          accepted_terms?: boolean
          accepted_terms_at?: string | null
          country?: string | null
          created_at?: string
          approved_email_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          occupation?: string | null
          phone?: string | null
          profile_type?: string | null
          referral_code?: string | null
          referred_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          under_review_email_at?: string | null
          updated_at?: string
        }
        Update: {
          accepted_terms?: boolean
          accepted_terms_at?: string | null
          country?: string | null
          created_at?: string
          approved_email_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          occupation?: string | null
          phone?: string | null
          profile_type?: string | null
          referral_code?: string | null
          referred_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          under_review_email_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_bonuses: {
        Row: {
          bonus_amount: number
          commission_id: string | null
          created_at: string
          godchild_id: string
          id: string
          status: string
          super_ambassador_id: string
        }
        Insert: {
          bonus_amount?: number
          commission_id?: string | null
          created_at?: string
          godchild_id: string
          id?: string
          status?: string
          super_ambassador_id: string
        }
        Update: {
          bonus_amount?: number
          commission_id?: string | null
          created_at?: string
          godchild_id?: string
          id?: string
          status?: string
          super_ambassador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_bonuses_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_bonuses_godchild_id_fkey"
            columns: ["godchild_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_bonuses_super_ambassador_id_fkey"
            columns: ["super_ambassador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_profile_status: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_superadmin: { Args: never; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "superadmin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "superadmin", "user"],
    },
  },
} as const
