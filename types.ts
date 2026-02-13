
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent?: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    summary: string;
  };
  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  skills: string[];
  certifications: string[];
  hobbies: string[];
}

export type ResumeTemplate = 'modern' | 'minimal' | 'sidebar' | 'ats';

export interface BillingTransaction {
  id: string;
  date: string;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface SubscriptionInfo {
  status: 'free' | 'active';
  planName: string;
  price: number;
  expiryDate?: string;
  billingHistory?: BillingTransaction[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TailorResult {
  matchScore: number;
  suggestions: string[];
  missingKeywords: string[];
}

export type AppTab = 'edit' | 'preview' | 'tailor';
