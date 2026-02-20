import ReactPlayer from "react-player";
import { useEffect, useRef } from "react";
import { Typography } from "antd";

interface VideoPlayerProps {
  url: string | undefined;
  currentTime: number;
  onProgress: (time: number) => void;
}

export const VideoPlayer = ({ url, currentTime }: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime);
    }
  }, [currentTime]);


  if (!url)
    return <Typography.Text type="warning">Видео не загружено</Typography.Text>;

  return (
    <ReactPlayer
      playing
      ref={playerRef}
      url={url}
      controls={true}
      volume={0}
      width="100%"
    />
  );
};
