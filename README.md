# MultiSig Wallet With Tests

Classic multi sig wallet that won't send send any ether out of the contract until all owners of the contract approve the transaction

## Tests

I updated the tests and the smart contract since it had a bug in it which made the contract useless. 

In require statement instead of two == I wrote only one which means the require statement failed every time.

![tests](https://github.com/Kuly14/multiSig_wallet_with_tests/blob/c5f7fe8848b28477a0c74f572e06c7d2cfdf3980/Screenshot%20from%202022-02-22%2011-04-14.png)

