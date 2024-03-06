import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Chat from './Pages/Chat'
import AvatarSet from './Components/AvatarSet'
import {BrowserRouter,Routes,Route} from 'react-router-dom'



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login/>}/>
          <Route path='/register' element={<Register/>} />
          <Route path='/avatarSet' element={<AvatarSet/>} />
          <Route path='/' element={<Chat/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
