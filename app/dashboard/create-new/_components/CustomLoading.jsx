import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import for hiding title
import Image from "next/image";

const CustomLoading = ({ loading, text = "Loading..." }) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        {/* Accessible title for screen readers */}
        <AlertDialogTitle>
          <VisuallyHidden>Loading</VisuallyHidden>
        </AlertDialogTitle>
        <div className="flex gap-4 items-center justify-center">
          <Image
            src="/loading.gif"
            width={40}
            height={40}
            alt="loading"
            unoptimized={true}
            priority // Ensures it's preloaded for better LCP
          />
          <h2>{text}</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomLoading;
