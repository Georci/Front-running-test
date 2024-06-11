
const fs = require("fs")
const ethers = require("ethers")
const { exec } = require("child_process")

const abi = [
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
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

// 这些合约用来在攻击交易之前发送交易，使得memorypool中的交易数量达到一个正常水准，模拟memorypool正常情况。
const contractAddressArray = [
    "0xC86cB91e13267BF47e6614A64B636e5583a878A1",
    "0xD1e9A1a2Cd7ED9a9b2aD9D22098628A2562f25f2",
    "0x0546f772855Fbf034bEE48D7c4be0eE0F1d527a2",
    "0x801439Df67F7ebd2f9a81fafc89e702F5b2fFbE0",
    "0x1D1F9f9a804b5B40c5CC9A9d0BB0A321A09E74cE",
    "0x3a5B3CE3F482d8EE8041eca32c6C40FF02676F2f",
    "0x2E4990004C56623a380E17B66ec36d50B43356a8",
    "0x709427c5FE6d27dF75871712F0264e31322D4254",
    "0xfdFA189E94f2E2233ff86eC0a3cF4f0345A6DA70",
    "0x0A86116611Fa5F2BFF5Ce2BeF0274fC80C9A7464",
    "0x6086D6a27786f063DD3afA18993BB5c12347A136",
    "0x96B37b10Ab79248efEe3d01A589767bA22CA6BC1",
    "0xef9FBc275aA0Ab88f70f7376d793095BDF175348",
    "0x2dB4C937697d799B2eeA208C8f7c223196468016",
    "0xA23B4e52b3E0563D59273064945F29B36ba61049"
]

const testabi = [
    {
        "inputs": [],
        "name": "balance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
let wallets = [];
const rpc = "http://localhost:8545"
const provider = new ethers.JsonRpcProvider(rpc)

async function SendTx() {


    const senderPK = "0x72feed5232dfd10b32ad570f80d5ead1b7a402aa4bc85d0015baeb48b2f64928";
    const Sender_Wallet = new ethers.Wallet(senderPK, provider);
    console.log("sender's balance is :", await provider.getBalance(Sender_Wallet.address))

    // 随机生成一些钱包，并往这些钱包中传入一些初始金额，保证其能够正常执行一些交易
    for (i = 0; i < 15; i++) {
        //随机数生成钱包
        let random = ethers.randomBytes(32)
        console.log(563, random)
        let privateKey = Buffer.from(random).toString('hex')   //转成16进制
        console.log(112, privateKey)
        let wallet = new ethers.Wallet(privateKey, provider)
        wallets.push(wallet)

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
    }


}

async function executeTransaction(wallet, contractAddress, abi) {
    // let contract = new ethers.Contract(contractAddress, abi, wallet);
    // return await contract.balance();
    const tx = {
        from: wallet.address,
        to: contractAddress,
        data: "0xb69ef8a8",
        gasLimit: 120000,
    }
    return await wallet.sendTransaction(tx)
}

async function main() {
    await SendTx();

    let promises = [];

    for (let i = 0; i < 15; i++) {
        if (i == 13) {
            console.log("You should start BackTruffic.js");
        }
        let wallet_gan = wallets[i];
        let contractAddress = contractAddressArray[i];
        promises.push(executeTransaction(wallet_gan, contractAddress, testabi));

    }

    // 使用 Promise.all() 并发执行所有交易
    console.log("===================start excute all txs======================")
    Promise.all(promises)
        .then(results => {

        })
        .catch(error => {
            // 处理错误
            console.error(error);
        });

}

main()

