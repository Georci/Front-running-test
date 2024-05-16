// provider.on("pending", listener)
// import { ethers, utils } from "ethers";
const ethers = require('ethers');
const utils = ethers.utils;


// 1. Create provider
var url = "wss://eth-sepolia.g.alchemy.com/v2/tnn6IKjqch5d30vFI4UoWErXsrZ416-2";
// const provider1 = new ethers.providers.WebSocketProvider(url);
const provider = new ethers.WebSocketProvider(url);
// const provider = new ethers.getDefaultProvider();
let network = provider.getNetwork(11155111);
network.then(res =>
    console.log(
        `[${new Date().toLocaleTimeString()}] Connected to chain ID ${res.chainId}`,
    ),
);

// 2. Create interface object for decoding transaction details.
// const iface = new utils.Interface(["function mint() external"]);
const iface = new ethers.Interface([
    "function mint(address _receiver) external",
])

// 3. Create wallet for sending frontrun transactions.
const privateKey =
    "a77bc36010e79b4b0e1750dbf2f0b2f99ef7bda4bcb25eca518d1fcdffbd8e75";
const wallet = new ethers.Wallet(privateKey, provider);
console.log(wallet)

const main = async () => {
    // 4. Listen for pending mint transactions, get transaction details, and decode them.
    console.log("\n4. Listen for pending transactions, get txHash, and output transaction details.");
    console.log(iface.getFunction('mint', ['address']))
    // Listen module
    provider.on("pending", async txHash => {
        if (txHash) {
            // Get transaction details
            let tx = await provider.getTransaction(txHash);
            if (tx) {

                // Filter pendingTx.data
                if (
                    // tx.data.indexOf(iface.getSighash("mint")) !== -1 &&
                    // tx.from != wallet.address

                    tx.data.indexOf(iface.getFunction('mint', ['address']).selector) !== -1 &&
                    tx.from != wallet.address
                ) {
                    // Print txHash
                    console.log(
                        `\n[${new Date().toLocaleTimeString()}] Listening to Pending transaction: ${txHash} \r`,
                    );

                    // Print decoded transaction details
                    let parsedTx = iface.parseTransaction(tx);
                    console.log("Decoded pending transaction details:");
                    console.log(parsedTx);
                    // Decode input data
                    console.log("Raw transaction:");
                    console.log(tx);
                    
                    // Front-running module
                    // Build frontrun tx
                    
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        // maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 1.2,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? BigInt(tx.maxPriorityFeePerGas) * BigInt(20) / BigInt(10) : DEFAULT_VALUE,
                        // maxFeePerGas: tx.maxFeePerGas * 1.2,
                        maxFeePerGas: tx.maxFeePerGas ? BigInt(tx.maxFeePerGas) * BigInt(20) / BigInt(10) : DEFAULT_VALUE,
                        // gasLimit: tx.gasLimit * 2,
                        gasLimit: tx.gasLimit ? BigInt(tx.gasLimit) * BigInt(2) : tx.gasLimit,
                        data: tx.data,
                    };
                    // Send frontrun transaction
                    var txResponse = await wallet.sendTransaction(txFrontrun);
                    console.log(`Sending frontrun transaction`);
                    await txResponse.wait();
                    console.log(`Frontrun transaction successful`);
                }
            }
        }
    });

    provider.on("error", async () => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
        setTimeout(init, 3000);
    });

    // provider.on("close", async code => {
    //     console.log(
    //         `Connection lost with code ${code}! Attempting reconnect in 3s...`,
    //     );
    //     provider.terminate();
    //     setTimeout(init, 3000);
    // });

    // provider._websocket.on("error", async () => {
    //     console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
    //     setTimeout(init, 3000);
    //   });

    // provider._websocket.on("close", async code => {
    //     console.log(
    //         `Connection lost with code ${code}! Attempting reconnect in 3s...`,
    //     );
    //     provider._websocket.terminate();
    //     setTimeout(init, 3000);
    // });
};

main();