## [Wirc](https://github.com/maboiteaspam/wirc)

Demonstrate use of various web frameworks to provide an irc-like chat.


| Experiment Name | Website | Source Code |
| ------------- |-------------|-------------|
| **Bootstrap** | [Website](http://getbootstrap.com) | [Source](https://github.com/twbs/bootstrap) |
| **AngularJS** | [Website](https://angularjs.org/) | [Source](https://github.com/angular/angular.js) |
| **Bower** | [Website](http://bower.io/) | [Source](https://github.com/bower/bower) |
| **WebSocket** | [Website](https://developer.mozilla.org/fr/docs/WebSockets) | [Source](https://github.com/einaros/ws) |
| **NodeJS** | [Website](http://nodejs.org/) | [Source](https://github.com/joyent/node) |

----

Wirc takes advantage of those libraries to offer a many-to-many chat system over a websocket connected to a remote central server.

## Requirements

- [Git](http://git-scm.com/)
- [Node](http://nodejs.org/download/) >= v0.10.26
- [Node-gyp](https://github.com/TooTallNate/node-gyp/)
- [A browser supporting web sockets](http://stackoverflow.com/a/2700609)



## Testing

```
git clone http://github.com/maboiteaspam/wirc
cd wirc 
npm i -p
npm install -g bower
bower i
node bin.js
```


Browse to http://localhost:9000/
Websocket is connected on http://localhost:8080/

