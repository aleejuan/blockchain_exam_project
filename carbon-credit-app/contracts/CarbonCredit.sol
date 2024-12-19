// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonCredit {
    struct Credit {
        uint256 id;
        address owner;
        uint256 amount;
    }

    mapping(uint256 => Credit) public credits;
    mapping(address => uint256) public balances;
    uint256 public nextId;

    event CreditCreated(uint256 id, address owner, uint256 amount);
    event CreditTransferred(uint256 id, address from, address to, uint256 amount);
    event TokensTransferred(address from, address to, uint256 amount);

    function createCredit(uint256 amount) external {
    require(amount > 0, "Amount must be greater than zero");
    credits[nextId] = Credit(nextId, msg.sender, amount);
    balances[msg.sender] += amount;
    emit CreditCreated(nextId, msg.sender, amount);
    nextId++;
}


    function transferCredit(uint256 id, address to) external {
        require(credits[id].owner == msg.sender, "Not the owner");
        credits[id].owner = to;
        emit CreditTransferred(id, msg.sender, to, credits[id].amount);
    }

    function transferTokens(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient address");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit TokensTransferred(msg.sender, to, amount);
    }

    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
}
