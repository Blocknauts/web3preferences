import React, { useEffect, useState, useRef, useContext } from "react";
import "./header.css";
import { abi, CONTRACT_ADDRESS } from "../../constants";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import {connectedwalletcontext} from '../../context/connectedwalletcontext.js'

function Header() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const {walletConnected, setWalletConnected} = useContext(connectedwalletcontext);
  
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);

  const [userPreferences, setUserPreferences] = useState("");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * writePreferences: Writer user preferences to smart contract
   */
  const writePreferences = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const blocknautsContract = new Contract(CONTRACT_ADDRESS, abi, signer);
      // call the setUserPreference from the contract
      const tx = await blocknautsContract.setUserPreference(
        "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" //TODO set newCID this is a hardcoded cid
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("You successfully updated your preferences");
    } catch (err) {
      console.error(err);
    }
  };

  /**
    * getPreferences: gets the preferences
    */
  const getPreferences = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      const blocknautsContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call the getUserPreference from the contract
      const _preferences = await blocknautsContract.userPreferences(address);
      // const _preferences = await blocknautsContract.userPreferences('0xD69DD3b617B24BdEc18F126eB2eA0Be072829A45');
      console.log(_preferences);
      setUserPreferences(_preferences);
    } catch (err) {
      console.error(err);
    }
  };


  /*
     connectWallet: Connects the MetaMask wallet
   */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getPreferences();
    }
  }, [walletConnected]);

  /*
      renderButton: Returns a button based on the state of the dapp
    */
  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!walletConnected) {
      return <button onClick={connectWallet}>Connect your wallet</button>;
    }
  };

  return (
    <div className="header__container">
      {renderButton()}
    </div>
  );
}

export default Header;
