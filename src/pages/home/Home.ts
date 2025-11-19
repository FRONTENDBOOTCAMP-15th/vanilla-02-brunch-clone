import axios from 'axios';
import type { PostItem, PostListResponse, UserListResponse, UserInfo } from '../../utils/types';

function removeImgTags(html: string): string {
  return html.replace(/<img\b[^>]*?(?:\/>|>)/gi, '');
}

// DOM 생성 함수 ---------------------------------------------
// 요즘 뜨는 브런치
function createBrunchCard(post: PostItem, index: number): HTMLElement {
  let postContent = removeImgTags(post.content).substring(0, 160);
  let srcImg: string = '';

  if (post.image && post.image.length > 0) {
    srcImg = post.image[0];
  }

  const wrapper: HTMLDivElement = document.createElement('div');
  wrapper.className = 'flex items-start gap-5 cursor-pointer min-w-[360px]';
  wrapper.addEventListener('click', () => {
    window.location.href = `./src/pages/details/DetailsPage.html?_id=${post._id}`;
  });

  // 이미지 있는 경우
  if (srcImg && srcImg.includes('http')) {
    wrapper.innerHTML = `
      <div class="text-[26px] font-bold text-black w-10 flex-shrink-0 flex items-center">
        ${index + 1}
      </div>

      <div class="flex-1">
        <h2 class="text-[18px] font-bold mb-[6px]">${post.title}</h2>
        <p class="text-[14px] text-[#999] mb-2">by ${post.user.name}</p>

        <p class="text-[14px] text-[#444] leading-[1.4] text-ellipsis whitespace-normal ">
          ${postContent}
        </p>
      </div>

      <div class="w-[80px] h-[112px] rounded shadow-[0_2px_5px_rgba(0,0,0,0.1)] flex-shrink-0">
        <img class="w-full h-full object-cover block"
             src="${srcImg}"
             alt="${post.title}" />
      </div>
    `;
  }

  // 이미지 없는 경우 (텍스트 전체 폭)
  else {
    wrapper.innerHTML = `
      <div class="text-[26px] font-bold text-black w-10 flex-shrink-0 flex items-center">
        ${index + 1}
      </div>

      <div class="flex-1">
        <h2 class="text-[18px] font-bold mb-[6px]">${post.title}</h2>
        <p class="text-[14px] text-[#999] mb-2">by ${post.user.name}</p>

        <!-- 텍스트가 오른쪽 전체 폭 사용 -->
        <p class="text-[14px] text-[#444] leading-[1.4] overflow-hidden text-ellipsis line-clamp-2">
          ${postContent}
        </p>
      </div>
    `;
  }

  return wrapper;
}

//구독자 급등 작가
function createWriterCard(post: any): HTMLElement {
  const card = document.createElement('div');
  card.addEventListener('click', () => {
    window.location.href = `./src/pages/author/AuthorPage.html?_id=${post._id}`;
  });
  card.className = 'cursor-pointer text-center p-[30px_20px] border-r border-b border-[#eee]';
  /* 현재 db에 이미지 경로가 없음. 임시 이미지 사용
   * 회원가입 처리 후 db에 데이터가 들어가면 ${post.image}로 대체
   */
  const srcImg = getValidImageUrl(post.image);
  card.innerHTML = `    
      <a href="./src/pages/author/AuthorPage.html?_id=${post._id}">
      <img 
        src="${srcImg}"
        onerror="this.onerror=null; this.src='/img/NoFaceImage.png';" 
        alt="${post.name || '작가'}" 
        class="w-[90px] h-[90px] rounded-full object-cover mb-[15px] inline-block cursor-pointer"
      />
      </a>

      <h3 class="text-[17px] font-semibold mt-[5px] mb-[3px]">
        ${post.name || '이름 없음'}
      </h3>

      <p class="text-[14px] text-[#999] mb-[10px]">
        ${post.extra?.job || '작가'}
      </p>

      <p class="text-[14px] text-[#444] leading-[1.4] max-w-[200px] mx-auto overflow-hidden  whitespace-nowrap">
        ${post.extra?.biography || '소개글이 없습니다.'}
      </p>      
  `;

  return card;
}

//오늘의 작가 dom 구현
export async function fetchAuthorPosts(authorId: number): Promise<PostListResponse | undefined> {
  const url = `https://fesp-api.koyeb.app/market/posts?type=brunch&_id=${authorId}`;

  try {
    const response = await axios.get<PostListResponse>(url, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': 'febc15-vanilla02-ecad',
      },
    });
    if (response.data.ok === 1) {
      const data: PostListResponse = response.data;

      // user._id가 authorId와 일치하는 게시물만 필터링
      const filteredItems = data.item.filter((post) => post.user._id === authorId);

      // bookData 생성
      const bookData: PostListResponse = {
        ok: data.ok,
        item: filteredItems,
        pagination: {
          page: 1,
          limit: filteredItems.length,
          total: filteredItems.length,
          totalPages: 1,
        },
      };

      console.log(JSON.stringify(bookData.item[0], null, 2));

      return bookData;
    }
  } catch (err: any) {
    console.error('작가 작품 가져오기 실패:', err);

    return {
      ok: 0,
      message: '',
    };
  }
}

function getValidImageUrl(imageUrl: any): string {
  const fallback = '/img/NoFaceImage.png';

  // null, undefined, 객체, 숫자 등 문자열이 아니면 바로 fallback
  if (typeof imageUrl !== 'string') {
    return fallback;
  }

  // 빈 문자열
  if (!imageUrl.trim()) {
    return fallback;
  }

  // http 또는 https 확인
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  return fallback;
}

