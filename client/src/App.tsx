// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import Header from "./components/Header"
import AddColumn from "./components/AddColumn"
import AddCard from "./components/AddCard"
import AddComment from "./components/AddComment"
import Kanban from "./components/Kanban"

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Header />

          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/addColumn" element={<AddColumn />}/>
            <Route path="/addCard" element={<AddCard />}/>
            <Route path="/addComment" element={<AddComment />}/>
            <Route path="/kanban" element={<Kanban />}/>
          </Routes>

        </div>
      </BrowserRouter>
    </>
  )
}

export default App
