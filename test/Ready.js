
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
const contractAddressArray = [
    "0x6F99F48b4dCdD76dd6BA55498FCE490b4E3c637A",
    "0xaFA1Ee1C2A1603ccFF055a685279E760b737B065",
    "0x87DEe0fC3e305CFC0F6E39621D336217f9098218",
    "0x0fDFD86A29f6759Cb8c3967c0D9cE616591547c4",
    "0x847836DD1982F314F0FD105750BfCD7f9Ef3c309",
    "0xabc59536257E2407750DCEd7AC5BA537dD04E4f5",
    "0x9942950a498ca65A3876Da8020bf0D8e6EFa635C",
    "0x0477521E8622760f59615e531566B6017f58FD23",
    "0xeCbE01F8ADb31fF75987cA233B24A3BB070dD4Bd",
    "0x9B87b1155C0daa7f40EAb5eFB962955e92240bEd",
    "0xfcc8B6f01C89F2bAfd7350e7bf2fD3AE75eE4404",
    "0x30782Fa31555179b4cBC1920aCD6a420C90788a6",
    "0x1116C81e9362a4d2D6F545954cB797e1050E690E",
    "0x49ED1535C4a70E8B72069f13bAd3bFF09D9C7917",
    "0xfcc144915761380a746b60F2542C4Fb35820e002"
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


    const senderPK = "0xdbd0db8310c9d8b1da86f51316eaa991fb1e8fdbebe0ead1c95502d1c423d03b";
    const Sender_Wallet = new ethers.Wallet(senderPK, provider);
    console.log("sender's balance is :", await provider.getBalance(Sender_Wallet.address))


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
        let wallet_gan = wallets[i];
        let contractAddress = contractAddressArray[i];
        promises.push(executeTransaction(wallet_gan, contractAddress, testabi));

    }

    // 使用 Promise.all() 并行执行所有交易
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

