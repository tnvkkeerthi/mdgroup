# EMS

**EMS** is an expense manage system

## Table of contents
* [Setup-Installation](#installation)
* [Run project](#run-project)
* [Project structure](#project-structure)


## Installation
Clone or Download this repo and navigate to the application directory
```bash
git clone https://github.com/tnvkkeerthi/mdgroup.git
cd EMS
```

## Run Project

```bash
npm install
npm start
```

## Project Structure
```
|__ controllers
|__ models
|__ routes
|__ tests
|.. swaggerDoc.json
|.. app.js
|.. package.json
```

### controllers
controllers folder contains the application logic

### models
models folder stores the Mongo DB schemas

### routes
routes folder with router to all application routes

 Base path
  ```
  https://keerthi-expense-app.herokuapp.com/expense-app
  ```
 API Routes documentation
  ```
  https://keerthi-expense-app.herokuapp.com/expense-app/api-docs/
  ```

### config
This application uses [dotenv](https://github.com/motdotla/dotenv) to load environment variables. If NODE_ENV is local or test, environment variables are loaded from `config/.local` and `config/.test` files relatively.

It also uses [mongoose](https://mongoosejs.com/) driver for mongodb, [signale-logger](https://www.npmjs.com/package/signale-logger) for logging and [swagger](https://www.npmjs.com/package/swagger-ui-express) for API documentation.


***


Assumptions 

- Here it is assumed that all expenses are in GBP(£)
- We can have seperate test db and change the url acc to enviroinment
- Disable/Enable logger for test enviroinment