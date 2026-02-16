let bookmarked = [];
chrome.storage.local.get(["bookmarked"], (result) => {
  if (result.bookmarked) {
    bookmarked = result.bookmarked;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    sendResponse({ bookmarked: bookmarked });
  }
  if (request.action === "toggleBookmark") {
    const turnId = request.turnId;
    
    if (bookmarked.includes(turnId)) {
      bookmarked = bookmarked.filter(id => id !== turnId);
    } else {
      bookmarked.push(turnId);
    }
    
    chrome.storage.local.set({ bookmarked: bookmarked }, () => {
      console.log("Storage updated:", bookmarked);
      sendResponse({ success: true, currentBookmarks: bookmarked });
    });
  }
  return true; 
});