// SPDX-License-Identifier: MIT
// Implementation Contract(logic)

pragma solidity ^0.8.7;

contract Box {
  uint256 internal value;

  event ValueChanged(uint256 newValue);

  function store(uint256 newValue) public {
    value = newValue;
    emit ValueChanged(newValue);
  }

  function retrieve() public view returns (uint256) {
    return value;
  }

  function version() public view returns (uint256) {
    return 1;
  }
}
