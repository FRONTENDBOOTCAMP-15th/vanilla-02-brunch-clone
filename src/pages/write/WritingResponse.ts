import type { uploadFileInfo, PostInfo, APIError } from '../../utils/types';

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
