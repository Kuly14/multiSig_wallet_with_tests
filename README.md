# MultiSig Wallet With Tests

Classic multi sig wallet that won't send send any ether out of the contract until all owners of the contract approve the transaction

## Tests

I updated the tests and the smart contract since it had a bug in it which made the contract useless. 

In require statement instead of two == I wrote only one which means the require statement failed every time.

![tests](

