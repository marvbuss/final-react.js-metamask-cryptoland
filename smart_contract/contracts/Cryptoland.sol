// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Cryptoland {

    event Transfer(address from, address receiver, uint amount, string payment_reference, uint256 timestamp);
  
    struct Payment {
        address sender;
        address receiver;
        uint amount;
        string payment_reference;
        uint256 timestamp;
    }

    Payment[] payments;

    function initiateTransfer(address payable receiver, uint amount, string memory payment_reference) public {
        payments.push(Payment(msg.sender, receiver, amount, payment_reference, block.timestamp));

        emit Transfer(msg.sender, receiver, amount, payment_reference, block.timestamp);
    }

    function getAllPayments() public view returns (Payment[] memory) {
        return payments;
    }

}