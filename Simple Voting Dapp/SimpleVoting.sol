//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract SimpleVoting {
    address public owner;

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public hasVoted;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOt owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(string memory _description) external onlyOwner {
        proposals.push(Proposal(_description, 0));
    }

    function vote(uint256 proposalIndex) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(proposalIndex < proposals.length, "Invalid proposal");

        proposals[proposalIndex].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function totalProposals() external view returns (uint256) {
        return proposals.length;
    }
}
