# Grocery Store

This is a technical assessment for QuestionPro. Application ID: **29455337***

The relational database used is SQL.
The libraries used for creating the API are express, mssql, typescript and jsonwebtoken.

The SQL queries in the API have been parameterized to prevent SQL injections. 
Stored prodecures have not been written (except for one) for transparency and display of SQL proficiency. 

For authentication, stored procedures have been used to conceal the process of hashing the password with salt. The password provided by the user is not stored in the database, instead the salt and hash are stored. 

The Configuration file for the server is encrypted with openssl and can be decrypted only by using a private key.
JWT is used to create and store bearer tokens that are used to validate the user.

The calculation of total for a grocery item in an order (product price * quantity) must be done at the frontend. 

---
This is a preliminary API without many validations. The documentation for the API is as follows:

## 1) Authentication API

### i) Register
url: "api/auth/register"

parameters: 
  username (string)
  name (string)
  password (string)
  type ("admin" | "user")

returns: 
Successful: Message of type string with status 200
Failure: Message of type string with error code and error message

### ii) Login
url: "api/auth/login"
  
parameters: 
  username (string)
  password (string)

returns: 
  Successful: Authentication token with status 200
  Failure: {message: string} with error code and error message

---
## 2) Grocery API

### i) View Grocery Items
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**

url: "api/grocery/view"

parameters: none

returns: 
  Successful: 
    Array of all grocery items with status 200 if user is of type "admin"
    Array of grocery items with stock > 0 with status 200 if user is of type "user"
  Failure: Message of type string with error code and error message

### ii) Add Grocery Item
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**

url: "api/grocery/add"

parameters: 
  name (string)
  price (number)
  stock (number)

returns:
Successful: Message of type string with status 200 if user is of type "admin"
Failure: Message of type string with error code and error message


### iii) Remove Grocery Item
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**

url: "api/grocery/remove"

parameters: 
  id (number)

returns:
Successful: Message of type string with status 200 if user is of type "admin"
Failure: Message of type string with error code and error message

### iv) Update Grocery Item
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**

url: "api/grocery/update"

parameters: 
  id (number)
  name (string) (optional)
  price (number) (optional)
  stock (number) (optional)

returns:
Successful: Message of type string with status 200 if user is of type "admin"
Failure: Message of type string with error code and error message

---
## 3) Orders API

### i) View Orders
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**
url: "api/order/view"

parameters: none

returns:
Successfull: Array of orders of a user with status 200
Failure: Message of type string with error code and error message

### ii) Add Order
**AUTHENTICATION TOKEN REQUIRED IN REQUEST HEADER**

url: "api/order/view"

parameters: 
  itemId (number)
  quantity (number)
  total (number)

returns:
Successfull: Message of type string with status 200
Failure: Message of type string with error code and error message