// 단일 PostItem을 받아서 오늘의 작가 섹션 + 작품 목록 생성
async function renderTodayAuthorSection(post: UserInfo) {
  console.log(JSON.stringify(post));
  const container = document.querySelector('.today-author-container');
  if (!container) return;

  const srcImg = getValidImageUrl(post.image);

  container.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'p-5 bg-white';
  //img가 없을 때는 <img> 태그를 넣지 않음
  section.innerHTML = `
    <header class="mb-[25px]">
      <h3 class="text-[15px] font-bold text-[#00c192] mb-[5px]">오늘의 작가</h3>

      <div class="flex justify-between items-start mb-[3px]">
        <h1 class="text-[32px] font-bold text-[#333] leading-[1.2]">${post?.name || '익명'}</h1>
        <a href="./src/pages/author/AuthorPage.html?_id=${post._id}"><img class="w-[65px] h-[65px] rounded-full object-cover ml-[20px]" 
          src="${srcImg}"           
          alt="프로필 사진" />
        </a>
      </div>

      <p class="text-[14px] text-[#777] mb-[20px]">${post.extra?.job || '작가'}</p>
    </header>
    <p class="text-[15px] leading-[1.6] text-[#555] mb-[30px]">${post.extra?.biography || '소개글이 없습니다'}</p>
    <div class="flex flex-col gap-[15px] today-author-works"></div>
  `;

  container.appendChild(section);

  const worksArea = section.querySelector('.today-author-works');
  if (!worksArea) return;

  // 작가 작품 가져오기
  const authorPosts: PostListResponse | undefined = await fetchAuthorPosts(post._id || 0);
  if (authorPosts?.ok === 1) {
    authorPosts.item.forEach((p, idx) => {
      if (idx >= 2) return;
      const card = document.createElement('div');
      card.addEventListener('click', () => {
        window.location.href = `./src/pages/details/detailspage?_id=${post._id}`;
      });
      card.className = 'flex py-[15px] border-b border-[#eee] bg-[#f8f8f8] cursor-pointer';

      const imgUrl = p.image || '/img/NoBookImage.png';

      card.innerHTML = `
        <div class="relative flex-shrink-0 w-[80px] h-[110px] mr-[20px] shadow-md">
          <img class="w-full h-full mx-6 object-cover block" src="${imgUrl}" alt="${p.title} 표지" />
          ${idx === 0 ? `<span class="absolute bottom-0 left-0 px-[8px] py-[4px] text-[11px] font-bold text-white bg-[#333]">최신작</span>` : ''}
        </div>
        <div class="flex flex-col px-6 justify-center">
          <h2 class="text-[16px] font-bold text-[#333] mb-[8px]">${p.title}</h2>
          <p class="text-[14px] text-[#666] leading-[1.5]">${p.content?.slice(0, 45) + '...'}</p>
        </div>
      `;

      worksArea.appendChild(card);
    });
  }
}

// axios 이용 API 가져오기 함수 ------------------------------------------------

export async function retrieveAPI(url: string): Promise<any> {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'client-id': 'febc15-vanilla02-ecad',
      },
    });

    // Axios는 자동으로 JSON 변환을 해줌
    const data: PostListResponse = response.data;
    return data;
  } catch (error: any) {
    console.error('POST 목록 가져오기 실패:', error);

    return {
      ok: 0,
      item: [],
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// -------------------------------------------

(async () => {
  let postRes: PostListResponse;
  let userRes: UserListResponse;

  //요즘 뜨는 브런치
  let url: string = 'https://fesp-api.koyeb.app/market/posts?type=brunch';
  postRes = await retrieveAPI(url);
  if (postRes.ok === 1) {
    //console.log(JSON.stringify(postRes.item[3]));
    //console.log(JSON.stringify(postRes.item[4]));
    const container = document.querySelector('.brunch-container');
    if (!container) return;

    container.innerHTML = ''; // 기존 내용 제거

    postRes.item.forEach((post, i) => {
      if (i >= 10) return;
      const card = createBrunchCard(post, i);
      container.appendChild(card);
    });
  } else {
    console.log('로드 실패');
  }
  // 구독자(TOP 구독) 급등 작가
  url = 'https://fesp-api.koyeb.app/market/users?sort={"bookmarkedBy.users": -1}';
  userRes = await retrieveAPI(url);
  if (userRes.ok === 1) {
    const container = document.querySelector('.top-author-container');
    if (!container) return;
    container.innerHTML = ''; // 기존 내용 제거
    userRes.item.forEach((post, i) => {
      if (i >= 4) return;
      const card = createWriterCard(post);
      container.appendChild(card);
    });
  } else {
    console.log('로드 실패');
  }
  //오늘의 작가
  // 오늘 날짜와 회원번호를 매핑
  url = 'https://fesp-api.koyeb.app/market/users?sort={"bookmarkedBy.users": -1}';
  userRes = (await retrieveAPI(url)) as UserListResponse;
  if (userRes.ok === 1) {
    const date: Date = new Date();
    const day: string = String(date.getDate()).padStart(2, '0');
    const dayToNum: number = Number(day) % 10;
    for (let i: number = 0; i < userRes.item.length; i++) {
      if (i >= 10) break;
      // 탑구독 작가 10 명 중에서 오늘 날짜와 회원번호 끝자리 같은 회원
      // 회원번호 끝자리가 같은 회원이 여러 명이명 순위가 높은 회원
      if (userRes.item[i]._id == dayToNum) {
        console.log(JSON.stringify(userRes.item[i], null, 2));
        renderTodayAuthorSection(userRes.item[i]);
        break;
      }
    }
    //renderTodayAuthorSection(userRes.item[0]);
  }
})();
