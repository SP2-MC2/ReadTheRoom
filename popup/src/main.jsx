import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { loadInitialState } from "./redux/moderationSlice";
import App from "./App";

const InitStateLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.storage.local.get(["flaggedPosts"], (result) => {
      dispatch(loadInitialState(result.flaggedPosts || {}));
    });
  }, [dispatch]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <InitStateLoader />
      <App />
    </Provider>
  </React.StrictMode>
);
