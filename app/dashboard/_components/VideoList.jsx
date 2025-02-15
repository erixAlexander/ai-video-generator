import React, { useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import useWindowWidth from "../hooks/useWindowWidth";

const VideoList = ({ videoList }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoId, setVideoid] = useState();
  const windowWidth = useWindowWidth();

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-20">
      {videoList?.map((video, index) => {
        return (
          <div
            className="cursor-pointer transition-all hover:scale-105"
            key={index}
            onClick={() => {
              setOpenDialog(true);
              setVideoid(video.id);
            }}
          >
            <Thumbnail
              component={RemotionVideo}
              compositionWidth={windowWidth < 950 ? 140 : 220}
              compositionHeight={windowWidth < 950 ? 230 : 340}
              frameToDisplay={30}
              durationInFrames={120}
              fps={30}
              inputProps={{
                ...video,
                setDurationInFrames: () => console.log(""),
              }}
              style={{ borderRadius: 15 }}
            />
          </div>
        );
      })}

      <PlayerDialog
        videoId={videoId}
        playVideo={openDialog}
        setPlayVideo={setOpenDialog}
      />
    </div>
  );
};

export default VideoList;
