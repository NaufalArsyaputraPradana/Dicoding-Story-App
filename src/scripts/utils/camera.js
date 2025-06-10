export default class Camera {
  #currentStream;
  #streaming = false;
  #width = 640;
  #height = 0;
  #videoElement;
  #selectCameraElement;
  #canvasElement;
  #takePictureButton;

  static addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) window.currentStreams = [];
    window.currentStreams.push(stream);
  }

  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) return;
    window.currentStreams.forEach((stream) => {
      if (stream && stream.active)
        stream.getTracks().forEach((track) => track.stop());
    });
    window.currentStreams = [];
  }

  constructor({ video, cameraSelect, canvas }) {
    this.#videoElement = video;
    this.#selectCameraElement = cameraSelect;
    this.#canvasElement = canvas;
    this.#initialListener();
  }

  #initialListener() {
    this.#videoElement.oncanplay = () => {
      if (this.#streaming) return;
      this.#height =
        (this.#videoElement.videoHeight * this.#width) /
          this.#videoElement.videoWidth || 480;
      this.#canvasElement.setAttribute('width', this.#width);
      this.#canvasElement.setAttribute('height', this.#height);
      this.#streaming = true;
    };
    this.#selectCameraElement.onchange = async () => {
      await this.stop();
      await this.launch();
    };
  }

  async #populateDeviceList(stream) {
    try {
      if (!(stream instanceof MediaStream))
        throw Error('MediaStream not found!');
      const { deviceId } = stream.getVideoTracks()[0].getSettings();
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((d) => d.kind === 'videoinput');
      this.#selectCameraElement.innerHTML = cameras
        .map(
          (device, i) =>
            `<option value="${device.deviceId}" ${deviceId === device.deviceId ? 'selected' : ''}>${device.label || `Camera ${i + 1}`}</option>`
        )
        .join('');
      // Improvisasi: hide select if only one camera
      this.#selectCameraElement.style.display =
        cameras.length > 1 ? '' : 'none';
    } catch (error) {
      console.error('#populateDeviceList: error:', error);
    }
  }

  async #getStream() {
    try {
      const deviceId =
        !this.#streaming && !this.#selectCameraElement.value
          ? undefined
          : { exact: this.#selectCameraElement.value };
      const constraints = {
        video: {
          aspectRatio: 4 / 3,
          width: { ideal: this.#width },
          deviceId,
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      await this.#populateDeviceList(stream);
      return stream;
    } catch (error) {
      console.error('#getStream: error:', error);
      window.showToast?.(
        'Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.',
        'error'
      );
      return null;
    }
  }

  async launch() {
    this.#currentStream = await this.#getStream();
    if (this.#currentStream) {
      Camera.addNewStream(this.#currentStream);
      this.#videoElement.srcObject = this.#currentStream;
      this.#videoElement.play().catch((e) => {
        console.error('Video play error:', e);
        window.showToast?.('Gagal memulai kamera.', 'error');
      });
      this.#clearCanvas();
    }
  }

  stop() {
    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
      this.#streaming = false;
    }
    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => track.stop());
    }
    this.#clearCanvas();
  }

  #clearCanvas() {
    const ctx = this.#canvasElement.getContext('2d');
    ctx.fillStyle = '#AAAAAA';
    ctx.fillRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);
  }

  async takePicture() {
    if (!(this.#width && this.#height)) return null;
    const ctx = this.#canvasElement.getContext('2d');
    this.#canvasElement.width = this.#width;
    this.#canvasElement.height = this.#height;
    ctx.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);
    return await new Promise((resolve) => {
      this.#canvasElement.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
  }

  addCheeseButtonListener(selector, callback) {
    this.#takePictureButton = document.querySelector(selector);
    if (this.#takePictureButton) this.#takePictureButton.onclick = callback;
  }

  // Improvisasi: switch camera (front/back) if supported
  async switchCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((d) => d.kind === 'videoinput');
      if (cameras.length < 2) {
        window.showToast?.('Tidak ada kamera lain untuk dipilih.', 'info');
        return;
      }
      const currentIdx = cameras.findIndex(
        (d) => d.deviceId === this.#selectCameraElement.value
      );
      const nextIdx = (currentIdx + 1) % cameras.length;
      this.#selectCameraElement.value = cameras[nextIdx].deviceId;
      await this.stop();
      await this.launch();
      window.showToast?.('Kamera berhasil diganti.', 'success');
    } catch (error) {
      window.showToast?.('Gagal mengganti kamera.', 'error');
    }
  }
}
