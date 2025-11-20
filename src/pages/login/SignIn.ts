//이메일, 패스워드 입력 후 로그인
//로그인 정보 저장 누르고 로그인
//로그인,회원가입 입력값 다 넣으면 회원가입 버튼 없어지기,로그인 버튼 색 바뀌기

import { AxiosError } from 'axios';
import { getAxios } from '../../utils/axios';
import type { DetailRes, LoginUser } from '../../utils/types';

const axios = getAxios();

//html 요소
const SigninEmail = document.getElementById('signin-email') as HTMLInputElement;
const SigninPwd = document.getElementById('signin-pwd') as HTMLInputElement;
const checkBox = document.getElementById('signin-checkbox-1') as HTMLInputElement;
const LoginForm = document.getElementById('login-form') as HTMLFormElement;
const LoginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const Signup = document.getElementById('signup') as HTMLAnchorElement;

//이메일, 비밀번호 입력 후 로그인 버튼 색상 변경, 회원가입 버튼 감추기
SigninPwd.addEventListener('input', () => {
  const email = SigninEmail.value;
  const pwd = SigninPwd.value;

  if (email && pwd) {
    LoginBtn.classList.add('bg-br-primary');
    LoginBtn.classList.remove('bg-br-loginButton');
    Signup.classList.add('hidden');
  } else {
    LoginBtn.classList.add('bg-br-loginButton');
    LoginBtn.classList.remove('bg-br-primary');
    Signup.classList.remove('hidden');
  }
});

//로그인
LoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const login = {
    email: SigninEmail.value,
    password: SigninPwd.value,
  };

  try {
    if (checkBox.checked) {
      const { data } = await axios.post<DetailRes<LoginUser>>('/users/login', login, { params: { expiresIn: '1d' } });
      const accessToken = data.item.token.accessToken;
      const userName = data.item.name;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userName', userName);
    } else {
      const { data } = await axios.post<DetailRes<LoginUser>>('/users/login', login);
      const accessToken = data.item.token.accessToken;
      const userName = data.item.name;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('userName', userName);
    }

    alert('로그인 성공했습니다');
    location.href = '../../../index.html';
  } catch (err) {
    if (err instanceof AxiosError) {
      alert(`로그인 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
    } else {
      alert(`로그인 실패: ${err}`);
    }
  }
});
