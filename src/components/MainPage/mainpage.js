import React, {useContext} from 'react'
import './mainpage.css'
import iPhone from '../../assets/iPhone 13.png'
import Code from '../../assets/code.png'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {connectedwalletcontext} from '../../context/connectedwalletcontext.js'
import { useNavigate } from 'react-router-dom';

function Mainpage() {
  const {walletConnected, setWalletConnected} = useContext(connectedwalletcontext);
  const navigate = useNavigate();
  const goToForm = () => {
    if (walletConnected) {
        navigate("/form")
    } else {
      alert("connect your wallet first")
    }
  }
  return (
    <div>
      <div className="mainpage__container">
        <div>
              <div className='mainpage__title'>
                <h1>Web3preferences</h1>
                <h2>The #1 fully-customizable Web3.0 app</h2>
              </div>
              <div className="mainpage__paragraph">
                <p>Let web3 apps access your preferences through a smart contract. <br />Update them across all supported apps in seconds.</p>
              </div>
              <div>
                <button className="mainpage__featuresbutton">Explore features</button>
  <button className="mainpage__appbutton" onClick={goToForm}>Go to app</button>
              </div>
        </div>
        <div className="mainpage__image">
              <img src={iPhone}/>
        </div>
      </div>
      <div className="mainpage__features">
        <div className="mainpage__features__title">
            <h1>What do we offer?</h1>
            <p>Main features of our app</p>
        </div>
        <div className="mainpage__features__container">
            <div className="mainpage__featurebox">
              <p></p>
              <h1>Color Changer</h1>
              <h5>Choose a global site theme and accents without having to toggle themes manually</h5>
            </div>
            <div className="mainpage__featurebox">
              <p></p>
              <h1>Cookies</h1>
              <h5>Activate or deactivate those annoying cookies popup. Your choice.</h5>
            </div>
            <div className="mainpage__featurebox">
              <p></p>
              <h1>Fonts</h1>
              <h5>Choose whatever font you like most for your webpages. Put the style that most suits you!</h5>
            </div>
        </div>
      </div>
      <div className="mainpage__gettingstarted">
        <div className="mainpage__gettingstarted__title">
            <h1>Getting Started</h1>
            <p>Our main features and everything our app has to offer to our customers.</p>
        </div>
        <div className="mainpage__gettingstarted__containerbox">
           <div className="mainpage__gettingstarted__containerboxes">
             <div className="mainpage__gettingstarted__boxes">
                <button>
                    <p>1</p>
                    <h5>Connect your wallet</h5>
                </button>
                <hr />
             </div>
             <div className="mainpage__gettingstarted__boxes">
                <button>
                  <p>2</p>
                  <h5>Choose your settings</h5>
                </button>
                <hr />
                <div></div>
             </div>
             <div className="mainpage__gettingstarted__boxes">
                <button>
                  <p>3</p>
                  <h5>Get applied everywhere</h5>
                </button>
                <hr />
             </div>
           </div>
           <div className="mainpage__image__code">
             <img src={Code} />
           </div>
        </div>
      </div>
   </div>
  )
}

export default Mainpage