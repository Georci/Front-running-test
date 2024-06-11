var keyth = require('keythereum');
//('你想要得到私钥的账户地址'，'你keystore存放的目录（即keystore在我的data0目录下）')，这里使用的是绝对路径
var keyobj = keyth.importFromFile('2b62cdfa480a825ed53aeeb7ff915fc93b5721b2', '/home/kenijima/usr/work/Front-Running');
var privateKey = keyth.recover('123', keyobj);//（'这个账号的密码'，keyobj）
console.log(privateKey.toString('hex'));//然后你就能够得到你的私钥了

//这个是裁决者，也是被攻击合约的deployer，也是miner
//address:0x7c1719a60fc75e57f4277412e5853d76bc35f58c PrivateKey:dbd0db8310c9d8b1da86f51316eaa991fb1e8fdbebe0ead1c95502d1c423d03b

// test:
//攻击者
//address:0x5bd42f193521662fda5b201dd8122e5f7fa1f974 PrivateKey:22b848b90cb455a72bc982994d52857bd3f25b9ee87a60e60d61311b24eb3282

//防御者
//address:0xc018fedba886825ed5ec0010c85fbbc0b9b8b851 PriavetKey:6451dd3a65808a810dbdaac51e2ea04e9b51d869c4abbfe547f69a1d312d9539

//白
//address：169c1cb510dc9c8a94366f3450893ac1eaf82e8e PrivateKey:72feed5232dfd10b32ad570f80d5ead1b7a402aa4bc85d0015baeb48b2f64928

//红
// address:d2e41279f81af94e2c8c4fed571f0daf7be54219 PrivateKey:91dcc6e347e57b3f824ecfaedf57201329efa4bd275afaa754539450d32c6c1e

//蓝
// address:2b62cdfa480a825ed53aeeb7ff915fc93b5721b2 PrivateKey:c48398ed81a0124e2385f60fa2d77542b682427f7d171b1a89e5729903cb5989




