import React from 'react'
import Navbar from '../components/Navbar'
import Search from './Search'
import Chats from './Chats'

const SideBar = () => {
  return (
    <div className='w-1/4 border-r-[1px] border-solid border-sky-800'>
      <Navbar/>
      <Search/>
      <Chats/>  
    </div>
  )
}

export default SideBar