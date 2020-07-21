const handleEliminarEmpresa = (req, res, db) => {
    const { id } = req.params;
    db('cytii_empresas').where({ id: id})
    .del()
    .then(res.json('borrado exitoso!'))
    if(err){
         res.status(400).json(err);
    }
}


module.exports = {
    handleEliminarEmpresa: handleEliminarEmpresa
}