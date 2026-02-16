//load check
console.log("GPTmark loaded");

//bookmark icons stored as js strings
const bookmarkSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
  <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5v16.5l-7-4.5-7 4.5V4.5z"/>
</svg>
`;

const bookmarkFillSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
  <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5v16.5l-7-4.5-7 4.5V4.5z"/>
</svg>
`;

const strip = `
<div style="width: 80px; height: 5px; background-color: rgba(97, 95, 95, 0.8); margin-bottom: 4px; border-radius: 5px; margin-right: 10px;"></div>
`;

//adds bookmark button to action bar
function addBookmarkToActionBar(actionBar) {
  chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
    if (response.bookmarked.includes(turn.getAttribute("data-testid"))) {
        marked = true;
        btn.innerHTML = bookmarkFillSVG;
    }
  });

  //avoid duplicate injections
  if (actionBar.dataset.gptmarkInjected) return;

  const turn = actionBar.closest('[data-testid^="conversation-turn-"]');
  if (!turn) return;

  const btn = document.createElement("button");
  btn.className =
    "text-token-text-secondary hover:bg-token-bg-secondary rounded-lg";
  btn.style.width = "32px";
  btn.style.height = "32px";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.title = "Bookmark response";
  btn.setAttribute("aria-label", "Bookmark response");

  let marked = false;
  btn.innerHTML = bookmarkSVG;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const turnId = turn.getAttribute("data-testid");

    chrome.runtime.sendMessage(
      { action: "toggleBookmark", turnId: turnId }, 
      (response) => {
        if (response.success) {
          marked = !marked;
          btn.innerHTML = marked ? bookmarkFillSVG : bookmarkSVG;
          console.log("Global bookmarks are now:", response.currentBookmarks);
        }
      }
    );
  });

  actionBar.appendChild(btn);
  actionBar.dataset.gptmarkInjected = "true";
}

//adds the marked list container to the page
function addMarkedList(){
  if(document.getElementById("gptmark-list")) return;

  const listContainer = document.createElement("div");
  listContainer.id = "gptmark-list";  
  listContainer.style.position = "fixed";
  listContainer.style.top = "50%";
  listContainer.style.right = "0";
  listContainer.style.transform = "translateY(-50%)";
  listContainer.style.borderRadius = "8px";
  listContainer.style.padding = "8px";
  listContainer.style.zIndex = "1000";

  listContainer.innerHTML = strip;
  document.body.appendChild(listContainer);
}

//Observes for changes in the document to dynamically add bookmark buttons
const observer = new MutationObserver(() => {
  if (!location.pathname.startsWith("/c/")) return;

  document
    .querySelectorAll('[data-testid="copy-turn-action-button"]')

    //finds the action bar container and adds bookmark button to every response
    .forEach((copyBtn) => {
      const actionBar = copyBtn.closest("div");
      if (actionBar) {
        addBookmarkToActionBar(actionBar);
      }
    });
    
  const chatMain = document.querySelector(".flex.flex-col.text-sm.pb-25");
  if(chatMain){
    addMarkedList();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

