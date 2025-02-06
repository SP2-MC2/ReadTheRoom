chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "logModeration") {
      console.log(`Moderation logged for post ID: ${request.data.postId}`);
    }
  });
  