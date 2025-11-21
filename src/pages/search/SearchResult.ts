import { AxiosError } from 'axios';
import { getAxios } from '../../utils/axios';
import type { PostListResponse, UserListResponse } from '../../utils/types';
import { initSearchEvent } from './Search';

const axios = getAxios();

function init() {
  searchPosts(); // 2. 검색
  setKeyword(); // 검색어 입력창에 검색어 세팅
  initSearchEvent(); // 검색어 입력후 엔터 이벤트 등록
  setTabEvent(); // 글/작가 이동
}
init(); // 1

function setKeyword() {
  const keyword = new URLSearchParams(window.location.search).get('keyword')!;
  console.log(keyword);
  const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
  searchInput.value = keyword;
}

// 게시물 검색 API 호출
async function getPosts(keyword: string): Promise<PostListResponse | undefined> {
  try {
    const response = await axios.get<PostListResponse>(`posts`, {
      params: {
        type: 'brunch',
        keyword,
      },
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      alert(err.response?.data.message || err.message);
    } else {
      alert((err as Error).message);
    }
  }
}

// 작가 검색 API 호출
async function getAuthors(keyword: string): Promise<UserListResponse | undefined> {
  try {
    const custom = { name: { $regex: keyword, $options: 'i' } };
    const response = await axios.get<UserListResponse>(`users`, {
      params: {
        custom: JSON.stringify(custom),
      },
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      alert(err.response?.data.message || err.message);
    } else {
      alert((err as Error).message);
    }
  }
}

// 이미지 제거 함수
function removeImages(html: string): string {
  if (!html) return '';

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  wrapper.querySelectorAll('img, figure, picture, source, br ').forEach((el) => el.remove());

  return wrapper.innerHTML.trim();
}

// 게시물 검색
async function searchPosts() {
  // 검색어 추출
  const keyword = new URLSearchParams(window.location.search).get('keyword')!;
  // API 서버에서 검색
  const data = await getPosts(keyword);

  console.log('검색 응답:', data);

  // 게시물 목록을 출력하는 영역
  const articleList = document.querySelector('#article-list')!;
  // 게시물 목록 영역 비우기
  articleList.innerHTML = '';

  // 서버로부터 정상적인 응답을 받았을 경우
  if (data?.ok) {
    if (data.item.length === 0) {
      articleList.innerHTML = `
        <p class="text-center text-sm text-gray-500 py-10">검색 결과가 없습니다.</p>
      `;
    } else {
      // 검색 결과 수 출력
      const countSpan = document.querySelector<HTMLSpanElement>('#post-count span')!;
      countSpan.textContent = data.item.length.toString();

      // 검색 결과 수 만큼 화면에 article 출력
      data.item.forEach((post) => {
        const cleanedContent = removeImages(post.content ?? '');

        const article = `
          <article class="border-b border-br-line py-4">
            <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">
              <h3 class="text-[17px] mt-[14px]">${post.title ?? ''}</h3>
              <p class="mt-10 text-[12px] text-br-contentSecondary line-clamp-3">
                ${cleanedContent}
              </p>
              <div class="flex items-center gap-2 mt-[8px]">
                <span class="text-[12px] text-br-contentSecondary">${post.updatedAt ?? ''}</span>
              </div>
            </a>
          </article>
        `;

        articleList.innerHTML += article;
      });
    }
  }
}

// 작가 검색
async function searchAuthors() {
  // 쿼리스트링에서 검색어 추출
  const keyword = new URLSearchParams(window.location.search).get('keyword')!;
  // API 서버에서 검색
  const data = await getAuthors(keyword);

  console.log('검색 응답:', data);

  // 게시물 목록을 출력하는 영역
  const articleList = document.querySelector('#article-list')!;
  // 게시물 목록 영역 비우기
  articleList.innerHTML = '';

  // 서버로부터 정상적인 응답을 받았을 경우
  if (data?.ok) {
    if (data.item.length === 0) {
      articleList.innerHTML = `
        <p class="text-center text-sm text-gray-500 py-10">검색 결과가 없습니다.</p>
      `;
    } else {
      // 검색 결과 수 출력
      const countSpan = document.querySelector<HTMLSpanElement>('#post-count span')!;
      countSpan.textContent = data.item.length.toString();

      // 검색 결과 수 만큼 화면에 article 출력
      data.item.forEach((user) => {
        const article = `
         
        <article class="flex items-start gap-3 py-3">
          <a href="/src/pages/Author/AuthorPage.html?_id=${user._id}" class="flex items-start gap-3">
            <img src="${user.image}" alt=" 프로필 이미지" class="w-12 h-12 rounded-full object-cover" />
            <div class="flex flex-col">
              <h2 id="name" class="text-[16px] text-br-detailsTitle mb-1">${user.name}</h2>
              <h3 id="job" class="text-[12px] text-br-contentSecondary mb-1 line-clamp-2">${user.extra?.job ?? ''}</h3>
            </div>
          </a>
        </article>
   
        `;
        articleList.innerHTML += article;
      });
    }
  }
}

function removeHtmlTags(html: string): string {
  if (!html) return '';

  // 1) 태그 전체 제거
  const withoutTags = html.replace(/<[^>]*>/g, '');

  // 2) 공백 정리
  return withoutTags.trim();
}

// 탭 이벤트 추가
function setTabEvent() {
  document.querySelector('#posts')?.addEventListener('click', () => {
    searchPosts();
  });
  document.querySelector('#authors')?.addEventListener('click', () => {
    searchAuthors();
  });
}

// 글/작가 버튼 클릭시 밑줄 색 변경
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // 모든 탭 초기화
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.classList.add('text-br-contentSecondary');
      });

      // 클릭된 탭 활성화
      tab.classList.add('active');
      tab.classList.remove('text-br-contentSecondary');
    });
  });
});
