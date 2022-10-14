// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./onlyVerifier.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

contract Olympics is ERC1155, ERC1155Burnable, Ownable, onlyVerifier {
    uint256 constant private STAFF = 0;
    uint256 constant private ATHLETE = 1;
    uint256 constant private ATHLETE_RELATED = 2;
    uint256 constant private AUDIENCE = 3;
    uint256 constant private AUDIENCE_SOUVENIR = 4;
    mapping (uint256 => mapping(address => uint256)) _balances;

    string constant private BASE_URI = "https://ipfs.io/ipfs/QmZo1Wpnm1iYXufika72kpp9tZvPJzcLML6Q648tiU3PTp/";
    string constant private JSON = ".json";
    bool private isPublicSale;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // implement of onlyVerifier

    bytes32 root;
    constructor(bytes32[] memory role, address[] memory addr) payable
        ERC1155("https://ipfs.io/ipfs/QmZo1Wpnm1iYXufika72kpp9tZvPJzcLML6Q648tiU3PTp/{id}.json")
    {
        _grantRoleInBatch(role, addr);
    }
    function uri (uint256 _tokenId) override public pure returns (string memory) {
        require( (_tokenId <=3 && _tokenId >= 0), "There is no this id." );
        return 
        string(
            abi.encodePacked(
            BASE_URI,
            Strings.toString(_tokenId),
            JSON)
        );
    }

    function setPublic() public onlyOwner {
        isPublicSale = true;
    }

    function setPause() public onlyOwner {
        isPublicSale = false;
    }

    function mintForStaff( uint256 id, uint256 amount)
        public
    {   
        require(id < 3 && id >= 0, "This is only for Staff!");
        _mint(msg.sender, id, amount, "");
    }

    function mintForAudience( uint256 amount)
        public
    {
        require(amount > 0, "Amount should be bigger than 0");
        require(amount <= 4, "You can only buy 4 ticket once.");
        _mint(msg.sender, 3, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
    {
        require(ids.length < 3, "What are you doing?");
        for (uint i = 0; i < ids.length; i++) {
            require(ids[i] < 3, "This is only for Staff!");
        }
        _mintBatch(to, ids, amounts, data);
    }

    // for Merkle Proof Part
    modifier isWhitelisted_m(bytes32[] memory proof) {
        require(
            MerkleProof.verify(
                proof,
                root,
                keccak256(abi.encodePacked(msg.sender))
        ));
        _;
    }
    
    function verifySuccessed(address user) public onlyTwoRole { 
        burn(user, 3, 1);
        _mint(user, 4, 1, "");
    }
}