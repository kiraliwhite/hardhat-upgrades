const { ethers } = require("hardhat");

async function main() {
  //抓取ProxyAdmin,因為需要此function來升級Proxy
  const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
  //抓取Proxy本身,合約名稱是由hardhat deploy自動命名的,使用yarn hardhat deploy可得知
  const transparentProxy = await ethers.getContract("Box_Proxy");

  /** 顯示舊版本 */
  //使用getContractAt(abi,合約地址),來抓取目前proxy指向的implementation合約,地址是proxy的地址
  const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address);
  //呼叫我們寫在Box_implementation合約的中的function,先抓取版本
  const versionV1 = await proxyBoxV1.version();
  console.log(versionV1.toString());

  /** 升級 */
  //因為要升級implementation合約到V2,因此需要BoxV2
  const boxV2 = await ethers.getContract("BoxV2");
  //使用boxProxyAdmin的upgrade function,輸入參數為Proxy地址,與implementation合約地址
  const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
  await upgradeTx.wait(1);

  /** 顯示新版本 */
  //使用getContractAt(abi,合約地址) 來呼叫升級後的implementation合約(boxV2),地址是填入proxy的地址
  const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
  //呼叫我們寫在BoxV2合約中的version function檢查版本
  const versionV2 = await proxyBoxV2.version();
  console.log(versionV2.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
