import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Comment } from '../components/Comment';
import { fetchPost, likePost } from '../services/post';
import { fetchCommentsByPostId, createComment } from '../services/comment';
import { fetchGallery } from '../services/gallery';
import type { Post, Gallery, Comment as CommentType } from '../types';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const p = await fetchPost(id);
        setPost(p);
        setLikes(p.likes);

        const [c, g] = await Promise.all([
          fetchCommentsByPostId(id),
          p.galleryId ? fetchGallery(p.galleryId) : Promise.resolve(null),
        ]);
        setComments(c);
        setGallery(g as Gallery | null);
      } catch (e) {
        console.error(e);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="post-not-found">
        <p>게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-not-found">
        <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        <Link to="/galleries" className="btn-primary">뒤로 가기</Link>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const handleLike = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const updated = await likePost(id);
      setLiked(true);
      setLikes(updated.likes);
    } catch (e) {
      console.error(e);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!newComment.trim()) {
      return;
    }
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const created = await createComment(id, newComment.trim());
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="post-detail">
      <div className="post-detail-container">
        <Link to={`/gallery/${post.galleryId}`} className="back-link">
          <ArrowLeft size={18} />
          {gallery?.name || '갤러리로'}
        </Link>

        <article className="post-article fade-in">
          <div className="post-images">
            <img 
              src={post.images[currentImageIndex]} 
              alt={post.title}
              className="post-main-image"
            />
            {post.images.length > 1 && (
              <>
                <button className="image-nav prev" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="image-nav next" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
                <div className="image-dots">
                  {post.images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="post-content">
            <div className="post-header">
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.createdAt}</span>
              </div>
            </div>

            <div className="post-body">
              <p>{post.content}</p>
            </div>

            <div className="post-actions">
              <button 
                className={`like-button ${liked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                {likes}
              </button>
            </div>
          </div>
        </article>

        <section className="comments-section">
          <h2 className="comments-title">댓글 ({comments.length})</h2>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="댓글을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-textarea"
              rows={3}
            />
            <button type="submit" className="comment-submit">
              댓글 작성
            </button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
