# Simple JSON Replay Server ❤️  [![Build Status](https://travis-ci.org/realdah/simple-json-replay-server.svg?branch=master)](https://travis-ci.org/realdah/simple-json-replay-server) [![npm version](https://badge.fury.io/js/simple-json-replay-server.svg)](https://badge.fury.io/js/simple-json-replay-server) [![Node version](https://img.shields.io/node/v/simple-json-replay-server.svg?style=flat)](http://nodejs.org/download/)

Pefect companion with single page application development, and unit mock testing. Especially designed for angularjs 1 and 2 & reactjs. Zero Code invasion to your production code.

## It is not a Restful Json Server
Have you spent a lot of time trying to find a **simple straight-forward file based json replay server** which will return json responses by matching some simple filtering criteria in requested parameters (such as query, headers, post body etc)?

You probably will be disappointed, because not all but at least majority of them are fancy shinning restful style severs which either returning dynamic json in memory or manipulate some text based db files. And obviously, they will all require you to send standard restful style requests and then response with some dynamic results which you might have to think hard to set it up.

Isn't it overkill? if we just need a mock server for development and unit testing.
Or, if you have legacy backend API design, which are not strictly following restful URL patterns.

## Simple Features

 * **Decoupled with production code** This json replay server will run only side by side in local development/testing environment on demand, **Zero** code change required in your production code.
 * **Simple command** to launch it with optional port and folder configuration.
 * **Supre Easy to create & maintain data** Create a pure json file in your replay data folder and you should get it right away, no programming is required.
 * **Advanced features** to allow you set more matching rules including query parameters, method, header, body, cookie etc. 
 * **Straight-foward rules** configured in the file, they are almost self explaining.
 * **Fast & Predictable**, Once configured, it will response immediately and consistently.
 * **Simple but still Powerful**, You can configure different rules to simulating different responses to cover different scenarios for the same service call, such as paginiation, error, failure etc.

## Sampe Use Cases

https://github.com/realdah/simple-json-replay-server/wiki/Some-use-case-scenarios-for-demonstrating-how-to-use-this-tool
  
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

Create a json file, eg. **_example.json_** inside of **_app_mock_** folder, you can create **any layer of sub folders to organize your mock data files**. The mock server will only look for files ending with ".json" in app_mock folder recursively.

Once start replay server, you can hit <http://localhost:8008/test?param1=value1%20to%20be%20matched&param2=value2%20to%20be%20matched> to see the result.


> Please note: you are able to config a different port number if it conflicts.


```
example.json

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

### ✦ Request (Filtering Rules)

The request object can be defined as described in below table.


You can define more than one mock data which are mapping to the same path. And then, you should define different filtering rules which can narrow down the results.

However, if more than one mock data match the same number of filtering criteria (for query/body, each key is consider as seperate criteria), we will not guarantee which mock data will be returned.


Key | Value | Optional | Description
---------|----------|----------|---------
 path | part of path or full path | No | You can give partial of path or full path, for example, the full path is "/api/examples", you can give just "examples" or "example" or "api/examples", all of them will match.
 method | http methods | Yes | Default as **get**
 query | key value pairs | Yes | Default as **undefined** (no filtering). You can think about this is a filtering logic.  As long as you defined one or more key-value pairs, it will only return results which exactly matching these query parameters to pass through. If multiple results all matching, it will choose the first one.
 body | a json map | Yes | Default as **undefined**. you can have partial values in multiple layers, it will only try to match partial branch of the value till the end. So far, only support **json body** (application/json) & **form-urlencoded** (application/x-www-form-urlencoded) when **post**.
 headers | key value pairs | Yes | default as undefined. Similiar to **query**, if you add any thing in here, it will filter out the data with headers having specific value.  

### ✦ Response

The Response object can be defined as below properties.

Key | Value | Optional | Description
---------|----------|----------|---------
 status | http status | Yes | default as **200**
 delay | number in milliseconds | Yes | default as **0** which is no delay. you can give **negative value**, which means **timeout**, in this case, will ignore the any other response settings.
 data | a json object map | Yes | you can define the expected json response.
 html | a string  | Yes | When you define **html** as response, please note that you should not define **data**, if both **data** & **html** are defined, it will consider only **data**.



## Integrate with your development work flow

As we all know, nowadays, most of frontend projects have been completely seperated from backend projects. 

When we develop frontend application, we often tend to mock the data either directly in the code or hard-coded in backend service before implemented, which will requires some code changes during integration phase. And more often it is not easy to setup mock data which can cover many business scenarios.

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

Although you can use **grunt-contrib-connect** with some magic middleware settings to make it work,
I would suggest you to use **grunt-connect-proxy** plug-in which kind simplify the configurations.

You can find more details in here: <https://github.com/drewzboto/grunt-connect-proxy>

```
grunt.initConfig({
    connect: {
        server: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/api',
                    host: '127.0.0.1',
                    port: 8008,
                    https: false
                }
            ]
        }
    }
})
```

## Release Note

Version | Description
---------|----------
 0.0.10 | Include **body** mapping for **json body** (application/json) & **form-urlencoded** (application/x-www-form-urlencoded)
 0.0.11 | support filtering by **headers** value.
 0.0.12 | support new response type as **html**
