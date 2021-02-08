// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.7.4;

import "./IERC20.sol";

contract Capsule {
    address public grantor;
    address public beneficiary;
    uint256 public distributionDate;
    uint256 public createdDate;

    modifier onlyOwner {
        require(msg.sender == grantor);
        _;
    }

    constructor ( address _grantor, address _beneficiary, uint256 _distributionDate) {
        grantor = _grantor;
        beneficiary = _beneficiary;
        distributionDate = _distributionDate;
        createdDate = block.timestamp;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw() onlyOwner public {
        require(block.timestamp >= distributionDate);
        msg.sender.transfer(address(this).balance);
        Withdrew(msg.sender, address(this).balance);
    }

    function withdrawTokens(address _tokenContract) onlyOwner public {
        require(block.timestamp >= distributionDate);
        IERC20 token = IERC20(_tokenContract);
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(grantor, tokenBalance);
        WithdrewTokens(_tokenContract, msg.sender, tokenBalance);
    }

    function info() public view returns(address, address, uint256, uint256, uint256) {
        return (grantor, beneficiary, distributionDate, createdDate, address(this).balance);
    }

    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);
}