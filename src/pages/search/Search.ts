import { AxiosError } from 'axios';
import { getAxios } from '../../utils/axios';
import type { PostListResponse, UserListResponse } from '../../utils/types';

const axios = getAxios();

const tabNav = document.querySelector('#tabNav') as HTMLElement;
const titleSection = document.querySelector('#title') as HTMLElement;
const articleList = document.querySelector('#article-list') as HTMLElement;

function onSearch() {
  tabNav.removeAttribute('hidden');
  titleSection.style.display = 'none';
}

// // 작가 목록 API
// export async function fetchAuthors(): Promise<UserInfo[]> {
//   const res = await axios.get<UserListResponse>('/users', {
//     params: {
//       filter: '{"type":"seller"}',
//       sort: '{"bookmarkedBy.users": -1}', // 인기순 정렬
//     },
//   });

//   const data = res.data;

//   if (!isUserListSuccess(data)) {
//     throw new Error(data.message);
//   }

//   return data.item; // UserInfo[]
// }

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

// 검색창 글자 입력시 보이기/숨기기
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const title = document.querySelector<HTMLElement>('#title') as HTMLElement;
  const titleText = document.querySelector<HTMLElement>('#popular-keywords-title');
  const contentText = title?.querySelector('p');
  const contents = document.querySelectorAll<HTMLElement>('[data-content]');
  const searchInput = document.querySelector<HTMLInputElement>('#search-input');
  const searchTitle = document.querySelector<HTMLTitleElement>('#search-title');

  // 원본 내용 저장
  const originalTitle = titleText?.textContent || '';
  const originalContent = contentText?.innerHTML || '';

  // 검색어 입력시 내용 변경
  if (searchInput && titleText && contentText) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) {
        // 검색 중일 때 내용 변경

        contentText.innerHTML = `'<span class="text-[20px] text-br-primary font-medium">${searchInput.value}</span>' 검색 중...`;
      } else {
        // 원래 내용으로 복원
        titleText.textContent = originalTitle;
        contentText.innerHTML = originalContent;
      }
    });
  }

  // 검색어 입력시 section영역 숨김

  // 검색어 입력 그리고 타이틀 요소에
  if (searchTitle && title) {
    // enter 이벤트 리스너가 발생하면
    searchTitle.addEventListener('enter', () => {
      // 검색창의 값에 공백을 제거하고, 길이가 0보다 크면
      if (searchTitle.value.trim().length > 0) {
        // title에 숨김처리
        titleText.textContent = '검색 결과';
        title.classList.add('hidden');
      } else {
        // 그렇지 않으면 title에 보임처리

        title.classList.remove('hidden');
      }
    });
  }

  // 버튼 클릭시 콘텐츠 전환
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      if (!targetTab) return;

      // ---- active 클래스 토글 ----
      buttons.forEach((b) => b.classList.remove('active')); // 모든 탭 버튼 active 제거
      btn.classList.add('active');

      // ---- 콘텐츠 토글 ----
      contents.forEach((content) => {
        const isTarget = content.dataset.content === targetTab;
        content.hidden = !isTarget;
      });
    });
  });
});

// 1. 작가 상세 API 호출
async function getUserProfile(authorId: number) {
  const api = getAxios(); // axios instance 생성
  const res = await api.get(`/users/${authorId}`);
  return res.data; // { ok, item } 반환
}

// 2. 상세 페이지 렌더링
async function loadUserProfile() {
  try {
    const authorId = Number(new URLSearchParams(window.location.search).get('_id'));

    if (!authorId) {
      console.error('URL 에 _id 가 없습니다.');
      return;
    }

    // 여기서 data 선언됨!! ✔
    const data = await getUserProfile(authorId);

    if (!data.ok) {
      console.error('API 응답 ok:false');
      return;
    }

    // 사용자 정보 렌더링
    document.querySelector('#name')!.textContent = data.item.name;
    document.querySelector('#job')!.textContent = data.item.extra?.job ?? '';

    const image = document.querySelector('#image') as HTMLImageElement;
    image.src = data.item.image;

    // 게시글 목록 렌더링
    const articleList = document.querySelector('#article-list') as HTMLElement;

    data.item.postList.forEach((post: any) => {
      const article = `
        <article class="border-b border-br-line py-4">
          <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">
            <div class="underline decoration text-[13px] text-br-primary pb-[10px]">
              ${post.extra?.subTitle ?? ''}
            </div>
            <h3 class="text-[17px] mt-[14px]">${post.title}</h3>
            <p class="mt-10 text-[12px] text-br-contentSecondary line-clamp-3">
              ${post.content}
            </p>
            <div class="flex items-center gap-2 mt-[8px]">
              <span class="text-[12px] text-br-contentSecondary">${post.updatedAt}</span>
            </div>
          </a>
        </article>
      `;
      articleList.innerHTML += article;
    });
  } catch (error) {
    console.error('실패:', error);
  }
}
// 실행
loadUserProfile();

// 4 작가 홈 API 호출
async function getAuthorProfile(authorId: number) {
  const api = getAxios(); // axios instance 생성
  const res = await api.get(`/users/${authorId}`);
  return res.data; // { ok, item } 반환
}

// 5. 상세 페이지 렌더링
async function authorProfile() {
  //
  try {
    // const authorId = Number(new URLSearchParams(window.location.search).get('_id'));

    // if (!authorId) {
    //   console.error('URL 에 _id 가 없습니다.');
    //   return;
    // }

    // 여기서 data 선언됨!!
    const data = await getAuthorProfile(authorId);

    if (!data.ok) {
      console.error('API 응답 ok:false');
      return;
    }

    // 사용자 정보 렌더링
    document.querySelector('#name')!.textContent = data.item.name;
    document.querySelector('#job')!.textContent = data.item.extra?.job ?? '';

    const image = document.querySelector('#image') as HTMLImageElement;
    image.src = data.item.image;

    // 게시글 목록 렌더링
    const authorlist = document.querySelector('#author-list') as HTMLElement;

    data.item.postList.forEach((user: any) => {
      const article = `
           <article>
            <img id="image" src="" alt=" 이미지" class="w-12 h-12 rounded-full object-cover" hidden />
            <h2 id="name" class="text-[16px] text-br-detailsTitle mb-3">${user.title}</h2>
            <h3 id="job" class="text-[12px] text-br-contentSecondary mb-3">${user.content}</h3>
          </article>
      `;
      authorlist.innerHTML += article;
    });
  } catch (error) {
    console.error('실패:', error);
  }
}

// 실행
authorProfile();
