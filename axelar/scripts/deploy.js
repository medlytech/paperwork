const { createAndExport, setupNetwork,getDepositAddress, getNetwork } = require('@axelar-network/axelar-local-dev');
const hre = require("hardhat");

const ethers = hre.ethers;
const { defaultAbiCoder, id, arrayify, keccak256 } = ethers.utils;
const { getDefaultProvider, constants,
  Contract ,Wallet} = ethers;
async function main(toFund = []) {
  let chains = [];
  async function callback(chain, info) {
    chain.token=   await deployToken(chain, 'Axelar Wrapped aUSDC', 'aUSDC', 6, BigInt(1e70), constants.AddressZero, symbol);

  //  chain.token= await chain.deployToken('Axelar Wrapped aUSDC', 'aUSDC', 6, BigInt(1e70));
    for (const address of toFund) {
      await chain.giveToken(address, 'aUSDC', BigInt(1e18));
    }
    chains.push(chain);

    // const depositAdd = await getDepositAddress(chain.name,
    //   "NextStep",
    //   "0xc0d8F541Ab8B71F20c10261818F2F401e8194049",
    //   'aUSDC',
    //   8500);
    // console.log({ depositAdd });
    // const tx = await chain.token.transfer(depositAdd, 10)
  //  await (await chain.token.transfer(depositAdd, 10)).wait();


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
  const name = "Wrapped aUSDC"
  const symbol = "aUSDC"

  // console.log({ networkOption });
  const chain = await setupNetwork("http://127.0.0.1:8545", networkOption)


   // chain.token = await chain.gateway.connect(chain.operatorWallet).deployToken('Axelar Wrapped aUSDC', 'aUSDC', 6, BigInt(1e70));
  // chain.token = await deployToken(chain, 'Axelar Wrapped aUSDC', 'aUSDC', 6, BigInt(1e70), constants.AddressZero,symbol);

  // console.log({ chain });


  // chains.push(chain);
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const token = await hre.ethers.getContractFactory("AXeERC20");
  // const aUSDCToken = await token.deploy(name, symbol, chain.gateway.address);

  // await aUSDCToken.deployed();
  const url = "http://127.0.0.1:8545"
  // approve gateway to spend token 
  // await aUSDCToken.approve(chain.gateway.address, 5000);
  // console.log(
  //   `Wrapped aUSDC deployed to ${aUSDCToken.address}`
  // );
  await createAndExport({
    chainOutputPath: "./info/local.json",
    accountsToFund: toFund,
    callback: callback,
  });
  const accounts = await ethers.getSigners();
  // console.log(accounts);// crossSwap(address _gateway, string destinationChain , address destinationAddress, uint256 amount)
  // // const nextGateway = await chain.gateway.connect(chain.operatorWallet).sendToken("Moonbeam", 0xc0d8F541Ab8B71F20c10261818F2F401e8194049, symbol, 100,{ gasLimit: BigInt(8e6) })
  const nextGateway = await chain.gateway.deployed();//.connect(chain.operatorWallet).sendToken("Moonbeam", 0xc0d8F541Ab8B71F20c10261818F2F401e8194049, symbol, 100,{ gasLimit: BigInt(8e6) })
   
  const test =  await nextGateway.tokenAddresses(symbol);
  // console.log({ nextGateway });
  console.log({ test });
  /**     string calldata destinationChain,
        string calldata destinationAddress,
        string calldata symbol,
        uint256 amount */
  // const tx = await giveToken(accounts[0], chain, 100, symbol);
  // console.log({ tx });
  
  // const depositAdd = await getDepositAddress("NextStep",
  //   chains[0].name,
  //   "0xc0d8F541Ab8B71F20c10261818F2F401e8194049",
  //   symbol,
  //   8500);
  // console.log({ depositAdd });
  // console.log({ chains });
  const destinationChain = chains[0];
  

  // const tx = await aUSDCToken.transfer(depositAdd, 10)
  // const balance = await aUSDCToken.balanceOf(depositAdd);

  // console.log({ balance });
  // console.log({ tx });

  // while (true) {
  //   await destinationChain.giveToken(depositAdd, 'aUSDC', BigInt(1e18));
  //   const newBalance = await destinationChain.token.balanceOf(depositAdd);
  //   console.log({ newBalance });

  //   if (balance != newBalance) break;
  //   await sleep(2000);
  // }

  
}

async function getToken(chain, wallet) {
  const provider = getDefaultProvider(chain.rpc);
  chain.wallet = wallet//.connect(provider);
  // chain.contract = new Contract(chain.gateway, Gateway.abi, chain.wallet);
  const tokenAddress = await chain.gateway.tokenAddresses(chain.tokens);
  chain.token = new Contract(tokenAddress, ERC20.abi, chain.wallet);
return chain
}
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
  const getRandomID = () => ethers.utils.id(getRandomInt(1e10).toString());

    async function giveToken(wallet, chain , amount, symbol) {
   const data = ethers.utils.arrayify(
     ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'bytes32[]', 'string[]', 'bytes[]'],
      [
        chain.chainId,
        [getRandomID()],
        ['mintToken'],
        [ethers.utils.defaultAbiCoder.encode(['string', 'address', 'uint256'], [symbol, wallet.address, amount])],
      ]
    )
  );

  const signedData = await getSignedExecuteInput(data, chain.operatorWallet);
  await(await chain.gateway.connect(chain.ownerWallet).execute(signedData, { gasLimit: BigInt(8e6) })).wait();
}
async function getSignedExecuteInput(data, wallet) {
  const signature = await wallet.signMessage(arrayify(keccak256(data)));
  const signData = defaultAbiCoder.encode(['address[]', 'uint256[]', 'uint256', 'bytes[]'], [[wallet.address], [1], 1, [signature]]);
  return defaultAbiCoder.encode(['bytes', 'bytes'], [data, signData]);
}

  async function deployToken(chain,name, symbol, decimals, cap, address, alias ) {
    console.log({name, symbol, decimals, cap, address, alias});
    console.log({ randomId:getRandomID() });
    const data = arrayify(
    defaultAbiCoder.encode(
      ['uint256', 'bytes32[]', 'string[]', 'bytes[]'],
      [
        chain.chainId,
        [getRandomID()],
        ['deployToken'],
        [
          defaultAbiCoder.encode(
            ['string', 'string', 'uint8', 'uint256', 'address', 'uint256'],
            [name, symbol, decimals, cap, address, 0]
          ),
        ],
      ]
    )
  );
     const signedData = await getSignedExecuteInput(data, chain.operatorWallet);
  // const tx=   await chain.gateway.connect(chain.ownerWallet).execute(signedData, { gasLimit: BigInt(8e6) })
  // console.log({tx});  
  // await (await chain.gateway.connect(chain.ownerWallet).execute(signedData, { gasLimit: BigInt(8e6) })).wait();
  //   const tokenAddress = await chain.gateway.tokenAddresses(symbol);
  // const tokenContract = new Contract(tokenAddress, BurnableMintableCappedERC20.abi, this.ownerWallet);
  // logger.log(`Deployed at ${tokenContract.address}`);
  //   chain.tokens[alias] = symbol;
  // return tokenContract;
  }
function getDeployCommand ( name, symbol, decimals, cap, tokenAddress, dailyMintLimit)
{  defaultAbiCoder.encode(
    ['string', 'string', 'uint8', 'uint256', 'address', 'uint256'],
    [name, symbol, decimals, cap, tokenAddress, dailyMintLimit],
        )}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});