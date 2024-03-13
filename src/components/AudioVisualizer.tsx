import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioContext: AudioContext;
  audioStream: MediaStream;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioContext,
  audioStream,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasCtx = canvasRef.current?.getContext("2d");
    if (!canvasCtx) return;

    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const draw = () => {
      canvasCtx.clearRect(
        0,
        0,
        canvasCtx.canvas.width,
        canvasCtx.canvas.height
      );
      const barWidth = (canvasCtx.canvas.width / bufferLength) * 2.5;
      let posX = 0;

      analyser.getByteFrequencyData(dataArray);

      dataArray.forEach((item, index) => {
        const barHeight = item * 2;

        const r = barHeight + 25 * (index / bufferLength);
        const g = 250 * (index / bufferLength);
        const b = 50;

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(
          posX,
          canvasCtx.canvas.height - barHeight / 2,
          barWidth,
          barHeight
        );

        posX += barWidth + 1;
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      source.disconnect();
    };
  }, [audioContext, audioStream]);

  return <canvas ref={canvasRef}></canvas>;
};

export default AudioVisualizer;
