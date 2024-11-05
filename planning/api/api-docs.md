# Stack Overflow Replica

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require athentication

All endpoints that require a current user to be logged in

* Primarily handled by flask-login. Custom error handling if neccessary.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "not authenticated, need log in first"
    }

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the correct role(s) or permission(s)

* Primarily handled by flask-login. Custom error handling if necessary.

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
    * Status Code: 403
    * Headers:
        * Content-Type: application/json
    * Body:

        ```json
        {
            "message": "not authenticated, not the owner of this question/answer/comment"
        }
        ```

### Get the Current User

Primarily handled by flask-login. Custom response route if necessary.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /session
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }

### Log In a User

Primarily handled by flask-login. Custom response route if necessary.

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/session
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
  {
    "user": {
      "id": 1,
      "email": "admin@admin.com",
      "first_name": "Adam",
      "last_name": "In",
      "created_at": "Mon, 04 Nov 2024 19:17:52 GMT",
      "updated_at": "Mon, 04 Nov 2024 19:17:52 GMT",
      "username": "admin"
    }
  }
    ```

 
* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "error": "Invalid username or password"
    }
    ```
    Consider individual error responses for specific invalid fields (haven't done yet)

    ```json
    {
        "message": "Invalid credentials",
        "credential": "Email or username does not exist",
        "password": "Incorrect password"
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "error": "username/email and password are required"
    }
    ```

### Sign Up a User


Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /users/register
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password",
      "confirm_password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "user": {
            "id": 26,
            "username": "testUsername",
            "email": "test@gmail.com",
            "first_name": "John",
            "last_name": "Wick",
            "created_at": "Mon, 04 Nov 2024 23:09:24 GMT",
            "updated_at": "Mon, 04 Nov 2024 23:09:24 GMT",
        }
    }
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "errors": {
            "email": "Email is already registered",
            "username": "Username is already registered"
        },
        "message": "Bad Request"
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "errors": {
            "username": "Username is required",
            "email": "Email is required",
            "firstName": "First Name is required",
            "lastName": "Last Name is required",
            "password": "Password is required",
            "confirm_Password": "Confirm Password is required",
            "password": "Passwords must match",
        },
        "message": "Bad Request"
    }
    ```


## Questions

### Get all Questions

Returns all questions

* Require Authentication: false
* Request
    * Method: Get
    * Route path: /questions
    * Body: none

* Succesfful Response
    * Status Code: 200
    * Headers:
        * Content-Type: application/json
    * Body:

        ```json
        {
      "questions": 
              [
              {
                  "id": 1,
                  "user_id": 1,
                  "content": "What is the difference between Flask and Django?",
                  "created_at": "November 4th, 2024",
                  "updated_at": "November 4th, 2024",

                  "answers": [
                      {
                          "id": 1,
                          "user_id": 1,
                          "content": "123",
                          "question_id": 1,
                          "created_at": "November 4th, 2024",
                          "updated_at": "November 4th, 2024",
                          "saves": [],
                          "accepted": true,
                          "comments": [
                              {
                                  "content": "This is a great answer!",
                                  "content_id": 1,
                                  "content_type": "answer",
                                  "created_at": "November 4th, 2024",
                                  "id": 1,
                                  "saves": [
                                      {
                                          "content_id": 1,
                                          "content_type": "comment",
                                          "id": 1,
                                          "parent_type": "answer",
                                          "user_id": 1
                                      }
                                  ],
                                  "updated_at": "November 4th, 2024",
                                  "user_id": 1
                              },
                          ],
                      }
                  ],
                  "comments": [
                      {
                          "content": "I had the same question, thanks for this!",
                          "content_id": 1,
                          "content_type": "question",
                          "created_at": "November 4th, 2024",
                          "id": 14,
                          "saves": [],
                          "updated_at": "November 4th, 2024",
                          "user_id": 4
                      },
                  ],
                  "saves": [
                      {
                          "content_id": 1,
                          "content_type": "question",
                          "id": 1,
                          "parent_type": null,
                          "user_id": 1
                      }
                  ],
                  "tags": [
                      {
                          "id": 9,
                          "name": "HTML"
                      },
                  ],
              }
            ]
        }
        ```

### Get all Questions by the Current User

Returns all the questions created by the current user.

* Require authentication: true
* Request
    * Method: GET
    * Route path: /questions/current
    * Body: none

* Successful Response
    * Status Code: 200
    * Headers:
        * Content-Type: application/json
    *Body :

        ```json
        formatted same as the get all questions^^^
        ```

### Get details of a Question from an id

Returns the details of a question specified by its id.

* Require Authentication: false
* Request
    * Method: GET
    * Route path: /questions/<int:question_id>
    * Body: None

* Successful Response
    * Status Code: 200
    * Headers:
        * Content-Type: application/json
    * Body:

        ```json
        same^^^
        ```
    
* Error response: Couldn't find a Question with the specified id
    * Status Code: 404
    * Headers:
        * Content-Type: application/json
    * Body:

        ```json
        {
            "message": "Question not found"
        }
        ```

### Create a Question

Creates and returns a new question.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /questions
  * Headers:
    * Content-Type: application/json
  * Body: (tags are optional)

    ```json
    {
        "content":"test question",
        "tag":["tag1","tag2"]
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
          "question": {
              "answers": [],
              "comments": [],
              "content": "test question",
              "created_at": "November 4th, 2024",
              "first_name": "Adam",
              "id": 34,
              "last_name": "In",
              "saves": [],
              "tags": [
                  {
                      "id": 32,
                      "name": "tag1"
                  },
                  {
                      "id": 33,
                      "name": "tag2"
                  }
              ],
              "updated_at": "November 4th, 2024",
              "user_id": 1,
              "username": "admin"
          }
      }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "error": "content is required"
    }
    ```

### Edit a Question

Updates and returns an existing question

* Require Authentication: true
* Require proper authorization: Question must belong to current user

* Request
    * Method: PUT
    * Route path: /questions/<int:question_id>
    * Body:

    ```json
    {
        "content":"edit test"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "error": "content is required"
    }
    ```

### Delete a question

Deletes an existing question

* Require Authentication: true
* Require proper authorization: Question must belong to current user

* Request
    * Method: DELETE
    * Route path: /questions/<int:question_id>

## Answers
### Get all answers for a question by question id
* Request
    * Method: GET
    * Route path: /questions/<int:question_id>/answers

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
      "answers": [
          {
              "accepted": false,
              "id": 2,
              "question_id": 2,
              "user_id": 2,
              "username": "john_doe",
              "first_name": "John",
              "last_name": "Doe",
              "content": "Flask manages sessions by storing session data on the client side, encrypted by a secret key on the server.",
              "created_at": "November 4th, 2024",
              "updated_at": "November 4th, 2024",
              "saves": [],
              "comments": [
                  {
                      "id": 2,
                      "user_id": 2,
                      "username": "john_doe",
                      "last_name": "Doe",
                      "first_name": "John",
                      "content": "I completely agree with this explanation.",
                      "content_id": 2,
                      "content_type": "answer",
                      "created_at": "November 4th, 2024",
                      "updated_at": "November 4th, 2024",
                      "saves": [],
                  }
              ],
          },
      ]
  }
  ```

