export type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  authorId: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
};

export type User = {
  id: number;
  name: string;
  email: string;
   password: string;
  posts?: Post[];
};

export type JWTPayload = {
    id: number;
    isAdmin: boolean;
    username: string;
}
