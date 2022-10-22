//Simulador de un carrito de compras
//Clase constructora
class Product {
    constructor(codigo, foto, nombre, precio) {
        this.codigo = parseInt(codigo);
        this.foto = foto;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
    sumarIva(){
        this.precio=this.precio * 1.21;
 }
}