### Create an answer for a question
* Require Authentication: true
* Request
    * Method: POST
    * Route path: /questions/<int:question_id>/answers
  * Body:
  ```json
    {
      "content":"test answer"
    }
  ```
* Successful Response
  * Body:
  ```json
      {
        "answer": {
            "accepted": false,
            "comments": [],
            "content": "test answer",
            "created_at": "November 4th, 2024",
            "first_name": "Adam",
            "id": 14,
            "last_name": "In",
            "question_id": 2,
            "saves": [],
            "updated_at": "November 4th, 2024",
            "user_id": 1,
            "username": "admin"
        }
    }
  ```
### Edit an answer by question id and answer id
* Require Authentication: true
* Request
    * Method: PUT
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>
  * Body:
  ```json
    {
      "content":"edit answer"
    }
  ```
* Successful Response
  * Body:
  ```
        same as get an answer above^^^
  ```

### Delete an answer
* Require Authentication: true
* Require proper authorization: Answer must belong to current user

* Request
    * Method: DELETE
    * Route path: /<int:question_id>/answers/<int:answer_id>

* Successful Response
  * Body:
  ```json
  {
    "message": "answer deleted"
  }
  ```
## Comments

### Get all Comments(question and answers) by Question id

Returns all the comments for a Question by the specified id

