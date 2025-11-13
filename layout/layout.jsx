import React from 'react'
import Header from '../components/header'
import SideBar from '../components/sidebars'
import Header2 from '../components/header/header2'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export default function Layout({children, header=true}) {

  return (
    <div className='w-full min-h-screen flex relative bg-white'>
      <SideBar/>
      <div className="flex flex-1 flex-col bg-[#f8f8ff]">
        {header && <Header />}
        <div className={`flex flex-col flex-1 ${header ? 'pt-[80px] md:pt-[90px]' : ''}`}>
          {children}
        </div>
      </div> 
    </div>
  )
}
