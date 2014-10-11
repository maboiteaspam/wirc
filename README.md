## [Wirc](https://github.com/maboiteaspam/wirc)

Demonstrate use of various web frameworks to provide an irc-like chat.


| Experiment Name | Website | Source Code |
| ------------- |-------------|-------------|
| **Bootstrap** | [Website](http://getbootstrap.com) | [Source](https://github.com/twbs/bootstrap) |
| **AngularJS** | [Website](https://angularjs.org/) | [Source](https://github.com/streamproc/MediaStreamRecorder/tree/master/demos/video-recorder.html) |
| **WebSocket** | [Website](https://developer.mozilla.org/fr/docs/WebSockets) | - |
| **NodeJS** | [Website](http://nodejs.org/) | [Source](https://github.com/joyent/node) |

----

Wirc takes advantage of those libraries to offer a many-to-many chat system over a websocket connected to a remote central server.

## Requirements

[Node](http://nodejs.org/download/) >= v0.10.26

[A browser supporting web sockets](http://stackoverflow.com/a/2700609)

## Install

Install Client side server, will locally install dev-tools such grunt and so on
```javascript
npm i -d
```


Install Remote Central server
```javascript
cd server && npm i
```

## Run

Remote Central server

```javascript
node sever/bin.js
```

Client side server in a new terminal

```javascript
grunt serve
```
