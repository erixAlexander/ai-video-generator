import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
} from "../../../../components/ui/alert-dialog";
import Image from "next/image";

const CustomLoading = ({ loading, text = "Loading..." }) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <div className="flex gap-4 items-center justify-center">
          <Image src={"/loading.gif"} width={40} height={40} alt="loading" />
          <h2>{text}</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomLoading;
