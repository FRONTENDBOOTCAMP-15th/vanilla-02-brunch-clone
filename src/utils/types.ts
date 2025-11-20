export interface APIError {
  ok: 0;
  message: string;
}

// 파일 업로드
export interface uploadFileInfo {
  name: string;
  path: string;
}

// 파일 업로드
export type fileUploadRes =
  | {
      ok: 1;
      item: uploadFileInfo[];
    }
  | APIError;

// 게시글 등록
export type postRes =
  | {
      ok: 1;
      item: PostItem;
    }
  | APIError;

// 게시글 등록
export interface RegisterPostReq {
  type?: string;
  title: string;
  extra: {
    subTitle: string;
  };
  content: string;
  image?: string[];
}

export interface DetailRes<T> {
  ok: 1;
  item: T;
}

export interface ListRes<T> {
  ok: 1;
  item: T[];
}

//

// -------------------------------------------------
export interface UserInfo {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  loginType: string;
  image: string;

  extra: {
    job?: string;
    biography?: string;
    keyword: string[];
  };
  bookmark: {
    users: number;
    posts: number;
  };
  createdAt: string;
  updatedAt: string;
  posts: number; // 작성한 게시물 수
  bookmarks: number;
  bookmarkedBy: {
    users: number; // 북마크한 사용자 수
  };
  likedBy: {
    users: number; // 좋아요한 사용자 수
  };
  postViews: number; // 조회수
}

export interface PostItem {
  _id: number;
  type: string;
  user: UserInfo;
  title: string;
  extra: {
    subTitle: string;
  };
  content: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  bookmarks: number;
  myBookmarkId: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// PostsResponse -> PostListResponse로 바꿈 (게시글 목록 전체 조회)
export type PostListResponse =
  | {
      ok: 1;
      item: PostItem[];
      pagination: Pagination;
    }
  | APIError;

// 게시글 상세 조회(한 개만 조회)
export type PostResponse =
  | {
      ok: 1;
      item: PostItem;
    }
  | APIError;

// 회원 목록 조회(UsersResponse -> UserListResponse)
export type UserListResponse =
  | {
      ok: 1;
      item: UserInfo[];
      pagination: Pagination;
    }
  | APIError;

// 회원 정보 조회(모든 속성)
export type UserResponse =
  | {
      ok: 1;
      item: UserInfo;
      pagination: Pagination;
    }
  | APIError;

// 응답 타입 정의
export type LoginResponse =
  | {
      ok: 1;
      item: LoginUser;
    }
  | APIError;

// 좋아요/구독 추가

export type BookmarkType = 'user' | 'post';

export type BookmarkLikeReq = {
  target_id: number; // 북마크한 대상 사용자의 id
  is_like?: boolean;
};

// 공통 북마크 row 기본 정보
export interface BaseBookmarkItem {
  _id: number; // 북마크 자체 id (삭제할 때 필요)
  user_id: number; // 북마크/좋아요를 한 사용자 id (= 로그인한 나)
  createdAt: string;
}

// user 타입 북마크: 내가 북마크 한 "사용자" 목록
export interface UserBookmarkItem extends BaseBookmarkItem {
  user: UserInfo; // 북마크 대상 사용자(작가)
}

// post 타입 좋아요: 내가 좋아요 한 "게시글" 목록
export interface PostTargetBookmark extends BaseBookmarkItem {
  post: PostItem; // 좋아요 대상 게시글
}

// 사용자가 북마크한 리스트
export type UserBookmarkListRes = {
  ok: 1;
  item: UserBookmarkItem[];
};

// 북마크, 좋아요 추가 응답
export type BookmarkCreateRes =
  | {
      ok: 1;
      item: UserBookmarkItem;
    }
  | APIError;

// 북마크, 좋아요 삭제
export type BookmarkDeleteRes =
  | {
      ok: 1;
    }
  | APIError;

export interface RecentPost {
  id: number; // 게시글 id
  title: string; // 게시글 제목
  thumbnail: string; // 썸네일 이미지 url
  authorId: number; // 작성자 id
}

//로그인 유저 타입
export interface LoginUser {
  _id: number;
  email: string;
  name: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

//북마크
export interface Bookmark {
  _id: number;
  user_id: number;
  user?: UserInfo;
  post?: PostItem;
}
