export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: "owner" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string;
          last_name?: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          cover_image: string | null;
          logo_image: string | null;
          phone: string | null;
          address: string | null;
          wifi_ssid: string | null;
          wifi_password: string | null;
          social_instagram: string | null;
          social_facebook: string | null;
          social_tiktok: string | null;
          plan: "free" | "starter" | "pro" | "business";
          status: "pending" | "active" | "trial" | "suspended";
          billing_cycle: "monthly" | "yearly";
          primary_color: string;
          template: "classic" | "card" | "profile" | "dark";
          currency: string;
          extra_info: string | null;
          reviews_enabled: boolean;
          animations_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          cover_image?: string | null;
          logo_image?: string | null;
          phone?: string | null;
          address?: string | null;
          wifi_ssid?: string | null;
          wifi_password?: string | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          social_tiktok?: string | null;
          plan?: "free" | "starter" | "pro" | "business";
          status?: "pending" | "active" | "trial" | "suspended";
          billing_cycle?: "monthly" | "yearly";
          primary_color?: string;
          template?: "classic" | "card" | "profile" | "dark";
          currency?: string;
          extra_info?: string | null;
          reviews_enabled?: boolean;
          animations_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          cover_image?: string | null;
          logo_image?: string | null;
          phone?: string | null;
          address?: string | null;
          wifi_ssid?: string | null;
          wifi_password?: string | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          social_tiktok?: string | null;
          plan?: "free" | "starter" | "pro" | "business";
          status?: "pending" | "active" | "trial" | "suspended";
          billing_cycle?: "monthly" | "yearly";
          primary_color?: string;
          template?: "classic" | "card" | "profile" | "dark";
          currency?: string;
          extra_info?: string | null;
          reviews_enabled?: boolean;
          animations_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      menus: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          icon: string;
          availability: string;
          visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          icon?: string;
          availability?: string;
          visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          icon?: string;
          availability?: string;
          visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          menu_id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          name: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      dishes: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          currency: string;
          image_url: string | null;
          allergens: string[];
          available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string;
          price?: number;
          currency?: string;
          image_url?: string | null;
          allergens?: string[];
          available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: number;
          currency?: string;
          image_url?: string | null;
          allergens?: string[];
          available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      qr_settings: {
        Row: {
          id: string;
          restaurant_id: string;
          frame_type: string;
          background_color: string;
          text: string;
          text_color: string;
          font: string;
          font_size: number;
          dot_style: string;
          dot_color: string;
          corner_style: string;
          corner_color: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          frame_type?: string;
          background_color?: string;
          text?: string;
          text_color?: string;
          font?: string;
          font_size?: number;
          dot_style?: string;
          dot_color?: string;
          corner_style?: string;
          corner_color?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          frame_type?: string;
          background_color?: string;
          text?: string;
          text_color?: string;
          font?: string;
          font_size?: number;
          dot_style?: string;
          dot_color?: string;
          corner_style?: string;
          corner_color?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      scans: {
        Row: {
          id: string;
          restaurant_id: string;
          scanned_at: string;
          period: "morning" | "afternoon";
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          scanned_at?: string;
          period?: "morning" | "afternoon";
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          scanned_at?: string;
          period?: "morning" | "afternoon";
        };
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          rating: number;
          meal: number;
          service: number;
          atmosphere: number;
          cleanliness: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          rating: number;
          meal: number;
          service: number;
          atmosphere: number;
          cleanliness: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          rating?: number;
          meal?: number;
          service?: number;
          atmosphere?: number;
          cleanliness?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      menu_languages: {
        Row: {
          id: string;
          restaurant_id: string;
          language_code: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          language_code: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          language_code?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      restaurant_usage: {
        Row: {
          restaurant_id: string;
          owner_id: string;
          plan: "free" | "starter" | "pro" | "business";
          status: "pending" | "active" | "trial" | "suspended";
          menu_count: number;
          dish_count: number;
          scans_this_month: number;
        };
      };
    };
    Enums: {
      user_role: "owner" | "admin";
      plan_type: "free" | "starter" | "pro" | "business";
      account_status: "pending" | "active" | "trial" | "suspended";
    };
  };
};

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type DbMenu = Database["public"]["Tables"]["menus"]["Row"];
export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type DbDish = Database["public"]["Tables"]["dishes"]["Row"];
export type QrSettings = Database["public"]["Tables"]["qr_settings"]["Row"];
export type Scan = Database["public"]["Tables"]["scans"]["Row"];
export type DbReview = Database["public"]["Tables"]["reviews"]["Row"];
export type MenuLanguage = Database["public"]["Tables"]["menu_languages"]["Row"];
export type RestaurantUsage = Database["public"]["Views"]["restaurant_usage"]["Row"];
