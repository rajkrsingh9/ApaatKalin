"use client";

import React, { useMemo, useState } from 'react';

const clinicData = [
  {
    id: 1,
    name: 'City Care Hospital',
    distance: '1.2 km',
    emergency: 4,
    ICU: 2,
    general: 8,
    priority: 'Critical',
    address: '12 Market Road',
  },
  {
    id: 2,
    name: 'Green Valley Clinic',
    distance: '2.9 km',
    emergency: 1,
    ICU: 0,
    general: 12,
    priority: 'Urgent',
    address: '45 Rose Avenue',
  },
  {
    id: 3,
    name: 'Metro Plus Hospital',
    distance: '4.6 km',
    emergency: 6,
    ICU: 3,
    general: 17,
    priority: 'Stable',
    address: '89 Central Street',
  },
  {
    id: 4,
    name: 'Recovery First Clinic',
    distance: '5.1 km',
    emergency: 0,
    ICU: 1,
    general: 9,
    priority: 'Routine',
    address: '18 Lake View',
  },
];

const priorityLevels = [
  { id: 'emergency', label: 'Emergency', color: 'bg-red-500' },
  { id: 'urgent', label: 'Urgent', color: 'bg-amber-500' },
  { id: 'stable', label: 'Stable', color: 'bg-emerald-500' },
];

export default function BedAvailabilityPage() {
  const [patientName, setPatientName] = useState('');
  const [priority, setPriority] = useState('emergency');
  const [location, setLocation] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState('');
  const [searchRadius, setSearchRadius] = useState('5');
  const [useMapMode, setUseMapMode] = useState(false);

  const filteredClinics = useMemo(() => {
    const searchValue = nearbyLocations.trim().toLowerCase();

    return clinicData.filter((clinic) => {
      const matchesLocation = !searchValue || clinic.address.toLowerCase().includes(searchValue) || clinic.name.toLowerCase().includes(searchValue);
      const matchesPriority =
        priority === 'emergency'
          ? clinic.emergency > 0
          : priority === 'urgent'
            ? clinic.emergency > 0 || clinic.general > 0
            : clinic.general > 0 || clinic.ICU > 0;

      return matchesLocation && matchesPriority;
    });
  }, [nearbyLocations, priority]);

  const availabilitySummary = useMemo(() => {
    if (!filteredClinics.length) {
      return {
        headline: 'No immediate bed match found',
        details: 'Try widening the radius or switching priority level.',
      };
    }

    const firstOption = filteredClinics[0];
    return {
      headline: `${firstOption.name} has available care capacity`,
      details: `${firstOption.emergency || 0} emergency, ${firstOption.ICU || 0} ICU, ${firstOption.general || 0} general beds available.`,
    };
  }, [filteredClinics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      patientName,
      priority,
      location,
      nearbyLocations,
      searchRadius,
      checkedAt: new Date().toISOString(),
    };

    alert(`Bed availability request submitted for ${patientName || 'patient'} in priority: ${priority}.\n\nRequest data:\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className='min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white shadow-lg'>
          <p className='text-sm uppercase tracking-[0.2em] text-sky-100'>Healthcare Support</p>
          <h1 className='mt-2 text-3xl font-bold'>Check Bed Availability</h1>
          <p className='mt-2 max-w-2xl text-sm text-sky-50'>Find nearby hospitals or care clinics and check if a suitable hospital bed is available based on patient urgency.</p>
        </div>

        <div className='grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]'>
          <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-md'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Patient Name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder='Enter patient name'
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Priority Level</label>
                <div className='grid grid-cols-3 gap-2'>
                  {priorityLevels.map((item) => (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => setPriority(item.id)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        priority === item.id
                          ? `${item.color} text-white border-transparent shadow-md`
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Current Location / Area</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder='Example: Downtown, Pune'
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Nearby Hospitals / Care Clinics</label>
                <input
                  value={nearbyLocations}
                  onChange={(e) => setNearbyLocations(e.target.value)}
                  placeholder='Search clinic or nearby care center'
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Search Radius</label>
                <div className='flex items-center gap-3'>
                  <input
                    type='range'
                    min='1'
                    max='20'
                    step='1'
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                    className='w-full accent-sky-600'
                  />
                  <span className='min-w-[60px] rounded-lg bg-sky-50 px-2 py-1 text-center text-sm font-semibold text-sky-700'>
                    {searchRadius} km
                  </span>
                </div>
              </div>

              <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                <label className='flex items-center justify-between gap-3 text-sm font-semibold text-slate-700'>
                  <span>Use map selection</span>
                  <input
                    type='checkbox'
                    checked={useMapMode}
                    onChange={() => setUseMapMode(!useMapMode)}
                    className='h-4 w-4 accent-sky-600'
                  />
                </label>
              </div>

              <button
                type='submit'
                className='w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'
              >
                Check Availability
              </button>
            </form>
          </div>

          <div className='space-y-6'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-md'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Live Status</p>
                  <h2 className='mt-1 text-2xl font-bold text-slate-900'>Availability Summary</h2>
                </div>
                <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Updated now</span>
              </div>

              <div className='mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4'>
                <p className='text-base font-semibold text-sky-900'>{availabilitySummary.headline}</p>
                <p className='mt-2 text-sm text-sky-700'>{availabilitySummary.details}</p>
              </div>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-md'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-xl font-bold text-slate-900'>Nearby Facilities</h3>
                <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                  {filteredClinics.length} results
                </span>
              </div>

              <div className='space-y-4'>
                {filteredClinics.length ? (
                  filteredClinics.map((clinic) => (
                    <div key={clinic.id} className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                          <p className='text-lg font-bold text-slate-900'>{clinic.name}</p>
                          <p className='text-sm text-slate-600'>{clinic.address}</p>
                        </div>
                        <span className='inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>
                          {clinic.distance}
                        </span>
                      </div>

                      <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                        <div className='rounded-xl bg-white p-3'>
                          <p className='text-xs uppercase tracking-wider text-slate-500'>Emergency</p>
                          <p className='mt-2 text-xl font-bold text-red-600'>{clinic.emergency}</p>
                        </div>
                        <div className='rounded-xl bg-white p-3'>
                          <p className='text-xs uppercase tracking-wider text-slate-500'>ICU</p>
                          <p className='mt-2 text-xl font-bold text-amber-600'>{clinic.ICU}</p>
                        </div>
                        <div className='rounded-xl bg-white p-3'>
                          <p className='text-xs uppercase tracking-wider text-slate-500'>General</p>
                          <p className='mt-2 text-xl font-bold text-emerald-600'>{clinic.general}</p>
                        </div>
                      </div>

                      <div className='mt-4 flex items-center justify-between'>
                        <span className='rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700'>Priority: {clinic.priority}</span>
                        <button className='rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500'>
                          Request Help
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                    <p className='text-lg font-semibold text-slate-700'>No matching hospitals found</p>
                    <p className='mt-2 text-sm text-slate-500'>Try changing the priority or expanding the search radius.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
