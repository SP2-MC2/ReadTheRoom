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
        openModal();
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

    function createModal() {
      if (document.getElementById("read-the-room-modal")) return;
    
      const modal = document.createElement("div");
      modal.id = "read-the-room-modal";
      modal.innerHTML = `
        <div id="chakra-ui-modal" style="
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100%;
          background-color: white;
          box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          padding: 20px;
          transform: translateX(100%);
        ">
          <!-- Header with Title and Close Button -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <h3 style="font-size: 18px;">Read the Room</h3>
            <button id="close-modal" style="background: none; border: none; font-size: 18px; cursor: pointer;">✖</button>
          </div>
    
          <!-- Search Bar -->
          <div style="margin-top: 10px; display: flex; align-items: center; border: 1px solid #ccc; border-radius: 6px; padding: 6px;">
            <input type="text" placeholder="Search for past questions/comments" style="border: none; outline: none; flex: 1;">
          </div>
    
          <!-- Tabs -->
          <div style="margin-top: 10px; display: flex; justify-content: space-around; border-bottom: 1px solid #ddd;">
            <button class="tab-button" style="border: none; background: none; font-size: 14px; padding: 10px; cursor: pointer; font-weight: bold;">Queue</button>
            <button class="tab-button" style="border: none; background: none; font-size: 14px; padding: 10px; cursor: pointer;">Flagged</button>
            <button class="tab-button" style="border: none; background: none; font-size: 14px; padding: 10px; cursor: pointer;">Archive</button>
          </div>
    
          <!-- AI Summary Section -->
          <div style="margin-top: 15px; padding: 10px; background: #f8f8f8; border-radius: 6px;">
            <strong>AI Summary</strong>
            <div style="margin-top: 5px; display: flex; align-items: center;">
              <span style="background: #ffcc00; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Publicizing</span>
              <span style="margin-left: 6px; color: green; font-weight: bold;">Very High</span>
            </div>
            <p style="font-size: 12px; color: #555; margin-top: 5px;">This post possibly contains attempts to publicize a legal problem...</p>
          </div>
    
          <!-- Post Content -->
          <div style="margin-top: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <strong>u/sam040501</strong> <span style="color: gray; font-size: 12px;">• Post • Today, 12:32 PM</span>
            <p style="margin-top: 5px; font-size: 14px;">Facing Legal Trouble with Airbnb in Barcelona, What Should I Do?</p>
            <p style="margin-top: 5px; font-size: 12px; color: #555;">
              I’ve recently been fined by local authorities in Barcelona for renting out my apartment on Airbnb, which is apparently against new regulations...
            </p>
          </div>
    
          <!-- Moderation Actions -->
          <div style="margin-top: 15px; display: flex; justify-content: space-around;">
            <button class="moderation-button" style="background: #ff4500; color: white; padding: 8px 15px; border-radius: 6px; font-size: 14px; border: none; cursor: pointer;">Remove</button>
            <button class="moderation-button" style="background: #2d89ef; color: white; padding: 8px 15px; border-radius: 6px; font-size: 14px; border: none; cursor: pointer;">Keep</button>
            <button class="moderation-button" style="background: #000; color: white; padding: 8px 15px; border-radius: 6px; font-size: 14px; border: none; cursor: pointer;">Ban User</button>
            <button class="moderation-button" style="background: #6c757d; color: white; padding: 8px 15px; border-radius: 6px; font-size: 14px; border: none; cursor: pointer;">Send Modmail</button>
          </div>
        </div>
      `;
    
      document.body.appendChild(modal);
    
      // Close button functionality
      document.getElementById("close-modal").addEventListener("click", closeModal);
    }
    
    /** Function to Open the Modal */
    function openModal() {
      createModal();
      document.getElementById("chakra-ui-modal").style.transform = "translateX(0%)";
    }
    
    /** Function to Close the Modal */
    function closeModal() {
      document.getElementById("chakra-ui-modal").style.transform = "translateX(100%)";
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
  