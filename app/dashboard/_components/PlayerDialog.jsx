import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";

const PlayerDialog = ({ playVideo, videoId, setPlayVideo, setVideoId }) => {
  const [videoData, setVideoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [durationInFrames, setDurationInFrames] = useState(100);

  useEffect(() => {
    if (videoId) {
      let isMounted = true;
      GetVideoData().then(() => {
        if (!isMounted) return;
      });
      return () => {
        isMounted = false;
      };
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, videoId));
      setVideoData(result[0] || {});
    } catch (error) {
      console.log("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!playVideo) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : videoData && Object.keys(videoData).length > 0 ? (
          <>
            <h2 style={{ fontSize: "1.5rem", margin: "0 0 20px" }}>
              Your Video Is Ready
            </h2>
            <Player
              acknowledgeRemotionLicense
              component={RemotionVideo}
              durationInFrames={Number(durationInFrames.toFixed(0)) + 60}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              inputProps={{ ...videoData, setDurationInFrames }}
              controls={true}
              style={{ margin: "0 auto" }}
            />
            <Button
              variant="ghost"
              onClick={() => {
                setPlayVideo(false);
                setTimeout(() => {
                  setVideoData({});
                  setVideoId(null);
                }, 100); // Match delay in saveVideoData
              }}
              style={{ marginTop: "20px" }}
            >
              Close
            </Button>
          </>
        ) : (
          <p>No video data available.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDialog;
