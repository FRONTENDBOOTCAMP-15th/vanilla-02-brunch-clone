const carousels = document.querySelectorAll('.carousels');

carousels.forEach((slider) => {
  const carousel = slider as HTMLElement;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  //클릭 했을 때
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;

    e.preventDefault();

    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  //영역 밖으로 나갔을 때
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });

  //마우스 떼ㅁ
  window.addEventListener('mouseup', (e) => {
    isDown = false;
    e.preventDefault();
  });

  //이동 구현
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // (현재 위치 x) - (아까 저장한 시작 위치 startX), 1.5 = 속도

    carousel.scrollLeft = scrollLeft - walk;
  });
});
