window.addEventListener('load', () => {

    //let btnSubmit = document.querySelector('#btnSubmit');
    let campoEmail = document.querySelector("#usuario_email");
    let campoPwd = document.querySelector("#password_log");
    let loginForm = document.getElementById("loginForm");


    loginForm.addEventListener('submit', (e) => {        
        
        let errores = [];     //Declaramos array conteneder de errores
        let tagErrores = document.querySelector('div.error_msg_form');

        while (tagErrores.firstChild) {
            tagErrores.removeChild(tagErrores.firstChild);
        }

        if (campoEmail.value == '') {
            errores.push('El email no puede estar vacío');
        }

        if (campoPwd.value == '') {
            errores.push('El password no puede estar vacío');
        }

        if (campoPwd.value.length < 3) {
            errores.push('El password debe contener al menos 3 caractéres');
        }

        if (errores.length > 0 ){
        
            e.preventDefault();

            errores.forEach((element) => {
                tagErrores.innerHTML += "<p>" + element + "</p>";
            })

        } else {
            //Cuando no hay mas errores, submit del form.
            loginForm.submit();
        }
    })

});