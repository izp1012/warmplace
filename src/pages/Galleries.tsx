import { useEffect, useState } from 'react';
import { GalleryCard } from '../components/GalleryCard';
import type { Gallery } from '../types';
import { fetchGalleries } from '../services/gallery';
import { Search } from 'lucide-react';
import './Galleries.css';

const categories = ['전체', '카페', '자연', '음식', '여행', '문화', '인테리어'];

export function Galleries() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGalleries();
        setGalleries(data);
      } catch (e) {
        console.error(e);
        setError('갤러리 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredGalleries = galleries.filter(gallery => {
    const matchesCategory = selectedCategory === '전체' || gallery.category === selectedCategory;
    const matchesSearch = gallery.name.includes(searchQuery) || gallery.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="galleries-page">
      <div className="galleries-header fade-in">
        <h1 className="galleries-title">갤러리 찾기</h1>
        <p className="galleries-subtitle">당신이 사랑하는 공간을 찾아보세요</p>
      </div>

      <div className="galleries-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="갤러리 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>갤러리를 불러오는 중입니다...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="galleries-grid">
            {filteredGalleries.map((gallery, index) => (
              <div key={gallery.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <GalleryCard gallery={gallery} />
              </div>
            ))}
          </div>

          {filteredGalleries.length === 0 && (
            <div className="empty-state">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
