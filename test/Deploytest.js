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

// 部署被攻击合约
async function deploy() {

  console.log("start deploying...")

  const [abi, bytecode] = await get_abi_bytecode("test.sol", "Test")
  console.log(abi)
  console.log(bytecode)
  var provider = new ethers.JsonRpcProvider("http://localhost:8545")
  // get private_key
  var deployer_private_key =
    "0x72feed5232dfd10b32ad570f80d5ead1b7a402aa4bc85d0015baeb48b2f64928"

  var wallet = new ethers.Wallet(deployer_private_key, provider)
  var Balance = await provider.getBalance(wallet.address)
  console.log("Balance of deployer is :", Balance)

  // deployg
  var TestFactory = new ethers.ContractFactory(abi, bytecode, wallet)

  var TestContract = await TestFactory.connect(wallet).deploy()
  await TestContract.waitForDeployment();

  console.log("TestContract contract deployed at address:", TestContract.target)
  console.log("TestContract contract balance :", await provider.getBalance(TestContract.target))
}

async function main() {
  for (i = 0; i < 15; i++) {
    await deploy();
  }
}

main()



