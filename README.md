## Real Estate contracts

### RoleBasedAcl contract

Manage role-based access control contracts

Properties:

- Assign role to address
- Unassign role to address
- Check role of address
- Get all address and role

### RealEstate contract

Real estate management and transaction

Properties:

- Create new certificate
- Get all owner of certificate
- Get owner approval for ( activate || sell)
- Activate certificate
- Activate certificate for sale
- Transfer ownership of certificate
- Check state of certificate

### Deploy smart contracts

Deploy smart contracts using truffle framework

- Test smart contracts
  ```
  truffle test
  ```
- Deploy smart contracts to your local Ganache instance
  ```
  truffle migrate --reset
  ```
- Deploy to other networks like testnet or mainnet
  ```
  truffle migrate --reset --network ropsten
  ```

## Frontend and interaction with RoleBasedAcl contract

In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Make sure there is at least one cryptocurrency wallet [Metamask](https://metamask.io/), [Mist](https://github.com/ethereum/mist/releases),[Trust](https://trustwallet.com/)... extension installed in your browser
You will also see any lint errors in the console.

## Available contract

The smart contract is deployed to testnet( ropsten ) for test

Contract address:

- RoleBasedAcl: [0x9da588a0bb8089725eb64fc10f4e2608ae9c65c5](https://ropsten.etherscan.io/tx/0x5e718abf03a3d1942154907bc042479e572250f45edd8a81f72ca1feaeb39911)
- RealEstate: [0x9a528d4f4B55C2717b5a387Bc8de211797f02C44](https://ropsten.etherscan.io/tx/0xc22f9c90741c75e8a411a5a66b01c9f5b43dbd584d9b52113456cbc88961e908)
