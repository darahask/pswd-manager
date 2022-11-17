// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Pswd is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256) public ownerToToken;

    constructor() ERC721("PswdManager", "PswdNFT") {
        _tokenIdCounter.increment();
    }

    function singleMint() public {
        require(balanceOf(msg.sender) == 0, "Not allowed to mint more than one");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        ownerToToken[msg.sender] = tokenId;
    }

    function burn() public {
        _burn(ownerToToken[msg.sender]);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256,
        uint256
    ) internal virtual override{
        require(
            from == address(0) || to == address(0),
            "Not allowed to transfer token"
        );
    }
}