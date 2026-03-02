import type { Gallery, Post, Comment } from './types';

export const galleries: Gallery[] = [
  {
    id: '1',
    name: '감성 카페',
    description: '아늑하고 따뜻한 카페를 소개하는 갤러리입니다.',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    postCount: 12,
    category: '카페',
  },
  {
    id: '2',
    name: '자연 힐링',
    description: '숲, 바다, 산 등 자연에서 힐링할 수 있는 곳들입니다.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    postCount: 8,
    category: '자연',
  },
  {
    id: '3',
    name: '맛집 탐방',
    description: '특별한 음식과 추억을 만들어주는 맛집들입니다.',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    postCount: 15,
    category: '음식',
  },
  {
    id: '4',
    name: '여행 일기',
    description: '다녀온 여행지에서의 특별한 순간들을 기록합니다.',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
    postCount: 20,
    category: '여행',
  },
  {
    id: '5',
    name: '책 읽는 공간',
    description: '책과 함께하는 여유로운 시간의 공간입니다.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
    postCount: 6,
    category: '문화',
  },
  {
    id: '6',
    name: '나의 방',
    description: '내가 사랑하는 개인 공간을 소개합니다.',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
    postCount: 9,
    category: '인테리어',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    galleryId: '1',
    title: '항정에서 느낀 따뜻함',
    content: '처음 이 카페에 들어섰을 때, 바닥에 깔린 따뜻한 나무 바닥과 함께 부드러운 음악이 흘러나왔습니다. 사장님이 직접 내려주신 라떼는 너무 예쁜 라터링이 되어 있었고, 창밖으로 보이는 정원의 나무들이 계절의 변화를 알려주고 있었습니다. 이렇게 일상에서 잠시 벗어나 나만의 시간을 보낼 수 있는 곳, 추천합니다.',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    ],
    author: '따뜻한나',
    createdAt: '2024.01.15',
    likes: 24,
  },
  {
    id: '2',
    galleryId: '1',
    title: '밤의 몰디브',
    content: '야간에 방문한 이 카페는 또 다른 매력을 발산했습니다. 어둠 속에서 부드럽게 빛나는 조명과 함께 일출을 즐기며 읽던 책을 읽었습니다. 커피 맛도 정말 좋았고 무엇보다 조용해서 딱 좋은 곳이었습니다.',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    ],
    author: '밤을 좋아하는',
    createdAt: '2024.01.18',
    likes: 18,
  },
  {
    id: '3',
    galleryId: '1',
    title: '디저트가 이색적인甜',
    content: '이 카페의 케이크는 그냥 먹는 게 아니라 감상해야 합니다. 생크림이 정말 부드럽고 과일의 신선함이 그대로 전달됩니다. 특히 시즌마다 다른 디저트가 나와서,每一次 방문이 새롭습니다.',
    images: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop',
    ],
    author: '달콤한나',
    createdAt: '2024.01.20',
    likes: 31,
  },
  {
    id: '4',
    galleryId: '2',
    title: '속초 해변의 일출',
    content: '凌晨 5시에 일어난 것은 이景色를 보기 위함이었다. 해가 떠오를 때 바다 위로 금빛이 펼쳐지는 모습은 말로는 다 표현할 수 없다. 찬란히 빛나던 해가 내 마음까지 따뜻하게 해주었다.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
    ],
    author: '바다의 아기',
    createdAt: '2024.02.01',
    likes: 45,
  },
  {
    id: '5',
    galleryId: '2',
    title: '남이섬에서 만난 가을',
    content: '단풍이最美的 시절에 방문했습니다. 나무들이 주황색과 赤색으로 물들어 있고,湖면에 비치는 풍경은 그림처럼 아름다웠습니다. 힐링이 하고 싶다면 강추입니다!',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    ],
    author: '산책러',
    createdAt: '2024.02.05',
    likes: 38,
  },
  {
    id: '6',
    galleryId: '3',
    title: '역전할머니맥주',
    content: '이 집의 대표 메뉴는 물론 할머니 맥주! 그리고 accompanying 해산물. 전사로 나온 새우는 너무나 신선했고, 본 메뉴인 해산물 튀김은 바삭바삭 너무 맛있었습니다. 특히 양념이 일품이었습니다.',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    ],
    author: '배달하는펭귄',
    createdAt: '2024.02.10',
    likes: 52,
  },
  {
    id: '7',
    galleryId: '3',
    title: '또cery 이ayakan 라멘',
    content: '오랜만에 찾는 라멘집. 진한 국물과 면이 완벽하게 조화를 이루고 있습니다. 특히 표고버섯이 들어가 있어서 깊은 맛이 납니다. 가면 반드시 추천 메뉴를 드세요!',
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    ],
    author: '라멘러버',
    createdAt: '2024.02.12',
    likes: 27,
  },
  {
    id: '8',
    galleryId: '4',
    title: '큐슈 여행',
    content: '일본의 큐슈 지방으로 여행을 떠났습니다. 특히 후쿠오카의 거리가 정말 아늑했습니다. 가볍게 돌아다니기 좋았고, 특히 가라아게가 맛있었습니다. 다음에는 온천도 가보고 싶어요!',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    ],
    author: '여행쟁이',
    createdAt: '2024.02.15',
    likes: 33,
  },
];

export const comments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: '카페마스터',
    content: '정말 아름다운 곳이네요! 다음에 저도 가봐야겠습니다.',
    createdAt: '2024.01.15',
  },
  {
    id: '2',
    postId: '1',
    author: '여행초보',
    content: '라떼 라터링이 정말 예쁘네요! 어떤 라터링인지 궁금합니다.',
    createdAt: '2024.01.16',
  },
  {
    id: '3',
    postId: '4',
    author: '일출사랑',
    content: '역시 바다의 일출은 최고입니다! 저도 가보고 싶어요.',
    createdAt: '2024.02.02',
  },
  {
    id: '4',
    postId: '4',
    author: '사진작가',
    content: '사진이 정말 잘나왔네요. 어떤 카메라로 찍으셨나요?',
    createdAt: '2024.02.03',
  },
  {
    id: '5',
    postId: '6',
    author: '먹방좋아',
    content: '해산물 튀김 유명한 곳이죠! 다음에 가봐야겠습니다.',
    createdAt: '2024.02.11',
  },
  {
    id: '6',
    postId: '8',
    author: '일본여행중',
    content: '큐슈 저도 가려고 계획중이에요! 추천해주신 곳 있어서 좋습니다.',
    createdAt: '2024.02.16',
  },
];

export const getGalleryById = (id: string): Gallery | undefined => {
  return galleries.find(g => g.id === id);
};

export const getPostsByGalleryId = (galleryId: string): Post[] => {
  return posts.filter(p => p.galleryId === galleryId);
};

export const getPostById = (id: string): Post | undefined => {
  return posts.find(p => p.id === id);
};

export const getCommentsByPostId = (postId: string): Comment[] => {
  return comments.filter(c => c.postId === postId);
};
