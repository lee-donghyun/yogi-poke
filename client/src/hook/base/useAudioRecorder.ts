import { useCallback, useRef, useState } from "react";

const UPDATE_INTERVAL = 400;

export const useAudioRecorder = () => {
  if (!navigator.mediaDevices) {
    throw new Error("This browser does not support audio recording");
  }

  const recorderRef = useRef<MediaRecorder>();
  const chunksRef = useRef<Blob[]>([]);

  const audioContextRef = useRef<AudioContext>();

  const [isRecording, setIsRecording] = useState(false);
  const [url, setUrl] = useState<null | string>(null);
  const [analytics, setAnalytics] = useState<number[]>([]);

  const start = useCallback(async () => {
    setIsRecording(true);

    // save the stream to the chunk
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorderRef.current = new MediaRecorder(stream);
    recorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
      const url = URL.createObjectURL(
        new Blob(chunksRef.current, { type: "audio/webm" }),
      );
      setUrl(url);
    };
    recorderRef.current.start();

    // get the volume analytics
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);

      const sum = dataArray.reduce((acc, val) => acc + val, 0);

      setAnalytics((p) => [...p, sum / 20]);

      if (audioContext.state === "running") {
        setTimeout(() => {
          updateVolume();
        }, UPDATE_INTERVAL);
      }
    };

    updateVolume();
  }, []);

  const stop = useCallback(() => {
    recorderRef.current?.stop();
    setIsRecording(false);
    void audioContextRef.current?.close();
  }, []);

  return { analytics, isRecording, start, stop, url };
};
