const formulario = document.querySelector("#formulario");
const lista = document.querySelector(".list-group");
let botonEnviar = document.querySelector("#enviar");

eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }
  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#presupuesto p").textContent = `${presupuesto}`;
    document.querySelector("#restante p").textContent = `${restante}`;
  }

  imprimirAlerta(mensaje, clase) {
    const elementPadre = document.querySelector(".alerta-form");
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("alert");

    if (clase === "error") {
      divMensaje.classList.add("error");
    } else {
      divMensaje.classList.add("success");
    }

    // Mensaje
    divMensaje.textContent = mensaje;

    elementPadre.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTML();

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      const nuevoGasto = document.createElement("li");
      nuevoGasto.className = "list-group-item";
      nuevoGasto.dataset.id = id;

      nuevoGasto.innerHTML = `<span class="item-cantidad">${nombre}: $${cantidad}</span>`;

      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "X";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      btnBorrar.classList.add("btn-delete");

      nuevoGasto.appendChild(btnBorrar);

      lista.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante p").textContent = `${restante}`;
  }

  comprobarPresupuesto(presupuestoObj) {
    const divRestante = document.querySelector("#restante");

    const { presupuesto, restante } = presupuestoObj;

    // Comprobar 25%
    if (presupuesto / 4 > restante) {
      divRestante.classList.remove("success", "warning");
      divRestante.classList.add("danger");
    } else if (presupuesto / 2 > restante) {
      divRestante.classList.remove("success");
      divRestante.classList.add("warning");
    } else {
        divRestante.classList.remove('danger', 'warning');
        divRestante.classList.add("success");
    }

    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      botonEnviar.disabled = true;
    }
  }

  resetFormulario() {
    formulario.reset();
  }
}

// Instanciar
const ui = new UI();
let presupuesto;

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt(
    "¿Cual es el tu presupuesto?  (minimo 100)"
  );

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario < 100
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#campo-gasto").value;
  const cantidad = Number(document.querySelector("#campo-cantidad").value);

  if (nombre.trim() === "" || cantidad === "") {
    return ui.imprimirAlerta("Ambos campos son obligatorios", "error");
  } else if (Number(cantidad) <= 0 || isNaN(cantidad)) {
    return ui.imprimirAlerta("La cantidad no es valida", "error");
  }

  const gasto = { nombre, cantidad, id: Date.now() };

  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta("Agregado correctamente", "success");

  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  ui.resetFormulario();
}

function eliminarGasto(id) {
  // Elimina de la Clase
  presupuesto.eliminarGasto(id);

  // Elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
