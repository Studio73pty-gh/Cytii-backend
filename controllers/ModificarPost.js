const handleModificarPost = (req, res, db) =>{
    const { id } = req.params;
     const { 
        titulo,
        intro,
        contenido,

        } = req.body;

               db('blog').where({ id }).update({     
                titulo,
                intro,
                contenido
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarPost
 }