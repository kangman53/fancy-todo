# server

# Todo-List
REST API built with Express and 3partys API
List of basic routes :

| ROUTE             | HTTP | HEADER(S) |     BODY     |   DESCRIPTION   |
| ----------------- | ---- | --------- | ------------ | --------------- |
| `/register` | **POST** | `none` | `fullname: String (`**`Required`**`), email: String (`**`Required`**`), password: String (`**`Required`**`), picture_url: String` | Create a user |
| `/login` | **POST** | `none` | `email: String (`**`Required`**`), password: String (`**`Required`**`)` | Login user |
| `/login/token` | **POST** | `token` | `none` | Check User Token |
| `/login/google` | **POST** | `id_token` | `none` | Check User Token |


List of user routes :

| ROUTE             | HTTP | HEADER(S) |     BODY     |   DESCRIPTION   |
| ----------------- | ---- | --------- | ------------ | --------------- |
| `/todo` | **GET** | `token` | `none` | Get all Todo (**Authorized Users Only**)|
| `/todo/` | **POST** | `token` | `name: String (`**`Required`**`), description: String, due_date: Date (`**`Required`**`)` | Create Todo (**Authorized Users Only**)|
| `/todo/:id` | **PUT** | `token` | `name: String , description: String, due_date: Date, date_finished: Date` | Update Todo (**Authorized Users Only**)|
| `/todo/:id` | **DELETE** | `token` | `none` | Delete Todo (**Authorized Users Only**)|
## Data Sample

### GET /todo
Success (200)
```
[
    {
        "status": true,
        "date_finished": "2019-01-13T23:19:03.559Z",
        "_id": "5c3b5e078134d40f3903728a",
        "userId": "5c3b54fe8134d40f3903727e",
        "name": "Create Semantyc Web",
        "description": "Porftfolio Project",
        "due_date": "2019-01-17T00:00:00.000Z",
        "date_created": "2019-01-13T22:49:27.405Z",
        "__v": 0
    },
    {
        "status": true,
        "date_finished": "2019-01-13T23:22:49.665Z",
        "_id": "5c3b65c18134d40f3903728b",
        "userId": "5c3b54fe8134d40f3903727e",
        "name": "Create Todo List App",
        "description": "Portfolio Project",
        "due_date": "2019-01-23T00:00:00.000Z",
        "date_created": "2019-01-13T23:22:25.163Z",
        "__v": 0
    }
]
```
Error
```
Internal Server Error(500):
    {
        message: 'Internal Server Error',
        error: error
    }

Invalid Token(400):
    {
        message: 'Invalid Token',
        error: 'Enter a valid token'
    }
```
### POST /todo
Success (201)
```
    {
        "status": false,
        "date_finished": null,
        "_id": "5c3bc697b020a346a43d26e3",
        "userId": "5c3b54fe8134d40f3903727e",
        "name": "Create Profile ",
        "description": "Push to Github",
        "due_date": "2019-01-13T17:00:00.000Z",
        "date_created": "2019-01-13T06:15:35.936Z",
        "__v": 0
    }
```
Error
```
Internal Server Error(500):
    {
        message: 'Internal Server Error',
        error: error
    }

Invalid Token(400):
    {
        message: 'Invalid Token',
        error: 'Enter a valid token'
    }
```
### PUT /todo/:id
Success (200)
```
{
    "status": false,
    "date_finished": null,
    "_id": "5c3bc697b020a346a43d26e3",
    "userId": "5c3b54fe8134d40f3903727e",
    "name": "Create My Profile ",
    "description": "Push to Github",
    "due_date": "2019-01-13T17:00:00.000Z",
    "date_created": "2019-01-13T06:15:35.936Z",
    "__v": 0
}
```
Error
```
Internal Server Error(500):
    {
        message: 'Internal Server Error',
        error: error
    }

Invalid Token(400):
    {
        message: 'Invalid Token',
        error: 'Enter a valid token'
    }
Not Authorized(400): {
        message: 'Error update todo',
        error: 'Todo not found / You are not autorized'
}

```
### DELETE /todo/:id
Success (200)
```
{
    "status": false,
    "date_finished": null,
    "_id": "5c3bc697b020a346a43d26e3",
    "userId": "5c3b54fe8134d40f3903727e",
    "name": "Create My Profile ",
    "description": "Push to Github",
    "due_date": "2019-01-13T17:00:00.000Z",
    "date_created": "2019-01-13T06:15:35.936Z",
    "__v": 0
}
```
Error
```
Internal Server Error(500):
    {
        message: 'Internal Server Error',
        error: error
    }

Invalid Token(400):
    {
        message: 'Invalid Token',
        error: 'Enter a valid token'
    }
Not Authorized(400): {
        message: 'Error update todo',
        error: 'Todo not found / You are not autorized'
}

```

## Usage

Make sure you have **Node.js** and **npm** installed in your computer, and then run these commands:
```
$ npm install
$ npm start
```

Access the API via `http://localhost:3000/`.