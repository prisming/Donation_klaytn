## Description

This pilot project is for tracking "donation box" that has various goods, such as toothpaste, soap, and snack, in a unit. Goods are donated by any organizations (= members), and packed in donation boxes by a nonprofit foundation (= foundation), and distributed to local nonprofit organizations (= NPOs). Each donation box has a unique identification number that allows NPOs to record its status into the Klaytn, especially when a good is arrived at recipients and where it is finally given. In addition, through the identification numbers, not only the foundation but also members can retrieve the information of goods and boxes when they want.

**Our codes are at a preliminary stage with a focus on the following procedure and smart contract methods.**

**Please click the following images to watch how each procedure works**

## Flows

We record donation information into a local database and/or the Klaytn because there are privacy issues in blockchain-based donation.


1. [Klaytn / Local] Members donate goods and give in-depth information (quantity, price, expiration date, ...) to the foundation.
    - Members specify which information will be opened to the public.
    - The selected information are recorded into the Klaytn. (method: __*donate*__)
    - Information what members are reluctant to open are stored into a local database. (MySQL)
    - Key for donation is generated by hashing the all the information, and it guarantees that data does not manipulate without proper process.

    - [![login_and_donate](http://img.youtube.com/vi/UYgFf_oQwvM/0.jpg)](http://www.youtube.com/watch?v=UYgFf_oQwvM "")
    
    
2. [Local] For each type of donation boxes, the foundation decides its configuration based on the collected goods.
    - e.g., type A box consists of 3 toothpastes and 1 toothbrush while type B box only has 1 soap 
    - Box configuration is saved into a local database. The foundation could change the configuration easily. 
    - Each type has own expiration date, which is the minimum of expiration dates of goods. 
    
3. [Local] The foundation sets the number of boxes by types.
    - The number of boxes is determined depending on the quantity of goods that members donate.
    - These numbers are stored in a local database. 
    
4. [Local] The foundation temporally distributes boxes to NPOs.
    - This step needs for simulating a donation event before recording the box information into the Klaytn.
    - Temporal distributions are saved in a local database to be easily modified.
    - [![box_simulation](http://img.youtube.com/vi/S-PxwciObQI/0.jpg)](http://www.youtube.com/watch?v=S-PxwciObQI "")
    
5. [Klaytn] The foundation uploads box distribution details to the Klaytn. 
    - Each box has an identification number and is sent to a NPO. (method: __*distributeBox*__)
    - A box contains rich information including the identification number, box type, recipient, expiration date, and etc.
    - [![final_dist](http://img.youtube.com/vi/G3eTcbA6w5I/0.jpg)](http://www.youtube.com/watch?v=G3eTcbA6w5I "")
    
6. [Klaytn] NPOs update box information when they receive boxes and deliver them to recipients.
    - NPOs record the date when they receive boxes by using their private key (method: __*receiveBox*__)
    - NPOs also record the date and details of final destinations (method: __*addInfo*__).
    - Private key is generated when the foundation creates ID of a NPO.
    - Keystore files are in the system, so that NPOs do not need to load them independently when signing a transaction.
    - NPOs delegate smart contract execution to the foundation. The foundation pays gas. 
    - [![issue_reciept](http://img.youtube.com/vi/-MOe7hi_DHU/0.jpg)](http://www.youtube.com/watch?v=-MOe7hi_DHU "")
    
    
    
    
![GitHub Logo](/public/Fig_for_flow_ENG.png)

## Smart contract

### Structs
We have two structs, Donation and Box. Each donation consists of its id, the id of the member who donates, and the information that the member agrees to open. 
```
struct Donation {
  string donationId; // donation Id
  string memberId; // member Id
  string openInfo; // information that a member agrees to open
}
```
Each box has its id, type, details, expiration date, and information on NPOs and recipients. 
```
struct Box {
  string boxId; // box Id
  string boxType; // box type such as KIDS
  string generatedYear; // year that a box is generated
  string serializedDonationsDetails; // originally string[] donationIds;
  string expirationDate; // expiration date obtained from the minimum value out of donations
  string npoInfo; // npo information
  string npoReceivedTime; // the time when the npo receives the box
  string recipientInfo; // information about last recipients
  string recipientReceivedTime; // the time when recipients finally get the box
}
```

### Methods

- __*donate*__
```
function donate (string _donationId, string _memberId, string _openInfo) public {
  Donation memory tmpDonation;
  tmpDonation.donationId = _donationId;
  tmpDonation.memberId = _memberId;
  tmpDonation.openInfo = _openInfo;
  donations.push(tmpDonation); // Donation[] public donations
  memberToDonations[_memberId].push(_donationId);
}
```

- __*distributeBox*__
```
function distributeBox (string _boxId, string _boxType, string _year, string _serializedDonationsDetails, string _expirationDate, string _npo) public {
  Box memory tmpBox;
  tmpBox.boxId = _boxId;
  tmpBox.boxType = _boxType;
  tmpBox.generatedYear = _year;
  tmpBox.serializedDonationsDetails = _serializedDonationsDetails;
  tmpBox.expirationDate = _expirationDate;
  tmpBox.npoInfo = _npo;
  tmpBox.npoReceivedTime = '';
  tmpBox.recipientInfo = '';
  tmpBox.recipientReceivedTime = '';

  boxes.push(tmpBox); // Box[] public boxes
  boxStatus.push(0); // '0': distributed
  
  boxIdToIdx[_boxId] = boxes.length - 1; // mapping boxId to its index in the array "boxes" for easy access
  ...
}
```

- __*receiveBox*__
```
function receiveBox (string _boxId, string _time) public {
  boxes[boxIdToIdx[_boxId]].npoReceivedTime = _time; //boxIdToIdx
  if(boxStatus[boxIdToIdx[_boxId]]<=1){
    boxStatus[boxIdToIdx[_boxId]] = 1; //'1': received
  }
}
```

- __*addInfo*__
```
function addInfo (string _boxId, string _recipientInfo, string _time) public {
  boxes[boxIdToIdx[_boxId]].recipientInfo = _recipientInfo;
  boxes[boxIdToIdx[_boxId]].recipientReceivedTime = _time;
  boxStatus[boxIdToIdx[_boxId]] = 2; //'2': given to a recipient
  ...
}
```

## Klaytn Fee Delegation Service 

Members, NPOs have their own account in Klaytn network, but managing keys and paying a fee for smart contract is difficult for people who are not familiar with block-chain. With klaytn free delegation service, all the fee can be paid on fee player(foundation), and Members/Npos can easily use the system without recognizing the key correctly.


![Delegate process](/public/Picture1.png)



## Prerequisites


1. [NPM](https://www.npmjs.com/) and Node installed (node version 8.10.0)

2. Follow the [Klaytn quick start](https://docs.klaytn.com/getting_started/quick_start) to work with klaytn

3. Install mysql for local storage.


## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version.

```shell
$ git clone https://github.com/[[git-hub address]] MyApp
$ cd MyApp
```

#### 2. Run `yarn install`

This command install run-time project depedencies and developter tools that listed in [package.json](../package.json) file.
If you add another libraries and add to [package.json](../package.json), you must re-install with `yarn install`.


#### 3. Run `mysql -u [user_name] -p < nodejs-mysql-login-db.sql`

This command install database_scheme for local stroage.


#### 4. Run `yarn start`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the Node.js server (`node build/server.js`).

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)

## Configuration for foundation
1. Issue account

[![issue_account](http://img.youtube.com/vi/2OiT_iRBZ7I/0.jpg)](http://www.youtube.com/watch?v=2OiT_iRBZ7I "")

2. Modify configuration for app

[![modify_config](http://img.youtube.com/vi/SNAnuYUEYC4/0.jpg)](http://www.youtube.com/watch?v=SNAnuYUEYC4 "")



## To-do List

#### 1. API is exposed. Make API key and API authentication architercture to blocks the access without permission
#### 2. Most parts of project is moblie-friendly, but some parte doesn't. Make project more moblie friendly.
