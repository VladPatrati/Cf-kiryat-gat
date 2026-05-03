
export type Gender = 'male' | 'female';

export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  options: Option[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
}

export interface UserAssessment {
  gender: Gender;
  responses: Record<string, number>;
}
