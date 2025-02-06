(() => {
    /** Inject a floating ReadTheRoom button */
    function createFloatingButton() {
      if (document.getElementById("read-the-room-button")) return; // Prevent duplicate buttons
  
      const container = document.createElement("div");
      container.id = "read-the-room-button";
      document.body.appendChild(container);
  
      const button = document.createElement("button");
      button.innerText = "🔍 ReadTheRoom";
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #ff4500;
        color: white;
        padding: 12px 20px;
        border-radius: 50px;
        font-size: 14px;
        border: none;
        cursor: pointer;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      `;
  
      button.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "readTheRoom" }); // Can trigger AI moderation later
        alert("ReadTheRoom Analysis coming soon! 🚀");
      });
  
      container.appendChild(button);
    }
  
    /** Inject AddToRoom button for every Reddit post */
    function addReactButton() {
      document.querySelectorAll(".flat-list.buttons").forEach((post) => {
        if (!post.querySelector(".add-to-room-container")) {
          const postId =
            post.closest("[data-post-id]")?.dataset.postId ||
            `temp-${Math.random().toString(36).substr(2, 9)}`;
  
          const button = document.createElement("button");
          button.innerText = "Add to Room";
          button.className = "add-to-room-button";
          button.style.cssText = `
            background-color: #e3f1df;
            color: black;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            border: 1px solid #c3d5bf;
            cursor: pointer;
          `;
  
          // Get initial state from Redux store
          chrome.storage.local.get(["flaggedPosts"], (result) => {
            const flaggedPosts = result.flaggedPosts || {};
            if (flaggedPosts[postId]) {
              button.innerText = "✓ Added";
              button.style.backgroundColor = "#ff4500";
            }
          });
  
          button.addEventListener("click", () => {
            chrome.storage.local.get(["flaggedPosts"], (result) => {
              const flaggedPosts = result.flaggedPosts || {};
              const isFlagged = !flaggedPosts[postId]; // Toggle state
  
              flaggedPosts[postId] = isFlagged; // Update state
              chrome.storage.local.set({ flaggedPosts }); // Persist in storage
  
              chrome.runtime.sendMessage({
                action: "logModeration",
                data: { postId, action: isFlagged ? "flagged" : "unflagged" },
              });
  
              // Update UI based on state
              button.innerText = isFlagged ? "✓ Added" : "Add to Room";
              button.style.backgroundColor = isFlagged ? "#ff4500" : "#e3f1df";
            });
          });
  
          const container = document.createElement("span");
          container.className = "add-to-room-container";
          container.appendChild(button);
          post.appendChild(container);
        }
      });
    }
  
    /** Observe for dynamically loaded content */
    const observer = new MutationObserver(() => {
      addReactButton();
      createFloatingButton();
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    /** Initial execution */
    addReactButton();
    createFloatingButton();
  })();
  