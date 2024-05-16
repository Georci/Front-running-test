// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Test{

    uint256 a;

    function balance() public returns(uint256){
        a = a + 1;
        return a; 
    }
}