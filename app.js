require('dotenv').config()

const express = require("express");

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var cors = require('cors');
// var whitelist = ['http://localhost:3000', 'https://socket-sync.onrender.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true,
// }

// app.use(cors(corsOptions));

const port = process.env.PORT || 3001;



const newId = () => Math.random().toString(36).substr(2, 9);

console.log('The value of secret is', process.env.SECRET);

var activeSessions = {};

io.on('connection', function (socket) {
    console.log('a user connected');
});

app.post('/api/sessions', jsonParser, function (req, res) {
    console.log('got request')
    const action = req.body.action;
    switch (action) {
        case "new": {


            const id = newId();
            activeSessions[id] = {
                claimed: false,
            }
            res.send({ id: id })
            break;
        }
        case "claim": {
            const id = req.body.id;
            if (id && activeSessions[id] && !activeSessions[id].claimed) {
                activeSessions[id].claimed = true;
            }
            res.send({ done: activeSessions[id].claimed })
            break;
        }
        default: {
            res.send({ message: "invalid" })
        }
    }
    // create user in req.body
})

app.get("/", (req, res) => res.send("Hello from Render!"));

app.get("/claim", (req, res) => {

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
