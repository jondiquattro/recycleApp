'use strict';


//brings in modules
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const methodoverride = require('method-override');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => console.log(`App is up on port ${PORT}`));


// pg middleware setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('err', err => console.log(err));

// Express setup
app.use(cors());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(methodoverride((req, res)=>{
  if(typeof (req.body)==='object' && '_method' in req.body ){
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


//middleware connections to front end
app.get('/', helloWorld);

// Get user location then render the material category page
app.post('/location', getLocation);

//Get item material then render subcategory page
app.post('/item-categories/:id', getCategory);

//query earth911 to get recycle instructions
app.post('/disposal-instructions', getInstructions);


function getInstructions(req, res){
  //update the sql table
  //make a superagent request with req.body data

  res.render('./pages/result.ejs');
}

function getCategory(req, res){
  //console.log(req.body);
  //using req.body, load object into res.render
  res.render('./pages/subcat.ejs');
}

function getLocation(req, res){
  res.render('./pages/categories.ejs');
}


// This retrieves and returns data from the Google Books API.
function helloWorld(req, res) {
  res.render('index.ejs');
  checkDatabase();

}

function checkDatabase(){
  const SQL = `SELECT * FROM materials`;

  let values = ['plastic', 'glass', 'paper', 'electronics', 'food-waste', 'metal'];

  return client.query(SQL, values)
    .then(result => {
      if(result.rows>0){
        const SQLinsert =  `INSERT INTO materials (material) VALUES($1)`;
        client.query(SQLinsert);
      }
    }).catch(console.error('error'));
}

// function fillDatabase(){
//   const SQL =  `INSERT INTO materials ('plastic', 'glass', 'paper', 'electronics', 'food-waste', 'metal')
//   VALUES($1, $2, $3, $4, $5, $6)`;

//   return client.query(SQL)
//   .then(results=>{

//   })
// }




// var itemCategories = [

//   {material: 'Plastic',
//     items: ['bottle', 'utensil', 'wrapper', 'bag', 'straw', 'tuppaware'],
//    img_src: '../images/pastic-bottle.jpg'},

//   {material: 'Glass',
//     items: ['bottle', 'window', 'container'],
//     img_src: '../images/glass.jpeg'},

//   {material: 'Paper',
//     items: ['card board', 'cup', 'copy paper', 'napkins', 'news paper', 'straws', 'egg carton', 'Paper Bags', 'Carton'],
//     img_src: '../images/paper.jpeg'},

//   {material: 'Food Waste',
//     items: ['Food Scraps', 'Greasy Pizza Boxes', 'Coffee Grounds', 'napkins'],
//   img_src: },

//   {material: 'Electronic',
//     items: ['Light Bulbs', 'Batteries', 'Cords', 'Devices'],
//   img_src: "../images/electric.jpeg"},

//   {material: 'Metal',
//     items: ['Aluminum Can', 'Tin Foil', 'Rusted Items', 'Cans']
//   img_src: '../images/aluminum-can.jpg'}
// ]

