// components/VotingFrontend.js
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import contractAbi from "../utils/votingAbi.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

export default function VotingFrontend() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();

  const [contract, setContract] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState("");
  const [status, setStatus] = useState("");

  const initContract = () => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    const instance = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
    setContract(instance);
  };

  const vote = async () => {
    if (!contract || selectedProposal === "") {
      alert("Please initialize contract and select a proposal.");
      return;
    }

    try {
      const tx = await contract.vote(selectedProposal);
      setStatus("Voting...");
      await tx.wait();
      setStatus("Voted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error voting.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Voting DApp</h1>

      {isConnected ? (
        <>
          <p className="text-sm text-center">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
          <div className="flex gap-2">
            <button
              onClick={() => disconnect()}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
            <button
              onClick={initContract}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Init Contract
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      )}

      <select
        className="w-full border p-2 rounded"
        value={selectedProposal}
        onChange={(e) => setSelectedProposal(e.target.value)}
      >
        <option value="">Select a proposal</option>
        <option value="0">Proposal 0</option>
        <option value="1">Proposal 1</option>
        <option value="2">Proposal 2</option>
      </select>

      <button
        onClick={vote}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Vote
      </button>

      {status && <p className="text-center text-gray-600">{status}</p>}
    </div>
  );
}

