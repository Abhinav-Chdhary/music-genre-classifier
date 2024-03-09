<script>
export default {
  name: 'App',
  data() {
    return {
      audioContext: null,
      canvasCtx: null,
      audioStream: null,
    };
  },
  methods: {
    startVisualizer() {
      this.initializeAudio();
    },
    initializeAudio() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.canvasCtx = this.$refs.canvas.getContext('2d');
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.audioStream = stream;
          const source = this.audioContext.createMediaStreamSource(stream);
          const analyser = this.audioContext.createAnalyser();
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          source.connect(analyser);

          const draw = () => {
            this.canvasCtx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            const barWidth = (this.$refs.canvas.width / bufferLength) * 2.5;
            let posX = 0;

            analyser.getByteFrequencyData(dataArray);

            dataArray.forEach((item, index) => {
              const barHeight = item * 2;

              const r = barHeight + (25 * (index/bufferLength));
              const g = 250 * (index/bufferLength);
              const b = 50;

              this.canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
              this.canvasCtx.fillRect(posX, this.$refs.canvas.height - barHeight / 2, barWidth, barHeight);

              posX += barWidth + 1;
            });

            requestAnimationFrame(draw);
          };

          draw();
        })
        .catch((err) => {
          console.log('The following error occurred: ' + err);
        });
    },
  },
  beforeUnmount() {
    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach(track => track.stop());
    }
  },
};
</script>

<template>
    <div id="app">
    <div class="visualizer">
      <canvas ref="canvas"></canvas>
    </div>
    <button @click="startVisualizer">Start Visualizer</button>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.visualizer {
  width: 400px;
  height: 200px;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  background-color: #333;
}
</style>
