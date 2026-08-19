import React, { useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { SourceContext } from '@/context/SourceContext';
import Image from 'next/image';
import { DestinationContext } from '@/context/DestinationContext';

function GoogleMapSection() {
    const containerStyle = {
        width: '100%',
        height: '72vh',
        minHeight: '420px',
        borderRadius: '20px',
        overflow: 'hidden'
    };

    const { source, setSource } = useContext(SourceContext);
    const { destination, setDestination } = useContext(DestinationContext);

    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -3.745, lng: -38.523 });
    const [currentPosition, setCurrentPosition] = useState(null);
    const [directionRoutePoints, setDirectionRoutePoints] = useState([]);
    const [routeAlertShown, setRouteAlertShown] = useState(false);
    const [heading, setHeading] = useState(0);
    const [trafficSignals, setTrafficSignals] = useState([]);
    const [signalCycle, setSignalCycle] = useState(0);

    useEffect(() => {
        if (source?.lat) {
            const nextCenter = { lat: source.lat, lng: source.lng };
            setMapCenter(nextCenter);

            if (map) {
                map.panTo(nextCenter);
            }
        }

        if (source?.lat && destination?.lat) {
            directionRoute();
        }
    }, [source, destination, map]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        let isMounted = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!isMounted) return;
                const { latitude, longitude, heading } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
                if (heading) setHeading(heading);
            },
            (error) => {
                console.warn('Geolocation lookup failed:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 60000,
            }
        );

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!trafficSignals.length) return;

        const interval = setInterval(() => {
            setSignalCycle((prev) => (prev + 1) % (trafficSignals.length + 2));
        }, 1500);

        return () => clearInterval(interval);
    }, [trafficSignals]);

    useEffect(() => {
        if (!directionRoutePoints?.routes || !directionRoutePoints.routes.length) return;

        const route = directionRoutePoints.routes[0];
        const steps = route.legs?.[0]?.steps || [];
        const signalPoints = [];

        steps.forEach((step) => {
            const path = step.path || [];
            if (!path.length) return;

            const sampleInterval = Math.max(1, Math.floor(path.length / 3));

            for (let index = 1; index <= 3; index += 1) {
                const sampleIndex = Math.min(path.length - 1, index * sampleInterval);
                const point = path[sampleIndex];
                if (point) {
                    signalPoints.push({
                        lat: point.lat(),
                        lng: point.lng(),
                        id: `${step.instructions}-${sampleIndex}`
                    });
                }
            }
        });

        const finalSignals = signalPoints.slice(0, 5).map((point, index) => ({
            ...point,
            order: index
        }));

        setTrafficSignals(finalSignals);
        setSignalCycle(0);
    }, [directionRoutePoints]);

    const updateLocationFromCoords = (type, lat, lng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const formattedAddress = results[0].formatted_address;
                const nextLocation = {
                    lat,
                    lng,
                    name: formattedAddress,
                    label: formattedAddress.split(',')[0] || 'Selected Location'
                };

                if (type === 'source') {
                    setSource(nextLocation);
                } else {
                    setDestination(nextLocation);
                }
            }
        });
    };

    const directionRoute = () => {
        if (!source || !destination || !google?.maps?.DirectionsService) return;

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

                    if (!routeAlertShown) {
                        showRouteAlert(result);
                        setRouteAlertShown(true);
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

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    const onUnmount = () => {
        setMap(null);
    };

    const handleMapClick = (event) => {
        if (!event?.latLng) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        if (source && !destination) {
            updateLocationFromCoords('destination', lat, lng);
            return;
        }

        if (!source) {
            updateLocationFromCoords('source', lat, lng);
        }
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={source?.lat ? 15 : 12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{ mapId: 'bf5e92fe30f6eda' }}
        >
            {currentPosition && (
                <MarkerF
                    position={currentPosition}
                    icon={{
                        url: '/live.png',
                        scaledSize: { width: 30, height: 30 }
                    }}
                >
                    <OverlayViewF position={currentPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='inline-block bg-white p-2 font-bold'>
                            <p className='text-[16px] text-black'>Current Location</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {currentPosition && (
                <div className='absolute right-2 top-11 p-2'>
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
                    draggable={true}
                    onDragEnd={(event) => {
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        updateLocationFromCoords('source', lat, lng);
                    }}
                    icon={{
                        url: '/src.png',
                        scaledSize: { width: 20, height: 20 }
                    }}
                >
                    <OverlayViewF position={{ lat: source.lat, lng: source.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='inline-block bg-white p-2 font-bold'>
                            <p className='text-[16px] text-black'>{source.label}</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {destination?.lat && (
                <MarkerF
                    position={{ lat: destination.lat, lng: destination.lng }}
                    draggable={true}
                    onDragEnd={(event) => {
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        updateLocationFromCoords('destination', lat, lng);
                    }}
                    icon={{
                        url: '/destination.png',
                        scaledSize: { width: 20, height: 20 }
                    }}
                >
                    <OverlayViewF position={{ lat: destination.lat, lng: destination.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='inline-block bg-white p-2 font-bold'>
                            <p className='text-[16px] text-black'>{destination.label}</p>
                        </div>
                    </OverlayViewF>
                </MarkerF>
            )}

            {trafficSignals.map((signal) => {
                const signalState = signalCycle - signal.order;
                const status = signalState <= 0 ? 'red' : signalState === 1 ? 'amber' : 'green';

                return (
                    <OverlayViewF
                        key={signal.id}
                        position={{ lat: signal.lat, lng: signal.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className={`traffic-signal ${status}`} aria-label={`Traffic signal ${status}`}>
                            <span className='traffic-signal__light traffic-signal__red' />
                            <span className='traffic-signal__light traffic-signal__amber' />
                            <span className='traffic-signal__light traffic-signal__green' />
                        </div>
                    </OverlayViewF>
                );
            })}

            {directionRoutePoints && (
                <DirectionsRenderer
                    directions={directionRoutePoints}
                    options={{
                        polylineOptions: {
                            strokeColor: 'blue',
                            strokeOpacity: 1,
                            strokeWeight: 8
                        },
                        suppressMarkers: true,
                    }}
                />
            )}
        </GoogleMap>
    );
}

export default GoogleMapSection;
