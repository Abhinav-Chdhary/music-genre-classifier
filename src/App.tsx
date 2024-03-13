import React, { useState } from "react";
import AudioVisualizer from "./components/AudioVisualizer";
import StartButton from "./components/StartButton";

const App: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const startVisualizer = () => {
    const newAudioContext = new ((window as any).AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(newAudioContext);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setAudioStream(stream);
      })
      .catch((err) => {
        console.log("The following error occurred: " + err);
      });
  };

  const stopVisualizer = () => {
    audioStream?.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
    setAudioContext(null);
  };

  return (
    <div id='app'>
      <div className='visualizer'>
        {audioContext && audioStream && (
          <AudioVisualizer
            audioContext={audioContext}
            audioStream={audioStream}
          />
        )}
      </div>
      {!audioStream && <StartButton onClick={startVisualizer} />}
      {audioStream && <button onClick={stopVisualizer}>Stop Visualizer</button>}
    </div>
  );
};

export default App;
