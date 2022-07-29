import { useState, useEffect } from "react";
import bunzz from "bunzz-sdk";
import { REACT_APP_API_KEY, REACT_APP_DAPP_ID } from "./constant/env";

const DAPP_ID = REACT_APP_DAPP_ID
const API_KEY = REACT_APP_API_KEY



function App() {
  const [contract, setContract] = useState();
  const [value, setValue] = useState({ walletAddress: "", transferAmount: "", burnAmount: "", mintAmount: "" });
  const [userAddress, setUserAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
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
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log("Account Connected: ", account);
        
      } else {
        setError("Install a MetaMask wallet to get our token.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const init = async () => {
    try {
      const handler = await bunzz.initializeHandler({
        dappId: DAPP_ID,
        apiKey: API_KEY,
      });
      const tokenContract = await handler.getContract("Token (ERC20)");
      const userAddress = await handler.getSignerAddress();
    
      // Set local state
      setContract(contract);
      setUserAddress(userAddress);
   
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts", });
      const account = accounts[0];


      // token details
      let tokenName = await tokenContract.name();
      let tokenSymbol = await tokenContract.symbol();
      let tokenSupply = await tokenContract.totalSupply();
      let tokenOwner = await tokenContract.owner();
  
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

    } catch (error) {
      console.log(error);
    }
  };


 





  /** 
 @dev - Transfer token function
 */

  const transferToken = async (event) => {
    if (!contract) return;

    await contract.transfer(userAddress, value);
    alert("Transaction was sent in success🎉");
  };

  // BURNING TOKEN FUNCTION
  const burnToken = async (event) => {
    if (!contract) return;

    await contract.burn(value);
    alert("Transaction was sent in success🎉");
  };

  // MINTING TOKEN FUNCTION

  const mintToken = async (event) => {
    if (!contract) return;

    await contract.mint(userAddress, value);
    alert("Transaction was sent in success🎉");
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    init();
  }, []);

  const handleChange = (event) => {
    setValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">Baz Coin Project</span>
        <img
          className="inline p-3 ml-2"
          src="https://i.imgur.com/5JfHKHU.png"
          alt="Baz Coin"
          width="60"
          height="30"
        />
      </h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <span className="mr-5">
            <strong>Coin:</strong> {tokenName}{" "}
          </span>
          <span className="mr-5">
            <strong>Ticker:</strong> {tokenSymbol}{" "}
          </span>
          <span className="mr-5">
            <strong>Total Supply:</strong> {tokenTotalSupply}
          </span>
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-double"
              onChange={handleChange}
              name="walletAddress"
              placeholder="Wallet Address"
              value={value.walletAddress}
            />
            <input
              type="text"
              className="input-double"
              onChange={handleChange}
              name="transferAmount"
              placeholder={`0.0000 ${tokenSymbol}`}
              value={value.transferAmount}
            />
            <button className="btn-purple" onClick={transferToken}>
              Transfer Tokens
            </button>
          </form>
        </div>
        {isTokenOwner && (
          <section>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleChange}
                  name="burnAmount"
                  placeholder={`0.0000 ${tokenSymbol}`}
                  value={value.burnAmount}
                />
                <button className="btn-purple" onClick={burnToken}>
                  Burn Tokens
                </button>
              </form>
            </div>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleChange}
                  name="mintAmount"
                  placeholder={`0.0000 ${tokenSymbol}`}
                  value={value.mintAmount}
                />
                <button className="btn-purple" onClick={mintToken}>
                  Mint Tokens
                </button>
              </form>
            </div>
          </section>
        )}
       
        <div className="mt-5">
          <p>
            <span className="font-bold">Token Owner Address: </span>
            {tokenOwnerAddress}
          </p>
        </div>
        <div className="mt-5">
          {isWalletConnected && (
            <p>
              <span className="font-bold">Your Wallet Address: </span>
              {yourWalletAddress}
            </p>
          )}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>
    </main>
  );
}
export default App;
