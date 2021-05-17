# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Description
Current implementation is to store the API resources in the Redux store for the following main purpose:
1.	To avoid redundant GET calls on resources & reuse the response from store when needed
2.	Modified Headers: API communicates that a request has affected other resources by listing the URIs of those resources in Modified header tag inside Response header of that request. If any of the modified URI is present in the store we need to refresh that resource to update our UI accordingly. 

NOTE: Connection to VPN BIGIP is required to access the API
## Use case 1
We have one property Start Date on Quote resource. When we patch a date on this field, it has an impact on the sub resource like Coverage start date. We need to update this Coverage start date in UI after the patch

### Hooks
1. useActivity : To start an business activity (Quote, Contract or Client) & create new object in aia store with this url (baId) 
2. useAia: For http requests like Get, Patch, Post
