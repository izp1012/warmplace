import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X } from 'lucide-react';
import { galleries } from '../data';
import { API_BASE_URL } from '../config';
import './Write.css';

export function Write() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedGallery, setSelectedGallery] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      newPreviews.push(URL.createObjectURL(file));
    });
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedGallery) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const payload = {
        gallery: { id: Number(selectedGallery) },
        title: title.trim(),
        content: content.trim(),
        // 현재는 실제 파일 업로드 스토리지가 없으므로 DB에는 빈 이미지 리스트를 저장
        images: [] as string[],
      };

      const response = await fetch(API_BASE_URL ? `${API_BASE_URL}/api/posts` : '/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = '게시물 등록에 실패했습니다.';
        try {
          const data = await response.json();
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // ignore parse error
        }
        alert(message);
        return;
      }

      alert('게시물이 등록되었습니다!');
      navigate(`/gallery/${selectedGallery}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="write-page">
      <div className="write-container fade-in">
        <h1 className="write-title">글쓰기</h1>
        <p className="write-subtitle">당신의 따뜻한 공간을 공유해주세요</p>

        <form className="write-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">갤러리 선택</label>
            <select
              value={selectedGallery}
              onChange={(e) => setSelectedGallery(e.target.value)}
              className="form-select"
            >
              <option value="">갤러리를 선택해주세요</option>
              {galleries.map((gallery) => (
                <option key={gallery.id} value={gallery.id}>
                  {gallery.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="당신의 공간에 대한 이야기를 적어주세요..."
              className="form-textarea"
              rows={8}
            />
          </div>

          <div className="form-group">
            <label className="form-label">사진 올리기</label>
            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="image-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <Image size={32} />
                <span>사진을 선택하거나 여기에 드래그하세요</span>
                <span className="image-hint">최대 5장까지 업로드 가능합니다</span>
              </label>
            </div>
            {previewImages.length > 0 && (
              <div className="preview-grid">
                {previewImages.map((img, index) => (
                  <div key={index} className="preview-item">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="preview-remove"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className="btn-submit">
              게시하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
