// src/api/user.ts
import { getAxios } from '../../utils/axios';
import type { UserProfileRes, UserPostList } from '../../utils/types';

const axios = getAxios();

/**
 * 회원 정보 조회
 */
export const getUserProfile = async (userId: number) => {
  const response = await axios.get<UserProfileRes>(`/users/${userId}`);
  return response.data;
};

/**
 * 사용자가 작성한 글 목록 조회
 */
export const getUserPosts = async (userId: number, page: number = 1, limit: number = 10) => {
  const response = await axios.get<UserPostList>(`/users/${userId}/posts`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

// ========== 실제 실행 코드 ==========

// 1. 회원 정보 조회
async function loadUserProfile() {
  try {
    const data = await getUserProfile(123); // 사용자 ID: 123
    console.log('사용자 이름:', data.item.name);
    console.log('직업:', data.item.extra.job);
    console.log('작성한 글 수:', data.item.posts);
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
  }
}

// 2. 사용자가 작성한 글 목록 조회
async function loadUserPosts() {
  try {
    const data = await getUserPosts(123, 1, 10); // ID: 123, 1페이지, 10개씩
    console.log('총 글 개수:', data.pagination.total);
    console.log('글 목록:', data.item);

    data.item.forEach((post) => {
      console.log(`제목: ${post.title}, 작성일: ${post.createdAt}`);
    });
  } catch (error) {
    console.error('글 목록 조회 실패:', error);
  }
}

// 실행
loadUserProfile();
loadUserPosts();
