const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.urlencoded({extended : false}));
server.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan5'
});

connection.connect((err)=>{
    if(err) {
        console.error('Terjadi kesalahan dalam koneksi ke MySQL:', err.stack);
        return;
    }
    console.log('Koneksi MySQL berhasil dengan id' + connection.threadId);
});

server.set('view engine', 'ejs');

//ini adalah routing (Create, Read, Update, Delete)

//Read
server.get('/', (req, res) =>{
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) =>{
        res.render('index',{users: results});
    });
});

//create / input / insert
server.post('/add', (req, res)=> {
    const {Name, Email, Phone} = req.body;
    const query = 'INSERT INTO users (Name, Email, Phone) VALUES (?,?,?)';
    connection.query(query, [Name, Email, Phone], (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    });
});

//update
server.get('/edit/:id', (req, res)=>{
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) =>{
        res.render('edit',{user: result[0]})
    })
});

server.post('/update/:id', (req, res) =>{
    const {Name, Email, Phone} = req.body;
    const query = 'UPDATE users SET Name = ?, Email = ?, Phone = ? WHERE id = ?';
    connection.query(query, [Name, Email, Phone, req.params.id], (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    });
});

//delete
server.get('/delete/:id', (req, res)=>{
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) =>{
        res.redirect('/');
    });
});

server.listen(3000,()=>{
    console.log('Server berjalan di port 3000, buka web melalui http://localhost:3000')
});