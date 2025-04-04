import { useState } from "react";
import { ethers } from "ethers";
import abi from "./SimpleBookLibrary.json"; // Assuming ABI is exported from this file

const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replace with your deployed contract address

export default function SimpleLibrary() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [address, setAddress] = useState(null);
    const [bookId, setBookId] = useState("");
    const [bookDetails, setBookDetails] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            await ethProvider.send("eth_requestAccounts", []);
            const ethSigner = ethProvider.getSigner();
            const userAddress = await ethSigner.getAddress();
            const libContract = new ethers.Contract(CONTRACT_ADDRESS, abi, ethSigner);

            setProvider(ethProvider);
            setSigner(ethSigner);
            setAddress(userAddress);
            setContract(libContract);
        } else {
            alert("Please install MetaMask!");
        }
    };

    const addBook = async (title, author, copies) => {
        if (!contract) return;
        const tx = await contract.addBook(title, author, copies);
        await tx.wait();
        alert("Book added!");
    };

    const borrowBook = async (id) => {
        if (!contract) return;
        const tx = await contract.borrowBook(id);
        await tx.wait();
        alert("Book borrowed!");
    };

    const returnBook = async (id) => {
        if (!contract) return;
        const tx = await contract.returnBook(id);
        await tx.wait();
        alert("Book returned!");
    };

    const viewBook = async (id) => {
        if (!contract) return;
        const book = await contract.viewBook(id);
        setBookDetails({
            title: book[0],
            author: book[1],
            copies: book[2].toString(),
        });
    };

    return (
        <div className="p-5">
            {!address ? (
                <button onClick={connectWallet} className="bg-blue-600 text-white p-2 rounded">
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p>Connected as: {address}</p>

                    <div className="my-4">
                        <h3>Add Book (Owner only)</h3>
                        <button onClick={() => addBook("Moby Dick", "Herman Melville", 5)} className="bg-green-600 text-white p-2 rounded">
                            Add "Moby Dick"
                        </button>
                    </div>

                    <div className="my-4">
                        <h3>Borrow / Return / View Book</h3>
                        <input
                            type="number"
                            placeholder="Book ID"
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                            className="border p-1"
                        />
                        <div className="space-x-2 mt-2">
                            <button onClick={() => borrowBook(bookId)} className="bg-yellow-500 text-white p-1 rounded">
                                Borrow
                            </button>
                            <button onClick={() => returnBook(bookId)} className="bg-red-500 text-white p-1 rounded">
                                Return
                            </button>
                            <button onClick={() => viewBook(bookId)} className="bg-gray-700 text-white p-1 rounded">
                                View Info
                            </button>
                        </div>
                    </div>

                    {bookDetails && (
                        <div className="mt-4 p-2 border rounded bg-gray-100">
                            <h4>Book Details:</h4>
                            <p>Title: {bookDetails.title}</p>
                            <p>Author: {bookDetails.author}</p>
                            <p>Copies Left: {bookDetails.copies}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
