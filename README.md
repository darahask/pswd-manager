# Password Manager
- URL: https://pswd-manager.vercel.app/

# About
The password manager uses lit protocol and ceramic to encrypt and store credentials of a user. A contract is deplyed on mumbai network which mints a SBT to user and helps lit protocol to check the ownership

## Setup
* Create a .env file in root directory
* Add MUMBAI_URL and PRIVATE_KEY fields
* Run the below commands for contract deployment
```shell
npm install
npx hardhat run scripts/deploy.js
```
* Change the values in constants.js accordingly
* Run ```npm run dev``` to launch frontend
