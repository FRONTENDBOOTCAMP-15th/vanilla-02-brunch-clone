// 1. 타입 정의 -------------------------------------------------

export interface UserInfo {
  _id: number;
  name: string;
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

// 요즘 뜨는 브런치 호출
// 2. fetch 함수 ------------------------------------------------

export async function fetchRecents(): Promise<PostsResponse> {
  try {
    const response = await fetch('https://fesp-api.koyeb.app/market/posts?type=brunch', {
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

// 3. DOM 생성 함수 ---------------------------------------------

function createBrunchCard(post: PostItem, index: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-start gap-5';

  wrapper.innerHTML = `
    <div class="text-[26px] font-bold text-black w-10 flex-shrink-0 flex items-center gap-[6px]">
      ${index + 1}
      <span class="text-[12px] text-[#ff0077] font-semibold">NEW</span>
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
        src="${post.image || '../../../public/Background.svg'}"
        alt="${post.title}" />
    </div>
  `;

  return wrapper;
}

// 4. API 호출 및 DOM 삽입 ---------------------------------------

(async () => {
  const res = await fetchRecents();

  if (res.ok === 1) {
    const container = document.querySelector('.brunch-container');
    if (!container) return;

    container.innerHTML = ''; // 기존 내용 제거

    res.item.forEach((post, i) => {
      if (i >= 10) return;
      const card = createBrunchCard(post, i);
      container.appendChild(card);
    });
  } else {
    console.log('로드 실패');
  }
})();
