"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_context/VideoDataContext";
import { UserDetailContext } from "../_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { db } from "../../configs/db";
import { Users } from "../../configs/schema";
import { eq } from "drizzle-orm";

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [hidden, setHidden] = useState(true);
  const [userDetail, setUserDetail] = useState({});

  const getUserDetail = useCallback(async () => {
    if (!user) return;
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user.primaryEmailAddress.emailAddress));

      setUserDetail(result[0]);
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getUserDetail();
    }
  }, [isLoaded, isSignedIn, getUserDetail]);

  const userContextValue = useMemo(
    () => ({ userDetail, setUserDetail }),
    [userDetail]
  );
  const videoContextValue = useMemo(
    () => ({ videoData, setVideoData }),
    [videoData]
  );

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <UserDetailContext.Provider value={userContextValue}>
      <VideoDataContext.Provider value={videoContextValue}>
        <div>
          <div
            className={`${
              hidden && "hidden"
            } md:block h-screen bg-white fixed mt-[65px] w-64 z-10`}
          >
            <SideNav />
          </div>
          <div>
            <Header setHidden={setHidden} />
            <main onClick={() => setHidden(true)} className="md:ml-64 p-10">
              {children}
            </main>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout;
