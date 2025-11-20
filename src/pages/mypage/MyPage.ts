import { getAxios } from '../../utils/axios';
import type { ListRes, Bookmark, PostItem, RecentPost } from '../../utils/types';

//토큰이 있어야만 내 서랍 진입 가능 없으면 로그인페이지로 이동 //이건 home에서 처리해줄듯
//관심작가 - /bookmarks/user // item.user.name, item.user.image
//최근 글 - local에 저장할듯
//관심 목록 - /bookmarks/post // item.image item.title, item.user.name
//내가 작성한 글 - /posts/users
//로그아웃

const axios = getAxios();
// const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

// if (!token) {
//   alert('로그인이 필요한 서비스입니다.');
//   location.href = '../login/SignIn.html';
// }

//관심작가
async function getBookmarkUser() {
  try {
    const { data } = await axios.get<ListRes<Bookmark>>('/bookmarks/user');
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderBookmarkUser(users: Bookmark[]) {
  const result = users.map((user) => {
    return `
    <a href="/src/pages/author/AuthorPage.html?_id=${user.user?._id}">
            <figure class="flex flex-col w-20 items-center shrink-0">
              <img src="${user.user?.image}" alt="${user.user?.name}의 프로필 사진" class ="w-20 h-20 rounded-full object-cover border border-gray-200"/>
              <figcaption class="my-4 text-br-contentSecondary text-[13px]">${user.user?.name}</figcaption>
            </figure>
          </a>

    `;
  });
  const bookmarkUser = document.querySelector('#bookmark-user');
  if (bookmarkUser) {
    bookmarkUser.innerHTML = result.join('');
  }
}

const data = await getBookmarkUser();
if (data?.ok) {
  renderBookmarkUser(data.item);
}

//최근 본

function RecenterPosts() {
  const recentPosts = localStorage.getItem('recentPosts');
  const recentList: RecentPost[] = recentPosts ? JSON.parse(recentPosts) : [];
  // 1. 로컬 키 꺼내
  // 2.데이터 없을 때
  const result = recentList.map((recent) => {
    return `<a href="/src/pages/details/DetailsPage.html?_id=${recent.id}" class="flex flex-col items-center shrink-0">
            <img src="${recent.thumbnail}" alt="${recent.title}표지" class="w-[123px] h-[172px] mb-4" />
            <p class="text-xs mb-0.5">${recent.title}</p>
            <div class="flex gap-1">
              <i class="text-[13px] text-br-contentTertiary">by</i>
              <span class="text-[13px] text-br-contentSecondary">${recent.username}</span>
            </div>
          </a>
    `;
  });
  const container = document.querySelector('#recently');
  if (container) {
    container.innerHTML = result.join('');
  }
}
RecenterPosts();
//관심 글
async function getBookmarkPost() {
  try {
    const { data } = await axios.get<ListRes<Bookmark>>('/bookmarks/post');
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderBookmarkPost(posts: Bookmark[]) {
  const result = posts.map((post) => {
    return `
    <a href="/src/pages/details/DetailsPage.html?_id=${post.post?._id}" >
            <div class="flex flex-col items-center shrink-0 w-[123px]">
              <img src="${post.post?.image}" alt="${post.post?.title}표지" class="w-[123px] h-[172px] mb-4 object-cover" />
              <p class="text-xs mb-0.5 text-black text-center ">${post.post?.title}</p>
              <div class="flex gap-1">
                <i class="text-[13px] text-br-contentTertiary">by</i>
                <span class="text-[13px] text-br-contentSecondary">${post.post?.user.name}</span>
              </div>
            </div>
          </a>

    `;
  });
  const bookmarkPost = document.querySelector('#bookmark-post');
  if (bookmarkPost) {
    bookmarkPost.innerHTML = result.join('');
  }
}

const post = await getBookmarkPost();
if (post?.ok) {
  renderBookmarkPost(post.item);
}

//내 브런치
async function getMyPost() {
  try {
    const { data } = await axios.get<ListRes<PostItem>>(`/posts/users`, { params: { type: 'brunch' } });
    return data;
  } catch (err) {
    console.log(err);
  }
}

function renderMyPost(Myposts: PostItem[]) {
  const result = Myposts.slice(0, 5).map((Mypost) => {
    return `
    <a href="/src/pages/details/DetailsPage.html?_id=${Mypost._id}">
            <div class="border-t border-br-line py-3.5 px-[25px]">
              <h1 class="text-[17px]">${Mypost.title}</h1>
              <p class="mt-2 mb-[9px] text-br-contentSecondary text-xs">${Mypost.extra?.subTitle || ''}</p>
              <p class="text-br-contentSecondary text-xs">${Mypost.createdAt}</p>
            </div>
          </a>

    `;
  });
  const MyPost = document.querySelector('#post-user');
  if (MyPost) {
    MyPost.innerHTML = result.join('');
  }
}

const Minepost = await getMyPost();
if (Minepost?.ok) {
  renderMyPost(Minepost.item);
}

//로그아웃
const logout = document.getElementById('logout');

logout?.addEventListener('click', () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userid');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userid');
  alert('로그아웃 성공! 홈으로 이동합니다');
  location.href = '/index.html';
});
