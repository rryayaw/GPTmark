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
  
//adds bookmark button to action bar
function addBookmarkToActionBar(actionBar) {
  //avoid duplicate injections
  if (actionBar.dataset.gptmarkInjected) return;

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
    marked = !marked;
    btn.innerHTML = marked ? bookmarkFillSVG : bookmarkSVG;
  });

  actionBar.appendChild(btn);
  actionBar.dataset.gptmarkInjected = "true";
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
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

