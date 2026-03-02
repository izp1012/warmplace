import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-card-image">
        <img src={post.images[0]} alt={post.title} />
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-preview">{post.content.slice(0, 80)}...</p>
        <div className="post-card-meta">
          <span className="post-card-author">{post.author}</span>
          <div className="post-card-stats">
            <span className="post-card-stat">
              <Heart size={14} />
              {post.likes}
            </span>
            <span className="post-card-stat">
              <MessageCircle size={14} />
              {post.images.length > 1 ? '여러 장' : '1'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
