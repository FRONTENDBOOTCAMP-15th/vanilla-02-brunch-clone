// src/api/user.ts
import { getAxios } from '../../utils/axios';
import type { UserResponse, PostListResponse } from '../../utils/types';

const axios = getAxios();

/**
 * 회원 정보 조회
 */
export const getUserProfile = async (userId: number) => {
  const response = await axios.get<UserResponse>(`/users/${userId}`);
  return response.data;
};

/**
 * 사용자가 작성한 글 목록 조회
 */
export const getUserPosts = async (userId: number, page: number = 1, limit: number = 10) => {
  const response = await axios.get<PostListResponse>(`posts/users/${userId}/`, {
    params: {
      type: 'brunch',
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
    const authorId = new URLSearchParams(window.location.search).get('_id')!;
    const data = await getUserProfile(parseInt(authorId)); // 사용자 ID

    if (data.ok) {
      console.log('사용자 이름:', data.item.name);
      console.log('직업:', data.item.extra.job);
      console.log('작성한 글 수:', data.item.posts);
      console.log('이미지:', data.item.image);
      console.log('구독자수:', data.item.bookmarkedBy.users);
      console.log('관심작가 수:', data.item.bookmark.users);

      const name = document.querySelector('#name')!;
      name.textContent = data.item.name;

      const job = document.querySelector('#job')!;
      job.textContent = String(data.item.extra?.job || '');

      const image = document.querySelector('#image') as HTMLImageElement;
      image.src = data.item.image;
      image.width = 80;
      image.height = 80;

      const subCount = document.querySelector('#subCount')!;
      subCount.textContent = data.item.bookmarkedBy.users.toString();

      const followCount = document.querySelector('#followCount')!;
      followCount.textContent = data.item.bookmark.toString();
    }
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
  }
}

// 2. 사용자가 작성한 글 목록 조회
async function loadUserPosts() {
  try {
    const authorId = new URLSearchParams(window.location.search).get('_id')!;
    const data = await getUserPosts(parseInt(authorId), 1); // ID: 3, 1페이지

    if (data.ok) {
      console.log('총 글 개수:', data.pagination.total);
      console.log('글 목록:', data.item);

      const articleList = document.querySelector('#article-list')!;

      data.item.forEach((post) => {
        console.log(`제목: ${post.title}, 작성일: ${post.createdAt}`);
        console.log(`내용: ${post.content}`);
        console.log('부제목', post.extra.subTitle);
        console.log('날짜', post.updatedAt);

        const article = `          
        <article class="border-b border-br-line py-4">
          <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">
            <div class="underline decoration text-[13px] text-br-primary pb-[10px]">${post.extra.subTitle}</div>
            <h3 class="text-[17px] mt-[14px]">${post.title}</h3>          
            <p class="mt-10 text-[12px] text-xs text-br-contentSecondary mt-[8px] line-clamp-3 break-words overflow-hidden ">${post.content}</p>
            <div class="flex items-center gap-2 mt-[8px]">
              <span class="text-[12px] text-br-contentSecondary">${post.updatedAt}</span>
            </div>
          </a>
        </article>
        
      `;

        articleList.innerHTML += article;
      });
    }
  } catch (error) {
    console.error('글 목록 조회 실패:', error);
  }
}

// 실행
loadUserProfile();
loadUserPosts();
