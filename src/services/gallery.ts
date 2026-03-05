import type { Gallery } from '../types';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/galleries`;

export async function fetchGalleries(): Promise<Gallery[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error('갤러리 목록을 불러오지 못했습니다.');
  }
  const data = await res.json();
  // 백엔드 GalleryResponse -> 프론트 Gallery 로 매핑
  return data.map((g: any) => ({
    id: String(g.id),
    name: g.name,
    description: g.description,
    coverImage: g.coverImage,
    postCount: g.postCount ?? 0,
    category: g.category ?? '',
  })) as Gallery[];
}

export async function fetchGallery(id: string): Promise<Gallery> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    throw new Error('갤러리 정보를 불러오지 못했습니다.');
  }
  const g = await res.json();
  return {
    id: String(g.id),
    name: g.name,
    description: g.description,
    coverImage: g.coverImage,
    postCount: g.postCount ?? 0,
    category: g.category ?? '',
  };
}

