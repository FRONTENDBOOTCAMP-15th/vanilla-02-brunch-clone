import axios from 'axios';
import type { LoginResponse } from '../utils/types';

//CircleContents
class CircleContentsComponent extends HTMLElement {
  // 웹 컴포넌트가 DOM 연결될 때 호출되는 메서드
  // 컴포넌트 렌더링과 이벤트 초기화를 수행
  connectedCallback() {
    this.render();
  }

  // UI를 렌더링
  render() {
    this.innerHTML = `
     <!--원 컴포넌트-->
    <div class="circle-contents w-20 h-20 rounded-full bg-br-loginButton role=img aria-label=이미지 영역"></div>

    `;
  }
}

// InputComponent
class InputComponent extends HTMLElement {
  // 웹 컴포넌트가 DOM 연결될 때 호출되는 메서드
  // 컴포넌트 렌더링과 이벤트 초기화를 수행
  connectedCallback() {
    this.render();
  }

  // UI를 렌더링
  render() {
    this.innerHTML = `
    <!-- 로그인 입력 서식 -->
    <div class="email-input">
      <label for="emailinput" class="sr-only font-Pretendard">레이블</label>
      <input type="email" id="login-email-input" name="login" required placeholder="이메일" class="w-80 h-[43px] border-b border-br-loginLine placeholder:text-sm focus:outline-none focus:border-br-primary" />
    </div>
    <div class="pwd-input">
      <label for="pwdinput" class="sr-only">레이블</label>
      <input type="password" id="login-pwd-input" name="password" required placeholder="비밀번호" class="w-80 h-[43px] border-b border-br-loginLine placeholder:text-sm focus:outline-none focus:border-br-primary" />
    </div>
    <!-- 입력 서식 -->
    <div class="text-input">
      <input type="text" id="page-text-input" name="text" required placeholder="텍스트" class="py-[25px] px-[25px] w-[360px] border-b border-br-loginLine placeholder:text-xl focus:outline-none focus:border-br-primary" />
    </div>
    <div class="본인 페이지-input">
      <textarea type="text" name="input-name" required placeholder="텍스트" class="py-[25px] px-[25px] w-[360px] resize-none placeholder:text-xl border-b border-br-loginLine caret-br-primary focus:outline-none"></textarea>
    </div>
    `;
  }
}

type User = {
  name: string;
  avatarUrl: string;
};

// Navigate
class NavigateComponent extends HTMLElement {
  // 웹 컴포넌트가 DOM 연결될 때 호출되는 메서드
  // 컴포넌트 렌더링과 이벤트 초기화를 수행
  connectedCallback() {
    this.render();
  }
  // 세션스토리지에서 현재 로그인 정보 읽기
  private getUser(): User | null {
    const name = sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('accessToken');

    if (!name || !token) return null;

    return {
      name,
      avatarUrl: 'https://via.placeholder.com/50',
    };
  }

