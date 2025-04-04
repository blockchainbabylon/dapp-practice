import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "../utils/auctionAbi.json";

const CONTRACT_ADDRESS = "CONTRACT_ADDRESS_HERE";

export default function AuctionFrontend() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [address, setAddress] = useState("");

    const [duration, setDuration] = useState("");
    const [auctionId, setAuctionId] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [auctionInfo, setAuctionInfo] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum); //provider connects to the blockchain through metamask
            await ethProvider.send("eth_requestAccounts", []);
            const ethSigner = ethProvider.getSigner(); //signer allows interaction with the blockchain
            const userAddress = await ethSigner.getAddress();
            const auctionContract = new ethers.Contract(CONTRACT_ADDRESS, abi, ethSigner);

            setProvider(ethProvider);
            setSigner(ethSigner);
            setAddress(userAddress);
            setContract(auctionContract);
        } else {
            alert("Please install MetaMask!");
        }
    };

    const createAuction = async () => {
        const tx = await contract.createAuction(duration);
        await tx.wait();
        alert("Auction created!");
    };

    const placeBid = async () => {
        const tx = await contract.placeBid(auctionId, {
            value: ethers.utils.parseEther(bidAmount)
        });
        await tx.wait();
        alert("Bid placed!");
    };

    const finalizeAuction = async () => {
        const tx = await contract.finalizeAuction(auctionId);
        await tx.wait();
        alert("Auction finalized!");
    };

    const fetchAuctionDetails = async () => {
        const data = await contract.getAuctionDetails(auctionId);
        setAuctionInfo(data);
    };

    return (
        <div style
    )


}