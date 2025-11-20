// 구독 버튼 스크립트

// 1. 로그인 여부 확인 함수 (세션 스토리지에 accessToken 기준)
function isLoggedIn() {
  const token = sessionStorage.getItem('accessToken');
  return !!token;
}

// 2. 구독 버튼 요소 찾기
//   - aria-pressed 가진 버튼이 이 구독 버튼 하나라고 가정
const btn = document.querySelector<HTMLButtonElement>('button[aria-pressed][type="button"]');

if (!btn) {
  console.error('구독 버튼을 찾을 수 없습니다.');
} else {
  let subscribed = btn.getAttribute('aria-pressed') === 'true';

  // 아이콘 / 텍스트 요소 미리 찾아두기
  const plus = btn.querySelector<HTMLImageElement>('.icon-plus');
  const check = btn.querySelector<HTMLImageElement>('.icon-check');
  const label = btn.querySelector<HTMLSpanElement>('span');

  // 현재 subscribed 값에 맞게 UI 갱신하는 함수
  const updateButtonUI = () => {
    // aria-pressed
    btn.setAttribute('aria-pressed', String(subscribed));

    // 배경 / 글자색 / 너비
    btn.classList.toggle('bg-br-contentsBg', !subscribed);
    btn.classList.toggle('bg-br-primary', subscribed);
    btn.classList.toggle('text-br-primary', !subscribed);
    btn.classList.toggle('text-br-contentsBg', subscribed);
    btn.classList.toggle('w-[65px]', !subscribed);
    btn.classList.toggle('w-[78px]', subscribed);

    // 아이콘 표시 토글
    plus?.classList.toggle('hidden', subscribed);
    check?.classList.toggle('hidden', !subscribed);

    // 라벨 텍스트
    if (label) {
      label.textContent = subscribed ? '구독중' : '구독';
    }
  };

  // 처음 로드될 때도 한 번 UI 맞춰주기
  updateButtonUI();

  // 3. 클릭 이벤트
  btn.addEventListener('click', (event) => {
    // 로그인 안 되어 있으면 → 알림만 띄우고 스타일 안 바꿈
    if (!isLoggedIn()) {
      alert('로그인이 필요합니다.');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 로그인 되어 있을 때만 토글
    subscribed = !subscribed;
    updateButtonUI();

    // 필요하면 여기서 서버로 구독/구독취소 요청 보내는 코드 추가 가능
    // 예: window.dispatchEvent(new CustomEvent('subscribe-toggle', { detail: { subscribed } }));
  });
}
