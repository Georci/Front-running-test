// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// We attempt to frontrun a Free mint transaction
contract FreeMint {
    address owner;

    uint256 flag;

    // Constructor, initializes the namerm  and symbol of the NFT collection
    constructor() payable {
        owner = msg.sender;
        flag = 0;
    }

    // Mint function
    function mint(address _receiver) external {
        // if( msg.sender == owner){
        //     payable(_receiver).transfer(address(this).balance);
        // }

        // payable(msg.sender).transfer(10 ether);
        require(flag == 0);

        _mint(_receiver); // mint
        flag = flag + 1;
    }

    function _mint(address to) internal {
        if (to == address(0)) {
            revert("ERC721InvalidReceiver:address(0)");
        }
        payable(to).transfer(10 ether);
    }

    function reset() external {
        flag = 0;
    }

    receive() external payable {}
}
