import React, { useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { SourceContext } from '@/context/SourceContext';
import Image from 'next/image'
import { DestinationContext } from '@/context/DestinationContext';

function GoogleMapSection() {
    const containerStyle = {
        width: '100%',
        height: '100vh'
    };

    const { source, setSource } = useContext(SourceContext);
    const { destination } = useContext(DestinationContext);

    const [map, setMap] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null); // Track live location
    const [directionRoutePoints, setDirectionRoutePoints] = useState([]);
    const [routeAlertShown, setRouteAlertShown] = useState(false);
    const [heading, setHeading] = useState(0); // Track compass heading (direction)

    useEffect(() => {
        if (source?.lat && map) {
            map.panTo({ lat: source.lat, lng: source.lng });
        }
        if (source?.lat && destination?.lat) {
            directionRoute();
        }
    }, [source, destination]);

    useEffect(() => {
        // Enable geolocation tracking
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, heading } = position.coords;
                    setCurrentPosition({ lat: latitude, lng: longitude });
                    if (heading) setHeading(heading); // Update the compass direction
                },
                (error) => {
                    console.error("Error getting position: ", error);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );

            // Clean up the geolocation watch on component unmount
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    const directionRoute = () => {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route(
            {
                origin: { lat: source.lat, lng: source.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirectionRoutePoints(result);

                    // Show the alert with step-by-step directions only once after clicking the search button
                    if (!routeAlertShown) {
                        showRouteAlert(result);
                        setRouteAlertShown(true); // Ensure it's shown only once
                    }
                } else {
                    console.error('Error fetching directions');
                }
            }
        );
    };

    const showRouteAlert = (result) => {
        if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            const steps = route.legs[0].steps.map((step, index) => `${index + 1}. ${step.instructions}`).join('\n');

            alert(`
                Shared route from ${source.label} to ${destination.label}:
                
                Estimated Time: ${route.legs[0].duration.text}
                Distance: ${route.legs[0].distance.text}
                Current Traffic: ${route.legs[0].duration_in_traffic ? route.legs[0].duration_in_traffic.text : "N/A"}

                Directions:
                ${steps}
            `);
        }
    };

    const onLoad = (map) => {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map);
    };

    const onUnmount = () => {
        setMap(null);
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: source?.lat || -3.745, lng: source?.lng || -38.523 }}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{ mapId: 'bf5e92fe30f6eda' }} // Retain custom map styling
        >
            {/* Marker for current location */}
            {currentPosition && (
                <MarkerF
                    position={currentPosition}
                    icon={{
                        url: '/live.png', // Use an icon to represent current location
                        scaledSize: { width: 30, height: 30 }
                    }}
                >
                    <OverlayViewF position={currentPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='p-2 bg-white font-bold inline-block'>
                            <p className='text-black text-[16px]'>Current Location</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {/* Compass for showing direction */}
            {currentPosition && (
                <div className='absolute top-11 right-2 p-2'>
                    <div
                        style={{
                            transform: `rotate(${heading}deg)`,
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            padding: '10px',
                        }}
                    >
                        <Image src='/compass-icon.png' width={50} height={50} alt="Compass" />
                    </div>
                </div>
            )}

            {source?.lat && (
                <MarkerF
                    position={{ lat: source.lat, lng: source.lng }}
                    icon={{
                        url: '/src.png',
                        scaledSize: { width: 20, height: 20 }
                    }}
                >
                    <OverlayViewF position={{ lat: source.lat, lng: source.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='p-2 bg-white font-bold inline-block'>
                            <p className='text-black text-[16px]'>{source.label}</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {destination?.lat && (
                <MarkerF
                    position={{ lat: destination.lat, lng: destination.lng }}
                    icon={{
                        url: '/destination.png',
                        scaledSize: { width: 20, height: 20 }
                    }}
                >
                    <OverlayViewF position={{ lat: destination.lat, lng: destination.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='p-2 bg-white font-bold inline-block'>
                            <p className='text-black text-[16px]'>{destination.label}</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {directionRoutePoints && (
                <DirectionsRenderer
                    directions={directionRoutePoints}
                    options={{
                        polylineOptions: {
                            strokeColor: 'blue',
                            strokeOpacity: 1,
                            strokeWeight: 8
                        },
                        suppressMarkers: true // Hide default markers to use custom ones
                    }}
                />
            )}
        </GoogleMap>
    );
}

export default GoogleMapSection;
