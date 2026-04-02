import React from 'react'
import { Route, Routes } from 'react-router-dom'; {/* For Navigation we have to import this Routes and route */ }
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import preview from './pages/preview'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />       {/* Sub Route */}
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />  {/* Sub Route */}
        </Route>

        <Route path='view/:resumeId' element={<preview />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
