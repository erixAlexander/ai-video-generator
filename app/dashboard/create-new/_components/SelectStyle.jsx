"use client";
import Image from "next/image";
import React, { useState } from "react";

function SelectStyle({ onUserSelect }) {
  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.jpg",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpg",
    },
    {
      name: "Comic",
      image: "/comic.jpg",
    },
    {
      name: "Watercolor",
      image: "/watercolor.jpg",
    },
    {
      name: "GTA",
      image: "/gta.jpg",
    },
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className="mt-10">
      <h2 className="text-primary text-xl font-bold">Style</h2>
      <p className="text-gray-500">What is the Style of your video?</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {styleOptions.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative hover:scale-105 transition-all hover:cursor-pointer ${
                selectedOption === item.name &&
                "border-4 border-primary rounded-xl"
              }`}
            >
              <h2 className="absolute p-1 bg-black bottom-0 w-full text-white rounded-b-lg text-center">
                {item.name}
              </h2>
              <Image
                className="rounded-lg w-full h-40 object-cover"
                src={item.image}
                width={100}
                height={50}
                alt="img"
                onClick={() => {
                  setSelectedOption(item.name);
                  onUserSelect("style", item.name);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SelectStyle;
