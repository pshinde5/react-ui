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

### HOC
1. withActivity: Helps in providing calling the component by passing href via context & the Component.

### Context
1. baContext: Use of context is just to have access to current business entity (baId) in all components like href of quote/Id or Contract/Id. The provider is used inside HOC (withActivity).
### Hooks
1. useActivity : To start an business activity (Quote, Contract or Client) & create new object in aia store with this url (baId).
2. useAia: Hook for http requests methods like Get, Patch, Post. It uses current baId provided by Bacontext, dispatches action & returns a promise. 

### Actions
1. aiaActions: Consists different actions based on API requests, performing axios calls, handling of modified headers.