  // UI를 렌더링
  render() {
    // 로그인이 되었을 때
    const user: User | null = this.getUser();
    if (user) {
      this.innerHTML = `      
  <div class="bg-white w-full overflow-x-auto">
  <div class="flex flex-row items-stretch gap-2 py-2 min-w-[360px] h-[100px]">
    <!-- 홈 -->
    <div id="home-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center cursor-pointer">
        <!-- 체크박스 숨김 -->
      <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
       <a href='/index.html'>
      <!-- 기본 아이콘 (체크 전) -->
      <img
        src="/icon/Home.svg"
        alt="홈 아이콘 기본"
        class="peer-checked:hidden"
      />
      </a>
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/HomeActive.svg"
        alt="홈 아이콘 채움"
        class="hidden peer-checked:block"
      />
        </label>
        <span class="text-center">홈</span>
      </div>

    <!-- 발견 -->
    <div id="search-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center cursor-pointer">
       <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
      <!-- 기본 아이콘 (체크 전) -->
       <a href='/src/pages/author/AuthorPage.html'>
      <img
        src="/icon/Search.svg"
        alt="발견 아이콘 기본"
        class="peer-checked:hidden"
      />
      </a>
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/SearchActive.svg"
        alt="발견 아이콘 채움"
        class="hidden peer-checked:block"
      />
      </label>
      <span class="text-center">발견</span>
    </div>

    <!-- 글쓰기 -->
    <div id="write-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center cursor-pointer">
      <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
    <!-- 기본 아이콘 (체크 전) -->
    <a href='/src/pages/write/WritingPage.html'>
    <img
      src="/icon/EditSquare.svg"
      alt="글쓰기 아이콘 기본"
      class="peer-checked:hidden"
    />
    </a>
            <!-- 체크 아이콘 (체크 후) -->
    <img
       src="/icon/EditSquareActive.svg"
      alt="글쓰기 아이콘 채움"
      class="hidden peer-checked:block"
    />
      </label>
      <span class="text-center">글쓰기</span>
    </div>

    <!-- 내 서랍 -->
    <div id="Inventory-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center cursor-pointer">
       <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
      <!-- 기본 아이콘 (체크 전) -->
       <a href='/src/pages/mypage/MyPage.html'>
      <img
        src="/icon/Inventory.svg"
        alt="내서랍 아이콘 기본"
        class="peer-checked:hidden"
      />
      </a>
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/InventoryActive.svg"
        alt="내서랍 아이콘 채움"
        class="hidden peer-checked:block"
      />

      </label>
      <span class="text-center">내 서랍</span>
    </div>
  </div>
</div>
    <script>
    const checkboxes = document.querySelectorAll('input[name="navi-checkbox"]');
    // 클릭한 것 제외하고 나머지 체크 해제
    
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      if (checkbox.checked) {
        // 클릭한 것 제외하고 나머지 체크 해제
        checkboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
      }
    });
  });
  </script>
    `;
    } else {
      /* 로그인이 안 되었을 때 */
      this.innerHTML = `
       
  <div class="bg-white w-full overflow-x-auto">
  <div class="flex flex-row items-stretch gap-2 py-2 min-w-[360px] h-[100px]">
    <!-- 홈 -->
    <div id="home-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center ">
        <!-- 체크박스 숨김 -->
      <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
       
      <!-- 기본 아이콘 (체크 전) -->
      <a href="/index.html">
      <img
        src="/icon/Home.svg"
        alt="홈 아이콘 기본"
        class="peer-checked:hidden"
      />
      </a>
      
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/HomeActive.svg"
        alt="홈 아이콘 채움"
        class="hidden peer-checked:block"
      />
        </label>
        <span class="text-center">홈</span>
      </div>

    <!-- 발견 -->
    <div id="search-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center ">
       <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
      <!-- 기본 아이콘 (체크 전) -->
        <a href='/src/pages/search/Search.html'>
      <img
        src="/icon/Search.svg"
        alt="발견 아이콘 기본"
        class="peer-checked:hidden"
      />
      </a>
      
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/SearchActive.svg"
        alt="발견 아이콘 채움"
        class="hidden peer-checked:block"        
      />
      </label>
      <span class="text-center">발견</span>
    </div>

    <!-- 글쓰기 -->
    <div id="write-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center ">
      <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
    <!-- 기본 아이콘 (체크 전) -->
    
    <img
      onClick="alert('로그인이 필요한 화면입니다')"
      src="/icon/EditSquare.svg"
      alt="글쓰기 아이콘 기본"
      class="peer-checked:hidden"
      
    />
    
            <!-- 체크 아이콘 (체크 후) -->
    <img
       src="/icon/EditSquareActive.svg"
      alt="글쓰기 아이콘 채움"
      class="hidden peer-checked:block"
    />
      </label>
      <span class="text-center">글쓰기</span>
    </div>

    <!-- 내 서랍 -->
    <div id="Inventory-button" class="flex-1 flex flex-col items-center justify-center text-[var(--icon)] text-base py-2 gap-[10px]">
      <label class="w-8 h-8 flex items-center justify-center ">
       <!-- 체크박스 숨김 -->
    <input name="navi-checkbox" type="checkbox" class="sr-only peer" />
      <!-- 기본 아이콘 (체크 전) -->
     <a href='/src/pages/mypage/MyPage.html'>
      <img
        onClick="alert('로그인이 필요한 화면입니다')"
        src="/icon/Inventory.svg"
        alt="내서랍 아이콘 기본"
        class="peer-checked:hidden"
      />
    </a>
        <!-- 체크 아이콘 (체크 후) -->
      <img
        src="/icon/InventoryActive.svg"
        alt="내서랍 아이콘 채움"
        class="hidden peer-checked:block"
      />

      </label>
      <span class="text-center">내 서랍</span>
    </div>
  </div>
</div>
       `;
    }

    /*------------------------------------------------------
     *
     * 현재 클릭한 네비의 상태를 저장해야 함.
     * 어떻게????
     *
     * MPA 환경에서는 절대 경로 대신 HTML 기준 상대 경로를 사용하면 안전합니다.
    
    document.getElementById('home-button')?.addEventListener('click', () => {
      window.location.href = '/index.html';
    });
    document.getElementById('search-button')?.addEventListener('click', () => {
      window.location.href = '/src/pages/author/AuthorPage.html';
    });
    document.getElementById('write-button')?.addEventListener('click', () => {
      window.location.href = '/src/pages/write/WritingPage.html';
    });
    document.getElementById('Inventory-button')?.addEventListener('click', () => {
      window.location.href = '/src/pages/mypage/MyPage.html';
    });
    */
  }
}

