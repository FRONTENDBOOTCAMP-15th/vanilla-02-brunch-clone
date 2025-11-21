import { getAxios } from '../../utils/axios';
import type { BookmarkCreateRes, BookmarkDeleteRes, BookmarkLikeReq, BookmarkType, PostItem, PostLikeListRes, PostResponse, RecentPost, UserBookmarkListRes, UserResponse } from '../../utils/types';

const mainContents = document.querySelector('.details-maincontents') as HTMLElement;
const titleContents = document.querySelector('.details-title') as HTMLParagraphElement;
const subtitleContents = document.querySelector('.details-subtitle') as HTMLParagraphElement;
const authorContents = document.querySelector('.details-authorname') as HTMLAnchorElement;
const timeContents = document.querySelector('.details-time') as HTMLSpanElement;
const thumbnailImg = document.querySelector('.details-thumbnail') as HTMLImageElement;

const likeButton = document.querySelector('.details-like-button') as HTMLButtonElement;
const likeCountEl = document.querySelector('.details-like-count') as HTMLParagraphElement;

const writerName = document.querySelector('.details-writer-name') as HTMLParagraphElement;
const writerJob = document.querySelector('.details-writer-job') as HTMLAnchorElement;
const writerImg = document.querySelector('.details-writer-img img') as HTMLImageElement;
const writerExplain = document.querySelector('.details-explain') as HTMLAnchorElement;
const subscribeCount = document.querySelector('.details-subscribe-count') as HTMLAnchorElement;
const subscribeButtonEl = document.querySelector('.subscribe-button') as HTMLButtonElement;

// 구독 버튼 스크립트

// 구독 상태 조회
let subscribed = false;
let currentBookmarkId: number | null = null;

// -------------------- 좋아요 상태 --------------------
let liked = false; // 이 게시글을 내가 좋아요 했는지
let currentLikeId: number | null = null; // 좋아요 row id (취소할 때 사용)
let likeCount = Number(likeCountEl.textContent) || 0;

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

updateSubscribeButtonUI();

// 좋아요 버튼

// 초기 좋아요 개수 (DOM에 적힌 숫자 기준)

function updateLikeButtonUI() {
  if (!likeButton) return;

  likeButton.setAttribute('aria-pressed', String(liked));

  if (liked) {
    likeCountEl.classList.add('text-br-primary', 'font-semibold');
    likeCountEl.classList.remove('text-br-contentSecondary');
  } else {
    likeCountEl.classList.remove('text-br-primary', 'font-semibold');
    likeCountEl.classList.add('text-br-contentSecondary');
  }
}

// url에서 id 값 꺼내기
const params = new URLSearchParams(location.search);
const postId = params.get('_id');
console.log(postId);

if (!postId) {
  console.error('상세 페이지 id가 없습니다.');
  alert('해당 게시글을 찾을 수 없습니다.');
  // history.back();
} else {
  loadPost(postId);
}

let currentAuthorId: number;

