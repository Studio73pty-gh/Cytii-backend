const handleModificarPost = (req, res, db) =>{
    const { id } = req.params;
     const { 
        titulo,
        intro,
        contenido,
        fecha 
        } = req.body;

               db('blog').where({ id }).update({     
                titulo,
                intro,
                contenido,
                fecha 
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarPost
 }