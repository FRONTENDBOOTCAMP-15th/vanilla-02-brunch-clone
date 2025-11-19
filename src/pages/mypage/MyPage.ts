import { getAxios } from '../../utils/axios';
import type { ListRes, Bookmark } from '../../utils/types';

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
    <a href="../details/DetailsPage.html?_id=${post.post?._id}" >
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
