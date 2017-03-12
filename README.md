# Simple JSON Replay Server
Pefect companion with angular 1/2 development, and unit mock testing.

## It is not a Restful Json Server
Have you spent a lot of time trying to find a **simple straight-forward file based json replay server** which will just matching path and query parameters and return response which matching you expect?

You probably will be disappointed, because not all but at least majority of them are fancy shinning restful style severs which either return dynamic json in memory or manipulate some text based db files. And obviously, they will all require you to send standard restful style requests and then response with some dynamic results which you might have to think hard to set it up.

Isn't it overkill? if we just need a mock server for development and unit testing.
Or, if you have legacy backend API design, which are not strictly following restful specifications.

## Simple Features

 * **Simple command** to launch it with optional port and folder configuration.
 * **Supre Easy to create & maintain data** Create a pure json file in your replay data folder and you should get it right away, no programming is required.
 * **Advanced features** to allow you set more matching rules including request parameter, method, header, cookie etc. 
 * **Straight-foward rules** configured in the file, they are almost self explaining.
 * **Fast & Predictable**, Once configured, it will response immediately and consitently.
 * **Simple but still Powerful**, You can configure different rules to simulating different responses to cover different scenarios for the same service call, such as paginiation, error, failure etc.
  

## How to start 

> **Install to your package.json**
 
```
npm install simple-json-replay-server --save-dev
``` 


>  **Create app_mock folder under your application root**
 
 go to your application root folder, where it has package.json & your node_modules folder.
 
```
mkdir app_mock
```    


> **Create mock data config files**    

Create a json file, eg. **_example.json_** inside of **_app_mock_** folder, you can create **any layer of sub folders to hold this file**.

Once start replay server, you can hit <http://localhost:8008/test> to see the result.

Please note: _you are able to config a different port number if it conflicts._

Example: 


```
{
    "request" : {
        "path": "test",
        "method" : "get"
    },
    "response" : {
        "status" : 200,
        "data" : {
            "message" : "you made it!"
        }
    }
}
```  


> **Start the replay server**  
 
 ```
node node_modules/simple-json-replay-server/src/main.js
 ```

## Mock Data Specification

> **Request** 

Key | Value | Description
---------|----------|---------
 path | a part of path or full path | You can give partial of path or full path, for example, the full path will be "/api/examples", you can give just "examples" or "example" or "/examples", all of them will match.
 A2 | B2 | C2
 A3 | B3 | C3

## Integrate with your development work flow

As we all know, nowadays, most of frontend projects have been completely seperated from backend projects. 

When we develop frontend application, we often tend to mock the data either directly in the code or hard-coded in backend service before implemented, which will requires some code changes during integration phase. And more often it is not easy to setup mock data which can cover many business scenarios.

With this simple json replay server approach, **your code is always the same code which you will use in production**, and in local development environment, you can route all your backend restful service calls to this replay server and thus you can run and play with your frontend application without **ANY dependency** on your backend server.

I will take two most popular frontend build tools/solutions for example:

1. **Webpack** (new fashionable toy)
2. **Grunt**   (old world favorite , **Gulp** as well)


### **Webpack** 
**Webpack** based solution is gaining more popularity, and both angular 2 official and one of most popular tools - **angular-cli** are all using webpack as their build tool.

<To Be Edited>