# ShoppingList
Shoppinglist is an app helps users keep track of their purchased goods.Users can add shoppiglists ,update them or even delete them.

## About
A user can have several shoppinglists

A user can delete a shoppinglist

A user can update the name of a shoppinglist

A user can add shoppinglist

A user can view all shoppinglist

A user is required to include an password,user name, first name and Surname on creating an account


## Motivation

The need for the continous tracking of one's expenditure on consumables

## Tools
Tools used for development of this API are;
- API development environment: [Postman](https://www.getpostman.com)
- Editor: [Vs code](https://code.visualstudio.com)
- Database: [MongoDB](https://www.mongodb.com/)
- Framework: [Express](https://expressjs.com/)
- Programming language: [Node.js](https://nodejs.org/en/)



## Getting Started

### Prerequisites
1. Install the projects' packages, run 
```sh
     npm install
```
2. Database configuration.
   - Create database in terminal by running ```brew install mongodb```.
   -  Run the database server using the command below in the terminal.
   ```sh
      mongod;
   ```
   - Create a shoppinglist database using the command ```use shoppinglist```


## End points
### Endpoints to create a user account and login into the application
HTTP Method|End point | Public Access|Action
-----------|----------|--------------|------
POST | /shoppinglists/signup/ | True | Create an account
POST | /shoppinglists/login/ | True | Login a user


### Endpoints to create, update, view and delete a shopping list
HTTP Method|End point | Public Access|Action
-----------|----------|--------------|------
POST | /shoppinglists/auth/addlist | False | Create a shopping list
GET | /shoppinglists/auth/lists | False | View all shopping lists
PUT | /shoppinglists/auth/update | False | Updates a shopping list with a given name
DELETE | /shoppinglists/auth/delete | False | Deletes a shopping list with a given name



## Contributors

https//github.com/dkam26