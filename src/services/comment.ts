import type { Comment } from '../types';

const API_URL = 'http://localhost:8081/api/comments';

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

export async function fetchCommentsByPostId(postId: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/post/${postId}`);
  if (!res.ok) {
    throw new Error('댓글을 불러오지 못했습니다.');
  }
  const data = await res.json();
  return data.map((c: any) => ({
    id: String(c.id),
    postId: String(c.postId ?? c.post?.id ?? postId),
    author: c.authorName ?? c.authorNickname ?? c.author?.nickname ?? '',
    content: c.content,
    createdAt: c.createdAt ?? '',
  })) as Comment[];
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      post: { id: Number(postId) },
      content,
    }),
  });
  if (!res.ok) {
    throw new Error('댓글을 등록하지 못했습니다.');
  }
  const c = await res.json();
  return {
    id: String(c.id),
    postId: String(c.postId ?? c.post?.id ?? postId),
    author: c.authorName ?? c.authorNickname ?? c.author?.nickname ?? '',
    content: c.content,
    createdAt: c.createdAt ?? '',
  };
}

