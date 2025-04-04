//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract TipJar {
    address public owner;

    event TipReceived(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function tip() external payable {
        require(msg.value > 0, "Tip must be greater than zero");
        emit TipReceived(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
        emit Withdrawn(owner, balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
