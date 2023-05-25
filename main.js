// Variables globales
let carrito = [];
let total = 0;

// Obtener carrito del LocalStorage al cargar la página
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
 
}

// Productos
const productos = [
  { nombre: 'Pesas', precio: 25 },
  { nombre: 'Esterilla', precio: 15 },
  { nombre: 'Banda de resistencia', precio: 10 },
  { nombre: 'Pelota de ejercicio', precio: 20 },
  { nombre: 'Cuerda de saltar', precio: 8 }
];

// Elementos del DOM
const productoSelect = document.getElementById('producto-select');
const cantidadInput = document.getElementById('cantidad-input');
const agregarBtn = document.getElementById('agregar-btn');
const carritoList = document.getElementById('carrito-list');
const totalDiv = document.getElementById('total-div');
const finalizarBtn = document.getElementById('finalizar-btn');
const limpiarBtn = document.getElementById('limpiar-btn');
const bienvenidaDiv = document.getElementById('bienvenida-div');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupCloseBtn = document.getElementById('popup-close-btn');

// Mostrar ventana de bienvenida
function mostrarVentanaBienvenida() {
  const nombre = localStorage.getItem('nombre');

  if (nombre) {
    const bienvenidaTexto = document.createElement('div');
    bienvenidaTexto.classList.add('text-right');
    bienvenidaTexto.textContent = `Bienvenido(a) ${nombre}`;
    bienvenidaDiv.appendChild(bienvenidaTexto);
  } else {
    const ventanaBienvenida = document.createElement('div');
    ventanaBienvenida.id = 'bienvenida-modal';
    ventanaBienvenida.classList.add('modal', 'fade');
    ventanaBienvenida.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">¡Bienvenido(a)!</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Por favor, introduce tu nombre:</p>
            <input type="text" id="nombre-input" class="form-control">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="guardar-nombre-btn">Guardar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(ventanaBienvenida);

    const guardarNombreBtn = document.getElementById('guardar-nombre-btn');
    const nombreInput = document.getElementById('nombre-input');

    guardarNombreBtn.addEventListener('click', () => {
      const nombre = nombreInput.value.trim();

      if (nombre !== '') {
        localStorage.setItem('nombre', nombre);
        $('#bienvenida-modal').modal('hide');
        const bienvenidaTexto = document.createElement('div');
        bienvenidaTexto.classList.add('text-right');
        bienvenidaTexto.textContent = `Bienvenido(a) ${nombre}`;
        bienvenidaDiv.appendChild(bienvenidaTexto);
      } else {
        asignarNombreInvitado();
        $('#bienvenida-modal').modal('hide');
        const bienvenidaTexto = document.createElement('div');
        bienvenidaTexto.classList.add('text-right');
        bienvenidaTexto.textContent = 'Bienvenido(a) Invitado';
        bienvenidaDiv.appendChild(bienvenidaTexto);
      }
    });

    $('#bienvenida-modal').modal('show');
    $('#bienvenida-modal').on('hidden.bs.modal', () => {
      const nombre = localStorage.getItem('nombre');
      if (!nombre) {
        asignarNombreInvitado();
        const bienvenidaTexto = document.createElement('div');
        bienvenidaTexto.classList.add('text-right');
        bienvenidaTexto.textContent = 'Bienvenido(a) Invitado';
        bienvenidaDiv.appendChild(bienvenidaTexto);
      }
    });
  }
}

// Función para asignar "Invitado" a la clave "nombre" en el LocalStorage
function asignarNombreInvitado() {
  localStorage.setItem('nombre', 'Invitado');
}

// Actualizar el resumen de la compra
function actualizarResumen() {
  carritoList.innerHTML = '';
  total = 0;

  carrito.forEach((item, index) => {
    const { producto, precioUnitario, cantidad } = item;

    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    const botonMenos = document.createElement('button');
    botonMenos.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-2');
    botonMenos.textContent = '-';
    botonMenos.addEventListener('click', () => disminuirCantidad(index));

    const botonMas = document.createElement('button');
    botonMas.classList.add('btn', 'btn-sm', 'btn-success', 'mr-2');
    botonMas.textContent = '+';
    botonMas.addEventListener('click', () => aumentarCantidad(index));

    const cantidadSpan = document.createElement('span');
    cantidadSpan.textContent = cantidad;

    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = producto;

    const precioSpan = document.createElement('span');
    precioSpan.textContent = `$${precioUnitario * cantidad}`;

    listItem.appendChild(botonMenos);
    listItem.appendChild(botonMas);
    listItem.appendChild(cantidadSpan);
    listItem.appendChild(nombreSpan);
    listItem.appendChild(precioSpan);

    carritoList.appendChild(listItem);

    total += precioUnitario * cantidad;
  });

  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  const iva = total * 0.19;
  const totalConIva = total + iva;
  totalDiv.innerHTML += `<br>IVA (19%): $${iva.toFixed(2)}<br>Total (con IVA): $${totalConIva.toFixed(2)}`;

  if (carrito.length > 0) {
    finalizarBtn.disabled = false;
    limpiarBtn.disabled = false;
  } else {
    finalizarBtn.disabled = true;
    limpiarBtn.disabled = true;
  }

  // Guardar carrito en el LocalStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarProducto() {
  const seleccionado = productoSelect.value;
  const cantidad = parseInt(cantidadInput.value);

  if (seleccionado && cantidad > 0) {
    const producto = productos.find((item) => item.nombre === seleccionado);

    if (producto) {
      const existeEnCarrito = carrito.find((item) => item.producto === seleccionado);

      if (existeEnCarrito) {
        existeEnCarrito.cantidad += cantidad;
      } else {
        carrito.push({
          producto: seleccionado,
          precioUnitario: producto.precio,
          cantidad
        });
      }

      actualizarResumen();
      mostrarPopup('Producto agregado al carrito.');
    }
  }

  productoSelect.value = '';
  cantidadInput.value = '';
}

// Aumentar la cantidad de un producto en el carrito
function aumentarCantidad(index) {
  carrito[index].cantidad++;
  actualizarResumen();
}

// Disminuir la cantidad de un producto en el carrito
function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }

  actualizarResumen();
}

// Finalizar la compra
function finalizarCompra() {
  // Aquí puedes agregar la lógica para procesar la compra
  // y realizar las acciones necesarias

  // ...

  // Limpiar el carrito y actualizar el resumen
  carrito = [];
  actualizarResumen();
  mostrarPopup('¡Gracias por su compra, el detalle fue enviado al correo a***dfl89@gmail.com!');
}

// Limpiar el carrito
function limpiarCarrito() {
  carrito = [];
  actualizarResumen();
}

// Mostrar un mensaje emergente (popup)
function mostrarPopup(mensaje) {
  popupText.textContent = mensaje;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2000);
}

// Cerrar el popup
function cerrarPopup() {
  popup.classList.remove('show');
}

// Event listeners
agregarBtn.addEventListener('click', agregarProducto);
finalizarBtn.addEventListener('click', finalizarCompra);
limpiarBtn.addEventListener('click', limpiarCarrito);
popupCloseBtn.addEventListener('click', cerrarPopup);

// Mostrar ventana de bienvenida al cargar la página
mostrarVentanaBienvenida();
actualizarResumen();
