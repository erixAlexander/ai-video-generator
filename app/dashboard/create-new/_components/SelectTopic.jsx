"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

function SelectTopic({ onUserSelect }) {
  const options = [
    "Custom Prompt",
    "AI Story",
    "Scary Story",
    "Historical Facts",
    "Bed time Story",
    "Motivational",
    "Fun Facts ",
  ];
  const [selectedoption, setSelectedOption] = useState();
  return (
    <div>
      <h2 className="text-primary text-xl font-bold">Content</h2>
      <p className="text-gray-500">What is the topic of your video?</p>

      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          if (value !== "Custom Prompt") {
            onUserSelect("topic", value);
          }
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Select Content type" />
        </SelectTrigger>
        <SelectContent className="">
          {options?.map((item, index) => {
            return (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedoption === "Custom Prompt" && (
        <Textarea
          className="mt-8"
          placeholder="Write your custom prompt"
          onChange={(e) => {
            onUserSelect("topic", e.target.value);
          }}
        />
      )}
    </div>
  );
}

export default SelectTopic;
