import { getAxios } from '../../utils/axios';

async function getData() {
  const axios = getAxios();
  try {
    const { data } = await axios.get<UserPostList>('/posts/users/2');
    return data.item;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// function render(posts: UserPostItem[]) {
//   const listEl = document.getElementById('article-list');
//   listEl.innerHTML = '';

//   posts.forEach((post) => {
//     const item = `
//       <article class="border-b border-br-line py-5">
//         <a href="/article/${post.id}">
//           <div class="underline text-[13px] text-br-primary pb-[10px]">
//             ${post.category}
//           </div>
//           <h3 class="text-[17px] mt-[14px]">${post.title}</h3>
//           <p class="mt-5 text-[12px] text-br-detailsSubtitle">
//             ${post.subtitle}
//           </p>
//           <p class="mt-10 text-[12px] text-br-contentSecondary">
//             ${post.description}
//           </p>
//           <span class="block text-[12px] text-br-contentSecondary mt-[6px]">
//             댓글 ${post.comments} · ${post.date}
//           </span>
//         </a>
//       </article>
//     `;

//     listEl.insertAdjacentHTML('beforeend', item);
//   });
// }

// async function loadArticles() {
//   const posts = await getData();
//   render(posts);
// }

function convertToRenderItem(post: UserPost) {
  return {
    id: post._id,
    category: post.product?.name || '카테고리 없음',
    title: post.title,
    subtitle: post.content.slice(0, 30),
    description: post.content,
    comments: post.repliesCount,
    date: post.createdAt.slice(0, 10),
  };
}

async function loadArticles() {
  const posts = await getData();

  const renderItems = posts.map(convertToRenderItem);

  render(renderItems);
}

loadArticles();
