// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract onlyVerifier {
    address private _owner;
    struct roleData {
        mapping(address => bool) members;   
        bytes roleName;
    }
    mapping (bytes32 => roleData) _roles;
    
    constructor() {
        _owner = msg.sender;
    }
    
    modifier _onlyOwner {
        require(_owner == msg.sender, "Not Owner.");
        _;
    }
    
    event GrantRole(address, bytes32, address);
    function _grantRoleInBatch(bytes32[] memory role, address[] memory addr) internal virtual _onlyOwner{
        for (uint i = 0; i < role.length; i++) {
            if (!hasRole(role[i], addr[i])) {
                _roles[role[i]].members[addr[i]] = true;
                emit GrantRole(addr[i], role[i], msg.sender);
            }
        }
        
    }

    function hasRole(bytes32 role, address addr) public view virtual returns (bool) {
        return _roles[role].members[addr];
    }

    function _checkRole(bytes32 role1, bytes32 role2, address addr) internal view {
        if (!hasRole(role1, addr)) {
            revert (
                string("do not have the access")
            );
        }
        if (!hasRole(role2, addr)) {
            revert (
                string("do not have the access")
            );
        }
    }

    function _checkRole(bytes32 role, address addr) internal view {
        if (!hasRole(role, addr)) {
            revert (
                string("do not have the access")
            );
        }
    }

    modifier onlyTwoRole {
        bytes32 role1 = keccak256("MINTER_ROLE");
        bytes32 role2 = keccak256("BURNER_ROLE");
        _checkRole(role1, role2, msg.sender);
        _;
    }

    modifier onlySingleRole {
        bytes32 role = keccak256("MINTER_ROLE"); // or change your rule if you want
        _checkRole(role, msg.sender);
        _;
    }
}