const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
require('dotenv').config();
 

//Llamando controladores
const registro = require('./controllers/Registro');
const inicioSesion = require('./controllers/IniciarSesion');
const buscarEmpresa = require('./controllers/BuscarEmpresa');
const modificarEmpresa = require('./controllers/ModificarEmpresa');
const borrarEmpresa = require('./controllers/EliminarEmpresa');
const buscarCategoria = require('./controllers/BuscarCategoria');


// Llamando a Uploads y Cloudinary

const upload = require('./controllers/ImageUploader/Multer');
const cloudinary = require('./controllers/ImageUploader/Cloudinary');

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

  // Creando conexion a la base de datos
const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port: 3306,
      database: process.env.DATABASE
    }
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
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
                res.json(result);
            }
            
        }); 

    }else if(zona && categoria && empresa){
        let query = connection.query(sqlAllFields, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
                res.json(result);
            }
            
        });

    }else if( !zona && categoria && empresa ){
        let query = connection.query(sqlCatEmp, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
                res.json(result);
            }
        });
    
        
    }else if( zona && categoria ){
        let query = connection.query(sqlZoCat, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
                res.json(result);
            }
            
        });
    
        
    }else if(categoria){
        let query = connection.query(sqlCategoria, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
                res.json(result);
            }
            
        });
    }else if(zona){
        let query = connection.query(sqlZona, (err, result) => {
            if(err) throw err;
            if(result.length === 0){
                res.json('!resultados');
            }else{
                result.sort(function(a, b) {
                    return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                   
                });
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
                    result.sort(function(a, b) {
                        return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                       
                    });
                    res.json(result);
                }
            });
    
        }
});

//Buscar por categoria
app.post('/buscar-empresas-categoria', (req, res) => {buscarCategoria.handleBuscarCategoria(req, res, db)})


//---- Registro y Login
//Registro
app.post('/registro', (req, res) =>  { registro.handleRegistro(req, res, db, bcrypt) });

//Iniciar Sesion
app.post('/iniciar-sesion', (req, res) =>  { inicioSesion.handleInicioSesion(req, res, db, bcrypt) });


// ----- Agregar, modificar, buscar y eliminar empresas
// Agregar
app.use('/agregar-empresa', upload.array('image'), async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Cytii');
    let safeUrl = '';
    const insert = (str, index, value) => {
      safeUrl = str.substr(0, index) + value + str.substr(index);
  }
  
  
    const { 
      categoria, nombre, descripcion,
      localizacion, telefono, correo, link,
      mapa,zona 
        } = req.body;
  
        if (req.method === 'POST') {
          const urls = [];
          const files = req.files;
    
          for(const file of files) {
              const { path } = file;
    
              const newPath = await uploader(path);
    
              urls.push(newPath);
    
              fs.unlinkSync(path);
          
              };
              const unsafeUrl = urls[0].url;
              insert(unsafeUrl, 4, 's');
  
                 db('cytii_empresas').insert({
                  categoria,             
                  nombre,
                  descripcion,
                  localizacion,
                  mapa,
                  zona,
                  telefono,
                  correo, 
                  link,   
                  imagen: safeUrl   
               }).then(res.status(200).json('empresa agregada'))
                 // id: urls[0].id
            } else {
          res.status(405).json({
              err: "No se pudo subir la imagen"
          })
      }
    
    
  })

//Modificar Empresa
app.patch('/modificar-empresa/:id', (req, res) => {modificarEmpresa.handleModificarEmpresa(req, res, db)});

//Modificar Imagen Empresa
app.use('/modificar-imagen-empresa/:id', upload.array('image'), async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Cytii');
    let safeUrl = '';
    const insert = (str, index, value) => {
      safeUrl = str.substr(0, index) + value + str.substr(index);
  }
  const { id } = req.params;
  if (req.method === 'PATCH') {
      const urls = [];
      const files = req.files;
  
      for(const file of files) {
          const { path } = file;
  
          const newPath = await uploader(path);
  
          urls.push(newPath);
  
          fs.unlinkSync(path);
      
          };
          const unsafeUrl = urls[0].url;
          insert(unsafeUrl, 4, 's');
  
            db('cytii_empresas').where({id: id}).update({             
              imagen: safeUrl
             // id: urls[0].id
  
          })
             .then(console.log)           
          
      res.status(200).json('exito');
  } else {
      res.status(405).json({
          err: "No se pudo subir la imagen"
      })
  }
  
  })


//Buscar Empresa por ID
app.get('/buscar-empresa/:id', (req, res) => {buscarEmpresa.handleBuscarEmpresa(req, res, db)});
  
//Eliminar Empresa
app.delete('/borrar-empresa/:id', (req, res) => {borrarEmpresa.handleEliminarEmpresa(req, res, db)});


 
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))
