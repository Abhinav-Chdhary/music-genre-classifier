import React from "react";

interface StartButtonProps {
  onClick: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Start Visualizer</button>;
};

export default StartButton;
