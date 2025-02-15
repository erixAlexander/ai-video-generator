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
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const getUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      setUserDetail(result[0] || null);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      // Optionally, set an error state here
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getUserDetail();
    }
  }, [user, getUserDetail]);

  // Memoize the context values to prevent unnecessary re-renders
  const userContextValue = useMemo(
    () => ({ userDetail, setUserDetail }),
    [userDetail]
  );
  const videoContextValue = useMemo(
    () => ({ videoData, setVideoData }),
    [videoData]
  );

  return (
    <UserDetailContext.Provider value={userContextValue}>
      <VideoDataContext.Provider value={videoContextValue}>
        <div>
          <div className="hidden md:block h-screen bg-white fixed mt-[65px] w-64">
            <SideNav />
          </div>
          <div>
            <Header />
            <main className="md:ml-64 p-10">
              {loading ? <div>Loading...</div> : children}
            </main>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout;
