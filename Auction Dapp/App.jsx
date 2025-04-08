// frontend/src/AuctionFrontend.js

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { abi } from "../utils/auctionAbi.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

export default function AuctionFrontend() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();

  const [contract, setContract] = useState(null);
  const [duration, setDuration] = useState("");
  const [auctionId, setAuctionId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [auctionInfo, setAuctionInfo] = useState(null);

  // Manually initialize contract when needed
  const initContract = () => {
    if (!signer) {
      alert("Signer not available yet. Please connect your wallet first.");
      return;
    }

    const instance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    setContract(instance);
  };

  const createAuction = async () => {
    if (!contract) return alert("Please initialize contract first.");
    try {
      const tx = await contract.createAuction(duration);
      await tx.wait();
      alert("Auction created!");
    } catch (err) {
      console.error(err);
      alert("Error creating auction.");
    }
  };

  const placeBid = async () => {
    if (!contract) return alert("Please initialize contract first.");
    try {
      const tx = await contract.placeBid(auctionId, {
        value: ethers.utils.parseEther(bidAmount),
      });
      await tx.wait();
      alert("Bid placed!");
    } catch (err) {
      console.error(err);
      alert("Error placing bid.");
    }
  };

  const finalizeAuction = async () => {
    if (!contract) return alert("Please initialize contract first.");
    try {
      const tx = await contract.finalizeAuction(auctionId);
      await tx.wait();
      alert("Auction finalized!");
    } catch (err) {
      console.error(err);
      alert("Error finalizing auction.");
    }
  };

  const fetchAuctionDetails = async () => {
    if (!contract) return alert("Please initialize contract first.");
    try {
      const data = await contract.getAuctionDetails(auctionId);
      setAuctionInfo(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching auction details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Auction DApp</h1>

      {isConnected ? (
        <>
          <p className="mb-4">Connected as: {address}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-3 py-1 rounded mb-4"
          >
            Disconnect Wallet
          </button>

          <button
            onClick={initContract}
            className="bg-blue-500 text-white px-3 py-1 rounded mb-4 ml-2"
          >
            Initialize Contract
          </button>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Auction duration (seconds)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border p-2 mr-2"
            />
            <button
              onClick={createAuction}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Create Auction
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Auction ID"
              value={auctionId}
              onChange={(e) => setAuctionId(e.target.value)}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Bid amount (ETH)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="border p-2 mr-2"
            />
            <button
              onClick={placeBid}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              Place Bid
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={finalizeAuction}
              className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
            >
              Finalize Auction
            </button>
            <button
              onClick={fetchAuctionDetails}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              Get Auction Details
            </button>
          </div>

          {auctionInfo && (
            <div className="border p-4 mt-4 rounded bg-gray-100">
              <p>
                <strong>Seller:</strong> {auctionInfo.seller}
              </p>
              <p>
                <strong>Highest Bid:</strong>{" "}
                {ethers.utils.formatEther(auctionInfo.highestBid)}
              </p>
              <p>
                <strong>Highest Bidder:</strong> {auctionInfo.highestBidder}
              </p>
              <p>
                <strong>Is Active:</strong> {auctionInfo.active.toString()}
              </p>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="bg-purple-600 text-white px-3 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
