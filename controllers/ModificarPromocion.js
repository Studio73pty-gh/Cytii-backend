const handleModificarPromocion = (req, res, db) =>{
    const { id } = req.params;
     const { 
        titulo,
        intro,
        promocion,
        fecha
        } = req.body;

               db('promociones').where({ id }).update({     
                titulo,
                intro,
                promocion,
                fecha
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarPromocion
 }