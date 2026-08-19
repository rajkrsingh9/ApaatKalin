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
        setPlaceholder(type === 'source' ? 'PickUpLocation' : 'DropOffLocation');
    }, [type]);

    const setLocationData = (locationData) => {
        if (type === 'source') {
            setSource(locationData);
        } else {
            setDestination(locationData);
        }
    };

    const getLatAndLng = (place, type) => {
        const placeValue = place?.value ?? place;

        if (!placeValue || !placeValue.place_id) {
            if (type === 'source') setSource(null);
            else setDestination(null);
            return;
        }

        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId: placeValue.place_id }, (placeDetails, status) => {
            if (status === 'OK' && placeDetails?.geometry?.location) {
                const locationData = {
                    lat: placeDetails.geometry.location.lat(),
                    lng: placeDetails.geometry.location.lng(),
                    name: placeDetails.formatted_address || placeDetails.name,
                    label: placeDetails.name || placeDetails.formatted_address,
                };
                setLocationData(locationData);
            }
        });
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: 'Current Location',
                    label: 'Current Location'
                };

                setLocationData(currentLocation);
                setValue({ label: 'Current Location' });
            },
            (error) => {
                console.warn('Current location request failed:', error.message);
                alert('Unable to get your current location right now. Please try again or pick a location on the map.');
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 60000,
            }
        );
    };

    const clearLocation = () => {
        if (type === 'source') {
            setSource(null);
        } else {
            setDestination(null);
        }
        setValue(null);
    };

    return (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3 relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                    <Image src={type === 'source' ? '/src.png' : '/destination.png'} alt='location' width={15} height={15} />
                </div>
                <div className="flex-1 min-w-0">
                    <GooglePlacesAutocomplete
                        selectProps={{
                            value,
                            onChange: (place) => {
                                if (!place || !place.value || !place.value.place_id) {
                                    setValue(null);
                                    clearLocation();
                                    return;
                                }

                                setValue(place);
                                getLatAndLng(place, type);
                            },
                            placeholder,
                            isClearable: true,
                            className: 'w-full text-slate-800',
                            components: { DropdownIndicator: false },
                            styles: {
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#ffffff',
                                    border: 'none',
                                    boxShadow: 'none',
                                    color: '#0f172a',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: '#0f172a',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: '#0f172a',
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: '#64748b',
                                }),
                            }
                        }}
                    />
                </div>
                {type === 'source' && (
                    <button
                        onClick={getCurrentLocation}
                        className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:text-sm"
                    >
                        Use Current
                    </button>
                )}
                {type === 'source' && source && source.label === 'Current Location' && (
                    <button
                        onClick={clearLocation}
                        className="absolute -right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-800 px-2 py-1 text-xs font-bold text-white"
                        aria-label="Clear current location"
                    >
                        X
                    </button>
                )}
            </div>
        </div>
    );
}

export default InputItem;
