import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RemotionVideo = ({
  imageList = [],
  audioFileUrl,
  captions = [],
  setDurationInFrames,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrames = () => {
    return (captions[captions?.length - 1]?.end / 1000) * fps;
  };

  const getCurrentCaption = () => {
    const currentTime = (frame / 30) * 1000;
    const currentCaption = captions.find((word) => {
      return currentTime >= word.start && currentTime <= word.end;
    });
    return currentCaption?.text || "";
  };
  useEffect(() => {
    if (setDurationInFrames) {
      setDurationInFrames(getDurationFrames());
    }
  }, [captions, fps, setDurationInFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {Array.isArray(imageList) &&
        imageList?.map((item, index) => {
          const startTime = (index * getDurationFrames()) / imageList.length;
          const duration = getDurationFrames();

          const scale = (index) =>
            interpolate(
              frame, // The current frame
              [startTime, startTime + duration / 2, startTime + duration], // Input range
              index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8], // Output range
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" } // Extrapolation
            );
          return (
            <Sequence
              key={index}
              from={startTime}
              durationInFrames={getDurationFrames()}
            >
              <Img
                src={item}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale(index)})`,
                }}
              />
              <AbsoluteFill className="flex text-white text-3xl justify-center items-center bottom-10 h-[150px top-0]">
                <h2>{getCurrentCaption()}</h2>
              </AbsoluteFill>
            </Sequence>
          );
        })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  );
};

export default RemotionVideo;
