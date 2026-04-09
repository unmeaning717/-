export interface Article {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  link: string;
}

export type View = 'home' | 'intro' | 'travel' | 'guestbook' | 'media';
