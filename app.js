var express = require("express");
var app = express();
var mysql = require("mysql");
var http = require("http");
var bodyParser = require("body-parser");
var jsonParser=bodyParser.json();
const port = process.env.PORT || 5000;
var urlencodedParser=bodyParser.urlencoded({extended:true});
var server = http.createServer(app);
var io = require("socket.io")(server);
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_db"

});
con.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("connected");

});
var clients = {};

io.on("connection", (socket) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");
  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
   // console.log(clients);
  });
  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("server started");
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get("/", function (req, res) {
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }

    res.send("<html> <body> <p>I am normal</p> <p style='color:red;'>I am red</p> <p style='color:blue;'>I am blue</p> <p style='font-size:50px;'>I am big</p> </body> </html> ")

});

app.get("/books", function (req, res) {

    con.query("select * from books",(err,result,filds)=>{
        if (err) throw(err)
        res.send(result);

    });

}); 
app.post("/users", function (req, res) {
    let id   = req.body.id;
    console.log(id);

    
    con.query("select * from users where id <>"+id,(err,result,filds)=>{
        if (err) throw(err)
        res.send(result);
    });

}); 

app.post("/login", jsonParser, function (req, res) {
    let mobile   = req.body.mobile;
    let password   = req.body.password;
  
   

      let qry= `SELECT * FROM users WHERE mobile ='${mobile}' and  password ='${password}' `;
    
     con.query(qry,(err,result,filds)=>{
        if (err) throw(err)
        res.send(result);
    });

}); 


app.listen(9001, function () {
    console.log("server started...");
});