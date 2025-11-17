// 1. 타입 정의 -------------------------------------------------
export interface UserInfo {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  loginType: string;
  image: string;
  extra: {
    job: string;
    biography: string;
    keyword: string[];
  };
  createdAt: string;
  updatedAt: string;
  posts: number; // 작성한 게시물 수
  bookmarkedBy: {
    users: number; // 북마크한 사용자 수
  };
  likedBy: {
    users: number; // 좋아요한 사용자 수
  };
  postViews: number; // 조회수
}

export interface ProductImage {
  url: string;
  name: string;
}

export interface ProductInfo {
  name: string;
  image: ProductImage;
}

export interface PostItem {
  _id: number;
  type: string;
  product_id: number;
  seller_id: number;
  user: UserInfo;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  product: ProductInfo;
  bookmarks: number;
  myBookmarkId: number;
  repliesCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  ok: number;
  item: PostItem[];
  pagination: Pagination;
}

export interface UsersResponse {
  ok: number;
  item: UserInfo[];
  pagination: Pagination;
}
// 3. DOM 생성 함수 ---------------------------------------------
// 요즘 뜨는 브런치
function createBrunchCard(post: PostItem, index: number): HTMLElement {
  const wrapper: HTMLDivElement = document.createElement('div');
  wrapper.className = 'flex items-start gap-5';

  wrapper.innerHTML = `
    <div class="text-[26px] font-bold text-black w-10 flex-shrink-0 flex items-center gap-[6px]">
      ${index + 1}      
    </div>

    <div class="flex-1">
      <h2 class="text-[18px] font-bold mb-[6px]">${post.title}</h2>
      <p class="text-[14px] text-[#999] mb-2">by ${post.user.name}</p>
      <p class="text-[14px] text-[#444] leading-[1.4] overflow-hidden text-ellipsis whitespace-nowrap max-w-[181px]">
        ${post.content}
      </p>
    </div>

    <div class="w-[80px] h-[112px] rounded shadow-[0_2px_5px_rgba(0,0,0,0.1)] overflow-hidden">
      <img class="w-full h-full object-cover block"
         src="${post.product?.image?.url || post.image || '../../../public/Background.svg'}"
        alt="${post.title}" />
    </div>
  `;

  return wrapper;
}

//구독자 급등 작가
function createWriterCard(post: any): HTMLElement {
  const card = document.createElement('div');
  card.className = 'text-center p-[30px_20px] border-r border-b border-[#eee]';
  /* 현재 db에 이미지 경로가 없음. 임시 이미지 사용
   * 회원가입 처리 후 db에 데이터가 들어가면 ${post.image}로 대체
   */
  const imageUrl = '../../../public/PeterImage.svg';

  card.innerHTML = `
      <img 
        src="${imageUrl}" 
        alt="${post.name || '작가'}" 
        class="w-[90px] h-[90px] rounded-full object-cover mb-[15px] inline-block"
      />

      <h3 class="text-[17px] font-semibold mt-[5px] mb-[3px]">
        ${post.name || '이름 없음'}
      </h3>

      <p class="text-[14px] text-[#999] mb-[10px]">
        ${post.extra?.job || '작가'}
      </p>

      <p class="text-[14px] text-[#444] leading-[1.4] max-w-[200px] mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
        ${post.extra?.biography || '소개글이 없습니다.'}
      </p>
  `;

  return card;
}

//오늘의 작가 dom 구현
// API 호출 타입 정의
async function fetchAuthorPosts(authorId: number): Promise<PostsResponse> {
  const url = `https://fesp-api.koyeb.app/market/posts?type=brunch&id=${authorId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'client-id': 'febc15-vanilla02-ecad',
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data: PostsResponse = await response.json();
    console.log(JSON.stringify(data.item[0], null, 2));
    return data;
  } catch (err) {
    console.error('작가 작품 가져오기 실패:', err);
    return {
      ok: 0,
      item: [],
      pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
    };
  }
}

// 단일 PostItem을 받아서 오늘의 작가 섹션 + 작품 목록 생성
async function renderTodayAuthorSection(post: UserInfo) {
  const container = document.querySelector('.today-author-container');
  if (!container) return;
  container.innerHTML = '';

  // 프로필 이미지
  //const profileImg = post.image ? `https://fesp-api.koyeb.app/${post.image}` : '../../../public/HappyBackground.svg';
  const profileImg = '../../../public/HappyBackground.svg';

  const section = document.createElement('div');
  section.className = 'p-5 bg-white';

  section.innerHTML = `
    <header class="mb-[25px]">
      <h3 class="text-[15px] font-bold text-[#00c192] mb-[5px]">오늘의 작가</h3>

      <div class="flex justify-between items-start mb-[3px]">
        <h1 class="text-[32px] font-bold text-[#333] leading-[1.2]">${post?.name || '익명'}</h1>
        <img class="w-[65px] h-[65px] rounded-full object-cover ml-[20px]" src="${profileImg}" alt="작가 ${post.name || '익명'} 프로필 사진" />
      </div>

      <p class="text-[14px] text-[#777] mb-[20px]">${post.extra?.job || '작가'}</p>
    </header>

    <p class="text-[15px] leading-[1.6] text-[#555] mb-[30px]">${post.extra?.biography?.slice(0, 70) + '...'}</p>

    <div class="flex flex-col gap-[15px] today-author-works"></div>
  `;

  container.appendChild(section);

  const worksArea = section.querySelector('.today-author-works');
  if (!worksArea) return;

  // 작가 작품 가져오기
  const authorPosts = await fetchAuthorPosts(post._id || 0);
  if (authorPosts.ok === 1) {
    authorPosts.item.forEach((p, idx) => {
      if (idx >= 2) return;
      const card = document.createElement('div');
      card.className = 'flex py-[15px] border-b border-[#eee] bg-[#f8f8f8] cursor-pointer';

      const imgUrl = p.product?.image?.url || '../../../public/HappyBackground.svg';

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

// fetch 함수 ------------------------------------------------

export async function fetchAPI(url: string): Promise<any> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'client-id': 'febc15-vanilla02-ecad',
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data: PostsResponse = await response.json();
    return data;
  } catch (error) {
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

// 4. API 호출 및 DOM 삽입 ---------------------------------------

(async () => {
  let postRes: PostsResponse;
  let userRes: UsersResponse;

  //요즘 뜨는 브런치
  let url: string = 'https://fesp-api.koyeb.app/market/posts?type=brunch';
  postRes = await fetchAPI(url);
  //console.log(res.item);
  //console.log(JSON.stringify(res.item[0], null, 2));
  if (postRes.ok === 1) {
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
  userRes = await fetchAPI(url);
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
  // 탑구독 작가 10 명 중에서 오늘 날짜와 회원번호 끝자리 같은 회원
  // 회원번호 끝자리가 같은 회원이 여러 명이명 순위가 높은 회원
  url = 'https://fesp-api.koyeb.app/market/users?sort={"bookmarkedBy.users": -1}';
  userRes = await fetchAPI(url);
  if (userRes.ok === 1) {
    console.log(JSON.stringify(userRes.item[0], null, 2));
    const date: Date = new Date();
    const day: string = String(date.getDate()).padStart(2, '0');
    const dayToNum: number = Number(day) % 10;
    for (let i: number = 0; i < userRes.item.length; i++) {
      if (i >= 10) break;
      if (i == dayToNum) {
        renderTodayAuthorSection(userRes.item[i]);
        break;
      }
    }
    renderTodayAuthorSection(userRes.item[0]);
  }
})();
