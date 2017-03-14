# Simple JSON Replay Server ❤️
Pefect companion with single page application development, and unit mock testing. Especially designed for angularjs 1 and 2 & reactjs.

> Current Version: 0.0.6

## It is not a Restful Json Server
Have you spent a lot of time trying to find a **simple straight-forward file based json replay server** which will just matching path and query parameters and return response which matching you expect?

You probably will be disappointed, because not all but at least majority of them are fancy shinning restful style severs which either return dynamic json in memory or manipulate some text based db files. And obviously, they will all require you to send standard restful style requests and then response with some dynamic results which you might have to think hard to set it up.

Isn't it overkill? if we just need a mock server for development and unit testing.
Or, if you have legacy backend API design, which are not strictly following restful specifications.

## Simple Features

 * **Simple command** to launch it with optional port and folder configuration.
 * **Supre Easy to create & maintain data** Create a pure json file in your replay data folder and you should get it right away, no programming is required.
 * **Advanced features** to allow you set more matching rules including query parameters, method, header, cookie etc. 
 * **Straight-foward rules** configured in the file, they are almost self explaining.
 * **Fast & Predictable**, Once configured, it will response immediately and consitently.
 * **Simple but still Powerful**, You can configure different rules to simulating different responses to cover different scenarios for the same service call, such as paginiation, error, failure etc.
  
## Node Dependency
Support **node version >= 4.0.0** by not using any **ES6** syntax for a period of time.

## How to start 

### ✦ **Install to your package.json**
 
```
npm install simple-json-replay-server --save-dev
``` 


### ✦ **Create app_mock folder under your application root**
 
 go to your application root folder, where it has package.json & your node_modules folder.
 
```
mkdir app_mock
```    


### ✦ **Create mock data config files**    

Create a json file, eg. **_example.json_** inside of **_app_mock_** folder, you can create **any layer of sub folders to organize your mock data files**. Our application only look for files ending with ".json" in app_mock folder.

Once start replay server, you can hit <http://localhost:8008/test> to see the result.

> Please note: you are able to config a different port number if it conflicts.

Example: 


```
{
    "request" : {
        "path": "test",
        "method" : "get",
        "query" : {
            "param1" : "value1 to be matched",
            "param2" : "value2 to be matched"
        }
    },
    "response" : {
        "status" : 200,
        "data" : {
            "message" : "you made it!"
        }
    }
}
```  


### ✦ **Start the replay server**  
 
 ```
node node_modules/simple-json-replay-server/src/main.js
 ```

### ✦ **Config a shortcut in package.json**

> Nice to have step only, you can create alias in mac/unix or bat file for windows instead.

Open **package.json** of your frontend application
```
  "scripts": {
    "mockServer": "node node_modules/simple-json-replay-server/src/main.js"
  }
```  
Now, you can run below shorter command to start mock server

```
npm run mockServer
```

> You can then create concurrent tasks in whatever preferrable ways you want

## Mock Data Specification

### ✦ Request

The request object can be defined as below propertities.
You can possibly define as many as mock data configs which match the same path. However, the mock sever will return the best matching mock data based on a ranking algorithm. if more than one mock data get the same matching ranking, we will not guarantee which one will return.


Key | Value | Optional | Description
---------|----------|----------|---------
 path | part of path or full path | No | You can give part of path or full path, for example, the full path is "/api/examples", you can give just "examples" or "example" or "/examples", all of them will match.
 method | http methods | Yes | default as **get**
 query | a json map with key value pairs | Yes | you can only give keys which you want to match. default as **undefined**

### ✦ Response

The Response object can be defined as below properties.

Key | Value | Optional | Description
---------|----------|----------|---------
 status | http status | Yes | default as **200**
 delay | number in milliseconds | Yes | default as **0** which is no delay. you can give **negative value**, which means **timeout**, in this case, will ignore the any other response settings.
 data | a json object map | Yes | you can define the expected json response.



## Integrate with your development work flow

As we all know, nowadays, most of frontend projects have been completely seperated from backend projects. 

When we develop frontend application, we often tend to mock the data either directly in the code or hard-coded in backend service before implemented, which will requires some code changes during integration phase. And more often it is not easy to setup mock data which can cover many business scenarios.

With this simple json replay server approach, **your code is always the same code which you will use in production**, and in local development environment, you can route all your backend restful service calls to this replay server and thus you can run and play with your frontend applicati
With this simple json replay server approach, **your code is always the same code which you will use in production**, and in local development environment, you can route all your backend restful service calls to this replay server and thus you can run and play with your frontend application without **ANY dependency** on your backend server.

I will take below some of most popular frontend build tools/solutions for example:

* **Webpack**
* **Grunt** (**Gulp** as well)


### ✦ Webpack 
**Webpack** based solution is gaining more popularity, and both angular 2 official and one of most popular tools - **angular-cli** are all using webpack as their build tool.


#### ► Angular2 with Angular-Cli

Please find instruction in below

Original source:
<https://www.npmjs.com/package/angular-cli#proxy-to-backend>

Using the proxying support in webpack's dev server we can highjack certain urls and send them to a backend server. We do this by passing a file to --proxy-config

Say we have a server running on http://localhost:8008/api and we want all calls to http://localhost:4200/api to go to that server.

We create a file next to projects package.json called proxy.conf.json with the content


```
{
  "/api/*": { //Note, this wild match is the key to make it work (Jeff)
    "target": "http://localhost:8008",
    "secure": false
  }
}
```

You can read more about what options are available here **webpack-dev-server** proxy settings

and then we edit the package.json file's start script to be

```
"start": "ng serve --proxy-config proxy.conf.json",
```

now run it with **npm start**

#### ► Directly Use Webpack

Very similiar to angular-cli configuration because it is using the same webpack which then use **webpack-dev-server** internally.

You should add below configuration in your **webpack.config.js** in your project. 

> Please note: this is a javascript file instead of json file.

An example of this javascript based configuration file for webpack:
<https://webpack.js.org/configuration/>

```
//shortcut config
proxy: {
  "/api": "http://localhost:8008"
}
```
This is almost equivalent to 

```
proxy: {
  "/api": {
    target: "http://localhost:8008",
    secure: false
  }
}
```

For more advanced proxy configuration, please read offical document: <https://webpack.js.org/configuration/dev-server/#devserver-proxy>


### ✦ Grunt 

If your project is still using **grunt** or **gulp**, you can look at this charpter. I will not give example for **gulp**, however, the approach would be very much similiar.



~~To Be Continue~~
