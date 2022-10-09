import { useState } from "react";
import Web3 from 'web3';
import abi from './abi/ticketContractAbi.json'

const Mint = ({ accounts }) => {
  const [mintNum, setMintNum] = useState(1);
  const [txLink, setTxLink] = useState("");
  const [txIsSend, setTxSend] = useState(false);
  const isConnected = Boolean(accounts[0]);
  const prefix = "https://goerli.etherscan.io/tx/"

  const web3 = new Web3(Web3.givenProvider);
  const ticketAddress = "0x4D2669542f0e6041C83c83cbEDa8df6262977Ec1";
  const goerliId = 5;
  const switchNetwork = () => {

    if (window.ethereum.netWorkVersion !== goerliId) {
      try {
          window.ethereum.request({
          method: 'wallet_switchEthereumChain', 
          params: [{ chainId: web3.utils.toHex(goerliId) }]
        });
      }

      catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
            window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Goerli Test Network',
                chainId: web3.utils.toHex(goerliId),
                nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                rpcUrls: ['https://goerli.infura.io/v3/']
              }
            ]
          });
        }
      }
    }
  }

  // to mint NFT
  const mint = () => {
    const ticketContract = new web3.eth.Contract(abi, ticketAddress);
    ticketContract.methods.mintForAudience(mintNum).send({
      from: window.ethereum.selectedAddress
    })
    .on('error', (error, receipt) => {
      console.log(receipt);
      alert("You have denied the transaction.")
      return;
    })
    .on('transactionHash', (hash) => {
      setTxSend(true);
      setTxLink(prefix + hash);
    });
  }

  // execute when press mint button
  const mintButton = async () => {
    if (!isConnected) {
      alert('Please connect to MetaMask!');
      return;
    }
    if (mintNum <= 0) {
      alert('Mint Number Must Bigger Than 0!');
      return;
    }
    if (mintNum > 4) {
      alert ('You can mint at most 4 tickets!');
      return;
    }
    switchNetwork();
    mint();
  }
  return ( 
    <div className="home">
      <div className="home-title">
        Choose How Many Tickets You Want to Mint.
      </div>
      <div className="mint-Count">
        <button className="plus" onClick={ () => setMintNum(mintNum - 1)}>-</button>
        <div className="mint-num">{ mintNum }</div>
        <button className="minus" onClick={ () => setMintNum(mintNum + 1)}>+</button>
      </div>  
      {!txIsSend && <button className="mint-btn" onClick={ () => mintButton()}>Mint</button>}
      {txIsSend && 
        <div className="mint-success">   
          <a className="mint-success" href={ txLink } target="_blank" rel="noreferrer" > 
            Successfully Minted, You can check in This Link.
          </a> 
        </div>}
      </div>

  );
}
 
export default Mint;