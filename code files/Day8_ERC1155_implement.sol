// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Olympics is ERC1155, Ownable {
    uint256 constant private STAFF = 0;
    uint256 constant private ATHLETE = 1;
    uint256 constant private ATHLETE_RELATED = 2;
    uint256 constant private AUDIENCE = 3;

    string constant private BASE_URI = "https://ipfs.io/ipfs/QmPiEpJpb84oRrmSnBxhmR9CC7kgr39yvXy7fHaUaZi7Hn/";
    string constant private JSON = ".json";
    bool private isPublicSale;

    constructor()
        ERC1155("https://ipfs.io/ipfs/QmPiEpJpb84oRrmSnBxhmR9CC7kgr39yvXy7fHaUaZi7Hn/{id}.json")
    {
        _mint(msg.sender, STAFF, 1, "");
        isPublicSale = false;
    }

    function uri (uint256 _tokenId) override public pure returns (string memory) {
        require( (_tokenId <=3 && _tokenId > 0), "There is no this id." );
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

    function mintForStaff(address account, uint256 id, uint256 amount, bytes memory data)
        public
    {   
        require(id < 3, "This is only for Staff!");
        _mint(account, id, amount, data);
    }

    function mintForAudience(address account, uint256 id, uint256 amount, bytes memory data)
        public
    {
        require(id == 3, "This is only for Audience!");
        require(amount <= 0, "Amount should be bigger than 0");
        require(amount <= 4, "You can only buy 4 ticket once.");
        _mint(account, id, amount, data);
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
}
