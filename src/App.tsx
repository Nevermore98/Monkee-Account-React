import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import 'zarm/dist/zarm.css'

import 'zarm/dist/zarm.css'

import Index from '@/views/Index'
import About from '@/views/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
