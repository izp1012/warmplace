## Warmplace Frontend

- **Framework**: React + TypeScript
- **Bundler**: Vite
- **UI**: Custom CSS, lucide-react icons
- **Backend**: Spring Boot (동일 저장소 내 `warmplace_back`)

따뜻한 공간을 공유하는 커뮤니티 서비스의 프론트엔드 리포지토리입니다.  
갤러리/게시글/댓글/채팅 기능을 제공하며, 모든 실데이터는 백엔드 API와 연동됩니다.

---

### 1. 사전 준비

- Node.js 18+ (권장)
- npm 또는 pnpm (현재 `package-lock.json` 이 있으므로 npm 기준)
- 백엔드 서버:
  - 기본 주소: `http://localhost:8081`
  - JWT 인증 기반 (`/api/auth/**` 사용)

루트 `.env` 예시:

```bash
VITE_API_BASE_URL=http://localhost:8081
```

현재 코드는 기본값으로 `http://localhost:8081` 를 직접 사용하고 있으므로,  
필요시 `fetch(...)` 호출부를 이 환경 변수로 치환해서 사용하면 됩니다.

---

### 2. 설치 & 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트 5173)
npm run dev
```

브라우저에서 `http://localhost:5173` 에 접속합니다.  
채팅 WebSocket, 게시글/갤러리/댓글 API 를 사용하려면 **백엔드도 함께 구동**해야 합니다.

---

### 3. 주요 기능

#### 3.1 갤러리 / 게시글 / 댓글

- `/galleries`
  - DB 기반 갤러리 목록 조회 (`GET /api/galleries`)
  - 카테고리/검색어 필터링
- `/gallery/:id`
  - 특정 갤러리 정보 (`GET /api/galleries/{id}`)
  - 해당 갤러리의 게시글 목록 (`GET /api/posts/gallery/{galleryId}`)
- `/post/:id`
  - 게시글 상세 (`GET /api/posts/{id}`)
  - 게시글 좋아요 (`POST /api/posts/{id}/like`)
  - 댓글 목록 (`GET /api/comments/post/{postId}`)
  - 댓글 작성 (`POST /api/comments`) – 로그인 필요

#### 3.2 글쓰기

- `/write`
  - 제목/내용/갤러리 선택 후 게시글 생성
  - 백엔드 `POST /api/posts` 호출
  - 성공 시 해당 갤러리 상세 페이지로 이동

#### 3.3 인증

- `src/services/auth.ts`
  - 회원가입: `POST /api/auth/signup`
  - 로그인: `POST /api/auth/login`
  - 로그아웃: `POST /api/auth/logout`
  - 현재 사용자: `GET /api/auth/me`
  - `localStorage` 에 `token` 과 사용자 정보 저장
- `src/context/AuthContext.tsx`
  - 앱 전역에서 `useAuth()` 로 로그인 상태와 사용자 정보 사용

---

### 4. 채팅 기능

채팅은 플로팅 모달과 `/chat` 페이지에서 **동일한 코어 로직**을 공유합니다.

- WebSocket 엔드포인트: `/ws` (SockJS + STOMP)
- REST API:
  - 1:1 전송: `POST /api/chat/direct`
  - 그룹 전송: `POST /api/chat/group`
  - 이전 메시지 조회:
    - 1:1: `GET /api/chat/direct/{userId1}/{userId2}`
    - 그룹: `GET /api/chat/group/{roomId}`
  - 채팅방 목록: `GET /api/chat/rooms/{userId}`

구성 파일:

- `src/components/Chat.tsx`
  - 우하단 플로팅 채팅 버튼 + 모달
  - 로그인 시 모든 페이지에서 접근 가능
  - `/chat` 페이지에서는 헤더에서 숨겨져 WebSocket 연결이 하나만 유지
- `src/pages/ChatPage.tsx`
  - 상단 메뉴의 전체 화면 채팅 페이지 (`/chat`)
  - 동일한 코어 로직과 UI (`ChatSidebar`, `ChatPanel`) 사용
- `src/components/useChatCore.ts`
  - WebSocket 연결, 메시지/대화목록 상태, 자동완성, 방 선택/불러오기 등 **채팅 핵심 로직**을 캡슐화
- `src/components/ChatSidebar.tsx`
  - 대화 상대/방 목록
- `src/components/ChatPanel.tsx`
  - 현재 방의 메시지 리스트, 입력창, 1:1/그룹 모드 스위치, 모달 닫기 버튼

자동완성/대화상대 추가:

- `authService.getAllUsers()` 로 사용자 목록을 가져와
  - 플로팅/페이지 채팅 모두에서 username/닉네임 기반 자동완성 제공
  - 선택 시 해당 사용자와의 1:1 대화방을 생성·선택 후 이전 메시지 로드

---

### 5. 백엔드와의 연동 개요

백엔드 프로젝트는 동일 리포지토리의 `warmplace_back` 디렉토리에 있습니다.

- Spring Boot + JPA + PostgreSQL
- JWT 기반 인증, CORS 설정은 `SecurityConfig` 참고
- 초기 데이터 시드는 `DataInitializer` (갤러리/게시글/댓글) 에서 처리

프론트는 대부분의 데이터를 **백엔드 REST API** 를 통해 가져오며,  
실시간 채팅은 WebSocket(STOMP) 과 Kafka 기반 메시지 파이프라인을 사용합니다.

---

### 6. 개발 시 유용한 스크립트

`package.json` 예시 (발췌):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

- `npm run dev` – 개발 서버
- `npm run build` – 프로덕션 번들 빌드
- `npm run preview` – 빌드 결과 미리보기
- `npm run lint` – ESLint 검사

---

### 7. 폴더 구조 (요약)

```text
src/
  components/
    Chat.tsx
    ChatPanel.tsx
    ChatSidebar.tsx
    ChatTypes.ts
    Header.tsx
    Footer.tsx
    GalleryCard.tsx
    PostCard.tsx
    Comment.tsx
  pages/
    Home.tsx
    Galleries.tsx
    GalleryDetail.tsx
    PostDetail.tsx
    Write.tsx
    ChatPage.tsx
    Login.tsx
    Signup.tsx
  services/
    auth.ts
    gallery.ts
    post.ts
    comment.ts
  context/
    AuthContext.tsx
  assets/
    chat-close.png (채팅 모달 닫기 버튼 아이콘)
```

