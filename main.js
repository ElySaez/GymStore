// Declaración de variables y objetos
let carrito = [];
let productos = [
    { nombre: "Pesas", precio: 25 },
    { nombre: "Esterilla", precio: 15 },
    { nombre: "Banda de resistencia", precio: 10 },
    { nombre: "Pelota de ejercicio", precio: 20 },
    { nombre: "Cuerda de saltar", precio: 8 }
];

// Función para realizar una compra
function realizarCompra() {
    let finalizar = false;
    let total = 0;

    while (!finalizar) {
        // Captura entradas del usuario
        let producto = prompt("Ingresa el nombre del producto que deseas comprar (o escribe 'fin' para terminar):");

        if (producto.toLowerCase() === "fin") {
            finalizar = true;
            continue;
        }

        // Valida si se ingresó un producto válido
        let productoEncontrado = productos.find(function(item) {
            return item.nombre.toLowerCase() === producto.toLowerCase();
        });

        if (productoEncontrado) {
            let cantidad;
            let cantidadValida = false;

            while (!cantidadValida) {
                cantidad = parseInt(prompt("Ingresa la cantidad que deseas comprar:"));

                // Valida si se ingresó una cantidad válida
                if (!isNaN(cantidad) && cantidad > 0) {
                    cantidadValida = true;
                } else {
                    // Muestra mensaje de error si no se ingresó una cantidad válida
                    alert("Error: Debes ingresar una cantidad válida.");
                }
            }

            // Agrega el producto al carrito
            carrito.push({
                producto: productoEncontrado.nombre,
                precioUnitario: productoEncontrado.precio,
                cantidad: cantidad
            });

            // Calcula el subtotal y lo suma  al total
            let subtotal = productoEncontrado.precio * cantidad;
            total += subtotal;

            // Muestra mensaje de éxito
            let mensajeExito = "Producto agregado al carrito:\n";
            mensajeExito += "Producto: " + productoEncontrado.nombre + "\n";
            mensajeExito += "Cantidad: " + cantidad;
            alert(mensajeExito);
        } else {
            // Muestra mensaje de error si no se ingresó un producto válido
            alert("Error: Producto no válido.");
        }
    }

    // Muestra el resumen de la compra y el total
    if (carrito.length > 0) {
        let mensajeResumen = "Resumen de la compra:\n";

        for (let i = 0; i < carrito.length; i++) {
            let item = carrito[i];
            let subtotal = item.precioUnitario * item.cantidad;

            mensajeResumen += "Producto: " + item.producto + "\n";
            mensajeResumen += "Cantidad: " + item.cantidad + "\n";
            mensajeResumen += "Subtotal: $" + subtotal + "\n";
            mensajeResumen += "----------------------\n";
        }

        mensajeResumen += "Total: $" + total;
        alert(mensajeResumen);
    } else {
        alert("No se realizaron compras.");
    }
}
