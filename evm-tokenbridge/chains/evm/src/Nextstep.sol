// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./Wormhole/ITokenBridge.sol";
import "./Wormhole/PortalWrappedToken.sol";
interface INextStep {
    function is_acted(bytes32 deprocess, string calldata action) external returns(bool);
    function act(bytes32 deprocess, string  calldata action, uint256 action_data) external returns(bool);
}

contract HelloNextStep {
// wormhole

//  address private token_bridge_address = address(0x0290FB167208Af455bB137780163b7B7a9a10C16);
//     ITokenBridge token_bridge = ITokenBridge(token_bridge_address);
//     address private TKN_address = address(0x2D8BE6BF0baA74e0A907016679CaE9190e80dD0A); 
//     ERC20PresetMinterPauser TKN = ERC20PresetMinterPauser(TKN_address);
 uint32 nonce = 0;
address owner;

   constructor(){
        owner = msg.sender;
    }
    address INEXT_STEP_PRECOMPILED = address(0x0000000000000000000000000000000000000800);
    INextStep NextStep = INextStep(INEXT_STEP_PRECOMPILED);

    function is_acted(bytes32 adeprocess, string memory aaction) public returns (bool) {                 
        return NextStep.is_acted(adeprocess, aaction);
    }

    function act(bytes32 adeprocess, string memory aaction, uint256 aaction_data) public returns (bool) {
        return NextStep.act(adeprocess, aaction, aaction_data);
    }

    struct Cross {
        uint16 network;
        address token;
        bytes32 rcvr;
        uint256 value;
    }

    mapping( bytes32 => Cross ) public crosses; //(deprocess, action) => (net, contract, recvr, value)

    function escrow(bytes32   deprocess, string memory action, uint16 network, address token, bytes32 rcvr, uint256 value) public {
        bytes32 key = keccak256(abi.encodePacked(deprocess, action));
        crosses[key] = Cross(network, token, rcvr,value); 
    }

    function release(bytes32   deprocess, string memory action) public {
        if (is_acted(deprocess, action)) {
            bytes32 key = keccak256(abi.encodePacked(deprocess, action));
            // proxy.transfer(crosses[key].network, crosses[key].token, crosses[key].rcvr, crosses[key].value);
         nonce += 1;
         ITokenBridge(crosses[key].token).transferTokens(crosses[key].token, crosses[key].value, crosses[key].network, crosses[key].rcvr, 0, nonce);
 
       
        }
    }
}