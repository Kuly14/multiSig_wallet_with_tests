// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract MultiSig {

    event CreateTransaction(address indexed _to, uint indexed _amount, uint indexed _txId);
    event ApproveTransaction(uint indexed _txId);
    event SubmitTransaction(uint indexed _txId);



    struct Transaction {
        address to;
        uint amount;
        bool executed;
    }

    address[] public owners;
    uint public required;
    mapping(uint => mapping(address => bool)) public approved;
    Transaction[] public transactions;

    modifier onlyOwners() {
        require(isOwner(), "You are not one of teh owners");
        _;
    }

    modifier notApproved(uint _txId) {
        require(approved[_txId][msg.sender] = false, "You already approved this transaction");
        _;
    }

    modifier notExecuted(uint _txId) {
        require(transactions[_txId].executed == false, "This transaction has been executed");
        _;
    }

    modifier txExists(uint _txId) {
        require(_txId <= transactions.length);
        _;
    }

    constructor(address[] memory _owners, uint _requiered) {
        required = _requiered;
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            owners.push(owner);
        }
    }

    function createTransaction(address _to, uint _amount) public onlyOwners {
        transactions.push(Transaction(_to, _amount, false));
        emit CreateTransaction(_to, _amount, transactions.length - 1);
    }

    function approveTransaction(uint _txId) external onlyOwners notApproved(_txId) notExecuted(_txId) txExists(_txId) {
        approved[_txId][msg.sender] = true;
        emit ApproveTransaction(_txId);
    }


    function executeTransaction(uint _txId) external onlyOwners notExecuted(_txId) {
        require(approvedByAll(_txId) == required, "Transaction hasn't been approved by all owners");

        uint amountToSend = transactions[_txId].amount;
        address receiver = transactions[_txId].to;
        transactions[_txId].executed = true;
        (bool success,) = receiver.call{value: amountToSend}("");
        require(success, "transaction didn't go through");
        
    }

    receive() external payable {}

    // Helper functions


    function isOwner() internal view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function approvedByAll(uint _txId) internal view returns (uint count) {
        for (uint i = 0; i < owners.length; i++) {
            if (approved[_txId][owners[i]] == true) {
                count += 1;
            }
        }
        return count;
    }


}