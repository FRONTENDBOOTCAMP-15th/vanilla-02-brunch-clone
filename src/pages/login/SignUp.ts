//중복확인 버튼 클릭이벤트 연결
//비밀번호 보기/숨기기 토글 구현
//비밀번호 일치 확인 구현
// form -> submit axios로 보내기

import { AxiosError } from 'axios';
import { getAxios } from '../../utils/axios';

const axios = getAxios();
let NicknameVerified = false;
let EmailVerified = false;

// html 요소
const nickname = document.getElementById('signup-nickname') as HTMLInputElement;
const signupEmail = document.getElementById('signup-email') as HTMLInputElement;
const signupPassword = document.getElementById('signup-pwd') as HTMLInputElement;
const passwordCheck = document.getElementById('signup-check-pwd') as HTMLInputElement;
const signupForm = document.getElementById('signup-form') as HTMLFormElement;

const nicknameCheckBtn = document.getElementById('nickname-check-btn') as HTMLButtonElement;
const emailCheckBtn = document.getElementById('email-check-btn') as HTMLButtonElement;

const iconEyeBtn1 = document.getElementById('signup-icon-eye') as HTMLButtonElement;
const iconEyeBtn2 = document.getElementById('signup-icon-eye2') as HTMLButtonElement;

const nicknameMessage = document.getElementById('nickname-message') as HTMLParagraphElement;
const emailMessage = document.getElementById('email-message') as HTMLParagraphElement;
const passwordCheckMessage = document.getElementById('pwd-message') as HTMLParagraphElement;

//별명 중복 버튼
nicknameCheckBtn.addEventListener('click', checkNickname);

async function checkNickname() {
  const nicknameValue = nickname.value;
  if (nicknameValue === '') {
    nicknameMessage.textContent = '별명을 입력해주세요.';
    NicknameVerified = false;
    return;
  }
  try {
    const { data } = await axios.get('/users/name', {
      params: {
        name: nicknameValue,
      },
    });
    if (data.ok === 1) {
      nicknameMessage.textContent = '사용 가능한 별명입니다.';
      NicknameVerified = true;
      return;
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      nicknameMessage.textContent = err.response?.data?.message || '서버 오류입니다.';
      NicknameVerified = false;
      return;
    }
  }
}

//이메일 중복 버튼
emailCheckBtn.addEventListener('click', checkEmail);

async function checkEmail() {
  const emailValue = signupEmail.value;
  if (emailValue === '') {
    emailMessage.textContent = '이메일을 입력해주세요.';
    EmailVerified = false;
    return;
  }
  if (!emailValue.includes('@')) {
    emailMessage.textContent = '올바른 이메일 형식이 아닙니다.';
    EmailVerified = false;
    return;
  }
  try {
    const { data } = await axios.get('/users/email', {
      params: {
        email: emailValue,
      },
    });
    if (data.ok === 1) {
      EmailVerified = true;
      return (emailMessage.textContent = '사용 가능한 이메일입니다.');
    } else {
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      EmailVerified = false;
      return (emailMessage.textContent = err.response?.data?.message || '서버 오류입니다.');
    }
  }
}

//비밀번호 숨김, 보이기 토글
iconEyeBtn1.addEventListener('click', () => {
  const Password = signupPassword.type === 'password';
  if (Password) {
    signupPassword.type = 'text';
    iconEyeBtn1.setAttribute('aria-label', '비밀번호 숨기기');
    iconEyeBtn1.querySelector('img[src*="LoginOpenEye.svg"]')?.classList.add('hidden');
    iconEyeBtn1.querySelector('img[src*="LoginCloseEye.svg"]')?.classList.remove('hidden');
  } else {
    signupPassword.type = 'password';
    iconEyeBtn1.setAttribute('aria-label', '비밀번호 보이기');
    iconEyeBtn1.querySelector('img[src*="LoginOpenEye.svg"]')?.classList.remove('hidden');
    iconEyeBtn1.querySelector('img[src*="LoginCloseEye.svg"]')?.classList.add('hidden');
  }
});

//비밀번호 확인 숨김, 보이기 토글
iconEyeBtn2.addEventListener('click', () => {
  const PasswordCheck = passwordCheck.type === 'password';
  if (PasswordCheck) {
    passwordCheck.type = 'text';
    iconEyeBtn2.setAttribute('aria-label', '비밀번호 숨기기');
    iconEyeBtn2.querySelector('img[src*="LoginOpenEye.svg"]')?.classList.add('hidden');
    iconEyeBtn2.querySelector('img[src*="LoginCloseEye.svg"]')?.classList.remove('hidden');
  } else {
    passwordCheck.type = 'password';
    iconEyeBtn2.setAttribute('aria-label', '비밀번호 보이기');
    iconEyeBtn2.querySelector('img[src*="LoginOpenEye.svg"]')?.classList.remove('hidden');
    iconEyeBtn2.querySelector('img[src*="LoginCloseEye.svg"]')?.classList.add('hidden');
  }
});

//비밀번호 일치,불일치
function PasswordCheckLive() {
  const pwd1 = signupPassword.value;
  const pwd2 = passwordCheck.value;

  if (pwd1.length > 0 && (pwd1.length < 8 || pwd1.length > 16)) {
    return (passwordCheckMessage.textContent = '비밀번호는 8~16자여야 합니다.');
  }

  if (pwd1 === pwd2) {
    passwordCheckMessage.textContent = '비밀번호가 일치합니다.';
    passwordCheckMessage.classList.remove('text-br-warning');
    passwordCheckMessage.classList.add('text-br-primary');
  } else {
    passwordCheckMessage.textContent = '비밀번호가 일치하지 않습니다.';
  }
}

passwordCheck.addEventListener('input', PasswordCheckLive);

//회원가입 버튼
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (NicknameVerified == false) {
    alert('별명 중복 확인을 해주세요.');
    return;
  }

  if (EmailVerified == false) {
    alert('이메일 중복 확인을 해주세요.');
    return;
  }
  if (signupPassword.value !== passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const signup = {
    email: signupEmail.value,
    name: nickname.value,
    password: signupPassword.value,
    phone: '01011112222',
    address: '서울시 강남구 역삼동 123',
    type: 'user',
    image: 'https://res.cloudinary.com/ddedslqvv/image/upload/v1762361889/openmarket/bK6Io05NOx1.png',
  };

  try {
    await axios.post('/users', signup);
    alert('회원가입 성공했습니다. 로그인 페이지로 이동합니다.');
    location.href = './SignIn.html';
  } catch (err) {
    alert(`회원가입실패: ${err}`);
  }
});
