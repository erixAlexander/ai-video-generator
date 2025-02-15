import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

function EmptyState() {
  return (
    <div className="p-5 flex flex-col items-center gap-5 mt-6 border-2 py-24">
      <h2>You don't have any short videos generated</h2>
      <Link href={"/dashboard/create-new"}>
        <Button>Create New Video</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
