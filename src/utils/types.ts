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

export interface DetailRes<T> {
  ok: 1;
  item: T;
}

export interface ListRes<T> {
  ok: 1;
  item: T[];
}

export interface UserPostList {
  ok: number;
  item: UserPost[];
  pagination: Pagination;
}

export interface UserPost {
  _id: number;
  // user: {
  //   _id: number;
  //   name: string;
  // };
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  product: {
    name: string;
    image: {
      url: string;
      name: string;
    };
  };
  bookmarks: number;
  myBookmarkId: number | null;
  repliesCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserProfileRes {
  ok: number;
  item: UserProfile;
}

export interface UserProfile {
  _id: number;
  name: string;
  type: string;
  loginType: string;
  image: string;

  extra: {
    job: string;
    biography: string;
  };

  posts: number;

  bookmark: {
    products: number;
    users: number;
    posts: number;
  };

  bookmarkedBy: {
    users: number;
  };
}
