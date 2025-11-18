import { getAxios } from '../../utils/axios';
import type { uploadFileInfo } from '../../utils/types';
import type { fileUploadRes, postRes } from './WritingResponse';

const keyboardBtn = document.querySelector('.writing-keyboard') as HTMLButtonElement;
const titleInput = document.querySelector('#writingpage-title-input') as HTMLInputElement;

const keyboardOff = keyboardBtn!.querySelector('.writing-keyboard-off') as HTMLImageElement;
const keyboardOn = keyboardBtn!.querySelector('.writing-keyboard-on') as HTMLImageElement;

const pictureBtn = document.querySelector('.writing-picture') as HTMLButtonElement;
const imgInput = document.querySelector('#writing-image-input') as HTMLInputElement;

const contentsEditor = document.querySelector('#writingpage-contents-editor') as HTMLDivElement;

const postBtn = document.querySelector('.writing-registar') as HTMLButtonElement;
const contentDiv = document.querySelector('#writingpage-contents-editor') as HTMLDivElement;
const subtitleInput = document.querySelector('#writingpage-subtitle-input') as HTMLInputElement;

let status = false;

// 키보드 버튼 이벤트
keyboardBtn?.addEventListener('click', () => {
  status = !status;

  setKeyboardState(status);

  // 키보드 버튼 눌렀을 때 키보드 창의 유무 결정(title-input으로 focus됨)
  if (status) {
    titleInput!.focus();
  } else {
    titleInput!.blur();
  }
});

// 키보드 버튼 on 함수
function setKeyboardState(on: boolean) {
  // on이 true일 때만 status에 on의 값을 재할당
  if (on) {
    status = on;
  }
  keyboardBtn!.setAttribute('aria-pressed', String(on));

  keyboardOff!.classList.toggle('hidden', on); //on이 true일 때 on = true라서 무조건 hidden 속성 추가
  keyboardOn!.classList.toggle('hidden', !on); // on이 true일 때 on = false라서 무조건 hidden 속성 제거
}

const textFields = document.querySelectorAll('#writingpage-title-input, #writingpage-subtitle-input, #writingpage-contents-editor');
// input, textarea에 focus 됐을 때 keyboard-on 버튼으로 바뀜
textFields.forEach((element) => {
  element.addEventListener('focus', () => {
    setKeyboardState(true);
  });
});

// input, textarea에 focus 되지 않았을 때 keyboard-off 버튼으로 바뀜
textFields.forEach((element) => {
  element.addEventListener('blur', () => {
    setKeyboardState(false);
  });
});

// 사진 버튼 누르면 갤러리 열리도록 함

pictureBtn!.addEventListener('click', () => {
  // file 타입의 input을 클릭하지 않아도 사진 아이콘을 누르면 해당 요소가 강제 클릭됨
  imgInput!.click();
});

// 이미지 파일 업로드 API
/**
 *
 * @param {File} files -> files 변수는 File 형태의 객체인 값들을 여러 개 담고있는 배열이다.
 * files = [File{name: "a.png", size:1, type: "image/png", ...}, File{name: "b.png", size:2, type: "image/jpeg", ...}, ...]
 * @returns
 */
async function uploadImg(files: File[]) {
  const axios = getAxios();
  const formData = new FormData();

  // Request body 부분
  files.forEach((file) => {
    formData.append('attach', file); // {['attach', File1], ['attach', File2], ..} -> 내부 구조는 [key, value] 쌍 배열들의 리스트를 가진 FormData의 인스턴스
  });

  try {
    const { data } = await axios.post<fileUploadRes>('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // axio.ts파일에 기본으로 Content-Type이 application/json으로 되어 있어서 이 요청에선 바꿔줘야됨
      },
    });
    console.log('파일 업로드 응답 성공: ', data);
    return data;
  } catch (err) {
    console.log('오류 발생: ', err);
  }
}

let uploadedImgs: uploadFileInfo[] = []; // 업로드 된 이미지들을 담는 배열

imgInput.addEventListener('change', async () => {
  const files = Array.from(imgInput.files!);
  const res = await uploadImg(files); // await을 쓰지 않으면 res에는 Promise가 반환됨. awiat을 쓰면 res에는 Promise가 아닌 실제 data의 값이 반환됨

  if (!res) {
    return; // res가 undefined인 경우 걸러냄
  }

  if (res.ok === 1) {
    uploadedImgs = uploadedImgs.concat(res.item); // 업로드 시킬 때마다 업로드 된 이미지들 배열에 이어서 저장
    console.log(uploadedImgs);

    // 1) 눈에 보이는 에디터에 실제 이미지 DOM 추가
    res.item.forEach((file) => {
      const img = document.createElement('img');
      img.src = file.path;
      img.alt = file.name;
      img.className = 'max-w-full h-auto my-4'; // tailwind 임의 스타일

      contentsEditor?.appendChild(img);
    });
  } else {
    alert(res?.message); // 입력값 검증오류일 때 / 서버 에러일 때 메시지 다르게 띄우기
  }
});

// 게시글 등록 API

postBtn?.addEventListener('click', () => {
  uploadPost();
});

async function uploadPost() {
  const axios = getAxios();

  // 등록 취소 조건
  const title = titleInput.value.trim();
  const subtitle = subtitleInput.value.trim();
  const content = contentDiv.textContent.trim();

  if (!title) {
    alert('제목을 입력해주세요.');
    return;
  }

  if (title.length < 2) {
    alert('제목은 2글자 이상 입력해야 합니다.');
    return;
  }

  if (!subtitle) {
    alert('소제목을 입력해주세요.');
    return;
  }

  if (subtitle.length < 2) {
    alert('소제목은 2글자 이상 입력해야 합니다.');
    return;
  }

  if (!content) {
    alert('내용을 입력해주세요.');
    return;
  }
  if (content.length < 2) {
    alert('내용은 2글자 이상 입력해야 합니다.');
    return;
  }

  const body = {
    type: 'brunch',
    title: titleInput?.value,
    content: contentDiv?.textContent,
    extra: { subtitle: subtitleInput?.value },
    image: uploadedImgs.map((item) => item.path),
  };

  try {
    const { data } = await axios.post<postRes>('/posts', body);
    console.log(data);

    if (data.ok === 1) {
      alert('글이 등록되었습니다.');
      const postId = data.item._id;
      location.replace(`../details/DetailsPage.html?id=${postId}`);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    // console.log(err!.status);
  }
}