//SubscribeButton
class SubscribeButtonComponent extends HTMLElement {
  // 웹 컴포넌트가 DOM 연결될 때 호출되는 메서드
  // 컴포넌트 렌더링과 이벤트 초기화를 수행
  connectedCallback() {
    this.render();
  }

  // UI를 렌더링
  render() {
    this.innerHTML = `    
    <button type="button" aria-pressed="false" 
      id="subscribe-button"
      class="inline-flex flex-nowrap justify-center items-center gap-0.5 cursor-pointer rounded-full bg-br-contentsBg border border-br-primary text-br-primary w-[65px] h-9">
      <svg class="icon-plus" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="17" height="17" fill="url(#pattern0_1_16927)" />
        <defs>
          <pattern id="pattern0_1_16927" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_1_16927" transform="scale(0.0294118)" />
          </pattern>
          <image
            id="image0_1_16927"
            width="34"
            height="34"
            preserveAspectRatio="none"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiAQMAAAAAiZmBAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURUdwTADGvi5TahIAAAABdFJOUwBA5thmAAAAGUlEQVQI12NgIAocIJtk/v//A4ykxBwiAABTehTj/uJoSwAAAABJRU5ErkJggg=="
          />
        </defs>
      </svg>

      <svg class="icon-check hidden" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="17" height="17" fill="url(#pattern0_3153_10)" />
        <defs>
          <pattern id="pattern0_3153_10" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3153_10" transform="scale(0.0294118)" />
          </pattern>
          <image
            id="image0_3153_10"
            width="34"
            height="34"
            preserveAspectRatio="none"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiBAMAAADIaRbxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTP///////////////////////////////////////////////w2imYoAAAAMdFJOUwBJ7SIN1aqABTC+eRc69w0AAABbSURBVCjPY2AYzKABXYAxGF3E6DSaAEtMApoI21EHNJE9yujmnhHAbS4LhrlGBejmyhxrQDOXUWcJurmTjhqguZc5RhPdvV6HxNDcy5FzBt297BjuZRActLEIAIXPFQAhksVqAAAAAElFTkSuQmCC"
          />
        </defs>
      </svg>

      <span class="font-Pretendard">구독</span>
    </button>
    `;
    //const btn = document.querySelector('button');
    const btn = document.getElementById('subscribe-button');

    let subscribed = false;

    btn?.addEventListener('click', () => {
      subscribed = !subscribed; // subscribed = true
      // aria-pressed = true -> 버튼이 눌린 상태
      btn.setAttribute('aria-pressed', String(subscribed));

      // 스타일 변경
      btn.classList.toggle('bg-br-contentsBg', !subscribed);
      btn.classList.toggle('bg-br-primary', subscribed);
      btn.classList.toggle('text-br-primary', !subscribed);
      btn.classList.toggle('text-br-contentsBg', subscribed);
      btn.classList.toggle('w-[65px]', !subscribed);
      btn.classList.toggle('w-[78px]', subscribed);

      // 아이콘 변경
      const plus = btn.querySelector('.icon-plus');
      const check = btn.querySelector('.icon-check');

      plus?.classList.toggle('hidden', subscribed);
      check?.classList.toggle('hidden', !subscribed);

      // 텍스트 변경
      let label = btn.querySelector('span');

      if (subscribed) {
        label!.textContent = '구독중';
      } else {
        label!.textContent = '구독';
      }
    });
  }
}

//TopComponent
class TopComponent extends HTMLElement {
  // 웹 컴포넌트가 DOM 연결될 때 호출되는 메서드
  // 컴포넌트 렌더링과 이벤트 초기화를 수행
  connectedCallback() {
    // appendChild 를 사용하므로 먼저 html이 렌더 되어야 함
    this.render();
    //세션 스토리지에서 로그인된 사용자 정보를 가져옴
    const user: User | null = this.getUser();
    console.log(user);
    // 로그인 성공시 아바타 버튼 추가
    if (user != null) {
      this.loggedInHTML();
    } else {
      this.loggedOutHTML();
    }
    //탑헤더를 화면에 렌더링

    //로고를 클릭했을 때 메인화면으로 이동
    const logo = document.querySelector('#main-logo');
    logo?.addEventListener('click', () => {
      // SPA 환경에서는 window.location.assign을 사용하면 안전
      window.location.assign('/');
    });
  }

