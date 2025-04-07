"use client";
import React, { useContext, useEffect, useState, memo } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "../../_context/VideoDataContext";
import { db } from "../../../configs/db";
import { Users } from "../../../configs/schema";
import { eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { VideoData as videoDataTable } from "../../../configs/schema";
import PlayerDialog from "../../dashboard/_components/PlayerDialog";
import { UserDetailContext } from "../../_context/UserDetailContext";

function CreateNew() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    topic: "",
    style: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null); // Initialize as null
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { videoData, setVideoData } = useContext(VideoDataContext);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const validateFormData = () => {
    const { topic, style, duration } = formData;
    if (!topic || !style || !duration) {
      alert("Please fill out all fields before creating a video.");
      return false;
    }
    return true;
  };

  const onHandleCreateVideo = async () => {
    if (!validateFormData() || userDetail?.credits < 10) {
      alert(
        userDetail?.credits < 10 ? "Not enough credits" : "Fill all fields"
      );
      return;
    }

    setLoading(true);
    try {
      const videoScriptData = await GenerateVideoScript();
      if (!videoScriptData || videoScriptData === "Not enough credits") {
        alert(
          videoScriptData === "Not enough credits"
            ? "Out of credits"
            : "Script failed"
        );
        return;
      }
      const audioUrl = await GenerateAudioFile(videoScriptData);
      if (!audioUrl) throw new Error("Audio generation failed");
      const captions = await GenerateAudioCaption(audioUrl);
      if (!captions) throw new Error("Caption generation failed");
      await GenerateImage(videoScriptData);
    } catch (error) {
      console.error("Video creation error:", error);
      alert("Video creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const GenerateVideoScript = async () => {
    const prompt = `Write a script to generate a ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.style} format for each scene give me the result in JSON format with imagePrompt and ContextText as field`;
    const result = await axios.post("/api/get-video-script", {
      prompt,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    if (result.data.result === "Not enough credits")
      return "Not enough credits";
    setVideoData((prev) => ({ ...prev, script: result.data.result.scenes }));
    return result.data.result.scenes;
  };

  const GenerateAudioFile = async (scriptData) => {
    let script = "";
    const id = uuidv4();
    scriptData.forEach((item) => (script += " " + item.contextText));
    const result = await axios.post("/api/generate-audio", {
      id,
      text: script,
    });
    setVideoData((prev) => ({ ...prev, audioFileUrl: result.data.result }));
    return result.data.result;
  };

  const GenerateAudioCaption = async (audioUrl) => {
    const result = await axios.post("/api/generate-caption", {
      audioFileUrl: audioUrl,
    });
    setVideoData((prev) => ({ ...prev, captions: result.data.result }));
    return result.data.result;
  };

  const GenerateImage = async (videoScript) => {
    const promises = videoScript?.map((item) =>
      axios
        .post("/api/generate-image", {
          prompt: item?.imagePrompt,
          style: formData?.style,
        })
        .then((res) => res.data.result)
    );
    const imagesUrlArray = await Promise.all(promises);
    setVideoData((prev) => ({ ...prev, imageList: imagesUrlArray }));
  };

  useEffect(() => {
    if (
      Object.keys(videoData).length === 4 &&
      videoData.script &&
      videoData.audioFileUrl &&
      videoData.captions &&
      videoData.imageList
    ) {
      saveVideoData(videoData);
    }
  }, [videoData]);

  const saveVideoData = async (videoData) => {
    setLoading(true);
    const videoDataToInsert = {
      script: videoData.script,
      audioFileUrl: videoData.audioFileUrl,
      captions: videoData.captions,
      imageList: videoData.imageList,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    };
    try {
      const result = await db
        .insert(videoDataTable)
        .values(videoDataToInsert)
        .returning({ id: videoDataTable?.id });

      // Delay state updates to avoid render conflicts
      setTimeout(() => {
        setVideoId(result[0].id);
        setPlayVideo(true);
        setVideoData({}); // Reset after dialog opens
        setUserDetail((prev) => ({ ...prev, credits: prev.credits - 10 }));
      }, 100); // Small delay to let DB update settle

      await db
        .update(Users)
        .set({ credits: sql`${Users.credits} - 10` })
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
    } catch (error) {
      console.error("Error saving video data:", error);
      alert("Error saving video data.");
    } finally {
      setLoading(false);
    }
  };

  const MemoizedPlayerDialog = memo(PlayerDialog);

  return (
    <div className="md:p-20 mt-10 md:mt-0">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="shadow-md mt-10 p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <Button onClick={onHandleCreateVideo} className="mt-10 w-full">
          Create New Video
        </Button>
        <CustomLoading
          loading={loading}
          text={"Generating your video, please wait..."}
        />
        <MemoizedPlayerDialog
          playVideo={playVideo}
          videoId={videoId}
          setPlayVideo={setPlayVideo}
          setVideoId={setVideoId}
        />
      </div>
    </div>
  );
}

export default CreateNew;
