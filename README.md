# sailsChat

### A Sails application

## What it is

sailsChat is a multi-user chat app that demonstrates some new features in Sails v0.10:

* Low-level socket methods using `sails.sockets`
* New / reworked PubSub methods
* Auto-generated routes and actions (blueprints) for associations

The app features both private messages between two users, and public (multi-user) chatrooms, all updated in real time.  And all in under 100 lines of backend code (using the strictest method of line-counting :) )

## What it ain't
sailsChat is *not* a sterling example of how to architect a web application.  The front-end is deliberately simplified, using no outside libraries besides jQuery and socket.io.  The back-end is similarly oversimplified--a new user is created whenever a socket connects to the server, and destroyed as soon as that socket disconnects.  This allows us to easily demonstrate concepts without having to implement a login system, sessions, or anything else extraneous.

## Installing
Clone the repo into a new directory, `npm install` and `sails lift`, and you're off!

## Using

Browse to `http://localhost:1337` to view the app in all its glory.  A new user will be created for you automatically.  Of course, a chat app isn't much fun with just one user, so open another tab or browser window to the same address to pop up a new user.  Then use the "Send private message" button to communicate directly between two users, or start a new chat room to chat with a group!

## More

On the [wiki](https://github.com/balderdashy/sailsChat/wiki).
