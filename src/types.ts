export interface Gallery {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  postCount: number;
  category: string;
}

export interface Post {
  id: string;
  galleryId: string;
  title: string;
  content: string;
  images: string[];
  author: string;
  createdAt: string;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}
