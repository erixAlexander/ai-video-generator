"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const SelectDuration = ({ onUserSelect }) => {
  const options = ["30 Seconds", "60 Seconds"];

  return (
    <div className="mt-8">
      <h2 className="text-primary text-xl font-bold">Duration</h2>
      <p className="text-gray-500">What is the duration of your video?</p>

      <Select
        onValueChange={(value) => {
          onUserSelect("duration", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent className="">
          {options.map((item, index) => {
            return (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDuration;
