const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
 

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: process.env.DATABASE,
  });
   

  connection.connect((err) => {
    if (err){ 
        console.log(err);
    }
    console.log('Connected!!!');
  });

  
 

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req,res) => {
    let sql = 'SELECT * FROM cytii_empresas';
    connection.query(sql, (err, result) => {
        if (err){ 
            console.log(err);
        }
        
        res.json(result);
    });
});

app.post('/buscar', (req, res) => {
    const empresa = req.body.empresas.toLowerCase();
    const zona = req.body.zona.toLowerCase();
    const categoria = req.body.categoria.toLowerCase();
    let sqlEmpresa = `SELECT * FROM cytii_empresas WHERE nombre = '${empresa}'`;
    let sqlZona = `SELECT * FROM cytii_empresas WHERE zona = '${zona}'`;
    let sqlCategoria = `SELECT * FROM cytii_empresas WHERE categoria = '${categoria}'`;
    let sqlZoCat = `SELECT * FROM cytii_empresas Where zona = '${zona}' AND categoria = '${categoria}'`;
    let sqlzoEmp = `SELECT * FROM cytii_empresas Where zona = '${zona}' AND nombre = '${empresa}'`;
    let sqlCatEmp = `SELECT * FROM cytii_empresas Where categoria = '${categoria}' AND nombre ='${empresa}'`;
    let sqlAllFields = `SELECT * FROM cytii_empresas Where categoria = '${categoria}' AND nombre ='${empresa}' AND zona ='${zona}'`;
    
   if( zona && !categoria && empresa ){
        let query = connection.query(sqlzoEmp, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
            
        });

    }else if(zona && categoria && empresa){
        let query = connection.query(sqlAllFields, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
            
        });

    }else if( !zona && categoria && empresa ){
        let query = connection.query(sqlCatEmp, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
        });
    
        
    }else if( zona && categoria ){
        let query = connection.query(sqlZoCat, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
            
        });
    
        
    }else if(categoria){
        let query = connection.query(sqlCategoria, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
            
        });
    }else if(zona){
        let query = connection.query(sqlZona, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                res.json(result);
            }
            
        
            });
        }
        else if(empresa){
            let query = connection.query(sqlEmpresa,(err, result) => {
                if(err) throw err;
                if(result.length === 0){
                    res.json('!resultados');
                }else{
                    res.json(result);
                }
            });
    
        }
});
 
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))
