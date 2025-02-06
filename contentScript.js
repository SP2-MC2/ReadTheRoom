(() => {
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
          
          button.addEventListener("click", () => {
            chrome.runtime.sendMessage({
              action: "logModeration",
              data: { postId, action: "flagged" }
            });
            button.innerText = "✓ Added";
            button.style.backgroundColor = "#ff4500";
          });
  
          const container = document.createElement("span");
          container.className = "add-to-room-container";
          container.appendChild(button);
          post.appendChild(container);
        }
      });
    }
  
    const observer = new MutationObserver(() => addReactButton());
    observer.observe(document.body, { childList: true, subtree: true });
  
    addReactButton();
  })();
  