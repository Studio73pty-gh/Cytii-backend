const handleBorrarPost = (req, res, db) => {
    const { id } = req.params;
    db('blog').where({id})
    .del()
    .then(res.json('borrado exitoso!'))
}


module.exports = {
    handleBorrarPost: handleBorrarPost
}