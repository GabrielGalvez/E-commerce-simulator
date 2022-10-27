//Declaracion de un array de productos para almacenar objetos
const productosGabo=[];
productosGabo.push(new Product(1,"./images/mouseLogitech.jpg","Mouse",3000));
productosGabo.push(new Product(2,"./images/joyStick.jpg","Joystick",4000));
productosGabo.push(new Product(3,"./images/monitorSamsung.jpg","Monitor",10000));
productosGabo.push(new Product(4,"./images/laptop.jpg","Laptop",30000));
//Iteramos el array con for...of para agregar el iva
for(const producto of productosGabo){
    producto.sumarIva();
}

//console.log(productosGabo);
let totalCompra;
let contenedor = document.getElementById("misprods");
let botonFinalizar = document.getElementById("finalizar");
let carrito =  JSON.parse(localStorage.getItem("carrito")) || [];
if(carrito.length != 0){
    console.log("Recuperando carro")
    dibujarTabla();
}

//LUXON
const DateTime = luxon.DateTime;
//momento en que se ingresa a la web
const ahora = DateTime.now();
console.log(ahora.toString());
console.log(ahora.zoneName);
console.log(ahora.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS));


function dibujarTabla(){
    for(const prod of carrito){
        document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
        </tr>
    `;
    }
    totalCarrito = carrito.reduce((acumulador,prod)=> acumulador + prod.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito+"(iva incluido)";
}

function renderizarProds(){
    for(const prod of productosGabo){
        contenedor.innerHTML += `
        <div class="card col-sm-3 light">
        <img src=${prod.foto} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${prod.codigo}</h5>
            <p class="card-text">${prod.nombre}</p>
            <p class="card-text">$ ${prod.precio}</p>
            <button id="btn${prod.codigo}" class="btn btn-primary">Comprar</button>
        </div>
    </div>
        `;
    }
    //EVENTOS
    //Cambia de color cuando el mouse se posa sobre los botones
    productosGabo.forEach(prod => {
        let boton = document.getElementById(`btn${prod.codigo}`);
        boton.onmouseover = () =>{
            boton.className="btn btn-info";
        }
        boton.onmouseout = () => {
            boton.className="btn btn-primary";
        }
        //evento para cada boton
        document.getElementById(`btn${prod.codigo}`).addEventListener("click",function(){
            agregarAlCarrito(prod);
        });
    })
}

renderizarProds();

function agregarAlCarrito(newProd){
    carrito.push(newProd);
    console.table(carrito);
    alert("El producto: "+newProd.nombre+" ha sido agregado al carrito con exito!");
    document.getElementById("tablabody").innerHTML += `
        <tr class="light">
            <td>${newProd.codigo}</td>
            <td>${newProd.nombre}</td>
            <td>$ ${newProd.precio}(iva incluido)</td>
        </tr>
    `;
    totalCompra = carrito.reduce((acumulador,prod)=>acumulador + prod.precio,0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar: $"+totalCompra+"(iva incluido)";
    //storage
    localStorage.setItem("carrito",JSON.stringify(carrito));
}
botonFinalizar.onclick = () => {
    carrito = [];
    document.getElementById("tablabody").innerHTML="";
    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: ";
    Toastify({
        text: "Pronto recibirá un mail de confirmacion",
        duration: 3000,
        gravity: 'bottom',
        position: 'left',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c92d)'
        }
    }).showToast();

    //Quiero medir intevalo
    const cierreDeCompra=DateTime.now();
    const Interval = luxon.Interval;
    const tiempo = Interval.fromDateTimes(ahora,cierreDeCompra);
    console.log("Tardaste "+tiempo.length('seconds')+" segundos en comprar");
    localStorage.removeItem("carrito");
}

//Dark o Light mode con localStorage para q quede almacenado el mode

let boton = document.getElementById("mode");
let principal = document.getElementById("principal");
let modo = localStorage.getItem("modo");

//Primer renderizado
if(modo != null){
    document.body.className=modo;
    principal.className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center "+modo;
    if(modo == "light"){
        boton.innerHTML="Dark mode";
    }else{
        boton.innerHTML="Light mode";
    }
}else{
    modo="light";
}

boton.onclick = () =>{
    if(modo == "light"){
        document.body.className= "dark";
        principal.classList.remove("light");
        principal.classList.add("principal");
        boton.innerText="Light Mode";
        modo= "dark";
    }else{
        document.body.className= "light";
        principal.classList.remove("dark");
        principal.classList.add("principal");
        boton.innerText="Dark Mode";
        modo= "light";
    }
    localStorage.setItem("modo",modo);
}