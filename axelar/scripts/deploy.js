const { createAndExport, setupNetwork } = require('@axelar-network/axelar-local-dev');
const hre = require("hardhat");
async function main(toFund = []) {
  async function callback(chain, info) {
    await chain.deployToken('Axelar Wrapped aUSDC', 'aUSDC', 6, BigInt(1e70));
    for (const address of toFund) {
      await chain.giveToken(address, 'aUSDC', BigInt(1e18));
    }


  }



  const networkOption = {
    name: "NextStep",
    // chainId: "8888",
    // userKeys: toFund,
    ownerKey: "0x0cc0c2de7e8c30525b4ca3b9e0b9703fb29569060d403261055481df7014f7fa",
    // operatorKey: toFund[0],
    // relayerKey: toFund[0],
    // adminKeys: toFund,
    // lastRelayedBlock: 0,
  }


  // console.log({ networkOption });
  const chain = await setupNetwork("http://127.0.0.1:8545", networkOption)
  console.log({ chain });
  const name = "Wrapped aUSDC"
  const symbol = "aUSDC"

  const token = await hre.ethers.getContractFactory("ERC20");
  const aUSDCToken = await token.deploy(name, symbol);

  await aUSDCToken.deployed();
  const url = "http://127.0.0.1:8545"
  // approve gateway to spend token 
  await aUSDCToken.approve(chain.gateway.address, 5000);
  console.log(
    `Wrapped aUSDC deployed to ${aUSDCToken.address}`
  );
  await createAndExport({
    chainOutputPath: "./info/local.json",
    accountsToFund: toFund,
    callback: callback,
  });
  const accounts = await ethers.getSigners();
  console.log(accounts);
  const nextGateway = await chain.gateway.deployed()
  const tx = await nextGateway.connect(chain.operatorWallet).sendToken("Moonbeam", 0xc0d8F541Ab8B71F20c10261818F2F401e8194049, symbol, 100);/**     string calldata destinationChain,
        string calldata destinationAddress,
        string calldata symbol,
        uint256 amount */
  console.log({ tx });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});