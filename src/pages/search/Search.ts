import { AxiosError } from 'axios';
import { getAxios } from '../../utils/axios';
import type { PostListResponse } from '../../utils/types';

const axios = getAxios();

function onSearch() {
  const tabNav = document.querySelector('#tabNav') as HTMLElement;
  tabNav.removeAttribute('hidden');
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

    if (data.ok === 1) {
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
    }
    onSearch();
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  }
}

function initSearchEvent() {
  // 아이디가 search-input인 선택자를 이용해서 요소를 찾아라
  const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;

  // 검색어 입력요소에 키보드 입력 이벤트를 등록
  searchInput.addEventListener('keydown', (e) => {
    // 엔터쳤을때
    if (e.key === 'Enter') {
      // 검색어 앞뒤공백을 제거한 값을 꺼냄
      const keyword = searchInput.value.trim();
      // 검색어를 입력하지 않았을때 실행하지 마
      if (keyword.length === 0) return;

      // 검색어를 loadSearchResults 함수로 전달해서 호출
      loadSearchResults(keyword);
    }
  });
}

function initTextTabButton() {
  const textButton = document.querySelector<HTMLButtonElement>('#text-button');
  if (!textButton) return;

  textButton.addEventListener('click', () => {
    console.log('글 탭 클릭됨 → 글 목록 로드');

    const articleList = document.querySelector('#article-list')!;
    articleList.innerHTML = ''; // 기존 검색 결과 제거
  });
}

// // 실행
initSearchEvent();
initTextTabButton();
