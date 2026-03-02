import { Link } from 'react-router-dom';
import type { Gallery } from '../types';
import './GalleryCard.css';

interface GalleryCardProps {
  gallery: Gallery;
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <Link to={`/gallery/${gallery.id}`} className="gallery-card">
      <div className="gallery-card-image">
        <img src={gallery.coverImage} alt={gallery.name} />
        <span className="gallery-card-category">{gallery.category}</span>
      </div>
      <div className="gallery-card-content">
        <h3 className="gallery-card-title">{gallery.name}</h3>
        <p className="gallery-card-description">{gallery.description}</p>
        <div className="gallery-card-meta">
          <span className="gallery-card-count">{gallery.postCount}개의 게시글</span>
        </div>
      </div>
    </Link>
  );
}
