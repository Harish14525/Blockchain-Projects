// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public owner;
    string[] public candidateList;
    mapping(string => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _candidates) {
        owner = msg.sender;
        candidateList = _candidates;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "Already voted.");
        require(validCandidate(candidate), "Invalid candidate.");

        votesReceived[candidate] += 1;
        hasVoted[msg.sender] = true;
    }

    function totalVotesFor(string memory candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Invalid candidate.");
        return votesReceived[candidate];
    }

    function validCandidate(string memory candidate) internal view returns (bool) {
        for (uint256 i = 0; i < candidateList.length; i++) {
            if (keccak256(bytes(candidateList[i])) == keccak256(bytes(candidate))) {
                return true;
            }
        }
        return false;
    }

    function getAllCandidates() public view returns (string[] memory) {
        return candidateList;
    }
}
