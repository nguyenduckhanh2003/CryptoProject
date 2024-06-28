import React from 'react'
import Navigation from '../slide/Navigation'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
    <main>
      <Navigation/>
      <Outlet/>
    </main>
  )
}

export default Home