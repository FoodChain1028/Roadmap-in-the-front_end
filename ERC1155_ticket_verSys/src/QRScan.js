import CreateQRScanner from 'component-qrscanner';
import keccak256 from 'keccak256';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import useFetch from './useFetch';
import abi from './abi/ticketContractAbi.json'

const QRScan = (e) => {
  // fetch owners data
  const URL = 'https://try.readme.io/https://testnets-api.opensea.io/api/v1/asset/0x4D2669542f0e6041C83c83cbEDa8df6262977Ec1/3/?account_address=0xaB50035F25F96dd3DEf1A7a9cC4E1C81AD6a7651';
  const [qrData, setQrData] = useState('');
  const {data: nftData, isPending, error} = useFetch(URL);
  const [ownerList, setOwnerList] = useState([]);
  const [hashedOwnerList, setHashedOwnerList] = useState([]);
  
  useEffect(() => {
    if (qrData !== '') {
      scanner.hidden();
    }
    else {
      scanner.start();
    }

    if (nftData !== null) {
      console.log(nftData);
      if (hashedOwnerList.length !== nftData.top_ownerships.length){
        // first generate ownership array
        const topOwnerships = nftData.top_ownerships;
        let tmpOwnerList = [];
        for (let i = 0; i < topOwnerships.length; i++) {
          tmpOwnerList.push(hash(topOwnerships[i].owner.address));
        }
        console.log(tmpOwnerList);

        // to update in a useState;
        for (let i = 0; i < tmpOwnerList.length; i++) {
          setHashedOwnerList( previousList => {
            return [
              ...previousList,
              tmpOwnerList[i]
            ]
          });
        }
      }
    }
    console.log('hash: ', hashedOwnerList);
  }, [qrData, nftData, hashedOwnerList]);

  const buf2hex = (buffer) => {
    return ["0x", ...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }

  const hash = (addr) => {
    const addedMessage = "token3_audience_tickets";
    const encodePackedMessage = Web3.utils.encodePacked( addedMessage, addr);
    const hashedMessage = buf2hex(keccak256(encodePackedMessage));
    return hashedMessage;
  }

  const handleVerify = () => {
    for (let i = 0; i < hashedOwnerList.length; i++) {
      console.log(i);
      console.log(hashedOwnerList[i]);
      if (qrData === hashedOwnerList[i]) {
        alert("Verify Success! You can get in");
        
        const network = process.env.REACT_APP_ETHEREUM_NETWORK;
        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
            )
        );
        // Creating a signing account from a private key
        const signer = web3.eth.accounts.privateKeyToAccount(
            process.env.REACT_APP_SIGNER_PRIVATE_KEY
        );
        web3.eth.accounts.wallet.add(signer);

        const ticketContract = new web3.eth.Contract(abi, "0xB884Be93301449e06b5bc8b0257Ebe8599DDfDCe");
        const address = "0xaB50035F25F96dd3DEf1A7a9cC4E1C81AD6a7651";
        ticketContract.methods.verifySuccessed(address).send({
          from: address,
          gas: 5000000
        })
        .on('error', (error, receipt) => {
          console.log(receipt);
          console.log(error);
          return;
        })
        .on('transactionHash', (hash) => {
          console.log(hash);
        });
      }
    }
  }

  // to fetch QRCode Data
  const fn = (e) => {
    if(e.text) {
      setQrData(e.text);
      console.log(qrData);    
      scanner.hidden();
      handleVerify();
    }
    else {
      alert('error: ' +  e.error);
    }
  }

  const scanner = new CreateQRScanner(fn);
  
  // to burn and mint 
  const verifyOnChain = async () => {
    const network = process.env.REACT_APP_ETHEREUM_NETWORK;
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
      )
    );

    const signer = web3.eth.accounts.privateKeyToAccount(
      process.env.REACT_APP_PRIVATE_KEY
    );
    web3.eth.accounts.wallet.add(signer);

    const contract = new web3.eth.Contract(abi, "0x4D2669542f0e6041C83c83cbEDa8df6262977Ec1");
    const tx = contract.methods.mintForAudience(1);
    const receipt = await tx
      .send({
        from: signer.address,
        gas: await tx.estimateGas()
      })
      .once("transactionHash", txhash => {
        console.log(`Mining transaction ...`);
        console.log(`https://${network}.etherscan.io/tx/${txhash}`);
      })
    console.log(`Mined in block ${receipt.blockNumber}`);
  }

  return ( 
    <div>
      <div className="nft-data">
        <div className="nft-box">
          <div className="qr-data">{ qrData }</div>
        </div>
      </div>
    </div>
  );
}
 
export default QRScan;
