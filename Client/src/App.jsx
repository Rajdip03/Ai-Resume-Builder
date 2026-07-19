import React from 'react'
import { Route, Routes } from 'react-router-dom'; {/* For Navigation we have to import this Routes and route */ }
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Login from './pages/Login'
import Preview from './pages/preview';
import ATSReport from './pages/ATSReport';
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />       {/* Sub Route */}
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />  {/* Sub Route */}
          <Route path='ats/:resumeId' element={<ATSReport />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
