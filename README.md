# etherface

Ethereum dApp UI Builder.


Project is a work in progress, for testing use only.  Feedback / suggestions / contributions appreciated.



## Development

To run:

* Clone this repo
* `yarn run start`



## Template file

User interfaces for dApps defined in a JSON file.   By default, the template file is saved to the browser's localstorage.
When running the app for the first time, a default introduction template is loaded.


An existing template file can be loaded from the command line with the command `bin/etherface template.json`.
This command will start a simple webserver to serve the app and provide the template file to the app.


The template file is made up of the following elements:


### Tabs

Tabs are listed in the side navigation bar.  Each tab can have many pages (TODO).


### Pages


Pages are groups of components.  Pages are arranged in columns, either 1, 2 or 3.  The widths of each column may be adjusted.
Click the Edit button in the lower right hand corner of the button to edit a page's layout and components.


### Components

The UI elements that appear on a page.  The following types of components are available:

#### Markdown

A basic text component.  Renders Markdown text.  Values from web3 `call` transactions can be included in the Markdown text as variables  (TODO).


#### Web3 Transaction

Provides the user the inputs required to make a transaction to a specified contract.  This may be a call function to retrive a value, or a blockchain transaction.


#### Web3 Call

Displays a values from a web3 call.


#### GraphQL Data Table

Displays data from a GraphQL endpoint, such as [TheGraph](https://thegraph.com).  Introspection is used to determine the schema of the endpoint,
and queries are automatically generated.

The data displayed in the table can be customized, and you can drill down to see the details of individual items, as well as
click through relationships to other graph nodes.


### Integrations

Integrations are connections to other decentralized services.  Currently the following are implemented:


#### TheGraph

Connects to [TheGraph](https://thegraph.com) graphql endpoints.


#### Infura / Web3 RPC

Specify an Infura or other Web3 RPC API endpoint to make web3 queries against if the user does not have a web3 enabled browser. (TODO)

### Address book

An address book of Ethereum addresses including their ABIs.  When adding an address, ABIs can be automatically fetched
from [Etherscan](https://etherscan.io) or specified manually.

A truffle build .json file can also be uploaded, which contains the ABI and deployed addresses.
(TODO: Automatically build a user interface from truffle build .json files)



## Support this project

If you find this project to be useful, please consider a donation of Ethereum or BAT tokens to 0x4DA681E4713cC8C4fDbE8a1B027AeBE59c4B332E
