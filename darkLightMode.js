    //Dark o Light mode con localStorage para q quede almacenado el mode

    let boton = document.getElementById("mode");
    let principal = document.getElementById("principal");
    let modo = localStorage.getItem("modo");

    //Primer renderizado
    if (modo != null) {
        document.body.className = modo;
        principal.className = "position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center " + modo;
        if (modo == "light") {
            boton.innerHTML = "Dark mode";
        } else {
            boton.innerHTML = "Light mode";
        }
    } else {
        modo = "light";
    }

    boton.onclick = () => {
        if (modo == "light") {
            document.body.className = "dark";
            principal.classList.remove("light");
            principal.classList.add("principal");
            boton.innerText = "Light Mode";
            modo = "dark";
        } else {
            document.body.className = "light";
            principal.classList.remove("dark");
            principal.classList.add("principal");
            boton.innerText = "Dark Mode";
            modo = "light";
        }
        localStorage.setItem("modo", modo);
    }