const fs = require("fs")
const ethers = require("ethers")
const { exec } = require("child_process")

function get_abi_bytecode(file_path, contract_name) {
  return new Promise((resolve, reject) => {
    var abi
    var bytecode

    exec("solcjs --abi " + file_path, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令错误: ${error}`)
        reject(error)
        return
      }

      // 读取文件中的abi内容
      var abiFilePath =
        file_path.split(".")[0] +
        "_" +
        file_path.split(".")[1] +
        "_" +
        contract_name +
        ".abi"
      fs.readFile(abiFilePath, "utf-8", (error, data) => {
        if (error) {
          console.error(error)
          reject(error)
          return
        }
        abi = JSON.parse(data)

        exec("solcjs --bin " + file_path, (error, stdout, stderr) => {
          if (error) {
            console.error(`执行命令错误: ${error}`)
            reject(error)
            return
          }

          var bytecodeFilePath =
            file_path.split(".")[0] +
            "_" +
            file_path.split(".")[1] +
            "_" +
            contract_name +
            ".bin"
          fs.readFile(bytecodeFilePath, "utf-8", (error, data) => {
            if (error) {
              console.error(error)
              reject(error)
              return
            }
            bytecode = data
            resolve([abi, bytecode])
          })
        })
      })
    })
  })
}

async function deploy() {

  console.log("start deploying...")

  const [abi, bytecode] = await get_abi_bytecode("mockSnerio.sol", "FreeMint")
  console.log(abi)
  console.log(bytecode)
  var provider = new ethers.JsonRpcProvider("http://localhost:8545")
  // get private_key
  var deployer_private_key =
    "0xdbd0db8310c9d8b1da86f51316eaa991fb1e8fdbebe0ead1c95502d1c423d03b"

  // tx: Making sure FreeMint has 10 ether.
  var sendValue = ethers.parseEther("10") // 10 ether
  var tx = {
    value: sendValue,
    gas: 100000
  }

  var wallet = new ethers.Wallet(deployer_private_key, provider)
  var Balance = await provider.getBalance(wallet.address)
  console.log("Balance of deployer is :", Balance)

  // deployg
  var FreeMintFactory = new ethers.ContractFactory(abi, bytecode, wallet)

  var FreeMint = await FreeMintFactory.connect(wallet).deploy(tx)
  await FreeMint.waitForDeployment();

  console.log("FreeMint contract deployed at address:", FreeMint.target)
  console.log("FreeMint contract balance :", await provider.getBalance(FreeMint.target))
}

async function main() {
  await deploy();

  // for (i = 1; i <= 20; i++) {
  //   const [abi, bytecode] = await get_abi_bytecode("test.sol", "Test")
  //   var provider = new ethers.JsonRpcProvider("http://localhost:8545")
  //   var deployer_private_key =
  //     "0xdbd0db8310c9d8b1da86f51316eaa991fb1e8fdbebe0ead1c95502d1c423d03b"
  //   var wallet = new ethers.Wallet(deployer_private_key, provider)

  //   var TestFactory = new ethers.ContractFactory(abi, bytecode, wallet)
  //   var Test = await TestFactory.connect(wallet).deploy()
  //   await Test.waitForDeployment();
  //   console.log("test has been deployed in :", Test.target)
  // }
}

main()



