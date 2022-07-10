const productosController = {
    detalle: function (req,res) {
        res.send("Detalle del producto " + req.params.idProducto);
    }} 

module.exports = productosController;