async function loadPost(id: string) {
  const axios = getAxios();

  try {
    const { data } = await axios.get<PostResponse>(`/posts/${id}`);
    console.log(data);

    if (data.ok === 1) {
      const post = data.item;

      console.log('post.user 실제 값:', post.user);
      console.log('posts 응답 전체:', post);
      console.log(data.item);
      console.log('컨텐츠:', post.content);

      // 제목
      if (titleContents) {
        titleContents.textContent = post.title;
      }

      // 소제목
      if (subtitleContents) {
        subtitleContents.textContent = post.extra.subTitle;
      }

      // 작가 이름
      if (authorContents) {
        authorContents.textContent = post.user.name;
      }

      // 작성 날짜
      if (timeContents) {
        const created = new Date(post.createdAt);

        const year = created.getFullYear();
        const monthIndex = created.getMonth(); // 1월이 0부터 시작
        const day = created.getDate();

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const month = monthNames[monthIndex];

        const dayStr = day.toString().padStart(2, '0');

        timeContents.textContent = `${month}.${dayStr}.${year}`;
      }

      //썸네일
      if (post.image && post.image.length > 0 && post.image[0]) {
        thumbnailImg.src = post.image[0];
      } else {
        // 글에 이미지가 없을 때 → 기본 썸네일 사용
        thumbnailImg.src = '/img/sky.jpg';
      }

      // 메인 컨텐츠
      if (post.content.includes('<')) {
        // HTML 태그가 들어있으면 HTML 그대로 렌더링
        mainContents.innerHTML = post.content;
      } else {
        // 태그가 없고 그냥 텍스트만 렌더링
        mainContents.textContent = post.content;
        mainContents.style.whiteSpace = 'pre-line';
      }
      currentAuthorId = post.user._id;
      lookUpAuthor(currentAuthorId); // 게시글 작성자의 id

      // 게시글 좋아요 개수
      likeCount = post.likes ?? 0;
      likeCountEl.textContent = String(likeCount);

      // 로그인 되어 있을 때만 구독 상태 조회

      if (isLoggedIn()) {
        checkSubscribe(currentAuthorId);
        checkLike(post._id);
      }

      const writerLink = document.querySelector<HTMLAnchorElement>('.details-writer-img');
      if (writerLink && currentAuthorId) {
        writerLink.href = `/src/pages/author/AuthorPage.html?_id=${currentAuthorId}`;
      }

      const jobLink = document.querySelector<HTMLAnchorElement>('.details-writer-job');
      if (jobLink && currentAuthorId) {
        jobLink.href = `/src/pages/author/AuthorPage.html?_id=${currentAuthorId}`;
      }

      const explainLink = document.querySelector<HTMLAnchorElement>('.details-explain');
      if (explainLink && currentAuthorId) {
        explainLink.href = `/src/pages/author/AuthorPage.html?_id=${currentAuthorId}`;
      }

      if (subscribeCount && currentAuthorId) {
        subscribeCount.href = `/src/pages/author/AuthorPage.html?_id=${currentAuthorId}`;
      }

      const subsLink = document.querySelector<HTMLAnchorElement>('.details-subscribe');
      if (subsLink && currentAuthorId) {
        subsLink.href = `/src/pages/author/AuthorPage.html?_id=${currentAuthorId}`;
      }

      // 최근 본 글로 저장
      saveRecentPost(post);
    }
  } catch (err) {
    console.error(err);
  }
}

// 작가 정보 조회

async function lookUpAuthor(authorId: number) {
  const axios = getAxios();

  try {
    const { data } = await axios.get<UserResponse>(`/users/${authorId}`);
    console.log('작가 정보:', data);

    if (data.ok === 1) {
      const author = data.item;
      console.log('북마크 수:', data.item.bookmarkedBy.users);

      // 작가 이름
      if (writerName) {
        writerName.textContent = author.name;
      }

      // 직업
      if (writerJob) {
        const job = author.extra?.job?.trim?.();

        if (job) {
          writerJob.textContent = job;
        }
      }

      // 프로필 이미지
      if (writerImg && author.image) {
        writerImg.src = author.image;
      }

      // 작가 설명
      if (writerExplain) {
        const biography = author.extra?.biography?.trim?.();

        if (biography) {
          writerExplain.textContent = biography;
        }
      }

      // 구독자 수
      const authorBookmarked = author.bookmarkedBy.users;
      subscribeCount.textContent = String(authorBookmarked);
    }
  } catch (err) {
    console.error(err);
  }
}

