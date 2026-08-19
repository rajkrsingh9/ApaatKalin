import React, { useContext, useMemo, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '@/context/SourceContext';
import { DestinationContext } from '@/context/DestinationContext';
import CarListOptions from './CarListOptions';

function SearchSection() {
    const { source } = useContext(SourceContext);
    const { destination } = useContext(DestinationContext);
    const [distance, setDistance] = useState(null);
    const [showRoute, setShowRoute] = useState(false);

    const calculateDistance = () => {
        if (!source || !destination || !google?.maps?.geometry) return;

        const dist = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(source.lat, source.lng),
            new google.maps.LatLng(destination.lat, destination.lng)
        );
        setDistance(dist * 0.000621374);
        setShowRoute(true);
    };

    const signalCommand = useMemo(() => {
        if (!source || !destination) return null;

        return {
            command: 'TRAFFIC_LIGHT_GREEN',
            route: {
                pickup: {
                    name: source.name || source.label,
                    lat: source.lat,
                    lng: source.lng,
                },
                dropoff: {
                    name: destination.name || destination.label,
                    lat: destination.lat,
                    lng: destination.lng,
                },
            },
            distanceMiles: Number(distance || 0).toFixed(2),
            target: 'traffic-light-signal',
            status: 'authorized',
            priority: 'normal',
            timestamp: new Date().toISOString(),
        };
    }, [source, destination, distance]);

    const downloadTrafficSignalJson = () => {
        if (!signalCommand) return;

        const blob = new Blob([JSON.stringify(signalCommand, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'traffic-light-command.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60 sm:p-5">
            <p className="text-xl font-bold text-slate-900">Get a Ride</p>
            <InputItem type="source" />
            <InputItem type="destination" />

            <button
                className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={calculateDistance}
            >
                Search
            </button>

            {signalCommand && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800">Traffic Light Signal JSON</p>
                        <button
                            onClick={downloadTrafficSignalJson}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                            Download JSON
                        </button>
                    </div>
                    <pre className="max-h-60 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                        {JSON.stringify(signalCommand, null, 2)}
                    </pre>
                </div>
            )}

            {showRoute && distance ? <CarListOptions distance={distance} /> : null}
        </div>
    );
}

export default SearchSection;
