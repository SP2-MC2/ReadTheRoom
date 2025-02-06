import React from "react";
import ReadTheRoomButton from "./components/ReadTheRoomButton";

const App = () => {
  const handleReadTheRoomClick = () => {
    console.log("ReadTheRoom button clicked!");
    alert("ReadTheRoom Analysis coming soon! 🚀");
  };

  return (
    <div>
      <h2>Reddit Moderator Extension</h2>
      <p>This extension helps you flag Reddit posts that go against community policies.</p>
      {/* Sticky floating button */}
      <ReadTheRoomButton onClick={handleReadTheRoomClick} />
    </div>
  );
};

export default App;
