"use client";
import { DestinationContext } from '@/context/DestinationContext';
import { SourceContext } from '@/context/SourceContext';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function InputItem({ type }) {
    const [value, setValue] = useState(null);
    const [placeholder, setPlaceholder] = useState(null);
    const { source, setSource } = useContext(SourceContext);
    const { destination, setDestination } = useContext(DestinationContext);

    useEffect(() => {
        type === 'source'
            ? setPlaceholder('PickUpLocation')
            : setPlaceholder('DropOffLocation');
    }, [type]);

    const getLatAndLng = (place, type) => {
        const placeId = place.value.place_id;
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId }, (place, status) => {
            if (status === 'OK' && place.geometry && place.geometry.location) {
                if (type === 'source') {
                    setSource({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        name: place.formatted_address,
                        label: place.name
                    });
                } else {
                    setDestination({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        name: place.formatted_address,
                        label: place.name
                    });
                }
            }
        });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setSource({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: 'Current Location',
                    label: 'Current Location'
                });
                setValue({ label: 'Current Location' });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const clearLocation = () => {
        setSource(null);
        setValue(null);
    };

    return (
        <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4 relative">
            <Image src={type === 'source' ? '/src.png' : '/destination.png'} width={15} height={15} />
            <GooglePlacesAutocomplete
                selectProps={{
                    value,
                    onChange: (place) => {
                        getLatAndLng(place, type);
                        setValue(place);
                    },
                    placeholder: placeholder,
                    isClearable: true,
                    className: 'w-full',
                    components: {
                        DropdownIndicator: false
                    },
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: '#00ffff00',
                            border: 'none',
                        }),
                    }
                }}
            />
            {type === 'source' && (
                <>
                    <button
                        onClick={getCurrentLocation}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Use Current Location
                    </button>

                    {/* Display X button only if the current location is set */}
                    {source && source.label === 'Current Location' && (
                        <button
                            onClick={clearLocation}
                            className="absolute right-2 text-white font-bold p-2 rounded-lg"
                        >
                            X
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default InputItem;
