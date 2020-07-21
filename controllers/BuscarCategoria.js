const handleBuscarCategoria = (req, res, db) => {
    const { categoria } = req.body;
    db.select('*').from('cytii_empresas').where({
        categoria : categoria
    }).then(user => {
        if(user.length){
            user.sort(function(a, b) {
                return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
               
            });
            res.json(user)
        }else{
            res.status(400).json('empresas no encontradss')
        }
    })
    .catch(err => res.status(400).json('error buscando empresas'))

}

module.exports = {
    handleBuscarCategoria
}