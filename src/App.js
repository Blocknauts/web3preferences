import React, { useEffect, useState, useRef, useContext } from "react";
import Main from './Main.js'
import Forms from './components/Forms/forms.js'
import './styles/main.css'
import { Routes, Route, Outlet, BrowserRouter as Router, } from "react-router-dom";
import {connectedwalletcontext} from './context/connectedwalletcontext.js'
export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  return (
    <connectedwalletcontext.Provider value={{walletConnected, setWalletConnected}}>
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/form" element={<Forms />} />
      </Routes>
    </Router>
    </connectedwalletcontext.Provider>
);

}