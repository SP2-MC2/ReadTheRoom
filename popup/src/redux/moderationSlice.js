import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flaggedPosts: {}, // Stores postId and its flagged status
};

const moderationSlice = createSlice({
  name: "moderation",
  initialState,
  reducers: {
    toggleFlagged: (state, action) => {
      const { postId } = action.payload;
      const newState = !state.flaggedPosts[postId];

      // Update Redux store
      state.flaggedPosts[postId] = newState;

      // Persist in Chrome storage
      chrome.storage.local.get(["flaggedPosts"], (result) => {
        const storagePosts = result.flaggedPosts || {};
        storagePosts[postId] = newState;
        chrome.storage.local.set({ flaggedPosts: storagePosts });
      });
    },

    loadInitialState: (state, action) => {
      state.flaggedPosts = action.payload;
    },
  },
});

export const { toggleFlagged, loadInitialState } = moderationSlice.actions;
export default moderationSlice.reducer;
