import { useEffect, useRef, useState } from "react";
import "./styles.css";

const videoNames = [
  "part1(split-video.com).mp4",
  "part2(split-video.com).mp4",
  "part3(split-video.com).mp4"
];

type CustomVideoProps = {
  src: string;
  playNow: boolean;
  onEnd(): void;
  onDraw(video: HTMLVideoElement): void;
};
const CustomVideo = (props: CustomVideoProps) => {
  const { src, playNow, onEnd, onDraw } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (playNow) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [playNow]);

  useEffect(() => {
    let isUpdated = false;
    const drawIt = () => {
      if (isUpdated) return;

      if (videoRef.current) {
        onDraw(videoRef.current);
      }

      requestAnimationFrame(drawIt);
    };

    drawIt();

    return () => {
      isUpdated = true;
    };
  }, [playNow, onDraw]);

  return (
    <video
      ref={videoRef}
      src={src}
      onEnded={onEnd}
      width="100%"
      controls
      muted
      style={{
        maxHeight: "calc(100vh - 200px)",
        display: "none"
      }}
    />
  );
};

export default function App() {
  const [videoIndex, setVideoIndex] = useState(0);
  const isLastVideo = videoIndex + 1 === videoNames.length;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <ul>
        {videoNames.map((videoName, index) => (
          <li
            style={{
              cursor: "pointer",
              textDecoration: index === videoIndex ? "underline" : ""
            }}
            onClick={() => setVideoIndex(index)}
            key={index}
          >
            {videoName}
          </li>
        ))}
      </ul>
      {videoNames.map((videoName, index) => (
        <CustomVideo
          src={videoName}
          key={videoName}
          onDraw={(video: HTMLVideoElement) => {
            canvasRef.current?.getContext("2d")?.drawImage(video, 0, 0);
          }}
          onEnd={() => {
            if (isLastVideo) return;

            setVideoIndex(videoIndex + 1);
          }}
          playNow={index === videoIndex}
        />
      ))}
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  );
}
