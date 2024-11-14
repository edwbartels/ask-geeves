questions = [
    {
        # question 1
        "user_id": 1,
        "title": "Flask vs Django",
        "content": 
            "What is the difference between Flask and Django?",
    },
    {
        # question 2
        "user_id": 2,
        "title": "Flask Sessions",
        "content": "How does Flask manage sessions?",
    },
    {
        # question 3
        "user_id": 3,
        "title": "SQLAlchemy in Flask",
        "content": "What is the purpose of SQLAlchemy in Flask applications?",
    },
    {
        # question 4
        "user_id": 4,
        "title": "Securing a Flask API",
        "content": "How can I secure a REST API in Flask?",
    },
    {
        # question 5
        "user_id": 5,
        "title": "GET vs POST",
        "content": "What are the differences between GET and POST requests?",
    },
    {
        # question 6
        "user_id": 6,  
        "title": "Flask Routing",
        "content": "How does the Flask routing system work?",
    },
    {
        # question 7
        "user_id": 7,
        "title": "Jinja Templating",
        "content": "What is Jinja templating in Flask?",
    },
    {
        # question 8
        "user_id": 8,
        "title": "Flask with PostgreSQL",
        "content": "How can I connect a Flask app to a PostgreSQL database?",
    },
    {
        # question 9
        "user_id": 9,
        "title": "Flask Middleware",
        "content": "What is the role of middleware in a Flask application?",
    },
    {
        # question 10
        "user_id": 10,
        "title": "Testing Flask Applications",
        "content": "How can I test my Flask application?",
    },
    {
        # question 11
        "user_id": 11,
        "title": "File Uploads in Flask",
        "content": "How does Flask handle file uploads?",
    },
    {
        # question 12
        "user_id": 12,
        "title": "Flask Blueprints",
        "content": "What are blueprints in Flask and why are they useful?",
    },
    {
        # question 13
        "user_id": 13,
        "title": "Serving React with Flask",
        "content": "How can I set up Flask to serve a React frontend?",
    },
    {
        # question 14
        "user_id": 14,
        "title": "Flask Use Cases",
        "content": "What are common use cases for Flask over other frameworks?",
    },
    {
        # question 15
        "user_id": 15,
        "title": "User Authentication in Flask",
        "content": "How can I implement user authentication in Flask?",
    },
    {
        # question 16
        "user_id": 16,
        "title": "Popular Flask Extensions",
        "content": "What are Flask extensions, and which ones are popular?",
    },
    {
        # question 17
        "user_id": 17,
        "title": "Javascript Closures",
        "content": "What are JavaScript Closures and how are they used?",
    },
    {
        # question 18
        "user_id": 18,
        "title": "JavaScript var, let, and const",
        "content": "What is the difference between var, let, and const in JavaScript?",
    },
    {
        # question 19
        "user_id": 19,
        "title": "Organizing Flask Applications",
        "content": "How can I organize a large Flask application?",
    },
    {
        # question 20
        "user_id": 20,
        "title": "Flask Context Processors",
        "content": "What are Flask context processors?",
    },
    {
        # question 21
        "user_id": 21,
        "title": "Flask Error Handling",
        "content": "How does Flask handle error pages?",
    },
    {
        # question 22
        "user_id": 22,
        "title": "Flask Request Hooks",
        "content": "What are Flask request hooks, and how can they be used?",
    },
    {
        # question 23
        "user_id": 23,
        "title": "Creating a RESTful API with Flask",
        "content": "How can I create a RESTful API with Flask?",
    },
    {
        # question 24
        "user_id": 24,
        "title": "Sync vs Async in Flask",
        "content": "What is the difference between synchronous and asynchronous requests in Flask?",
    },
    {
        # question 25
        "user_id": 25,
        "title": "Deploying Flask on Heroku",
        "content": "How can I deploy a Flask application on Heroku?",
    },
    # question 26
    {
        "user_id": 2,
        "title": "HTML DIV & SPAN",
        "content": "What is the difference between <div> and <span> in HTML?",
    },
    # question 27
    {
        "user_id": 3,
        "title": "HTML ALT & IMG Tags",
        "content": "What is the purpose of the alt attribute in the <img> tag?",
    },
    # question 28
    {
        "user_id": 4,
        "title": "Semantic HTML Elements",
        "content": "What are semantic HTML elements and why are they important?",
    },
    # question 29
    {
        "user_id": 5,
        "title": "JavaScript Repeat Name",
        "content": """ I'm having trouble getting my code to print each name twice 
            ### My code:
            \'\'\'javascript
            function repeatName(name) {
                name + " " + name;
            }
            let repeatDaniel = repeatName("Daniel");
            let repeatMark = repeatName("Mark");
            let repeatBeyonce = repeatName("!!!" + ("Beyonce") + "!!!");
            \'\'\' 
            \n
            What could I *change* to fix my function?
            """
    },
    # question 30
    {
        "user_id": 6,
        "title": "String Operators",
        "content": 
            """ I am trying to get my function to return a str but in lowercase letters, but I am having issues.
            ### Here is what it is supposed to print:
            "...hey buddy..."
            "...yea! that was fun..."
            ### Here is my code:
            \'\'\'javascript
            function whisper(str) {
                let whispered = "..." + str.lowercase() + "...";
                return whispered;
            }
            console.log(whisper("HEY Buddy"));
            console.log(whisper("YEA! That was FUN"));
            \'\'\' 
            \n
            How do I fix my function?
            """,
    },
    # question 31
    {
        "user_id": 7,
        "title": "JavaScript Conditionals",
        "content": 
            """ I am trying to get my function to return a str but in lowercase letters, but I am having issues.
            ### Here is what it is supposed to print:
            "...hey buddy..."
            "...yea! that was fun..."
            ### Here is my code:
            \'\'\'javascript
            function oddNumOnly(num) {
                if (num % 2 === 0) {
                    return num;
                } else {
                    return null;
                }
            }
            console.log(oddNumOnly(2));
            console.log(oddNumOnly(5));
            console.log(oddNumOnly(-17));
            console.log(oddNumOnly(0));
            \'\'\' 
            \n
            What am i doing wrong!!!!
            """,
    },
    # question 32
    {
        "user_id": 8,
        "title": "Functions vs Arrow Functions",
        "content": 
            """ Are 'Functions' and 'Arrow Functions' equivalent and/or interchangeable? \n ### Here is my code: \n ```javascript \n function User(name) { \n this.name = name; \n } \n \n const User = name => { \n this.name = name; \n }; \n ``` \n They look so similar to me and i just dont understand the difference. """, 
    },
]
