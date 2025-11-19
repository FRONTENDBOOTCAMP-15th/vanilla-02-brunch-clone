import { getAxios } from '../../utils/axios';
import type { PostResponse, UserResponse } from '../../utils/types';

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

// 좋아요 버튼

// 초기 좋아요 개수 (DOM에 적힌 숫자 기준)
let likeCount = Number(likeCountEl.textContent) || 0;

// 현재 이 사용자가 좋아요를 누른 상태인지 여부
let liked = false;

likeButton.addEventListener('click', () => {
  liked = !liked;

  likeButton.setAttribute('aria-pressed', String(liked));

  if (liked) {
    likeCount += 1; // 좋아요 누름
  } else {
    likeCount -= 1; // 좋아요 취소
  }

  // 화면에 숫자 반영
  likeCountEl.textContent = String(likeCount);
});

// url에서 id 값 꺼내기
const params = new URLSearchParams(location.search);
const postId = params.get('id');

if (!postId) {
  console.error('상세 페이지 id가 없습니다.');
  alert('해당 게시글을 찾을 수 없습니다.');
  // history.back();
} else {
  loadPost(postId);
}

async function loadPost(id: string) {
  const axios = getAxios();

  try {
    const { data } = await axios.get<PostResponse>(`/posts/${id}`);
    console.log(data);

    if (data.ok === 1) {
      const post = data.item;
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
      if (post.image) {
        thumbnailImg.src = post.image[0];
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
      lookUpAuthor(post.user._id);
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
        writerJob.textContent = author.extra.job;
      }

      // 프로필 이미지
      if (writerImg && author.image) {
        writerImg.src = author.image;
      }

      // 작가 설명
      if (writerExplain) {
        writerExplain.textContent = author.extra.biography;
      }
    }
  } catch (err) {
    console.error(err);
  }
}
