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

      const subCount = document.querySelector('#subCount')!;
      subCount.textContent = data.item.bookmarkedBy.users.toString();

      const followCount = document.querySelector('#followCount')!;
      const count = data.item.bookmark?.users || 0;

      followCount.textContent = count.toString();
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

//구독 버튼
const subscribeButtonEl = document.querySelector('.subscribe-button') as HTMLButtonElement;

// 구독 버튼 토글
subscribeButtonEl.addEventListener('click', () => {
  console.log('구독 버튼 클릭됨!');

  if (!isLoggedIn()) {
    alert('로그인이 필요한 서비스입니다.');
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
      const current = Number(subscribeCount.textContent) || 0;
      subscribeCount.textContent = String(current + 1);
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
      const current = Number(subscribeCount.textContent) || 0;
      subscribeCount.textContent = String(current - 1);
    }
  } catch (err) {
    console.error('구독 취소 에러:', err);
  }
}
