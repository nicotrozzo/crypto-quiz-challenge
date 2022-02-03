pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Quiz is ERC20 {

    address private owner;

    constructor(uint256 initialSupply) ERC20("QUIZ", "QUIZ") {
        _mint(msg.sender, _toAmount(initialSupply));
        owner = msg.sender;
    }

    /** @dev Transfers tokens to the ones who completed the survey.
     *       Transfers as much tokens as amount of answers
     *  @param amountAnswered amount of completed answers
     */
    function claimQuiz(uint8 amountAnswered) public returns (bool) {   
        // There should be a validation here to check they actually answered the quiz.
        // One option would be that when they complete the survey, through a backend
        // the owner approves the one who answered, and here we would use allowance()
        // to check the amount, instead of receiving it as an argument.
        // require(true);
        _transfer(owner, msg.sender, _toAmount(amountAnswered) );
        return true;
    }

    /** @dev Transforms a number to the actual token amount taking decimals
     *          into account. Ex: 1 token for 18 decimals is 1e18, this function
     *          receives 1 and returns 1e18.
     */
    function _toAmount(uint256 number) private view returns (uint256) {
        return number * 10 ** uint256(decimals());
    } 
}
