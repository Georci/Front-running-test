pragma solidity 0.8.25;

library ImplementationLib {
    event testEvent(address txOrigin, address msgSenderAddress, address _from);

    function doSomething() public {
        emit testEvent(tx.origin, msg.sender, address(this));
    }
}

contract CallingContract {
    function callImplementationLib() public {
        ImplementationLib.doSomething();
    }
}
