import React, { useEffect, useState, useRef, useContext } from "react";
import "./forms.css";
import FontPicker from "font-picker-react";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

import { Contract, providers, utils } from "ethers";
import { abi, CONTRACT_ADDRESS } from "../../constants";
import Web3Modal from "web3modal";
import {connectedwalletcontext} from '../../context/connectedwalletcontext.js'
import { Navigate, history } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Forms() {
  const [preferences, setPreferences] = useState({
    theme: {
      colorMode: 'dark',
      font: 'Open Sans',
      fontColor: '#131313',
      highlight: '#0000ff',
    },
    cookies: {
      strictlyNecessary: true,
      performance: false,
      functional: false,
      targeting: false,
    }
  });
  const web3ModalRef = useRef();
  const {walletConnected, setWalletConnected} = useContext(connectedwalletcontext);
  console.log(walletConnected)
  const navigate = useNavigate();


  useEffect(() => {
    if (!walletConnected) {
      navigate("/")
    }
  }, []);

  function updatePreferencesState(category, e) {
    console.log(preferences[category][e.target.name]);
    let newPreferences = { ...preferences };

    let newValue = e.target.value;
    if (category === 'cookies') newValue = e.target.checked;

    newPreferences[category][e.target.name] = newValue;
    setPreferences(newPreferences);
    console.log(preferences[category][e.target.name]);
  }

  function updateFontPreference(name) {
    let newPreferences = { ...preferences };
    newPreferences.theme.font = name;
    setPreferences(newPreferences);
  }

  function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ3NDU5Mzk3MEFjQTIwMmQ2NGM1NmU1OTRiNkQ1MTBBOTNlRjk3ODkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDY1Njk1MTQ1MDMsIm5hbWUiOiJibG9ja25hdXRzIn0.pmxNt34aCQnQR2avWqQTelCcHO-I5aaCpIxZmvruX3s";
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwOEY4N2E3ZDQ1MUM3QjlBRTY5ZkQ2ZDMzY2VDOGQyQWJjYzM1NDgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDY1MDg4MTAzOTEsIm5hbWUiOiJ3ZWIzcHJlZmVyZW5jZXMifQ.Amrvvz318rge_MdXetdmGnP4nMr-inHD9SPSFYXk2Vc"
    //!! use this
    // return process.env.WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({
      token: getAccessToken(),
    });
  }

  async function storeFiles() {
    const client = makeStorageClient();

    const obj = { ...preferences };
    console.log(obj);
    const blob = new Blob([JSON.stringify(obj)], {
      type: "application/json",
    });
    console.log(blob);
    const file = new File([blob], "userPrefs.json");
    console.log(file);
    const cid = await client.put([file]);
    console.log(cid);
    console.log("stored files with cid:", cid);
    writePreferences(cid);
  }

  const writePreferences = async (cid) => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const blocknautsContract = new Contract(CONTRACT_ADDRESS, abi, signer);
      // call the setUserPreference from the contract
      const tx = await blocknautsContract.setUserPreference(cid);
      await tx.wait();
      window.alert("You successfully updated your preferences");
      // setLoading(true);
      // wait for the transaction to get mined
      // setLoading(false);
    } catch (err) {
      console.error(err);
      window.alert("There was an error updating your preferences");
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    console.log(web3ModalRef);
    web3ModalRef.current = new Web3Modal({
      providerOptions: {},
      disableInjectedProvider: false,
    });
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  return (
    <div>
      <div className="forms__container">
        <span className="forms__button">
          <fieldset>
            <legend>Theme</legend>
            <div className="forms__highlightcolor">
              <p>Highlight Color</p>
              <input
                type="color"
                id="colorpicker"
                value={preferences.theme.highlight}
                name="highlight"
                onChange={(e) => updatePreferencesState("theme", e)}
              ></input>
            </div>
            <div className="forms__fontcolor">
              <p>Font Color</p>
              <input
                type="color"
                id="colorpicker"
                placeholder="Select Color"
                name="fontColor"
                value={preferences.theme.fontColor}
                onChange={(e) => updatePreferencesState("theme", e)}
              ></input>
            </div>
            <div className="forms__font">
              <p>Font</p>
              <FontPicker
                apiKey="AIzaSyCTtR89twV3uThtcKhEv-DC17FDLOSqM3c"
                activeFontFamily={preferences.theme.font}
                onChange={(nextFont) => updateFontPreference(nextFont.family)}
              />
            </div>
            <div className="forms__dark">
              <p>Color Mode</p>
              <select
                name="colorMode"
                defaultValue={preferences.theme.colorMode}
                onChange={(e) => updatePreferencesState("theme", e)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </fieldset>
          <fieldset className="forms__cookies">
            <legend>Cookie Preferences</legend>
            <input
              type="checkbox"
              name="strictlyNecessary"
              checked={preferences.cookies.strictlyNecessary}
              onChange={(e) => updatePreferencesState("cookies", e)}
            ></input>
            <label htmlFor="strictlyNecessary">Strictly Necessary</label>
            <input
              type="checkbox"
              name="performance"
              checked={preferences.cookies.performance}
              onChange={(e) => updatePreferencesState("cookies", e)}
            ></input>
            <label htmlFor="performance">Performance</label>
            <input
              type="checkbox"
              name="functional"
              checked={preferences.cookies.functional}
              onChange={(e) => updatePreferencesState("cookies", e)}
            ></input>
            <label htmlFor="functional">Functional</label>
            <input
              type="checkbox"
              name="targeting"
              checked={preferences.cookies.targeting}
              onChange={(e) => updatePreferencesState("cookies", e)}
            ></input>
            <label htmlFor="targeting">Targeting</label>
          </fieldset>
          <button onClick={() => storeFiles()}> Save </button>
        </span>
      </div>
    </div>
  );
}

export default Forms;
