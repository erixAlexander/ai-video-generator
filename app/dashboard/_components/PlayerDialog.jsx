import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "../../../components/ui/button";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const PlayerDialog = ({ playVideo, videoId, setPlayVideo, setVideoId }) => {
  const [videoData, setVideoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [durationInFrames, setDurationInFrames] = useState(100);
  const router = useRouter();

  useEffect(() => {
    videoId && GetVideoData();
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, videoId));
      setVideoData(result[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  if (!videoData || Object.keys(videoData).length === 0) {
    return null;
  }

  return (
    <Dialog
      open={playVideo}
      onOpenChange={(newOpen) => {
        console.log("🚀 ~ PlayerDialog ~ newOpen:", newOpen);
        if (newOpen) return; // Do nothing if dialog is opening
        setPlayVideo(newOpen);
        setVideoData(null);
        setVideoId(null);
        // router.refresh();
        // router.replace("/dashboard");
      }}
    >
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="font-bold my-5 text-3xl">
            Your Video Is Ready
          </DialogTitle>
          <div>
            <Player
              acknowledgeRemotionLicense
              component={RemotionVideo}
              durationInFrames={Number(durationInFrames.toFixed(0)) + 60}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              inputProps={{
                ...videoData,
                setDurationInFrames: setDurationInFrames,
              }}
              controls={true}
            />
            <div className="flex items-center justify-center gap-10 mt-5">
              <Button
                variant="ghost"
                onClick={() => {
                  setPlayVideo(false);
                  setVideoData(null);
                  setVideoId(null);

                  // router.replace("/dashboard");
                  // router.refresh();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