  // 세션스토리지에서 현재 로그인 정보 읽기
  private getUser() {
    const name = sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('accessToken');
    if (!name || !token) return null;

    return {
      name,
      avatarUrl: 'https://via.placeholder.com/50',
    };
  }

  // UI를 렌더링
  render() {
    this.innerHTML = `
        <div class="sticky top-0 bg-white flex items-center justify-between px-[24px] py-4 min-w-[360px]">
      <!-- 왼쪽: brunchstory -->
      <div id="main-logo" class="flex items-center space-x-1 text-[var(--detailsTitle)] cursor-pointer">
        <img src="/icon/Logo.svg" alt="브런치스토리 로고" />
      </div>

      <!-- 오른쪽: 검색 아이콘 + 시작하기 버튼 -->
      <div id="menu-items" class="flex items-center space-x-4">
        
        <!-- 검색 아이콘 -->
        <button 
          onclick="location.href='/src/pages/search/Search.html'"
          class="text-br-start hover:text-[var(--start)] cursor-pointer">
          <img src="/icon/SearchVector.svg" alt="검색 아이콘" />
        </button>
      </div>
    </div>
    `;
  }

  private appendAvatarBtn() {
    const parentDiv = document.getElementById('menu-items'); // 실제 부모 div id로 변경
    const avatarBtn = document.createElement('button');
    avatarBtn.id = 'avatar-icon';
    avatarBtn.className = 'text-br-start hover:text-[var(--start)] cursor-pointer';

    const img = document.createElement('img');
    img.src = '/icon/Face.svg';
    img.alt = '아바타 아이콘';

    avatarBtn.appendChild(img);

    parentDiv?.appendChild(avatarBtn);
  }
  private appendAlertBtn() {
    const parentDiv = document.getElementById('menu-items'); // 실제 부모 div id로 변경

    const alertBtn = document.createElement('button');
    alertBtn.id = 'alert-icon';
    alertBtn.className = 'text-br-start hover:text-[var(--start)] cursor-pointer';

    const img = document.createElement('img');
    img.src = '/icon/Alarm.svg';
    img.alt = '검색 아이콘';

    alertBtn.appendChild(img);
    parentDiv?.prepend(alertBtn);
  }
  private appendStartBtn() {
    const parentDiv = document.getElementById('menu-items');

    const startBtn = document.createElement('button');
    startBtn.id = 'start-button';
    startBtn.addEventListener('click', () => {
      window.location.href = '/src/pages/login/SignIn.html';
    });
    startBtn.className = 'bg-black text-white rounded-full px-6 py-2 text-sm hover:bg-gray-800 transition cursor-pointer';
    startBtn.textContent = '시작하기';
    parentDiv?.appendChild(startBtn);
  }

  private loggedOutHTML() {
    console.log('호출됨');
    this.appendStartBtn();
  }

  private loggedInHTML() {
    this.appendAlertBtn();
    this.appendAvatarBtn();
  }
}

/* customElements.define('태그명'), Component);
 * html에서 <태그명>을 이용하여 사용
 */

customElements.define('top-header', TopComponent);

customElements.define('circle-component', CircleContentsComponent);

customElements.define('navigate-component', NavigateComponent);

customElements.define('subscribe-button', SubscribeButtonComponent);

customElements.define('input-component', InputComponent);

// 로그인 요청 함수 (Axios 버전)
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      'https://fesp-api.koyeb.app/market/users/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'client-id': 'febc15-vanilla02-ecad',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Axios 에러 처리
    if (error.response) {
      throw new Error(`로그인 요청 실패: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('로그인 요청 실패: 서버 응답 없음');
    } else {
      throw new Error(`로그인 요청 실패: ${error.message}`);
    }
  }
}

// 로그인 함수 호출
/*
(async () => {
  try {
    const result = await loginUser('w1@market.com', '11111111');
    if (result) {
      console.log('로그인 성공:', result.item.name);
      console.log('액세스 토큰:', result.item.token.accessToken);

      // 세션스토리지에 토큰 저장
      sessionStorage.setItem('accessToken', result.item.token.accessToken);
      sessionStorage.setItem('refreshToken', result.item.token.refreshToken);
      sessionStorage.setItem('userName', result.item.name);
      // 로컬스토리지에도 동일한 토큰 저장
      localStorage.setItem('accessToken', result.item.token.accessToken);
      localStorage.setItem('refreshToken', result.item.token.refreshToken);
      localStorage.setItem('userName', result.item.name);
    }
  } catch (e) {
    console.error(e);
  }
})();
*/
