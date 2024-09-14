import Image from 'next/image'
import React from 'react'
import { CarListData } from '@/utils/CarListData'
import { IconName } from "react-icons/hi2";

function CarListItem({car, distance}) {
  return (
    <div>
      <div className='grid'>
        <div className='flex items-center justify-between mt-5 gap-5 '>
            <div >
                <Image src={car.image} alt='car'
                width={100} height={100}/>
            </div>
            <div>
                <p className='font-semibold text-[18px]'>{car.name}</p>
                <p>{car.desc}</p>
            </div>
            <div >
                <p className='text-[18px] px-5 font-semibold mt-1 border-2 border-black rounded hover:bg-sky-600	p-[5px] w-[100%]'>Call</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CarListItem