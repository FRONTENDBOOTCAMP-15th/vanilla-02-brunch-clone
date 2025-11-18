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
