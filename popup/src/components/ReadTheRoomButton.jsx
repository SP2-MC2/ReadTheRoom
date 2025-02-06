import React from "react";

const ReadTheRoomButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#ff4500",
        color: "white",
        padding: "12px 20px",
        borderRadius: "50px",
        fontSize: "14px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1000, // Ensure it stays above other elements
      }}
    >
      🔍 ReadTheRoom
    </button>
  );
};

export default ReadTheRoomButton;
