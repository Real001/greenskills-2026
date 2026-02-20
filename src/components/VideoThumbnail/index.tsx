import { useRef, useEffect, useState } from "react";
import { Spin } from "antd";

interface IVideoThumbnailProps {
  snapshotAtTime: number;
  videoUrl: string;
}

export const VideoThumbnail = ({
  videoUrl,
  snapshotAtTime
}: IVideoThumbnailProps) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.currentTime = snapshotAtTime;
    }
  }, [snapshotAtTime]);

  return (
    <>
      <video
        style={{ width: "100%", height: "150px" }}
        muted
        className="snapshot-generator"
        ref={videoElement}
        onLoadedData={() => setLoading(false)}
        src={videoUrl}></video>
      {loading && (
        <Spin style={{ position: "absolute", top: "63px", zIndex: 1 }} />
      )}
    </>
  );
};
