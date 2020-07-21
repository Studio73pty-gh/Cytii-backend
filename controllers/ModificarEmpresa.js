const handleModificarEmpresa = (req, res, db) =>{
    const { id } = req.params;
    const { 
        categoria, nombre, descripcion,
        localizacion, telefono, correo, link,
        zona 
          } = req.body;

          db('cytii_empresas').where({id: id}).update({
            categoria,             
            nombre,
            descripcion,
            localizacion,
            zona,
            telefono,
            correo, 
            link   
             }).then(res.status(200).json('empresa actualizado'))
          
            //  .catch(err => res.status(400).json(err));

         }
 module.exports = {
     handleModificarEmpresa: handleModificarEmpresa
 }