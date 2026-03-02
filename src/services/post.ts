import type { Post } from '../types';

const API_URL = 'http://localhost:8081/api/posts';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export async function fetchPostsByGalleryId(galleryId: string): Promise<Post[]> {
  const res = await fetch(`${API_URL}/gallery/${galleryId}`);
  if (!res.ok) {
    throw new Error('게시글 목록을 불러오지 못했습니다.');
  }
  const data = await res.json();
  return data.map((p: any) => ({
    id: String(p.id),
    galleryId: String(p.galleryId ?? p.gallery?.id ?? galleryId),
    title: p.title,
    content: p.content,
    images: p.images ?? [],
    author: p.authorName ?? p.author?.nickname ?? p.author?.username ?? '',
    createdAt: p.createdAt ?? '',
    likes: p.likes ?? 0,
  })) as Post[];
}

export async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error('게시글을 불러오지 못했습니다.');
  }
  const p = await res.json();
  return {
    id: String(p.id),
    galleryId: String(p.galleryId ?? p.gallery?.id ?? ''),
    title: p.title,
    content: p.content,
    images: p.images ?? [],
    author: p.authorName ?? p.author?.nickname ?? p.author?.username ?? '',
    createdAt: p.createdAt ?? '',
    likes: p.likes ?? 0,
  };
}

export async function likePost(id: string): Promise<Post> {
  const res = await fetch(`${API_URL}/${id}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('게시글 좋아요 처리에 실패했습니다.');
  }
  const p = await res.json();
  return {
    id: String(p.id),
    galleryId: String(p.galleryId ?? p.gallery?.id ?? ''),
    title: p.title,
    content: p.content,
    images: p.images ?? [],
    author: p.authorName ?? p.author?.nickname ?? p.author?.username ?? '',
    createdAt: p.createdAt ?? '',
    likes: p.likes ?? 0,
  };
}

