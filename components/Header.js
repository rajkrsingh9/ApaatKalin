import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Header() {
  const headerMenu = [
    { id: 1, name: 'Home', icon: '/home.png', href: '/' },
    { id: 2, name: 'About Us', icon: '/about.png', href: '#' },
    { id: 3, name: 'My Profile', icon: '/profile.png', href: '#' },
    { id: 4, name: 'Check Bed Availability', icon: '/bed.png', href: '/bed-availability' },
  ];

  return (
    <div className='flex items-center justify-between border-b-[4px] border-gray-200 p-4 pb-3 pl-10'>
      <Link href='/' className='flex items-center'>
        <Image src='/Apatkalin.png' width={50} height={50} alt='Logo' />
      </Link>
      <div className='flex items-center gap-6'>
        {headerMenu.map((item) => (
          <Link key={item.id} href={item.href} className='flex items-center gap-1 text-slate-800 transition hover:text-blue-600'>
            <Image src={item.icon} width={17} height={17} alt={item.name} />
            <h2 className='text-[14px] font-semibold'>{item.name}</h2>
          </Link>
        ))}
      </div>
      <UserButton />
    </div>
  );
}

export default Header;