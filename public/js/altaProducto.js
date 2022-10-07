window.addEventListener('load', () => {

    let altaProducto = document.getElementById("altaProducto");
    let nombreDisco = document.getElementById("nombreDisco");
    let precio = document.getElementById("precio");
    let stock = document.getElementById("stock");
    let sku = document.getElementById("sku");
    let categoria = document.getElementById("categoria");
    let nombreArtista = document.getElementById("nombreArtista");
    let tapaDisco = document.getElementById("tapaDisco");


    altaProducto.addEventListener('submit', (e) => {        
        
        let errores = [];     //Declaramos array conteneder de errores
        let tagErrores = document.querySelector('div.error_msg_form');

        while (tagErrores.firstChild) {
            tagErrores.removeChild(tagErrores.firstChild);
        }

        //Nombre Artista
        console.log(nombreArtista.value);
        if (nombreArtista.value == 'default') {
            errores.push('Debe seleccionar un Artista');
        }

        //Nombre del disco
        if (nombreDisco.value == '') {
            errores.push('Debe ingresar un nombre para el Disco');
        }

        //Género (categoría)
        if (categoria.value == '') {
            errores.push('Debe seleccionar un Género Musical');
        }

        //Precio
        if (precio.value == '') {
            errores.push('Debe especificar un precio');
        }

        //Stock
        if (stock.value == '') {
            errores.push('Debe indicar stock');
        }

        //SKU
        if (sku.value == '') {
            errores.push('Debe indicar el SKU del Producto');
        }

        //Tapa del Disco
        if (tapaDisco.value == '') {
            errores.push('Debe incluir una imagen para la Tapa del Disco');
        }

        if (errores.length > 0 ){
        
            e.preventDefault();

            errores.forEach((element) => {
                tagErrores.innerHTML += "<p>" + element + "</p>";
            })

        } else {
            //Cuando no hay mas errores, submit del form.
            altaProducto.submit();
        }
    })

});