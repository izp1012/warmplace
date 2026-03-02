import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GalleryCard } from '../components/GalleryCard';
import { fetchGalleries } from '../services/gallery';
import type { Gallery } from '../types';
import './Home.css';

export function Home() {
  const [featuredGalleries, setFeaturedGalleries] = useState<Gallery[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGalleries();
        setFeaturedGalleries(data.slice(0, 6));
      } catch (e) {
        console.error(e);
        setError('추천 갤러리를 불러오는 중 오류가 발생했습니다.');
      }
    };
    load();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content fade-in">
          <h1 className="hero-title">
            나만의 <span className="hero-highlight">따뜻한 공간</span>을<br />
            찾아보세요
          </h1>
          <p className="hero-subtitle">
            당신이 사랑하는 곳, 가보고 싶은 곳을 사진과 글로 공유하세요.<br />
            같은 공간을 사랑하는 사람들과 따뜻하게 연결됩니다.
          </p>
          <div className="hero-actions">
            <Link to="/galleries" className="btn-primary">
              갤러리 둘러보기
            </Link>
            <Link to="/write" className="btn-secondary">
              글쓰기
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
      </section>

      <section className="featured">
        <div className="section-header">
          <h2 className="section-title">추천 갤러리</h2>
          <Link to="/galleries" className="section-more">
            더 보기 <ArrowRight size={16} />
          </Link>
        </div>
        {error ? (
          <div className="gallery-grid">
            <p>{error}</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {featuredGalleries.map((gallery, index) => (
              <div key={gallery.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <GalleryCard gallery={gallery} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
