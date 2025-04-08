import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SimpleVoting from "../artifacts/contracts/SimpleVoting.sol/SimpleVoting.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
    const [proposals, setProposals] = useState([]);
    const [provider, setProvider] = useState();
    const [signer, setSigner] = useState();
    const [contract, setContract] = useState();

    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, SimpleVoting.abi, signer);
                const count = wait contract.totalProposals();

                let proposalsArray = [];
                for (let i = 0; i < count; i++) {
                    const prop = await contract.proposals(i);
                    proposalsArray.push({ description: prop.description, voteCount: prop.voteCount.toString() });
                }

                setProposals(proposalsArray);
                setProvider(provider);
                setSigner(signer);
                setContract(contract);
            }
        }
        init();
    }, []);

    const vote = async (index) => {
        await contract.vote(index);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Simple VOting DApp</h1>
            {proposals.map((p, idx) => (
                <div key={idx} className="mb-2">
                    <p>{p.description} - Votes: {p.voteCount}</p>
                    <button onClick={() => vote(idx)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Vote
                    </button>
                </div>
            ))}
        </div>
    );
}

export default App;
