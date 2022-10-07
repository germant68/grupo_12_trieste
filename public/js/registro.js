window.addEventListener('load', () => {

    //Tomamos los campos del Formulario de Registro
    let registroForm = document.getElementById("registroForm");
    let campoEmail = document.getElementById("email_reg");
    let nombreReg = document.getElementById("nombreReg");
    let apellidoReg = document.getElementById("apellidoReg")
    let campoPwd = document.getElementById("pwd_reg");
    let pwdRepeat = document.getElementById("pwdrepeat");


    registroForm.addEventListener('submit', (e) => {        

        let errores = [];     //Declaramos array conteneder de errores
        let tagErrores = document.querySelector('div.error_msg_form'); //Tag donde inyectamos HTML con Error


        //Borramos el primer hijo del elemento padre, mientras contenga hijos va borrando de a 1.
        while (tagErrores.firstChild) {
            tagErrores.removeChild(tagErrores.firstChild);
        }

        if (campoEmail.value == '') {
            errores.push('El email no puede estar vacío');
        }

        if (nombreReg.value == '') {
            errores.push('El nombre no puede estar vacío');
        }

        if (apellidoReg.value == '') {
            errores.push('El apellido no puede estar vacío');
        }

        if (campoPwd.value == '') {
            errores.push('El password no puede estar vacío');
        }

        if (campoPwd.value.length < 3) {
            errores.push('El password debe contener al menos 3 caractéres');
        }

        if (pwdRepeat.value != campoPwd.value ) {
            errores.push('Las contraseñas no coinciden. Revise por favor.');
        }
        
        if (errores.length > 0 ){
        
            e.preventDefault();

            errores.forEach((element) => {
                tagErrores.innerHTML += "<p>" + element + "</p>";
            })

        } else {
            //Cuando no hay mas errores, submit del form.
            registroForm.submit();
        }
    })

});