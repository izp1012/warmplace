import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Galleries } from './pages/Galleries';
import { GalleryDetail } from './pages/GalleryDetail';
import { PostDetail } from './pages/PostDetail';
import { Write } from './pages/Write';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ChatPage } from './pages/ChatPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/write" element={<Write />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
