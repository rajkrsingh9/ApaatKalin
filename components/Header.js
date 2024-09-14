import { UserButton, SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { HiUser } from "react-icons/hi2";


function Header(){
    const headerMenu=[
        {
            id:1,
            name:'Home',
            icon: '/home.png'
        },
        {
          id:2,
          name:'About Us',
          icon: '/about.png'
        },
        {
          id:3,
          name:'My Profile',
          icon: '/profile.png'
        },
        {
          id:4,
          name:'Check Bed Availability',
          icon: '/bed.png'
        }
      ]
        
  return (
    <div className='flex justify-between p-4 pb-3 pl-10 border-b-[4px] border-gray-200 '>
      <div>
        <Image src='/Apatkalin.png' width={50} height={50} alt='Logo'/>
      </div>
      <div className='flex gap-6 items-center'>
        { headerMenu.map((item)=>(
          <div className='flex gap-1 items-center'>
            <Image src={item.icon} width={17} height={17}/>
            <h2 className='text-[14px] font-semibold'>{item.name}</h2>
          </div>
        ))}
      </div>
      {/* <SignInButton/> */}
      <UserButton/>
    </div>
  )
}

export default Header