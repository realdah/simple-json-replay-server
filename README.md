# Simple JSON Replay Server
Pefect companion with angular 1/2 development, and unit mock testing.

## It is not a Restful Json Server
Have you spent a lot of time trying to find a **simple straight-forward file based json replay server** which will just matching url and query parameters and return response you expect?

You probably will be disappointed, because not all but at least majority of them are fancy shinning restful style severs which either return dynamic json in memory or manipulate  some text db files. And obviously, they will all require you to send standard restful style requests and then response with some dynamic results which you might have to think hard to set it up.

Isn't it overkill? if we just need a mock server to help us during development locally and once deployed, it will never bother again.

## Simple Features

 * **Simple command** to launch it in any avaialbe port with zero configuration.
 * **Easy to maintain data** Put a url and a response json in your replay data folder and you should get it right away.
 * **Advanced features** to allow you set more matching rules including request parameter, method, header, cookie etc. 
 * **Straight-foward rules** to return best match results.
 * **Fast & Predictable**, Once configured, it will response immediately and consitently.
 * **Flexible & Powerful**, You can configure different rules to simulating different responses to cover different scenarios for the same service call.
  

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

Once start replay server, you can hit <http://localhost:8008/test> to see the result

Example: 


```
{
    "request" : {
        "url": "test",
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