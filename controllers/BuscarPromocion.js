const handleBuscarPromocionId = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('promociones').where({
        id: id
    }).then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('promocion no encontrado')
        }
    })
    .catch(err => res.status(400).json('error buscando empresa'))

}

module.exports = {
    handleBuscarPromocionId
}