"use client"

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import SearchSection from "../components/Home/SearchSection";
import GoogleMapSection from "@/components/Home/GoogleMapSection";
import { SourceContext } from "@/context/SourceContext";
import { DestinationContext } from "@/context/DestinationContext";
import { useState } from "react";
import React from 'react'
import { LoadScript } from "@react-google-maps/api";


export default function Home() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  return (
    <SourceContext.Provider value={{ source, setSource }}>
      <DestinationContext.Provider value={{ destination, setDestination }}>
        <LoadScript
          libraries={['places', 'geometry']}
          googleMapsApiKey={"AIzaSyCTW6QPKOW7TSfRQ9LhOvLfOuJJfZvOdNs"}
        >
          <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto max-w-[70vw] px-3 py-4 sm:px-5 lg:px-6">
              <div className="grid grid-cols-2 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="w-full">
                  <SearchSection />
                </div>
                <div className="w-full min-h-[420px]">
                  <GoogleMapSection />
                </div>
              </div>
            </div>
          </div>
        </LoadScript>
      </DestinationContext.Provider>
    </SourceContext.Provider>
  );
}

