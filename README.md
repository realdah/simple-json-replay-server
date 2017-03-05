# Simple JSON Replay Server
---
Pefect companion with angular 1/2 development, and unit mock testing

### It is not a Restful Json Server
Have you spent a lot of time trying to find a **simple straight-forward file based json replay server** which will just matching url and query parameters and return response you expect?

You probably will be dispointed, because not all but at least majority of them are fancy shinning restful style severs which either return dynamic json in memory or manipulate  some text db files. And obviously, they will all require you to send standard restful style requests and then response with some dynamic results which you might have to think hard to set it up.

Isn't it overkill? if we just need a mock server to help us during development locally and once deployed, it will never bother again.

### Basic useful feature list:

 * **Simple command** to launch it in any avaialbe port with zero configuration
 * **Easy to maintain data** Put a url and a response json in your replay data folder and you should get it right away
 * **Advanced features** to allow you set more matching rules including request parameter, method, header, cookie. 
 * **Straight-foward rules** to return best match results
 * **Fast & Predictable**, Once configured, it will response immediately and consitently
 * **Flexible & Powerful**, You can configure different parameters to simulating different scenarios for same service call
  
