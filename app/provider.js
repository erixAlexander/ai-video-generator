"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../configs/db";
import { Users } from "../configs/schema";
import { eq } from "drizzle-orm";
import CustomLoading from "./dashboard/create-new/_components/CustomLoading";

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        try {
          const result = await db
            .select()
            .from(Users)
            .where(eq(Users.email, user.primaryEmailAddress.emailAddress));

          if (!result[0]) {
            await db.insert(Users).values({
              name: user.fullName,
              email: user.primaryEmailAddress.emailAddress,
              imageUrl: user.imageUrl,
            });
          }
        } catch (error) {
          console.error("Error verifying user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (isLoaded) {
      verifyUser();
    }
  }, [user, isLoaded]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CustomLoading loading={loading} />
      </div>
    );
  }

  return <>{children}</>;
}

export default Provider;
