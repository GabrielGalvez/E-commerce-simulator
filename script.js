let productosJSON = [];
let dolarCompra;

let totalCarrito;
let contenedor = document.getElementById("misprods");
let botonFinalizar = document.getElementById("finalizar");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


(carrito.length != 0)&&dibujarTabla();
obtenerDolar();
//LUXON
const DateTime = luxon.DateTime;
//momento en que se ingresa a la web
const ahora = DateTime.now();


function dibujarTabla() {
    for (const prod of carrito) {
        document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
            <td><button class="btn btn-light" onclick="eliminar(event)">🗑️</button></td>
        </tr>
    `;
    }
    totalCarrito = carrito.reduce((acumulador, prod) => acumulador + prod.precio, 0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar $: " + totalCarrito ;
}

function renderizarProds() {
    for (const prod of productosJSON) {
        contenedor.innerHTML += `
        <div class="card col-sm-3 light">
        <img src=${prod.foto} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${prod.codigo}</h5>
            <p class="card-text">${prod.nombre}</p>
            <p class="card-text">U$D ${(prod.precio/dolarCompra).toFixed(2)}</p>
            <button id="btn${prod.codigo}" class="btn btn-primary">Comprar</button>
        </div>
    </div>
        `;
    }
    //EVENTOS
    //Cambia de color cuando el mouse se posa sobre los botones
    productosJSON.forEach(prod => {
        let boton = document.getElementById(`btn${prod.codigo}`);
        boton.onmouseover = () => {
            boton.className = "btn btn-info";
        }
        boton.onmouseout = () => {
            boton.className = "btn btn-primary";
        }
        //evento para cada boton
        document.getElementById(`btn${prod.codigo}`).addEventListener("click", function () {
            agregarAlCarrito(prod);
        });
    })
}



function agregarAlCarrito(newProd) {
    carrito.push(newProd);
    console.table(carrito);

    //SWEET ALERT
    Swal.fire({
        title: newProd.nombre,
        text: 'Agregado al carrito!',
        imageUrl: newProd.foto,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: newProd.nombre,
        showConfirmButton: false,
        timer: 1500
    })
    document.getElementById("tablabody").innerHTML += `
        <tr class="light">
            <td>${newProd.codigo}</td>
            <td>${newProd.nombre}</td>
            <td>${newProd.precio}</td>
            <td><button class="btn" onclick="eliminar(event)">🗑️</button></td>
        </tr>
    `;
    totalCarrito = carrito.reduce((acumulador, prod) => acumulador + prod.precio, 0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar: $" + totalCarrito;

    //storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Para eliminar prods del carro
function eliminar(ev) {
    console.log(ev);
    let fila = ev.target.parentElement.parentElement;
    let codigo = fila.children[0].innerText;
    let indice = carrito.findIndex(prod => prod.codigo == codigo);
    //remueve el producto del carro
    carrito.splice(indice, 1);
    console.table(carrito);
    //remueve la fila de la tabla
    fila.remove();
    //recalcular el total
    let preciosAcumulados = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    total.innerText = "Total a pagar $: " + preciosAcumulados;
    //storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Obtener valor dolar
function obtenerDolar() {
    const URLDOLAR = "https://api.bluelytics.com.ar/v2/latest";
    fetch(URLDOLAR)
        .then(respuesta => respuesta.json())
        .then(cotizaciones => {
            const dolarBlue = cotizaciones.blue;
            document.getElementById("fila_prueba").innerHTML += `
                <p>Dolar compra: $ ${dolarBlue.value_buy} Dolar venta: $ ${dolarBlue.value_sell}</p>
            `;
            dolarCompra = dolarBlue.value_buy;
            obtenerJSON();
        })
}

//GETJSON de productos.json
async function obtenerJSON() {
    const URLJSON = "productos.json";
    const resp = await fetch(URLJSON);
    const data = await resp.json();
    productosJSON = data;
    
    //ya tengo el dolar y los productos, renderizo las cartas
    renderizarProds();
}

//Cerrando la compra
botonFinalizar.onclick = () => {
    if (carrito.length == 0){
        Swal.fire({
            title: 'Tu carro se encuentra vacío',
            text: 'compre algun producto',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        })
    } else{
        carrito = [];
        document.getElementById("tablabody").innerHTML = "";
        let infoTotal = document.getElementById("total");
        infoTotal.innerText = "Total a pagar $: ";
        Toastify({
            text: "Pronto vas a recibir un mail de confirmacion, gracias por elegirnos!",
            duration: 3000,
            gravity: 'bottom',
            position: 'left',
            style: {
                background: 'linear-gradient(to right, #00b09b, #96c92d)'
            }
        }).showToast();

        //Quiero medir intevalo
        const cierreDeCompra = DateTime.now();
        const Interval = luxon.Interval;
        const tiempo = Interval.fromDateTimes(ahora, cierreDeCompra);
        console.log("Tardaste " + tiempo.length('seconds') + " segundos en comprar");
        localStorage.removeItem("carrito");
    }
}

