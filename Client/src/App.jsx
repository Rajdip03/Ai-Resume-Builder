import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'; {/* For Navigation we have to import this Routes and route */ }
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Login from './pages/Login'
import Preview from './pages/preview';
import ATSReport from './pages/ATSReport';
import { useDispatch } from 'react-redux';
import api from './configs/api';
import { login, setLoading } from './app/features/authSlice';
import { Toaster } from 'react-hot-toast';
const App = () => {

  const dispatch = useDispatch()
  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: token } })
        if (data.user) {
          dispatch(login({ user: data.user, token: token }))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }

    } catch (error) {
      console.log(error)
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserData()
  }, [])
  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />       {/* Sub Route */}
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />  {/* Sub Route */}
          <Route path='ats/:resumeId' element={<ATSReport />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />
      </Routes>
    </>
  )
}

export default App
