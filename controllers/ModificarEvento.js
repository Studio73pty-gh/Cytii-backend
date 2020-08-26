const handleModificarEvento = (req, res, db) =>{
    const { id } = req.params;
     const { 
        nombre,
        intro,
        evento,
        fecha
        } = req.body;

               db('promociones').where({ id }).update({     
                nombre,
                intro,
                evento,
                fecha
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarEvento
 }