const handleborrarPromocion = (req, res, db) => {
    const { id } = req.params;
    db('promociones').where({id})
    .del()
    .then(res.json('borrado exitoso!'))
}


module.exports = {
    handleborrarPromocion: handleborrarPromocion
}