import axios from 'axios';
import type { PostItem, PostListResponse, UserListResponse, UserInfo } from '../../utils/types';

/* utility 함수*/
// function removeImgTags(html: string): string {
//   return html.replace(/<img\b[^>]*?(?:\/>|>)/gi, '');
// }
function removeTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

function isWithinOneDay(dateStr: string) {
  // 'YYYY.MM.DD HH:MM:SS' → Date 객체로 변환
  const [datePart, timePart] = dateStr.split(' ');
  const [year, month, day] = datePart.split('.').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  const targetDate = new Date(year, month - 1, day, hour, minute, second); // month는 0~11
  const now = new Date();

  const diff = Math.abs(now.getTime() - targetDate.getTime()); // 밀리초 차이
  const oneDay = 1000 * 60 * 60 * 24; // 1일 밀리초

  return diff <= oneDay;
}

// 사용 예시
//console.log(isWithinOneDay("2025.11.22 00:27:08")); // true 또는 false

/*
function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // 이미지가 정상적으로 로드되면 true
    img.onerror = () => resolve(false); // 로드 실패 시 false
    img.src = url;
  });
}

function removeImgTags(html: string): string {
  return html.replace(/<img\b[^>]*?(?:\/>|>)/gi, '');
}
*/

function getValidImageUrl(imageUrl: any): string {
  //console.log(imageUrl);
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

// DOM 생성 함수 ---------------------------------------------
// 요즘 뜨는 브런치
function createBrunchCard(post: PostItem, index: number): HTMLElement {
  let postContent: string;
  if (window.innerWidth < 400 && post.image) {
    postContent = removeTags(post.content).substring(0, 50);
  } else postContent = removeTags(post.content);

  //console.log(post.createdAt);
  //console.log(isWithinOneDay('2025.11.20 00:27:08'));
  let srcImg: string = '';

  if (post.image && post.image.length > 0) {
    srcImg = getValidImageUrl(post.image[0]);
  }

  const wrapper: HTMLLIElement = document.createElement('li');
  wrapper.className = 'flex items-start  cursor-pointer  border-b border-gray-100 pb-4 pt-4 last:border-b-0 last:pb-0 last:pt-4';
  wrapper.addEventListener('click', () => {
    window.location.href = `/src/pages/details/DetailsPage.html?_id=${post._id}`;
  });

  // 이미지 있는 경우
  if (srcImg && srcImg.includes('http')) {
    wrapper.innerHTML = `
      <div id="rank-${index + 1}" class="text-[26px] font-normal text-color-br-primary
            flex flex-col justify-center items-center pr-[15px] pl-[7px]">
        ${index + 1}
      </div>

      <div class="flex-1 ml-2">
        <h2 class="text-[18px] font-normal mb-[6px]">${post.title}</h2>
        <div class="text-[14px] text-br-contentSecondary mb-2 flex items-center gap-2">
        <p class="italic text-br-contentTertiary">by</p>
        <p> ${post.user.name}</p> </div>
        

        <p class="text-[13px] font-light text-br-contentSecondary leading-[1.4] text-ellipsis whitespace-normal pt-5 overflow-hidden text-ellipsis line-clamp-2 pr-[17px]">
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
    <div id="rank-${index + 1}" class="text-[26px] font-normal text-black w-10 flex-shrink-0 flex flex-col items-center pl-[7px]">
      <span>${index + 1}</span>
    </div>

    <div class="flex-1 ml-2">
      <h2 class="text-[18px] font-normal mb-[6px]">${post.title}</h2>
      <div class="text-[14px] text-br-contentSecondary mb-2 flex items-center gap-2">
        <p class="italic text-br-contentTertiary">by</p>
        <p> ${post.user.name}</p>
      </div>

      <p class="text-[13px] pt-5 font-light text-br-contentSecondary leading-[1.4] overflow-hidden text-ellipsis line-clamp-2 ">
        ${postContent}
      </p>
    </div>
  `;
  }
  // wrapper 내부에서 안전하게 요소 선택
  const rankEl = wrapper.querySelector(`#rank-${index + 1}`);
  if (rankEl && isWithinOneDay(post.createdAt)) {
    const imgEl = document.createElement('img');
    imgEl.src = '/icon/new-line.svg';
    imgEl.className = 'w-6 h-6 mt-1'; // w-6=24px, h-6=24px, mt-1=위쪽 마진 4px
    imgEl.style.width = '24px';
    imgEl.style.height = '24px';
    imgEl.style.marginLeft = '4px';
    rankEl.appendChild(imgEl);
  }

  return wrapper;
}

//구독 급등 작가
function createWriterCard(post: any): HTMLElement {
  const card = document.createElement('div');
  card.addEventListener('click', () => {
    window.location.href = `./src/pages/author/AuthorPage.html?_id=${post._id}`;
  });
  card.className = 'cursor-pointer text-center p-[30px_20px] border-r border-b border-br-contentTertiary even:border-r-0 nth-3:border-b-0 nth-4:border-b-0';
  /* 현재 db에 이미지 경로가 없음. 임시 이미지 사용
   * 회원가입 처리 후 db에 데이터가 들어가면 ${post.image}로 대체
   */
  const srcImg = getValidImageUrl(post.image);
  card.innerHTML = `    
      <a href="./src/pages/author/AuthorPage.html?_id=${post._id}">
      <img 
        src="${srcImg}"
        onerror="this.onerror=null; this.src='/img/NoFaceImage.png';" 
        alt='회원 이미지'}" 
        class="w-[90px] h-[90px] rounded-full object-cover mb-[15px] inline-block cursor-pointer border border-gray-300"
      />
      </a>

      <h3 class="text-[17px] font-normal mt-[5px] mb-[3px]">
        ${post.name || '이름 없음'}
      </h3>

      <p class="text-[14px] text-[#999] mb-[10px]">
        ${post.extra?.job || '작가'}
      </p>

      <p class="text-[14px] text-bg-contentPrimary leading-[1.4] max-w-[200px] mx-auto overflow-hidden  whitespace-nowrap">
        ${post.extra?.biography || '소개글이 없습니다.'}
      </p>      
  `;

  return card;
}

//오늘의 작가 dom 구현
export async function fetchAuthorPosts(authorId: number): Promise<PostItem[] | undefined> {
  const url = `https://fesp-api.koyeb.app/market/posts?type=brunch`;

  const response = await axios.get<PostListResponse>(url, {
    headers: {
      'Content-Type': 'application/json',
      'client-id': 'febc15-vanilla02-ecad',
    },
  });
  if (response.data.ok === 1) {
    const data: PostItem[] = response.data.item;

    // user._id가 authorId와 일치하는 게시물만 필터링
    const filteredItems = data.filter((post) => post.user._id === authorId);

    // bookData 생성
    /*
      const bookData: PostListResponse = {
        ok: 1,
        item: filteredItems,
        pagination: {
          page: 1,
          limit: filteredItems.length,
          total: filteredItems.length,
          totalPages: 1,
        },
      };
      */

    //console.log(JSON.stringify(bookData.item[0], null, 2));

    return filteredItems;
  }
}

// 단일 PostItem을 받아서 오늘의 작가 섹션 + 작품 목록 생성
async function renderTodayAuthorSection(post: UserInfo) {
  const container = document.querySelector('.today-author-container');
  if (!container) return;

  const srcImg = getValidImageUrl(post.image);

  container.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'p-[25px] bg-white';
  //img가 없을 때는 <img> 태그를 넣지 않음
  section.innerHTML = `
  <div class="flex items-start justify-between p-0  h-[100px]">
  
  <div class="flex flex-col">
    
    <div class="text-br-primary text-sm font-semibold">오늘의 작가</div>
    
    <div class="inline-block">
      <h3 class="text-3xl font-semibold text-bg-primary">${post?.name || '익명'}</h3>
    </div>    
    <div class="w-full pb-1 text-sm text-br-contentSecondary">작가</div>
  </div>
  
  <div class="flex-shrink-0 ml-4 h-full">
  <a href="/src/pages/author/AuthorPage.html?_id=${post._id}">
   <img class="rounded-full object-cover h-full border border-gray-300" 
          src="${srcImg}"           
          alt="프로필 사진" />
    </a>
  </div>
</div>
    <p class="text-[15px] leading-[1.6] text-br-detailsSubtitle mt-2 mb-[30px]">${post.extra?.biography || '소개글이 없습니다'}</p>
    <div class="flex flex-col gap-[15px] today-author-works"></div>
  `;

  container.appendChild(section);

  const worksArea = section.querySelector('.today-author-works');
  if (!worksArea) return;

  // 작가 작품 가져오기
  const authorPosts: PostItem[] | undefined = await fetchAuthorPosts(post._id || 0);

  authorPosts?.forEach((p, idx) => {
    if (idx >= 2) return;
    const card = document.createElement('div');
    card.addEventListener('click', () => {
      window.location.href = `/src/pages/details/DetailsPage.html?_id=${p._id}`;
    });
    card.className = 'flex py-[15px] border-b border-[#eee] bg-br-contentsBg cursor-pointer ';

    const imgUrl = p?.image?.[0] || '/img/sky.jpg';

    card.innerHTML = `
        <div class="relative flex-shrink-0 px-4">
          <img class="object-cover block relative w-[60px] h-[85px]" src="${imgUrl}" alt="${p.title} 표지" />
          ${
            idx === 0
              ? `
            <span class="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-normal text-white bg-br-contentPrimary whitespace-nowrap rounded-md" 
                  style="bottom: -10px; z-index: 10;"> 
              최신작
            </span>
            `
              : ''
          }
        </div>
        <div class="flex flex-col justify-center">
          <h2 class="text-[16px] font-normal text-br-contentPrimary mb-[8px]">${p.title}</h2>
          <p class="text-[14px] text-[#666] leading-[1.5]">${p.content?.slice(0, 45) + '...'}</p>
        </div>
      `;

    worksArea.appendChild(card);
  });
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
  postRes = (await retrieveAPI(url)) as PostListResponse;
  if (postRes.ok === 1) {
    const container = document.querySelector('.brunch-container');
    if (!container) return;

    container.innerHTML = ''; // 기존 내용 제거

    const data = postRes.item as PostItem[];

    //구독한 사용자가 많은 순으로 정렬
    data.sort((a, b) => b.likes - a.likes);

    data.forEach((post, i) => {
      //console.log(JSON.stringify(post));
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
  //console.log(userRes);
  if (userRes.ok === 1) {
    const date: Date = new Date();
    const day: string = String(date.getDate()).padStart(2, '0');
    const dayToNum: number = Number(day) % 10;
    const data = userRes.item as UserInfo[];
    data.forEach((user) => {
      for (let i: number = 0; i < data.length; i++) {
        if (i >= 10) break;
        // 탑구독 작가 10 명 중에서 오늘 날짜와 회원번호 끝자리가 같은 회원
        // 회원번호 끝자리가 같은 회원이 여러 명이명 순위가 높은 회원
        if (user._id % 10 == dayToNum) {
          renderTodayAuthorSection(user);
          break;
        } else renderTodayAuthorSection(data[0]);
      }
    });
  }
})();
