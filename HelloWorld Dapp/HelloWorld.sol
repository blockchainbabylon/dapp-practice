//SPDX-License-Identifier: MIT
pragma solidity 0.8.26

contract HelloWorld {
    string private message;

    constructor() {
        message = "Hello, Blockchain!";
    }

    function setMessage(string calldata newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
