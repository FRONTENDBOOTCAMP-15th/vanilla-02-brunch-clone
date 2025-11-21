export function initSearchEvent() {
  // 아이디가 search-input인 선택자를 이용해서 요소를 찾아라
  const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;

  // 검색어 입력요소에 키보드 입력 이벤트를 등록
  searchInput.addEventListener('keydown', (e) => {
    // 엔터쳤을때
    if (e.key === 'Enter') {
      // 검색어 앞뒤공백을 제거한 값을 꺼냄
      const keyword = searchInput.value.trim();
      // 검색어를 입력하지 않았을때 실행하지 마
      if (keyword.length === 0) return;

      // 검색어를 loadSearchResults 함수로 전달해서 호출
      location.assign(`SearchResult.html?keyword=${keyword}`);
    }
  });
}

initSearchEvent();