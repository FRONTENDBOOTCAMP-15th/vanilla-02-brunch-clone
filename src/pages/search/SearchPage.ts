// src/api/user.ts
import { getAxios } from '../../utils/axios';
import type { PostListResponse } from '../../utils/types';

const axios = getAxios();

/**
 * 사용자가 작성한 글 목록 조회
 */
export const getUserPosts = async (userId: number, page: number = 1, limit: number = 10) => {
  const response = await axios.get<PostListResponse>(`/posts/users/${userId}/`, {
    params: {
      type: 'brunch',
      page,
      limit,
    },
  });
  return response.data;
};

// 2. 사용자가 작성한 글 목록 조회
async function loadUserPosts() {
  try {
    const authorId = new URLSearchParams(window.location.search).get('_id')!;
    const data = await getUserPosts(parseInt(authorId), 1); // ID: 3, 1페이지

    if (data.ok) {
      console.log('글 목록:', data.item);

      const articleList = document.querySelector('#article-list')!;

      data.item.forEach((post) => {
        console.log(`제목: ${post.title}, 작성일: ${post.createdAt}`);
        console.log(`내용: ${post.content}`);
        console.log('날짜', post.updatedAt);

        const article = `          
        <article class="border-b border-br-line py-4">
          <a href="/src/pages/details/DetailsPage.html">
          
            <h3 class="text-[17px] mt-[14px]">${post.title}</h3>            
            <p class="mt-10 text-[12px] text-xs text-br-contentSecondary mt-[8px] line-clamp-3 break-words overflow-hidden ">${post.content}</p>

            <div class="flex items-center gap-2 mt-[8px]">
              <span class="text-[12px] text-br-contentSecondary">${post.updatedAt}</span>
              <img src="${post.image}" alt="">
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
// loadUserProfile();
loadUserPosts();

// 3. 글 검색 결과
async function SearchResults() {
  try {
    const authorId = new URLSearchParams(window.location.search).get('_id')!;
    const data = await getUserPosts(parseInt(authorId), 1);

    if (data.ok) {
      console.log('글 목록:', data.item);

      const articleList = document.querySelector('#article-list')!;

      data.item.forEach((post) => {
        console.log(`제목: ${post.title}, 작성일: ${post.createdAt}`);
        console.log(`내용: ${post.content}`);
        console.log('날짜', post.updatedAt);

        const article = `          
        <article class="border-b border-br-line py-4">
          <a href="/src/pages/details/DetailsPage.html">
          
            <h3 class="text-[17px] mt-[14px]">${post.title}</h3>            
            <p class="mt-10 text-[12px] text-xs text-br-contentSecondary mt-[8px] line-clamp-3 break-words overflow-hidden ">${post.content}</p>

            <div class="flex items-center gap-2 mt-[8px]">
              <span class="text-[12px] text-br-contentSecondary">${post.updatedAt}</span>
              <img src="${post.image}" alt="">
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
SearchResults();

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const titleSection = document.getElementById('title') as HTMLElement;
const tabNav = document.getElementById('tabNav') as HTMLElement;

if (searchInput && titleSection && tabNav) {
  searchInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const hasValue = target.value.trim().length > 0;

    if (hasValue) {
      // 검색어가 있으면 타이틀 섹션 숨기고 탭 네비게이션 표시
      titleSection.hidden = true;
      tabNav.hidden = false;
    } else {
      // 검색어가 없으면 타이틀 섹션 표시하고 탭 네비게이션 숨김
      titleSection.hidden = false;
      tabNav.hidden = true;
    }
  });
}

/**
 * 검색 요청
 */
export const searchPosts = async (keyword: string, page: number = 1, limit: number = 20) => {
  const response = await axios.get<PostListResponse>(`posts`, {
    params: {
      type: 'brunch',
      keyword,
      page,
      limit,
    },
  });
  return response.data;
};

//검색 요청 함수
async function loadSearchResults(keyword: string) {
  try {
    const data = await searchPosts(keyword);

    console.log('검색 응답:', data);

    const articleList = document.querySelector('#article-list')!;
    articleList.innerHTML = '';

    if (!data || !data.item || data.item.length === 0) {
      articleList.innerHTML = `
        <p class="text-center text-sm text-gray-500 py-10">검색 결과가 없습니다.</p>
      `;
      return;
    }

    data.item.forEach((post) => {
      const article = `
        <article class="border-b border-br-line py-4">
          <h3 class="text-[17px] mt-[14px]">${post.title ?? ''}</h3>
          <p class="mt-10 text-[12px] text-br-contentSecondary line-clamp-3">
            ${post.content ?? ''}
          </p>
          <div class="flex items-center gap-2 mt-[8px]">
            <span class="text-[12px] text-br-contentSecondary">${post.updatedAt ?? ''}</span>
          </div>
        </article>
      `;
      articleList.innerHTML += article;
    });
  } catch (error) {
    if (error) {
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  }
}

function initSearchEvent() {
  const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (keyword.length === 0) return;

      loadSearchResults(keyword);
    }
  });
}

// // 실행
initSearchEvent();

// 4. 회원 정보 조회
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
loadUserProfile();

// 검색 실행 코드
function onSearch() {
  // 검색 결과가 존재하면 탭 보여주기
  const tabNav = document.querySelector('#tabNav');
  tabNav.hidden = false; // hidden 제거
  tabNav.classList.remove('hidden'); // hidden 클래스 제거
}

onSearch();
