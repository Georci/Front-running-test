var BackTraffic = async function () {
    const { promisify } = require('util');

    var Web3 = require('web3');
    //web3@1.8
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    //https://www.npmjs.com/package/readline-specific       npm i readline-specific
    const rl = require('readline-specific');

    // 获取发送账户
    console.time("getAccounts");
    var From_account = await web3.eth.getAccounts();
    console.timeEnd("getAccounts");

    // 解锁第一个账户
    console.time("unlockAccount");
    await web3.eth.personal.unlockAccount(From_account[0], "123", 10000000);
    console.timeEnd("unlockAccount");

    //npm install lodash
    let _ = require('lodash')

    // 定义泊松分布的点和概率
    const gasPriceDistribution = [
        { Point: 3, Probability: 0.0000000001 },
        { Point: 4, Probability: 0.0000000005 },
        { Point: 5, Probability: 0.0000000034 },
        { Point: 6, Probability: 0.0000000183 },
        { Point: 7, Probability: 0.0000000836 },
        { Point: 8, Probability: 0.0000003348 },
        { Point: 9, Probability: 0.0000011919 },
        { Point: 10, Probability: 0.0000038190 },
        { Point: 11, Probability: 0.0000111242 },
        { Point: 12, Probability: 0.0000297029 },
        { Point: 13, Probability: 0.0000732094 },
        { Point: 14, Probability: 0.0001675522 },
        { Point: 15, Probability: 0.0003579071 },
        { Point: 16, Probability: 0.0007167402 },
        { Point: 17, Probability: 0.0013509033 },
        { Point: 18, Probability: 0.0024047126 },
        { Point: 19, Probability: 0.0040552816 },
        { Point: 20, Probability: 0.0064968442 },
        { Point: 21, Probability: 0.0099127600 },
        { Point: 22, Probability: 0.0144372123 },
        { Point: 23, Probability: 0.0201125409 },
        { Point: 24, Probability: 0.0268514122 },
        { Point: 25, Probability: 0.0344142696 },
        { Point: 26, Probability: 0.0424108173 },
        { Point: 27, Probability: 0.0503296964 },
        { Point: 28, Probability: 0.0575940623 },
        { Point: 29, Probability: 0.0636342819 },
        { Point: 30, Probability: 0.0679643747 },
        { Point: 31, Probability: 0.0702475310 },
        { Point: 32, Probability: 0.0703384056 },
        { Point: 33, Probability: 0.0682951735 },
        { Point: 34, Probability: 0.0643609623 },
        { Point: 35, Probability: 0.0589204314 },
        { Point: 36, Probability: 0.0524414692 },
        { Point: 37, Probability: 0.0454134566 },
        { Point: 38, Probability: 0.0382923831 },
        { Point: 39, Probability: 0.0314600365 },
        { Point: 40, Probability: 0.0252005874 },
        { Point: 41, Probability: 0.0196941953 },
        { Point: 42, Probability: 0.0150245123 },
        { Point: 43, Probability: 0.0111954965 },
        { Point: 44, Probability: 0.0081527123 },
        { Point: 45, Probability: 0.0058049841 },
        { Point: 46, Probability: 0.0040434738 },
        { Point: 47, Probability: 0.0027565648 },
        { Point: 48, Probability: 0.0018400872 },
        { Point: 49, Probability: 0.0012032442 },
        { Point: 50, Probability: 0.0007710725 },
        { Point: 51, Probability: 0.0004844360 },
        { Point: 52, Probability: 0.0002985001 },
        { Point: 53, Probability: 0.0001804596 },
        { Point: 54, Probability: 0.0001070774 },
        { Point: 55, Probability: 0.0000623802 },
        { Point: 56, Probability: 0.0000356919 },
        { Point: 57, Probability: 0.0000200635 },
        { Point: 58, Probability: 0.0000110838 },
        { Point: 59, Probability: 0.0000060193 },
        { Point: 60, Probability: 0.0000032145 },
        { Point: 61, Probability: 0.0000016885 },
        { Point: 62, Probability: 0.0000008726 },
        { Point: 63, Probability: 0.0000004438 },
        { Point: 64, Probability: 0.0000002222 },
        { Point: 65, Probability: 0.0000001095 },
        { Point: 66, Probability: 0.0000000532 },
        { Point: 67, Probability: 0.0000000254 },
        { Point: 68, Probability: 0.0000000120 },
        { Point: 69, Probability: 0.0000000056 },
        { Point: 70, Probability: 0.0000000025 },
        { Point: 71, Probability: 0.0000000011 },
        { Point: 72, Probability: 0.0000000005 },
        { Point: 73, Probability: 0.0000000002 },
        { Point: 74, Probability: 0.0000000001 },
    ];

    async function sendTransaction() {
        const endTime = Date.now() + 60 * 1000; // 持续1分钟
        while (Date.now() < endTime) {
            for (let i = 0; i < 6; i++) {
                const Rd_gasPrice = await selectGasPrice();
                try {
                    const res = await promisify(rl.oneline)('./account.txt', 1);
                    if (res) {
                        web3.eth.sendTransaction({
                            from: From_account[0],
                            to: res,
                            value: web3.utils.toWei('0', 'ether'),
                            gasPrice: Rd_gasPrice * 1000000000
                        }, (error, result) => {
                            if (error)
                                console.log("Error send: ", error);
                            else
                                console.log("Tx: ", 'from:', 'to:', result, From_account[0], res);
                        });
                    } else {
                        console.error("Error reading account file.");
                    }
                } catch (error) {
                    console.error("Error reading account file:", error.message);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
        }
        process.exit(0); // 1分钟后退出程序
    }

    async function selectGasPrice() {
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        for (const { Point, Probability } of gasPriceDistribution) {
            cumulativeProbability += Probability;
            if (randomValue <= cumulativeProbability) {
                return Point;
            }
        }
        return gasPriceDistribution[gasPriceDistribution.length - 1].Point; // 默认的gasPrice
    }

    console.time("sendTransaction");
    await sendTransaction();
    console.timeEnd("sendTransaction");
}

BackTraffic();
