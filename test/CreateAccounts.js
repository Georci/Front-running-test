const { ethers } = require("ethers")
const fs = require("fs")

const contractAddress = "0x31a81d0BD7f9870eAE3acaa10bdEB74Fe2F25a0B"
const abi = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "Go",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
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
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

async function main() {
    const rpc = "http://localhost:8545"
    const provider = new ethers.JsonRpcProvider(rpc)
    const senderPK = "0x386fae10f94b400f6a0311be3f3b7904de52620a43cdeb47f0e7d414d7a7fbf3";
    const Sender_Wallet = new ethers.Wallet(senderPK, provider);
    console.log("sender's balance is :", await provider.getBalance(Sender_Wallet.address))


    for (i = 0; i < 100; i++) {
        //随机数生成钱包
        let random = ethers.randomBytes(32)
        console.log(563, random)
        let privateKey = Buffer.from(random).toString('hex')   //转成16进制
        console.log(112, privateKey)
        let wallet = new ethers.Wallet(privateKey, provider)
        console.log("账号地址: " + wallet.address)

        var sendValue = ethers.parseEther("1")
        //转账
        tx = {
            from: Sender_Wallet.address,
            gasLimit: 300000,
            to: wallet.address,
            value: sendValue
        }

        let txResponse = await Sender_Wallet.sendTransaction(tx)
        await txResponse.wait()

        const contract = new ethers.Contract(contractAddress, abi, wallet)

        for (j = 1; j <= 10; j++) {
            console.log(`第${j}次调用：`)
            const result = await contract.Go()
        }
    }
}

main()