import { ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ModeratorPanel } from "./components/ModeratorPanel";

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "OPEN_MODERATOR_PANEL") {
        setIsModalOpen(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <ChakraProvider>
      <ModeratorPanel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </ChakraProvider>
  );
} 