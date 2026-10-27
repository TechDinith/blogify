export interface Blog {
  id: number | string;
  title: string;
  body: string;
  author: string;
  authorId?: string;
  tags: string[];
  category?: string;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: number | string;
  blogId: number | string;
  author: string;
  authorId?: string;
  body: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
}
