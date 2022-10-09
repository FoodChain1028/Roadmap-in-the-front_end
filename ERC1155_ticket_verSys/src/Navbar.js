import { useEffect } from 'react';
import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import homeIcon from './img/home.png';
import mintIcon from './img/tickets.png';
import verIcon from './img/verified.png';
// import detectEthereumProvider from '@metamask/detect-provider';

const Navbar = ({accounts, setAccounts}) => {
  
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(true);
  const [isConnected, setConnected] = useState(false);
  const [isLogged, setLogged] = useState(false);
  const [isMenuDisplayed, setMenuDisplayed] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const changeMenuDisplay = () => setMenuDisplayed(!isMenuDisplayed);

  
  // detect whether a wallet is installed 
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') setMetamaskInstalled(false);
    
    else 
      if (!window.ethereum.isMetaMask) setMetamaskInstalled(false);
  },[]);

  // use window.ethereum.request({method: 'eth_requestAccounts'}) to connect wallet.
  const connectAccount = async () => {
    // to detect whether the wallet is installed
    if (isConnected === false){
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts',
        });
        setAccounts(accounts); 
        setCurrentAccount(accounts[0]);
        setConnected(true);
        setLogged(true);
      }
      alert("Successfully Logged in!")
    }
  }
  // To traunate strings
  const showAccount = () => {
    const prefix = accounts[0].substr(0, 5);
    const suffix = accounts[0].substr(36, 40);
    return (prefix + "..." + suffix);
  }


  setTimeout(() => {
    if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      // updateInterface();
      console.log(accounts[0]);
    }
  }, 100);
  
  
  // main return
  return (
    <nav className="navbar">
      <div className="list">
        <Link to={'/'} onClick={ () => { changeMenuDisplay() }}>
          <img src={ homeIcon } alt="home" className='home-icon'/>
        </Link>
        <Link to={'/Mint/Audience'} onClick={ () => { changeMenuDisplay() }}>
          <img src={ mintIcon } alt="mint" className='mint-icon'/>
        </Link>
        <Link to={'/Verify'} onClick={ () => { changeMenuDisplay() }}>
          <img src={ verIcon } alt="ver" className='ver-icon'/>
        </Link>
      </div>
      <div className="olympics-symbol">
        <svg xmlns="http://www.w3.org/2000/svg" height="158" width="342" className='OlymLogo'>
          <g strokeWidth="9.5" stroke="#000" fill="none">
            <circle cx="54" cy="54" r="49.25" stroke="#0081c8"/>
            <circle cx="171" cy="54" r="49.25"/>
            <circle cx="288" cy="54" r="49.25" stroke="#ee334e"/>
            <circle cx="112.5" cy="104" r="49.25" stroke="#fcb131"/>
            <circle cx="229.5" cy="104" r="49.25" stroke="#00a651"/>
            <path d="M93.4,24.45A49.25,49.25 0 0 1 93.4,83.55" stroke="#0081c8"/>
            <path d="M210.4,24.45A49.25,49.25 0 0 1 210.4,83.55M171,103.25A49.25,49.25 0 0 1 141.45,93.4"/>
            <path d="M288,103.25A49.25,49.25 0 0 1 258.45,93.4" stroke="#ee334e"/>
          </g>
        </svg>
      </div>
      <div className="title">
        <h1> OLYMPIC TICKET SYSTEM </h1>
      </div>
      <div className='log-in-area'>
        { !isLogged && (isMetamaskInstalled && <button className='log-in-btn' onClick={ () => { connectAccount() }}>Log In Metamask</button>) }
        { !isMetamaskInstalled && <a className='install-link' target="_blank" rel="noreferrer" href='https://metamask.io/download'>Please Install Metamask</a>}
        { isLogged && <div>{ showAccount() }</div>}
      </div>
    </nav>
  )
}

export default Navbar;