"use client";
import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "../../_context/VideoDataContext";
import { db } from "../../../configs/db";
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
  const [videoId, setVideoId] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  // Context
  const { videoData, setVideoData } = useContext(VideoDataContext);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => {
      return { ...prev, [fieldName]: fieldValue };
    });
  };

  const validateFormData = () => {
    const { topic, style, duration } = formData;
    if (!topic || !style || !duration) {
      console.error("All fields must be filled out.");
      alert("Please fill out all fields before creating a video.");
      return false;
    }
    return true;
  };

  const onHandleCreateVideo = async () => {
    if (!validateFormData()) return;

    if (!userDetail?.credits >= 10) {
      alert(`You don't have enough credits`);
      return;
    }

    setLoading(true);
    try {
      const videoScriptData = await GenerateVideoScript();

      if (!videoScriptData) {
        console.error("No video script generated");
        return;
      }
      if (videoScriptData == "Not enough credits") {
        alert("You ran out of credits, you need to purchase more.");
        return;
      }

      const audioUrl = await GenerateAudioFile(videoScriptData);
      if (!audioUrl) {
        console.error("No audio generated");
        return;
      }

      const captions = await GenerateAudioCaption(audioUrl);
      if (!captions) {
        console.error("No captions generated");
        return;
      }

      await GenerateImage(videoScriptData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //API Call
  const GenerateVideoScript = async () => {
    const prompt = `Write a script to generate a ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.style} format for each scene give me the result in JSON format with imagePrompt and ContextText as field`;

    try {
      const result = await axios.post("/api/get-video-script", {
        prompt: prompt,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });

      if (result.data.result == "Not enough credits")
        return "Not enough credits";

      setVideoData((prev) => ({
        ...prev,
        script: result.data.result.scenes,
      }));
      return result.data.result.scenes;
    } catch (error) {
      console.log(error);
    }
  };

  const GenerateAudioFile = async (scriptData) => {
    let script = "";
    const id = uuidv4();
    scriptData.forEach((item) => {
      script = script + " " + item.contextText;
    });

    try {
      const result = await axios.post("/api/generate-audio", {
        id: id,
        text: script,
      });
      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: result.data.result,
      }));
      return result.data.result;
    } catch (error) {
      console.error("Failed to generate audio file:", error);
      throw new Error("Audio generation failed");
    }
  };

  const GenerateAudioCaption = async (audioFileUrl) => {
    try {
      const result = await axios.post("/api/generate-caption", {
        audioFileUrl: audioFileUrl,
      });
      setVideoData((prev) => ({
        ...prev,
        captions: result.data.result,
      }));
      return result.data.result;
    } catch (error) {
      console.log(error);
    }
  };

  const GenerateImage = async (videoScript) => {
    try {
      const promises = videoScript?.map((item, index) => {
        return axios
          .post("/api/generate-image", {
            prompt: item?.imagePrompt,
            substract: index == videoScript.length - 1,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            style: formData?.style,
          })
          .then((response) => response.data.result);
      });

      const imagesUrlArray = await Promise.all(promises);
      setVideoData((prev) => ({
        ...prev,
        imageList: imagesUrlArray,
      }));

      setUserDetail((prev) => ({ ...prev, credits: prev.credits - 10 }));
    } catch (error) {
      console.error("Error generating images:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(videoData).length === 4) {
      saveVideoData(videoData);
    }
  }, [videoData]);

  const saveVideoData = async (videoData) => {
    if (!videoData || typeof videoData !== "object") {
      console.error("Invalid videoData:", videoData);
      return;
    }
    setLoading(true);

    // Create an object with only the fields defined in your schema
    const videoDataToInsert = {
      script: videoData.script,
      audioFileUrl: videoData.audioFileUrl,
      captions: videoData.captions,
      imageList: videoData.imageList,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    };

    try {
      const result = await db
        .insert(videoDataTable) // using the schema alias
        .values(videoDataToInsert)
        .returning({ id: videoDataTable?.id });

      setVideoId(result[0].id);
      setPlayVideo(true);
    } catch (error) {
      console.error("Error inserting video data:", error);
    } finally {
      setVideoData({});
      setLoading(false);
    }
  };

  return (
    <div className="md:p-20">
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

        <CustomLoading loading={loading} />

        <PlayerDialog
          playVideo={playVideo}
          videoId={videoId}
          setPlayVideo={setPlayVideo}
        />
      </div>
    </div>
  );
}

export default CreateNew;
