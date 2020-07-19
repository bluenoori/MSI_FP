const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const app = express();


//mysql con
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'company_profile'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
});

//set view file
app.set('views', path.join(__dirname,'views'));

app.use(express.static('public'));
// Virtual Path Prefix '/static'


//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('index', {
        title : 'MSI Official Page'
    })
})

app.get('/service', (req, res) => {
    res.render('service', {
        title : 'MSI Official Service Page'
    })
})

//rute for user admin page
app.get('/admin', (req, res) => {
    let sql = "SELECT * FROM admin";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('admin',{
            title : 'ADMIN',
            admin : rows
        });
    })
})

app.get('/team', (req, res) => {
    let sql = "SELECT * FROM team";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('team',{
            title : 'MSI Official Page',
            team : rows
        });
    })
})

app.get('/add-admin', (req, res) => {
    res.render('admin_add', {
        title : 'ADD-ADMIN'
    })
})

app.get('/add-team', (req, res) => {
    res.sendFile(__dirname +'/add_team')
    res.render('team_add', {
        title : 'ADD-TEAM'
    })
})



app.post('/save', (req, res) => {
    let data = {username: req.body.username, password: req.body.password};
    let sql = "INSERT INTO admin set ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/admin');
    })
})

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from admin where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('admin_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});

app.post('/update', (req, res) => {
   
    const adminId = req.body.id;
 
    let sql = "update admin SET username='"+req.body.username+"',  password='"+req.body.password+"' where id ="+adminId;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/admin');
    })
})

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from admin where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/admin');
    });
});

app.post('/send-email', (req, res) => {
    let data = {email: req.body.email};
    let sql = "INSERT INTO email set ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    })
})

//upload image


  
//Server listening
app.listen(3000, () => {
    console.log('Server running at port 3000')
})