import axios from 'axios';
import type { PostItem, PostListResponse, APIError } from '../../utils/types';

function removeImgTags(html: string): string {
  return html.replace(/<img\b[^>]*?(?:\/>|>)/gi, '');
}

// DOM 생성 함수 ---------------------------------------------
// 요즘 뜨는 브런치
function createBannerCard(post: PostItem, index: number): HTMLElement | null {
  let postContent = removeImgTags(post.content).substring(0, 160);
  let srcImg: string = '';

  if (post.image && post.image.length > 0) {
    srcImg = post.image[0];
  }

  const wrapper: HTMLElement | null = document.getElementById('adv-container');
  if (wrapper) {
    wrapper.className = 'bg-[#8D4E8E]  h-[488px] min-w-[360px] p-8 flex flex-col items-center justify overflow-hidden';
    wrapper.innerHTML = `
        <div class="relative max-w-lg w-full">       

        <h1 class="text-white text-5xl font-light mb-2 text-center tracking-wide">
            ${post.title}
        </h1>

        <p class="text-white text-lg font-light opacity-75 mb-10 text-center italic">
            by ${post.user.name}
        </p>

        <div class="w-full relative pt-[100%]">
            <img 
                src="${srcImg}"
                alt="책 표지 이미지" 
                class="absolute top-0 object-cover shadow-2xl rounded-lg"
            >
                <span class="absolute top-0 right-0 -mr-4 -mt-4 transform translate-x-1/4 translate-y-1/4 z-10">
                <div class="bg-blue-500 text-white text-sm font-semibold rounded-full px-3 py-1 shadow-lg border-2 border-white">
                    응원
                </div>
            </span>

            <div class="absolute h-full top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-2 shadow-xl border border-gray-200 w-[50%]">
                <p class="flex justify-center text-2xl mt-4 font-normal text-gray-800 ">
                    ${post.title}
                </p>
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
    //최신 순으로 정렬(광고 사용료를 낸 작품)
    //data.sort((a, b) => b.likes - a.likes);

    data.forEach(async (post, i) => {
      //console.log(JSON.stringify(post));
      // 이미지가 있는 포스트만 가져옴
      // 성공하면 리턴
      if (await checkImageUrl(post?.image?.[0])) {
        const card = createBannerCard(post, i);
        return;
      }
    });
  } else {
    console.log('API 로드 실패');
  }
})();
