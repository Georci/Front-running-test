var keyth = require('keythereum');
//('你想要得到私钥的账户地址'，'你keystore存放的目录（即keystore在我的data0目录下）')，这里使用的是绝对路径
var keyobj = keyth.importFromFile('c018fedba886825ed5ec0010c85fbbc0b9b8b851', '/home/kenijima/usr/work/test1');
var privateKey = keyth.recover('123', keyobj);//（'这个账号的密码'，keyobj）
console.log(privateKey.toString('hex'));//然后你就能够得到你的私钥了

//这个是裁决者，也是被攻击合约的deployer，也是miner
//address:0x7c1719a60fc75e57f4277412e5853d76bc35f58c PrivateKey:dbd0db8310c9d8b1da86f51316eaa991fb1e8fdbebe0ead1c95502d1c423d03b

// test:
//攻击者
//address:0x5bd42f193521662fda5b201dd8122e5f7fa1f974 PrivateKey:22b848b90cb455a72bc982994d52857bd3f25b9ee87a60e60d61311b24eb3282

//防御者
//address:0xc018fedba886825ed5ec0010c85fbbc0b9b8b851 PriavetKey:6451dd3a65808a810dbdaac51e2ea04e9b51d869c4abbfe547f69a1d312d9539



