import { useState } from "react";
import { ethers } from "ethers";
import HelloWorldAbi from "./HelloWorld.json";

const contractAddress = "DEPLOYED_CONTRACT_ADDRESS";

function App() {
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAddress(accounts[0]);
        } else {
            alert("Please install MetaMask!");
        }
    };

    //function to read the message from the smart contract
    const getMessage = async () => {
        if (!window.ethereum) return; //ensures Metamask is available
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, HelloWorldAbi, provider); //read only contract instance
        const currentMessage = await contract.getMessage();
        setMessage(currentMessage);
    };

    //function to send a new message to the smart contract
    const setNewMessageHandler = async () => {
        if (!window.ethereum) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, HelloWorldAbi, signer); //contract instance to send transactions
        const tx = await contract.setMessage(newMessage);
        await tx.wait();
        getMessage();
    };

    return (
        <div className="flex flex-col items-senter justify-center h-screen space-y-4 bg-gray-100">
            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 tect-white bg-blue-500 rounded"
                >
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p>Connect: {walletAddress}</p>
                    <button
                        onClick={getMessage}
                        className="py-4 py-2 mt-2 text-white bg-green-500 rounded"
                    >
                        Get Message
                    </button>
                    {message && <p className="mt-2">Current Message: {message}</p>}
                    <input
                        type="text"
                        placeholder="New message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="mt-2 border px-2 py-1"
                    />
                    <button
                        onClick={setNewMessageHandler}
                        className="px-4 py-2 mt-2 text-white bg-purple-500 rounded"
                    >
                        Set Message
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;