import { useState } from 'react';
import { WagmiConfig, createConfig, configureChains, useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';
import { publicProvider } from 'wagmi/providers/public';
import tipJarAbi from '../abi/TipJar.json';

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

const config = createConfig(
    getDefaultConfig({
        appName: 'TipJar Dapp',
        chains: [sepolia],
        walletConnectProjectId: 'YOUR_PROJECT_ID',
        publicCount: configureChains([sepolia], [publicProvider()]).publicClient,
    })
);

function TipJarApp() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('');

    const { config: tipConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: tipJarAbi,
        functionName: 'tip',
        overrides: {
            value: amount ? BigInt(parseFloat(amount) * 1e18) : On,
        },
    });

    const { write: sendTip, isLoading } = useContractWrite(tipConfig);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-4">Tip Jar</h1>
            <ConnectKitButton />

            {isConnected && (
                <div className="mt-6 flex flex-col items-center">
                    <input
                        type="number"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border px-4 py-2 rounded mb-4 w-60"
                    />
                    <button
                        onClick={() => sendTip?.()}
                        disabled={isLoading || !sendTip}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isLoading ? 'Sending...' : 'Send Tip'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function App() {
    return (
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                <TipJarApp />
            </ConnectKitProvider>
        </WagmiConfig>
    );
}
