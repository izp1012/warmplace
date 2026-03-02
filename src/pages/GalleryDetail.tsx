import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PenLine } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { fetchGallery } from '../services/gallery';
import { fetchPostsByGalleryId } from '../services/post';
import type { Gallery, Post } from '../types';
import './GalleryDetail.css';

export function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const [g, p] = await Promise.all([
          fetchGallery(id),
          fetchPostsByGalleryId(id),
        ]);
        setGallery(g);
        setPosts(p);
      } catch (e) {
        console.error(e);
        setError('갤러리 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="gallery-not-found">
        <p>갤러리를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="gallery-not-found">
        <p>{error || '갤러리를 찾을 수 없습니다.'}</p>
        <Link to="/galleries" className="btn-primary">뒤로 가기</Link>
      </div>
    );
  }

  return (
    <div className="gallery-detail">
      <div className="gallery-hero" style={{ backgroundImage: `url(${gallery.coverImage})` }}>
        <div className="gallery-hero-overlay">
          <Link to="/galleries" className="back-link">
            <ArrowLeft size={18} />
            목록으로
          </Link>
          <div className="gallery-hero-content fade-in">
            <span className="gallery-category">{gallery.category}</span>
            <h1 className="gallery-name">{gallery.name}</h1>
            <p className="gallery-description">{gallery.description}</p>
            <span className="gallery-post-count">{gallery.postCount}개의 게시글</span>
          </div>
        </div>
      </div>

      <div className="gallery-content">
        <div className="gallery-content-header">
          <h2 className="gallery-content-title">게시글</h2>
          <Link to="/write" className="write-button">
            <PenLine size={16} />
            글쓰기
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="posts-list">
            {posts.map((post, index) => (
              <div key={post.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-posts">
            <p>아직 게시글이 없습니다.</p>
            <p>첫 번째 게시글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
