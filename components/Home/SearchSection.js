import React, { useContext, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '@/context/SourceContext';
import { DestinationContext } from '@/context/DestinationContext';
import CarListOptions from './CarListOptions';

function SearchSection() {
    const { source, setSource } = useContext(SourceContext);
    const { destination, setDestination } = useContext(DestinationContext);
    const [distance, setDistance] = useState(null);
    const [showRoute, setShowRoute] = useState(false);

    const calculateDistance = () => {
        if (!source || !destination) return;

        const dist = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(source.lat, source.lng),
            new google.maps.LatLng(destination.lat, destination.lng)
        );
        setDistance(dist * 0.000621374); // Convert to miles
        setShowRoute(true); // Show the route after calculating distance
    };

    return (
        <div>
            <div className="p-2 md:p-6 border-[2px] rounded-xl">
                <p className="text-[20px] font-bold">Get a Ride</p>
                <InputItem type="source" />
                <InputItem type="destination" />

                <button
                    className="p-3 bg-black w-full mt-5 text-white rounded-lg"
                    onClick={() => calculateDistance()}
                >
                    Search
                </button>
            </div>
            {showRoute && distance ? <CarListOptions distance={distance} /> : null}
        </div>
    );
}

export default SearchSection;
