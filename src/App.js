import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import bunzz from "bunzz-sdk";
import { REACT_APP_API_KEY, REACT_APP_DAPP_ID } from './constant/env';

const DAPP_ID = REACT_APP_DAPP_ID;
const API_KEY = REACT_APP_API_KEY;

const init = async () => {
  const handler = await bunzz.initializeHandler({
    dappId: DAPP_ID,
    apiKey: API_KEY,
  });
  return handler;
};

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ walletAddress: "", transferAmount: "", burnAmount: "", mintAmount: "" });
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);


  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts =await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log('Account Connected: ', account);
        } else {
        setError("Install a MetaMask wallet to get our token.");
        console.error("No Metamask detected");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // GETTER FUNCTION

  const getTokenInfo = async () => {
    try {
      if (window.ethereum) {
        
        const handler = await init();
        const tokenContract = handler.getContract("Token (ERC20)");

        const[account] = await window.ethereum.request({ method: "eth_requestAccounts" });

        let tokenName = await tokenContract.name();
        let tokenSymbol = await tokenContract.symbol();
        let tokenSupply = await tokenContract.totalSupply();
        let tokenOwner =  await handler.getSignerAddress();
        // tokenSupply=utils.formatEther(tokenSupply);
        tokenSupply=utils.parseEther(tokenSupply);




        setTokenName(`${tokenName} 🦊`);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenTotalSupply);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true);
        } 

        console.log("Token Name: ", tokenName);
        console.log("Token Symbol: ", tokenSymbol);
        console.log("Token Supply: ", tokenSupply);
        console.log("Token Owner: ", tokenOwner);
      }
    } catch (error) {
      console.log(error);
    }
  }

   /** 
 @dev - Transfer token function
 */

  const transferToken = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const handler = await init();

        const tokenContract = handler.getContract("Token (ERC20)");

       
        let txn = await tokenContract.transfer(inputValue.walletAddress, utils.parseEther(inputValue.transferAmount));

         // let amount = utils.parseEther(inputValue.transferAmount);
        // let transferAmount = utils.formatEther(amount)

        // console.log(amount);

        // let txn = await tokenContract.transfer(inputValue.walletAddress, utils.formatEther(amount));
        // console.log(txn);


  


        
        console.log('Transfering tokens...');
        await txn.wait();
        alert("Token transfered sent Successfully 🎉");
        // console.log("Transfer Successful", txn.hash);
      } else {
        console.error("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // BURNING TOKEN FUNCTION
  const burnTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const handler = await init();

        const tokenContract = handler.getContract("Token (ERC20)");
        
        const txn = await tokenContract.burn(utils.parseEther(inputValue.burnAmount));
        console.log('Burning tokens...');
        await txn.wait()
        console.log("Burn Successful", txn.hash);

        let tokenSupply = await tokenContract.totalSupply()
        tokenSupply=utils.formatEther(tokenSupply);
        setTokenTotalSupply(tokenSupply);

      } else {
        console.error("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // MINTING TOKEN FUNCTION
  const mintTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const handler = await init();

        const tokenContract = handler.getContract("Token (ERC20)");
        
        let tokenOwner = await tokenContract.owner();
        const txn = await tokenContract.mint(tokenOwner, utils.parseEther(inputValue.mintAmount));
        console.log('Minting tokens...');
        await txn.wait()
        console.log("Mint Successful", txn.hash);

        let tokenSupply = await tokenContract.totalSupply()
        tokenSupply=utils.formatEther(tokenSupply);
        setTokenTotalSupply(tokenSupply);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getTokenInfo();
  }, [])

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">Baz Coin Project</span>
        <img className="inline p-3 ml-2" src="https://i.imgur.com/5JfHKHU.png" alt="Baz Coin" width="60" height="30" />
      </h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <span className="mr-5"><strong>Coin:</strong> {tokenName} </span>
          <span className="mr-5"><strong>Ticker:</strong>  {tokenSymbol} </span>
          <span className="mr-5"><strong>Total Supply:</strong>  {tokenTotalSupply}</span>
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-double"
              onChange={handleInputChange}
              name="walletAddress"
              placeholder="Wallet Address"
              value={inputValue.walletAddress}
            />
            <input
              type="text"
              className="input-double"
              onChange={handleInputChange}
              name="transferAmount"
              placeholder={`0.0000 ${tokenSymbol}`}
              value={inputValue.transferAmount}
            />
            <button
              className="btn-purple"
              onClick={transferToken}>Transfer Tokens</button>
          </form>
        </div>
        {isTokenOwner && (
          <section>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="burnAmount"
                  placeholder={`0.0000 ${tokenSymbol}`}
                  value={inputValue.burnAmount}
                />
                <button
                  className="btn-purple"
                  onClick={burnTokens}>
                  Burn Tokens
                </button>
              </form>
            </div>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="mintAmount"
                  placeholder={`0.0000 ${tokenSymbol}`}
                  value={inputValue.mintAmount}
                />
                <button
                  className="btn-purple"
                  onClick={mintTokens}>
                  Mint Tokens
                </button>
              </form>
            </div>
          </section>
        )}
        {/* <div className="mt-5">
          <p><span className="font-bold">Contract Address: </span>{contractAddress}</p>
        </div> */}
        <div className="mt-5">
          <p><span className="font-bold">Token Owner Address: </span>{tokenOwnerAddress}</p>
        </div>
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{yourWalletAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>

      </section>
    </main>
  );
}
export default App;