// 로컬 스토리지에 저장
function saveRecentPost(post: PostItem) {
  const STORAGE_KEY = 'recentPosts';

  // 1) 썸네일 결정
  const thumbnail = post.image && post.image.length > 0 && post.image[0] ? post.image[0] : '/img/sky.jpg';

  // 2) 이번에 저장할 아이템
  const newItem: RecentPost = {
    id: post._id,
    title: post.title,
    thumbnail,
    authorId: post.user._id,
    username: post.user.name,
  };

  // 3) 기존 목록 불러오기
  let list: RecentPost[] = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      list = JSON.parse(raw) as RecentPost[];
    }
  } catch (e) {
    console.error('recentPosts 파싱 에러:', e);
    list = [];
  }

  // 4) 이미 같은 글이 있으면 제거 (중복 방지)
  list = list.filter((item) => item.id !== newItem.id);

  // 5) 맨 앞에 이번 글 추가
  list.unshift(newItem);

  // 6) 최대 10개까지만 유지 (원하는 개수로 바꿔도 됨)
  const MAX = 10;
  if (list.length > MAX) {
    list = list.slice(0, MAX);
  }

  // 7) 다시 localStorage에 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ----------------- 구독 기능 구현 ---------------------

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
      const current = Number(subscribeCount.textContent) || 0;
      subscribeCount.textContent = String(current + 1);

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
      const current = Number(subscribeCount.textContent) || 0;
      subscribeCount.textContent = String(current - 1);

      alert('작성자 구독을 취소합니다.');
    }
  } catch (err) {
    console.error('구독 취소 에러:', err);
  }
}

// -------------------- 좋아요 기능구현 ---------------------------

// 좋아요 목록 조회

async function checkLike(postId: number) {
  const axios = getAxios();
  const type: BookmarkType = 'post';

  try {
    const { data } = await axios.get<PostLikeListRes>(`bookmarks/${type}`, {
      params: {
        is_like: true, // 좋아요만 조회
      },
    });
    console.log('내가 좋아요한 게시글 목록:', data.item);

    if (data.ok === 1) {
      const likeList = data.item;

      // 이 게시글을 좋아요한 row id 찾기!
      const find = likeList.find((item) => item.post._id === postId);

      if (find) {
        liked = true;
        currentLikeId = find._id;
      }
      updateLikeButtonUI();
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------- 좋아요 버튼 토글 --------------------
likeButton.addEventListener('click', () => {
  console.log('좋아요 버튼 클릭됨!');

  if (!isLoggedIn()) {
    alert('로그인이 필요한 서비스입니다.');
    location.href = '/src/pages/login/SignIn.html';
    return;
  }

  // 이미 좋아요 상태라면 → 취소
  if (liked) {
    if (currentLikeId != null) {
      cancelLike(currentLikeId);
    }
  } else {
    addLike(Number(postId));
  }
});

// -------------------- 좋아요 추가 --------------------
async function addLike(postId: number) {
  const axios = getAxios();
  const type: BookmarkType = 'post';

  const body: BookmarkLikeReq = {
    target_id: postId,
    is_like: true,
  };

  try {
    console.log('좋아요 추가 보냄:', postId);
    const { data } = await axios.post<BookmarkCreateRes>(`/bookmarks/${type}`, body);
    console.log('좋아요 추가 응답:', data);

    if (data.ok === 1) {
      liked = true;

      const created = data.item;
      currentLikeId = created._id;

      updateLikeButtonUI();

      // 화면 좋아요 수 +1
      likeCount += 1;
      likeCountEl.textContent = String(likeCount);

      alert('해당 게시글에 좋아요를 눌렀습니다.');
    } else {
      console.error('좋아요 실패 응답ㅜ', data);
    }
  } catch (err) {
    console.error('좋아요 추가 에러:', err);
  }
}

// -------------------- 좋아요 취소 --------------------
async function cancelLike(likeId: number) {
  const axios = getAxios();

  try {
    const { data } = await axios.delete<BookmarkDeleteRes>(`/bookmarks/${likeId}`);
    console.log('좋아요 취소 응답:', data);

    if (data.ok === 1) {
      liked = false;
      updateLikeButtonUI();

      // 화면 좋아요 수 -1 (최소 0 보장)
      likeCount = Math.max(0, likeCount - 1);
      likeCountEl.textContent = String(likeCount);

      alert('해당 게시글에 좋아요를 취소했습니다.');
    } else {
      console.error('좋아요 취소 실패 응답ㅜ', data);
    }
  } catch (err) {
    console.error('좋아요 취소 에러:', err);
  }
}
