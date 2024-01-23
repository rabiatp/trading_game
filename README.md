# Super Traders

## Notes:
- The project registers share and and allows users to update the price of the share on an hourly basis; the
share registered should have a unique Symbol to identify it and should be all capital letters with 3 characters. The
rate of the share should be exactly 2 decimal digits.
- Also, the users should have a portfolio before they can start trading in the shares.




# Project Overview
## Database Design
I designed the database using db designer. The design includes the following tables:
- "share": Stores information about shares, such as name, symbol, and share rate.
- "price_history": Tracks price updates made by users.
- "share_holding": Groups data to show the current share quantity, total shares bought and sold, and available shares.
- "user": Stores user information.
- "portfolio": Records user-specific share quantities, balances, purchase dates, and transaction types (buy or sell).
I created two views, "v_user_portfolio" and "v_share," to combine relevant user and share information.

# Views
## v_user_portfolio
This view combines user information with the user's portfolio in a single query. The goal is to provide a comprehensive overview of user-related data in one call.

## v_share
This view consolidates share information, anticipating the possibility of a share having multiple price updates. Shares are grouped by symbols, and the latest price is retrieved by ordering the records in descending order based on the update date. The result is then limited to one record, ensuring the display of the most recent data.

## Functions
- Defined models for database tables.
- In the index.js file, I declared the models in the ormContainer, providing a global context for usage.
- Utilized ormContainer to dynamically handle frequently used functions, reducing code redundancy.
- Adopted a callback structure in functions for better readability.
- Implemented a modular structure with functions calling each other to avoid lengthy and unreadable code.

# Usage
The project enables users to register shares and update their prices. The shares should have a unique symbol in all capital letters with three characters, and the share rate should be precisely two decimal digits. Users must have a portfolio before engaging in trading.

## Functions
### Bulk Share Insert:
- Handles multiple share registrations simultaneously.
- Accepts an array of share data, a success callback (thenFunc), and an error callback (errFunc).

### Share Purchase:
- Checks if the share information exists and if the requested quantity is available.
- Creates a new share holding record for the user and updates the portfolio.
- Updates total shares bought in the share_holding table and adjusts available shares.

### Portfolio Update:
- Updates user portfolio information based on share transactions.

### View: Latest Share Price by Symbol:
- Retrieves the latest share price for a specific symbol from the v_share view.
- Groups share records by symbol, orders them by the update date in descending order, and limits the result to one.

### API API documentation:
- You can review the endpoint calls in the API documentation.postman_collection.json.
