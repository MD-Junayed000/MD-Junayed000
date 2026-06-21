export interface About {
  id: number;
  bio: string;
  title: string;
  photo_url: string | null;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tech_stack: string;
  repo_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  order: number;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  proficiency: number;
}

export interface Research {
  id: number;
  title: string;
  venue: string | null;
  year: number | null;
  status: string;
  link: string | null;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  file_path: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export interface ChatResponse {
  response: string;
  sources: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Document {
  id: number;
  filename: string;
  uploaded_at: string;
}
