import axios from 'axios';
import type { PostItem, PostListResponse } from '../../utils/types';

// DOM 생성 함수 ---------------------------------------------
// 요즘 뜨는 브런치
function createBannerCard(post: PostItem): HTMLElement | null {
  //let postContent = removeImgTags(post.content).substring(0, 160);
  let srcImg: string = '';

  if (post.image && post.image.length > 0) {
    srcImg = post.image[0];
  }

  const wrapper: HTMLElement | null = document.getElementById('adv-container');
  if (wrapper) {
    wrapper.className = 'bg-[#F6F2E5]  h-[488px] min-w-[360px] flex flex-col items-center justify-center px-10 py-px';
    wrapper.innerHTML = `
       
    <div class="text-center ">
        
        <header class="mb-12">
            <h1 class="text-xl sm:text-4xl text-br-detailsContent">
                <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">${post.title}</a>
            </h1>
            <p class="text-lg opacity-75 italic mb-20 text-br-detailsContent mt-5">
                <a href="/src/pages/author/AuthorPage.html?_id=${post.user._id}">by ${post.user.name}</a>
            </p>
        </header>

        <div class="relative inline-block">
            <div class="w-[136px] h-[190px] bg-white rounded-lg shadow-xl overflow-hidden flex justify-center items-center">
                <a href="/src/pages/details/DetailsPage.html?_id=${post._id}">
                <img src="${srcImg}" 
                     alt="표지 이미지" 
                     class="w-full h-full object-fill m-0 p-0"> 
                </a>
            </div>           
            <div class="absolute top-0 right-[-20px] -translate-y-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                    응원
                </div>
        </div>
        
    </div>
    `;
    wrapper?.addEventListener('click', () => {
      //window.location.href = `/src/pages/details/DetailsPage.html?_id=${post._id}`;
    });
    return wrapper;
  }
  return wrapper;
}

// axios 이용 API 가져오기 함수 ------------------------------------------------
/*
export async function retrieveAPI(url: string): Promise<PostListResponse | APIError> {
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'client-id': 'febc15-vanilla02-ecad',
    },
  });
  if (response.data.ok == 1) {
    // Axios는 자동으로 JSON 변환을 해줌
    const data = response.data;
    return data.item;
  } else
    return {
      ok: 0,
      message: 'error: API failed',
    };
}
    */

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

function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // 이미지가 정상적으로 로드되면 true
    img.onerror = () => resolve(false); // 로드 실패 시 false
    img.src = url;
  });
}
// -------------------------------------------

(async () => {
  let postRes: PostListResponse;

  //광고 배너
  let url: string = 'https://fesp-api.koyeb.app/market/posts?type=brunch';
  postRes = (await retrieveAPI(url)) as PostListResponse;
  if (postRes.ok === 1) {
    const data = postRes.item as PostItem[];
    data.forEach(async (post) => {
      //console.log(JSON.stringify(post));
      // 이미지가 있는 포스트만 가져옴
      //최신 순으로 정렬(광고 사용료를 낸 작품)
      if (post._id == 19) {
        if (await checkImageUrl(post?.image?.[0])) {
            createBannerCard(post);
          return;
        }
      }
    });
  } else {
    console.log('API 로드 실패');
  }
})();
