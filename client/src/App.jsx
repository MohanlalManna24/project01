import React from 'react'
import Register from './components/Register'
import Login from './components/Login'
import EmailVarify from './components/EmailVarify'
import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'

const App = () => {
  return (
    <div>
      <Register/>
      <Login/>
      <EmailVarify/>
      <ForgetPassword/>
      <ResetPassword/>
    </div>
  )
}

export default App
