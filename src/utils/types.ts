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
  content: string;
  image?: string | string[];
  tag?: string;
  views: number;
  user: PostUser;
  _id: number;
  createdAt: string;
  updatedAt: string;
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
    job: string;
    biography: string;
    keyword: string[];
  };
  createdAt: string;
  updatedAt: string;
  posts: number; // 작성한 게시물 수
  bookmarkedBy: {
    users: number; // 북마크한 사용자 수
  };
  likedBy: {
    users: number; // 좋아요한 사용자 수
  };
  postViews: number; // 조회수
}

export interface ProductImage {
  url: string;
  name: string;
}

export interface ProductInfo {
  name: string;
  image: ProductImage;
}

export interface PostItem {
  _id: number;
  type: string;
  product_id: number;
  seller_id: number;
  user: UserInfo;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  product: ProductInfo;
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

export interface PostsResponse {
  ok: number;
  item: PostItem[];
  pagination: Pagination;
}

export interface UsersResponse {
  ok: number;
  item: UserInfo[];
  pagination: Pagination;
}

// 응답 타입 정의
export interface LoginResponse {
  ok: number;
  item: UserInfo;
}

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
  bookmarkedBy: {
    users: number; // 북마크한 사용자 수
  };
  likedBy: {
    users: number; // 좋아요한 사용자 수
  };
  postViews: number; // 조회수
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

export interface ProductImage {
  url: string;
  name: string;
}

export interface ProductInfo {
  name: string;
  image: ProductImage;
}

export interface PostItem {
  _id: number;
  type: string;
  product_id: number;
  seller_id: number;
  user: UserInfo;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  product: ProductInfo;
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

export interface PostsResponse {
  ok: number;
  item: PostItem[];
  pagination: Pagination;
}

export interface UsersResponse {
  ok: number;
  item: UserInfo[];
  pagination: Pagination;
}

// 요청 타입 정의
