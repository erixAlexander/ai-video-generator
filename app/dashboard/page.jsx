"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { db } from "../../configs/db";
import { VideoData } from "../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";

function page() {
  const [videoList, setVideoList] = useState(null);
  const { user } = useUser();

  const getVideoList = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress));
    setVideoList(result.reverse());
  };

  useEffect(() => {
    user && getVideoList();
  }, [user]);

  return (
    <div className="mt-14 md:mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl md:text-4xl text-primary">
          Dashboard
        </h2>
        <Link href={"/dashboard/create-new"}>
          <Button>Create New</Button>
        </Link>
      </div>

      {!Array.isArray(videoList) && "Loading..."}

      {Array.isArray(videoList) && !videoList.length && (
        <div>
          <EmptyState />
        </div>
      )}

      {Array.isArray(videoList) && videoList.length > 0 && (
        <div>
          <VideoList videoList={videoList} />
        </div>
      )}
    </div>
  );
}

export default page;
