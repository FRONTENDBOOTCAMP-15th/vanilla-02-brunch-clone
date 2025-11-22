// src/api/user.ts
import { getAxios } from '../../utils/axios';
import type { UserResponse, PostListResponse, BookmarkType, UserBookmarkListRes, BookmarkLikeReq, BookmarkCreateRes, BookmarkDeleteRes } from '../../utils/types';

const subscribeButtonEl = document.querySelector('.subscribe-button') as HTMLButtonElement;
const subCount = document.querySelector('#subCount')!;

const axios = getAxios();

// 구독 상태 조회
let subscribed = false;
let currentBookmarkId: number | null = null;

let currentAuthorId: number;

// 1. 로그인 여부 확인 함수 (세션 스토리지에 accessToken 기준)
function isLoggedIn() {
  const token = sessionStorage.getItem('accessToken');
  return !!token;
}

function updateSubscribeButtonUI() {
  if (!subscribeButtonEl) return;

  const plus = subscribeButtonEl.querySelector<HTMLImageElement>('.icon-plus');
  const check = subscribeButtonEl.querySelector<HTMLImageElement>('.icon-check');
  const label = subscribeButtonEl.querySelector<HTMLSpanElement>('span');

  // aria-pressed
  subscribeButtonEl.setAttribute('aria-pressed', String(subscribed));

  // 배경 / 글자색 / 너비
  subscribeButtonEl.classList.toggle('bg-br-contentsBg', !subscribed);
  subscribeButtonEl.classList.toggle('bg-br-primary', subscribed);
  subscribeButtonEl.classList.toggle('text-br-primary', !subscribed);
  subscribeButtonEl.classList.toggle('text-br-contentsBg', subscribed);
  subscribeButtonEl.classList.toggle('w-[65px]', !subscribed);
  subscribeButtonEl.classList.toggle('w-[78px]', subscribed);

  // 아이콘 토글
  plus?.classList.toggle('hidden', subscribed);
  check?.classList.toggle('hidden', !subscribed);

  // 텍스트
  if (label) {
    label.textContent = subscribed ? '구독중' : '구독';
  }
}

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
      const author = data.item;
      console.log('사용자 이름:', data.item.name);
      console.log('직업:', data.item.extra?.job);
      console.log('작성한 글 수:', data.item.posts);
      console.log('이미지:', data.item.image);
      console.log('구독자수:', data.item.bookmarkedBy.users);
      console.log('관심작가 수:', data.item.bookmark.users);

      const name = document.querySelector('#name')!;
      name.textContent = data.item.name;

      const job = document.querySelector('#job')!;
      job.textContent = String(data.item.extra?.job ?? '');

      const image = document.querySelector('#image') as HTMLImageElement;
      console.log(data.item.image);
      image.src = data.item.image;
      image.width = 80;
      image.height = 80;

      subCount.textContent = data.item.bookmarkedBy.users.toString();

      const followCount = document.querySelector('#followCount')!;
      const count = data.item.bookmark?.users || 0;

      followCount.textContent = count.toString();

      // 현재 작가의 id
      currentAuthorId = author._id;

      if (isLoggedIn()) {
        checkSubscribe(currentAuthorId);
      }
    }
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
  }
}

// 이미지 태그 제거
function removeImagesFromHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  // 모든 img 태그 제거
  tmp.querySelectorAll('img, br, div').forEach((img) => img.remove());

  // 태그 구조는 유지하고 싶으면 innerHTML 반환
  return tmp.innerHTML;
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
        const contentWithoutImg = removeImagesFromHtml(post.content);

        const article = `          
        <article class="border-b border-br-line py-4">
          <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">
            <div class="underline decoration text-[13px] text-br-primary pb-[10px]">${post.extra.subTitle}</div>
            <h3 class="text-[17px] mt-[14px]">${post.title}</h3>          
            <p class="mt-10 text-[12px] text-xs text-br-contentSecondary mt-[8px] line-clamp-3 break-words overflow-hidden ">${contentWithoutImg}
</p>
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

// -------------- 구독 기능 구현 ------------------
// 구독 상태 조회
async function checkSubscribe(authorId: number) {
  const axios = getAxios();
  const type: BookmarkType = 'user';

  try {
    const { data } = await axios.get<UserBookmarkListRes>(`bookmarks/${type}`);
    console.log('내가 구독한 구독 목록:', data.item);
    // const myIdStr = sessionStorage.getItem('userid');
    // console.log('현재 로그인된 사용자의 id: ', myIdStr);
    if (data.ok === 1) {
      const userBookmarkList = data.item;

      const find = userBookmarkList.find((item) => item.user._id === authorId); // 내가 구독한 목록 중에서 해당 게시글 작성자의 아이디가 있으면 그 객체 자체를 반환

      if (find) {
        subscribed = true;
        currentBookmarkId = find._id;
        // 이미 구독 중인 작가면 체크 되어 있게 표시
        updateSubscribeButtonUI();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// 구독 버튼 토글
subscribeButtonEl.addEventListener('click', () => {
  console.log('구독 버튼 클릭됨!');

  if (!isLoggedIn()) {
    alert('로그인이 필요한 서비스입니다.');
    location.href = '/src/pages/login/SignIn.html';
    return;
  }

  // 이미 구독 중인 상태라면
  if (subscribed) {
    // 구독 취소가 되어야 함(취소 함수를 적을 것!)
    if (currentBookmarkId != null) {
      cancelSubscribe(currentBookmarkId);
    } else {
      alert('북마크 id가 없습니다.');
    }
  }
  // 구독하지 않았으면 구독 목록에 추가됨
  else {
    // 현재 게시글 작성자의 아이디를 매개변수로 해서 구독 목록에 추가되는 함수 작성
    subscribeAuthor(currentAuthorId);
  }
});

// 구독 추가
async function subscribeAuthor(authorId: number) {
  const axios = getAxios();
  const type: BookmarkType = 'user';

  const body: BookmarkLikeReq = {
    target_id: authorId, // 구독하는 작가 즉, 현재 게시글의 작가의 id를 target_id로 넘겨줌
  };

  try {
    console.log('구독 추가 보냄:', authorId);
    const { data } = await axios.post<BookmarkCreateRes>(`/bookmarks/${type}`, body);
    console.log('구독 응답:', data);
    if (data.ok === 1) {
      // 구독 상태 구독 중으로 바뀜
      subscribed = true;
      currentBookmarkId = data.item._id;
      // 구독하면 구독 버튼 체크 표시로 바뀌도록 함
      updateSubscribeButtonUI();
      const current = Number(subCount.textContent) || 0;
      subCount.textContent = String(current + 1);

      alert('작성자를 구독합니다.');
    } else {
      console.error('구독 실패 응답ㅜ', data);
    }
  } catch (err) {
    console.error(err);
  }
}

// 구독 취소

async function cancelSubscribe(bookmarkId: number) {
  const axios = getAxios();

  try {
    const { data } = await axios.delete<BookmarkDeleteRes>(`/bookmarks/${bookmarkId}`);
    console.log('구독 취소 응답:', data);

    if (data.ok === 1) {
      subscribed = false;
      currentBookmarkId = null;
      updateSubscribeButtonUI();
      const current = Number(subCount.textContent) || 0;
      subCount.textContent = String(current - 1);

      alert('작성자 구독을 취소합니다.');
    }
  } catch (err) {
    console.error('구독 취소 에러:', err);
  }
}
