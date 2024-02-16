// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed from, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply * (10**(decimals));
        balanceOf[msg.sender] = totalSupply;
    }

    modifier invalidAddress(address _address) {
        require(_address != address(0), "Invalid Address");
        _;
    }

    function _burn(address _from, uint256 _value) internal {
        require(_value > 0, "Burn value must be greater than 0");
        require(balanceOf[_from] >= _value, "Burn amount exceeds balance");
        
        balanceOf[_from] -= _value;
        totalSupply -= _value;
        emit Burn(_from, _value);
    }

    function transfer(address _to, uint256 _value) public invalidAddress(_to) returns (bool success){
        require(balanceOf[msg.sender] >= _value, "Insufficient Token");

        uint256 burnAmount = (_value * 10) / 100; 
        uint256 totalAmount = _value + burnAmount;

        require(balanceOf[msg.sender] >= totalAmount, "Insufficient balance for transfer and burn");

        balanceOf[msg.sender] -= totalAmount;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);

        _burn(msg.sender, burnAmount); 

        return true;
    }

    function approve(address _spender, uint256 _value) public invalidAddress(_spender) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient Token");
        require(allowance[_from][msg.sender] >= _value, "Transfer not allowed");

        uint256 burnAmount = (_value * 10) / 100; 
        uint256 totalAmount = _value + burnAmount;

        require(balanceOf[_from] >= totalAmount, "Insufficient balance for transfer and burn");

        balanceOf[_from] -= totalAmount;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);

        _burn(_from, burnAmount); 

        allowance[_from][msg.sender] -= _value;

        return true;
    }
}