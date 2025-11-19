export interface APIError {
  ok: 0;
  message: string;
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
      item: PostInfo;
    }
  | APIError;

// 게시글 등록
export interface RegisterPostReq {
  type?: string;
  title: string;
  extra: {
    subtitle: string;
  };
  content: string;
  image?: string | string[];
}

// 게시글을 작성한 유저 정보
export interface PostUser {
  _id: number;
  name: string;
}

// 서버로부터 응답받는 게시글 정보
export interface PostInfo {
  type: string;
  title: string;
  extra: {
    subtitle: string;
  };
  content: string;
  image?: string | string[];
  tag?: string;
  views: number;
  user: PostUser;
  _id: number;
  createdAt: string;
  updatedAt: string;
}

// 게시글 상세조회 응답 타입
export type PostDetailsRes =
  | {
      ok: 1;
      item: PostInfo;
    }
  | APIError;

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
    job: string;
    biography: string;
    keyword: string[];
  };
  createdAt: string;
  updatedAt: string;
  posts: number; // 작성한 게시물 수
  bookmarks: number;
  bookmarkedBy: {
    users: number;
  };
  likedBy: {
    users: number;
  };
  postViews: number; // 조회수
}

export interface PostItem {
  _id: number;
  type: string;
  product_id: number;
  seller_id: number;
  user: UserInfo;
  title: string;
  extra: {
    subTitle: string;
  };
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  bookmarks: number;
  myBookmarkId: number;
  repliesCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type PostsResponse =
  | {
      ok: 1;
      item: PostItem[];
      pagination: Pagination;
    }
  | APIError;

export type UsersResponse =
  | {
      ok: 1;
      item: UserInfo[];
      pagination: Pagination;
    }
  | APIError;

export type UserResponse =
  | {
      ok: 1;
      item: UserInfo;
    }
  | APIError;

// 응답 타입 정의
export type LoginResponse =
  | {
      ok: 1;
      item: UserInfo;
    }
  | APIError;
