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
  const [source,setSource]=useState([])
  const [destination,setDestination]=useState([])
  return (
    <SourceContext.Provider value={{source,setSource}}>
    <DestinationContext.Provider value={{destination,setDestination}}>
      <LoadScript 
      libraries={['places']}
      googleMapsApiKey={"AIzaSyCTW6QPKOW7TSfRQ9LhOvLfOuJJfZvOdNs"}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div >
          <SearchSection/>
        </div>
        <div className="col-span-2">
          <GoogleMapSection/>
        </div>
      </div>
      </LoadScript>
    </DestinationContext.Provider>
    </SourceContext.Provider>
  );
}

