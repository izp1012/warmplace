import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (password.length < 10) {
      errors.password = '비밀번호는 10자 이상이어야 합니다';
    } else if (!/[a-z]/.test(password)) {
      errors.password = '소문자를 포함해야 합니다';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = '대문자를 포함해야 합니다';
    } else if (!/\d/.test(password)) {
      errors.password = '숫자를 포함해야 합니다';
    } else if (!/[@$!%*?&]/.test(password)) {
      errors.password = '특수문자(@$!%*?&)를 포함해야 합니다';
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      const errors = validatePassword(value);
      setValidationErrors(errors);
    }
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const passwordErrors = validatePassword(formData.password);
    if (Object.keys(passwordErrors).length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.username, formData.email, formData.password, formData.nickname);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes('사용자 이름')) {
          setFieldErrors(prev => ({ ...prev, username: errorMessage }));
        } else if (errorMessage.includes('이메일')) {
          setFieldErrors(prev => ({ ...prev, email: errorMessage }));
        } else {
          setError(errorMessage);
        }
      } else {
        setError('회원가입에 실패했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-header">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-subtitle">따뜻한 커뮤니티의 멤버가 되어보세요</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">사용자 이름 *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${fieldErrors.username ? 'input-error' : ''}`}
              placeholder="3자 이상 50자 이하"
              minLength={3}
              maxLength={50}
              required
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">이메일 *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
              placeholder="example@email.com"
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
              placeholder="영어 대소문자, 숫자, 특수문자 포함 10자 이상"
              required
            />
            {validationErrors.password && (
              <span className="validation-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 확인 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="비밀번호를 다시 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="form-input"
              placeholder="사용자 이름으로 표시됩니다"
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
