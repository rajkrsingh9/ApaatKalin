import { CarListData } from '@/utils/CarListData'
import React, { useState } from 'react'
import CarListItem from './CarListItem'
import { useRouter } from 'next/navigation';

function CarListOptions({distance}) {
  const [activeIndex,setActiveIndex] = useState();
  const [selectedCar,setSelectedCar]=useState([]);

  const router=useRouter();

  return (
    <div className='mt-5 p-5 overflow-auto h-[250px] '>
      <h2 className='text-[22px] font-bold'>Call for 
      </h2>
      {CarListData.map((item, index)=>(
        <div className={`p-5 px-4 cursor-pointer rounded-md border-black 
          ${activeIndex==index?'border-[2px]':null}`}
        onClick={()=>{
          setActiveIndex(index)
          setSelectedCar(item)
        }
        }>
          <CarListItem car={item} distance={distance}/>
        </div>
      ))}
      {selectedCar?.name? <div className='flex justify-between fixed bottom-5 bg-white p-3 shadow-xl w-full md:w-[30%] border-[2px] items-center'>
        <h2>Make Payment For</h2>
        <button className='p-3 bg-black text-white rounded-lg text-center'
        onClick={()=>{
          alert(` ${selectedCar.name} will reach you in ${(distance*380/75).toFixed(2)} minutes`);
        }}
        >Request {selectedCar.name}</button>
      </div>:null}

    </div>
  )
}

export default CarListOptions