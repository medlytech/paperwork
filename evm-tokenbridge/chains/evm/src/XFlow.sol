//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//If the below line shows an error, ignore it, it's cause you're root folder is not chains/evm. 
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./Wormhole/ITokenBridge.sol";
import "./Wormhole/PortalWrappedToken.sol";
contract XFlow  {
    // using StringToAddress for string;
    // using AddressToString for address;

 
    event NextStep(bytes32 CurrentStep, bytes32 NextStep,address caller);
 
// curretn step 
bytes32 currentStep;
bytes32 lastStep;

// link each step to the next 
// what if we have forked step ? need to rethink about it
mapping (bytes32=>bytes32) stepTree;
mapping (bytes32=>address) stepToAuthor;
// owner 

// steps with payment 
mapping (bytes32=>uint) stepPayment;

 // wormhole 

uint16 receipientChainId;
 bytes32 recipient;
    address private token_bridge_address;// = address(0x0290FB167208Af455bB137780163b7B7a9a10C16);
    ITokenBridge token_bridge; //= ITokenBridge(token_bridge_address);
    address private TKN_address ;//= address(0x2D8BE6BF0baA74e0A907016679CaE9190e80dD0A); 
    ERC20PresetMinterPauser TKN;// = ERC20PresetMinterPauser(TKN_address);

    uint32 nonce = 0;
    mapping(uint16 => bytes32) _applicationContracts;
    mapping(bytes32 => bool) _completedMessages;

    address owner;



modifier onlyAuthor() {
   
   require(stepToAuthor[stepTree[currentStep]]== msg.sender,"caller is not assigned to this step");
    _;
}

    constructor(
address tokenBridge,
address TKN_Address,
 uint16 receipientChainId_, bytes32 recipient_,
       bytes32 [] memory steps,
       address [] memory stepAuthors,
       bytes32 [] memory crossChainSteps,
       uint[] memory crossChainStepAmount
    ){
        // wormhole
        receipientChainId=  receipientChainId_;
         recipient = recipient_;
        token_bridge_address=tokenBridge;
        token_bridge = ITokenBridge(token_bridge_address);
        TKN_address = TKN_Address; 
        TKN = ERC20PresetMinterPauser(TKN_address);



        owner = msg.sender;
        // should check for arrays length
        for (uint256 index = 0; index < steps.length-1; index++) {
            stepTree[steps[index]]=steps[index+1];
            stepToAuthor[steps[index]]=stepAuthors[index];
        }
        for (uint256 index = 0; index < crossChainSteps.length; index++) {
            stepPayment[crossChainSteps[index]]=crossChainStepAmount[index];
        }
        lastStep = steps[steps.length];
    }
function goNextStep() public onlyAuthor{
 bool isCrossChain = stepPayment[stepTree[currentStep]]>0;
 
    if (isCrossChain){
    
      nonce += 1;
        return token_bridge.transferTokens(TKN_address,  stepPayment[currentStep], receipientChainId, recipient, 0, nonce);
 
     currentStep = stepTree[currentStep];
    emit NextStep(currentStep,  stepTree[currentStep],msg.sender);
    }
}
// wormhole

    /**
        Registers it's sibling applications on other chains as the only ones that can send this instance messages
     */
    function registerApplicationContracts(uint16 chainId, bytes32 applicationAddr) public {
        require(msg.sender == owner, "Only owner can register new chains!");
        _applicationContracts[chainId] = applicationAddr;
    }

    //Returns the Balance of this Contract
    function getTKNCount() public view returns (uint256) {
        return TKN.balanceOf(address(this));
    }

    //Returns the Balance of Wrapped Count
    function getWrappedCount(PortalWrappedToken wrappedToken) public view returns (uint256) {
        return wrappedToken.balanceOf(address(this));
    }

    function bridgeToken(uint256 amt, uint16 receipientChainId_, bytes32 recipient_) public returns (uint64 sequence) {
        nonce += 1;
        return token_bridge.transferTokens(TKN_address, amt, receipientChainId_, recipient_, 0, nonce);
    }   

    function approveTokenBridge(uint256 amt) public returns (bool) {
        return TKN.approve(token_bridge_address, amt);
    }
 
}