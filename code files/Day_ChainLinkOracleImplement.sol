// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract getPrice {
    AggregatorV3Interface internal priceFeed;
    constructor() {
        priceFeed = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);
        // mumbai testnet dataFeed
    }
    
    function getLatestPrice() public view returns (int) {
        (   
            /*uint80 roundID*/,  
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function test() public pure returns(int, int) {
        int a;
        int b;
        a = 101;
        b = 100;
        return(
            (a - b )/ b,
            a / b * 100
        );

    }
}

contract detectUpsAndDowns is KeeperCompatibleInterface, getPrice, ERC721, ERC721URIStorage {

    int lastPrice;
    string cat = "https://imgur.com/bwrkgIP";
    string dog = "https://imgur.com/SiufprW";

    getPrice getETH = getPrice(0xcD59d9649614b550e6caE1455ae891f8Cf4A89f7);
    
    constructor() ERC721("Test", "tt") {
        lastPrice = getEthPrice();
    }
    
    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, dog);
    }
    
    function checkUpkeep(bytes calldata /*checkData*/) external view override returns (bool upkeepNeeded, bytes memory /*performData*/) {
        int currentPrice = getEthPrice();
        upkeepNeeded = ( (currentPrice - lastPrice)  > 0 );
    }
    
    function performUpkeep(bytes calldata /* performData */) external override {
        int currentPrice = getEthPrice();
        if ( (currentPrice - lastPrice) > 0 ) {
            lastPrice = currentPrice;
            _setTokenURI(0, cat);
        }
    }
    function showPrice() public view returns(int) {
        int currentPrice = getEthPrice();
        return (currentPrice - lastPrice);
    }

    function getEthPrice() public view returns(int) {
        return getETH.getLatestPrice();
    }
    // ERC721 related
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
