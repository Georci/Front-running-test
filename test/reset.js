
const fs = require("fs")
const ethers = require("ethers")
const { exec } = require("child_process")

const abi = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

async function Attack() {
    // Attackerrm 
    console.log("start attack !!!")
    const provider = new ethers.JsonRpcProvider("http://localhost:8545")
    const Attack_Private_Key = "0x91dcc6e347e57b3f824ecfaedf57201329efa4bd275afaa754539450d32c6c1e"
    var wallet = new ethers.Wallet(Attack_Private_Key, provider)
    console.log("Attacker address:", wallet.address)
    console.log("Before attack, attacker's balance is :", await provider.getBalance(wallet.address))
    console.log("Attacker info has been initialized");

    // Contract
    const contractAddress = "0x4EDd9Fd359823190710e5EE7C05130624fca5682"

    const tx = {
        from: wallet.address,
        to: contractAddress,
        gas: 10000,
        gasLimit: 300000,
        data: '0xd826f88f'
    }

    const result = await wallet.sendTransaction(tx)
    await result.wait()

    // const contract = new ethers.Contract(contractAddress, abi, wallet)
    console.log("reset function has been use!");
}

// 该函数用来重置被攻击合约中flag的值，确保可以连续的进行实验
async function main() {
    Attack()
}

main()



