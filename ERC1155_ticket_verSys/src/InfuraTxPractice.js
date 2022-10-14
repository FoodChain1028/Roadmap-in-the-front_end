import Web3 from "web3";
import abi from "./abi/ticketContractAbi.json";
import keccak256 from "keccak256";
import bytecode from "./bytecode/ticketContractBytecode.json"

const InfuraTxPractice = () => {

    const main = async () => {
        // Configuring the connection to an Ethereum node
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

        // Estimatic the gas limit
        var limit = web3.eth.estimateGas({
            from: signer.address, 
            to: "0xd8538ea74825080c0c80B9B175f57e91Ff885Cb4",
            value: web3.utils.toWei("0.001")
            }).then(console.log);
            
        // Creating the transaction object
        const tx = {
            from: signer.address,
            to: "0xd8538ea74825080c0c80B9B175f57e91Ff885Cb4",
            value: web3.utils.numberToHex(web3.utils.toWei('0.01', 'ether')),
            gas: web3.utils.toHex(limit),
            nonce: web3.eth.getTransactionCount(signer.address),
            maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
            chainId: 5                  
        };

        let signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
        console.log("Raw transaction data: " + signedTx.rawTransaction)

        // Sending the transaction to the network
        const receipt = await web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
            });
        // The transaction is now on chain!
        console.log(`Mined in block ${receipt.blockNumber}`);

    }

    const verifyOnChain = async () => {
        const network = process.env.REACT_APP_ETHEREUM_NETWORK;
        const web3 = new Web3(
          new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
          )
        );
    
        const signer = web3.eth.accounts.privateKeyToAccount(
          process.env.REACT_APP_SIGNER_PRIVATE_KEY
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

    const contractDeploy = async () => {
      // Configuring the connection to an Ethereum node
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

      // assign a new contract Object
      const ticketContract = new web3.eth.Contract(abi);

      const mintRole = buf2hex(keccak256("MINTER_ROLE"));
      const burnRole = buf2hex(keccak256("BURNER_ROLE"));
      const address = "0xaB50035F25F96dd3DEf1A7a9cC4E1C81AD6a7651";
      
      // estimate gas of deployment

      ticketContract.deploy({
        data: bytecode.object, 
        arguments: [
          [mintRole, burnRole],
          [address, address]
        ]
      })
      .estimateGas((err, gas) => {
        console.log(gas)
      })


      ticketContract.deploy({
        data: bytecode.object,
        arguments: [
          [mintRole, burnRole],
          [address, address]
        ]
      })
      .send({
          from: address,
          gas: 5000000,
      }, (error, transactionHash) => {

      })
      .on('error', error => { 
        console.log(error);
       })
      .on('transactionHash', transactionHash => { 
        console.log(transactionHash);
       })
      .on('receipt', receipt => {
        console.log(receipt.contractAddress) // contains the new contract address
      })
      .then( (newContractInstance) => {
          console.log(newContractInstance.options.address) // instance with the new contract address
      });
      
    }

    const buf2hex = (buffer) => {
      return ["0x", ...new Uint8Array(buffer)]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
    }

    return ( 
        <div>
            <button onClick={() => verifyOnChain()}> Press To Send Tx</button>
            <button onClick={() => contractDeploy()}> Press To Deploy </button>
        </div>
     );
}
 
export default InfuraTxPractice;