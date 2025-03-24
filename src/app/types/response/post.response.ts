export interface User {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  id: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Post {
  user: User;
  title: string;
  subtitle: string;
  description: string;
  id: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface PostResponse {
  items: Post[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}
