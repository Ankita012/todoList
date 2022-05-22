import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoDashboard  from "./TodoDashboard"
import Login from "./login"
import Signup from "./Signup"
import Home from "./home"

function App() {
  return(
  <BrowserRouter>  
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/todo" element={<TodoDashboard/>} />
    </Routes>
  </BrowserRouter>
  )
}
export default App;