* Require Authentication: false
* Request 
    * Method: GET
    * Route path: /questions/<int:question_id>/allcomments

### optional vvv

### Get all Comments from question by question id
  * Route path: /questions/<int:question_id>/comments
### Get all Comments from an answer by question id and answer id
  * Route path: /questions/<int:question_id>/answers/<int:answer_id>/comments

### ^^^


### Create a Comment for a Question based on the Question's id

Create and return a new comment for a question specified by id.

* Require Authentication: true
* Request
    * Method: POST
    * Route path: /questions/<int:question_id>/comments

### Edit a comment

Update an return an existing comment

* Require Authentication: true
* Require proper authorization: Comment must belong to the current user
* Request
    * Method: PUT
    * Route path: /questions/<int:question_id>/comments/<int:comment_id>

### Delete a comment

Delete an existing comment.

* Require Authentication: true
* Require proper authorization: Comment must belong to the current user
* Request
    * Method: DELETE
    * Route path: /questions/<int:question_id>/comments/<int:comment_id>


### Create a Comment for an answer based on the Question's id and answer id
* Require Authentication: true
* Request
    * Method: POST
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>/comments

### Edit and delete are same routes, just different method ^^^


## Saves

### Get all of the Current User's Saves

Return all the saves that the current user has made.

* Require Authentication: true
* Request
    * Method: GET
    * Route path: /questions/usersaves

### Add a question to the Current User's Saves
* Require Authentication: true
* Request
    * POST
    * Route path: /questions/<int:question_id>/saves


### Remove a question from the Current User's Saves

Remove an existing save.

* Require Authentication: true
* Require proper authorization: Save must belong to the current user
* Request
    * DELETE
    * Route path: /questions/<int:question_id>/saves


### Add an answer to the Current User's Saves
* Require Authentication: true
* Request
    * POST
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>/saves
  
### Remove an answer from the Current User's Saves

Remove an existing save.

* Require Authentication: true
* Require proper authorization: Save must belong to the current user
* Request
    * DELETE
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>/saves


### Add a question comment to the Current User's Saves
* Require Authentication: true
* Request
    * POST
    * Route path: /questions/<int:question_id>/comments/<int:comment_id>/saves
  
### Remove a question comment from the Current User's Saves

Remove an existing save.

* Require Authentication: true
* Require proper authorization: Save must belong to the current user
* Request
    * DELETE
    * Route path: /questions/<int:question_id>/comments/<int:comment_id>/saves


### Add an answer comment to the Current User's Saves
* Require Authentication: true
* Request
    * POST
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves
  
### Remove an answer comment from the Current User's Saves

Remove an existing save.

* Require Authentication: true
* Require proper authorization: Save must belong to the current user
* Request
    * DELETE
    * Route path: /questions/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves



## Tags

### Get all Tags
Return all the tags in the database
* Require Authentication: false
* Request
    * Method: GET
    * Route path: /questions/tags

### Get all Tags by Question id

Return all the tags for a question specified by id

* Require Authentication: false
* Request
    * Method: GET
    * Route path: /questions/<int:question_id>/tags

### Add a tag to a Question by id

* Require Authentication: true
* Require proper authorization: Question must belong to the current user
* Request
    * Method: POST
    * Route path: /questions/<int:question_id>/tags

### Update tags of a Question by id

* Require Authentication: true
* Require proper authorization: Question must belong to the current user
* Request
    * Method: PUT
    * Route path: /questions/<int:question_id>/tags

### Delete a tag to a question by id

* Require Authentication: true
* Require proper authorization: Question must belong to the current user
* Request
    * Method: DELETE
    * Route path: /questions/<int:question_id>/tags





