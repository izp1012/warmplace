import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PenLine, LogIn, LogOut, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chat } from './Chat';
import './Header.css';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            WarmPlace
          </Link>
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={18} />
              <span>홈</span>
            </Link>
            <Link 
              to="/galleries" 
              className={`nav-link ${location.pathname === '/galleries' ? 'active' : ''}`}
            >
              <Search size={18} />
              <span>갤러리 찾기</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/write" 
                  className={`nav-link ${location.pathname === '/write' ? 'active' : ''}`}
                >
                  <PenLine size={18} />
                  <span>글쓰기</span>
                </Link>
                <Link 
                  to="/chat" 
                  className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
                >
                  <MessageCircle size={18} />
                  <span>메시지</span>
                </Link>
                <div className="user-info">
                  <User size={18} />
                  <span>{user?.nickname || user?.username}</span>
                </div>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <LogIn size={18} />
                <span>로그인</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
      {location.pathname !== '/chat' && <Chat />}
    </>
  );
}
