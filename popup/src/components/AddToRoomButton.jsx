import React, { useState } from "react";

const AddToRoomButton = ({ postId }) => {
  const [flagged, setFlagged] = useState(false);

  const handleClick = () => {
    setFlagged((prevFlagged) => {
      const newFlaggedState = !prevFlagged;
      chrome.runtime.sendMessage({
        action: "logModeration",
        data: { postId, action: newFlaggedState ? "flagged" : "unflagged" }
      });
      return newFlaggedState;
    });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: flagged ? "#ff4500" : "#e3f1df",
        color: "#000",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        border: "1px solid #c3d5bf",
        cursor: "pointer",
      }}
    >
      {flagged ? "✓ Added" : "Add to Room"}
    </button>
  );
};

export default AddToRoomButton;
