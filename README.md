# Password Manager

- URL: https://pswd-manager.vercel.app/

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