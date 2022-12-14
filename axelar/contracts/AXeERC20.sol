// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
/**
 * 
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
  import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
   import '@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol';

contract AXeERC20  is ERC20 , AxelarExecutable {
 
     /**
     * @dev Sets the values for {name}, {symbol}, and {decimals}.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address gateway_
    ) ERC20(name_,symbol_) AxelarExecutable (gateway_){
    
       _mint(msg.sender, 10 ether);
       
    }
 function decimals() public view  override returns (uint8) {
        return 6;
    }

function crossSwap( string calldata destinationChain,
        string calldata destinationAddress, uint256 amount)  external returns (bool){
     gateway.sendToken(  destinationChain,
         destinationAddress,
        symbol(),
       amount);

       
    
}
}
