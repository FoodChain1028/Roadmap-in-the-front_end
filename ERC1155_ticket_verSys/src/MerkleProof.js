import { MerkleTree } from 'merkletreejs';
import { useState } from "react";
import keccak256 from 'keccak256';
import Web3 from 'web3';
import abi from './abi/ticketContractAbi.json';

const MerkleProof = ({ accounts }) => {
  const [sig, setSig] = useState("");

  const MT = async () => {
    const buf2hex = x => '0x' + x.toString('hex');
    const whitelistAddresses = [
      "0xB5e30182B2EC04A58C8dFaB9f0E42Bbd5a551618",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ]
    // new leaves are hashed
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    // console.log('Whitelist Merkle Tree:\n', merkleTree.toString());

    // const leaf = buf2hex(leafNodes[0]);
    // // const leaf = buf2hex(keccak256(accounts[0]));
    
    // const proof = merkleTree.getHexProof(leaf);
    // const root = merkleTree.getHexRoot();

    // console.log(leaf);
    // console.log(proof);

    // const verifyAddress = "0x6Bd94c29576Be1687e4308b411DA12E392069F45";
    // const web3 = new Web3(Web3.givenProvider);

    // const verifyContract = new web3.eth.Contract(abi, verifyAddress);
    // verifyContract.methods.verify(proof, root).call({
    //   from: window.ethereum.selectedAddress
    // })
    // .then('error', (error, receipt) => {
    //   console.log(receipt);
    //   alert("You have denied the transaction.")
    //   return;
    // })
    // .then( (result)=> {
    //   console.log(result);
    // });
    
    const account = accounts[0];
    const message = "Verify Your Ticket.";
    const messageHash = buf2hex(keccak256(message));
   
    await window.ethereum.request({
      method: "personal_sign",
      params: [
        account, 
        messageHash
      ]
    })
    .then(signature => {
      setSig(signature);
      console.log(sig);
    });

    const verifyAddress = "0xE456372bDA3c8C37756339842b9E53EF4e9fda80";
    const web3 = new Web3(Web3.givenProvider);

    const verifyContract = new web3.eth.Contract(abi, verifyAddress);
    await verifyContract.methods.verify(message, sig).call({
      from: window.ethereum.selectedAddress
    })
    .then( (result)=> {
      console.log(result);
    });
  }

  return ( 
    <div className='nft-data'>
      <button onClick={ () => { MT() }}>
        Press To Verify
      </button> 
    </div>
  );
}
 
export default MerkleProof;
