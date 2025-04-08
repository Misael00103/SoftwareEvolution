document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const listaCompras = document.getElementById('listaCompras');
    const formularioCompra = document.getElementById('formularioCompra');
    const nuevaCompraBtn = document.getElementById('nuevaCompraBtn');
    const volverListaBtn = document.getElementById('volverListaBtn');
    const comprasTableBody = document.getElementById('comprasTableBody');
    const compraForm = document.getElementById('compraForm');
    const compraIdInput = document.getElementById('compraId');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const guardarCompraBtn = document.getElementById('guardarCompraBtn');
    const cancelarCompraBtn = document.getElementById('cancelarCompraBtn');
    const totalBruto = document.getElementById('totalBruto');
    const descuento1 = document.getElementById('descuento1');
    const baseImponible = document.getElementById('baseImponible');
    const itbis = document.getElementById('itbis');
    const totalNeto = document.getElementById('totalNeto');
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    const tituloFormulario = document.getElementById('tituloFormulario');

    // Variables para manejar eliminación y modal
    let elementToDelete = null;
    let deleteType = null;
    let modalCallback = null;

    // Datos simulados de compras
    let compras = [
        { id: 1, fechaIngreso: '2025-04-01', proveedor: 'ALMACEN PRINCIPAL', factura: 'FAC001', totalNeto: 12000.00 },
        { id: 2, fechaIngreso: '2025-04-02', proveedor: 'MONTO USS', factura: 'FAC002', totalNeto: 8500.50 },
    ];

    // Mostrar lista de compras al cargar
    mostrarListaCompras();

    // Botón para nueva compra
    nuevaCompraBtn.addEventListener('click', function() {
        mostrarFormularioCompra();
        resetearFormulario();
        tituloFormulario.textContent = 'Nueva Compra';
        compraIdInput.value = '';
    });

    // Botón para volver a la lista
    volverListaBtn.addEventListener('click', function() {
        if (hayDatosEnFormulario()) {
            showModal('¿Está seguro que desea volver? Los cambios no guardados se perderán.', mostrarListaCompras);
        } else {
            mostrarListaCompras();
        }
    });

    // Agregar producto
    agregarProductoBtn.addEventListener('click', function() {
        agregarFilaProducto();
        calcularTotales();
    });

    // Guardar compra
    compraForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validarFormulario()) {
            showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }
        guardarCompraBtn.disabled = true;
        guardarCompraBtn.innerHTML = '<span class="material-icons">save</span> Guardando...';
        setTimeout(() => {
            guardarCompraBtn.disabled = false;
            guardarCompraBtn.innerHTML = '<span class="material-icons">save</span> Guardar';
            const compraData = recolectarDatosCompra();
            if (compraIdInput.value) {
                actualizarCompra(compraData);
                showNotification('Compra actualizada', 'La compra ha sido actualizada correctamente');
            } else {
                agregarCompra(compraData);
                showNotification('Compra guardada', 'La compra ha sido guardada correctamente');
            }
            mostrarListaCompras();
        }, 1500);
    });

    // Cancelar compra
    cancelarCompraBtn.addEventListener('click', function() {
        if (hayDatosEnFormulario()) {
            showModal('¿Está seguro que desea cancelar esta compra? Los cambios no guardados se perderán.', resetearFormulario);
        } else {
            resetearFormulario();
        }
    });

    // Manejo del modal
    closeConfirmModal.addEventListener('click', hideModal);
    cancelConfirmBtn.addEventListener('click', hideModal);
    confirmActionBtn.addEventListener('click', () => {
        if (modalCallback) modalCallback();
        hideModal();
        if (deleteType === 'fila' && elementToDelete) {
            elementToDelete.remove();
            renumerarFilas();
            calcularTotales();
            elementToDelete = null;
            deleteType = null;
        } else if (deleteType === 'compra' && elementToDelete) {
            eliminarCompra(elementToDelete);
            elementToDelete = null;
            deleteType = null;
        }
    });

    // Cerrar notificación
    notificationCloseBtn.addEventListener('click', function() {
        notification.classList.remove('show');
    });

    // Delegación de eventos para la tabla de productos
    document.getElementById('detalleProductosTable').addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target || !target.classList.contains('eliminar-fila')) return;
        const row = target.closest('tr');
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        if (filas.length === 1) {
            showNotification('Error', 'Debe haber al menos un producto en la compra', 'error');
            return;
        }
        elementToDelete = row;
        deleteType = 'fila';
        showModal('¿Está seguro que desea eliminar este producto de la compra?', () => {});
    });

    // Delegación de eventos para cambios en productos
    document.getElementById('detalleProductosTable').addEventListener('input', function(e) {
        const target = e.target;
        if (target.classList.contains('cantidad-producto') || 
            target.classList.contains('costo-producto') || 
            target.classList.contains('itbis-producto')) {
            calcularTotales();
        }
    });

    // Delegación de eventos para la tabla de compras
    comprasTableBody.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        const id = target.closest('tr').dataset.id;
        if (target.classList.contains('editar-compra')) {
            editarCompra(id);
        } else if (target.classList.contains('eliminar-compra')) {
            elementToDelete = id;
            deleteType = 'compra';
            showModal(`¿Está seguro que desea eliminar la compra #${id}?`, () => {});
        }
    });

    // Función para mostrar la lista de compras
    function mostrarListaCompras() {
        listaCompras.style.display = 'block';
        formularioCompra.style.display = 'none';
        comprasTableBody.innerHTML = '';
        compras.forEach((compra, index) => {
            const row = document.createElement('tr');
            row.dataset.id = compra.id;
            row.innerHTML = `
                <td data-label="#">${index + 1}</td>
                <td data-label="Fecha Ingreso">${compra.fechaIngreso}</td>
                <td data-label="Proveedor">${compra.proveedor}</td>
                <td data-label="Factura #">${compra.factura}</td>
                <td data-label="Total Neto">${formatearNumero(compra.totalNeto)}</td>
                <td data-label="Acciones">
                    <div class="table-actions">
                        <button class="btn secondary editar-compra">
                            <i class="material-icons">edit</i>
                            <span>Editar</span>
                        </button>
                        <button class="btn secondary eliminar-compra">
                            <i class="material-icons">delete</i>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </td>
            `;
            comprasTableBody.appendChild(row);
        });
    }

    // Función para mostrar el formulario
    function mostrarFormularioCompra() {
        listaCompras.style.display = 'none';
        formularioCompra.style.display = 'block';
    }

    // Función para editar una compra
    function editarCompra(id) {
        const compra = compras.find(c => c.id == id);
        if (!compra) return;
        mostrarFormularioCompra();
        tituloFormulario.textContent = `Editar Compra #${compra.factura}`;
        compraIdInput.value = compra.id;
        document.getElementById('fechaIngreso').value = compra.fechaIngreso;
        document.getElementById('proveedor').value = compra.proveedor === 'ALMACEN PRINCIPAL' ? '1' : compra.proveedor === 'MONTO USS' ? '2' : '3';
        document.getElementById('numeroFactura').value = compra.factura;
        const tbody = document.querySelector('#detalleProductosTable tbody');
        tbody.querySelectorAll('tr:not(#filaPlantilla)').forEach(row => row.remove());
        agregarFilaProducto();
        calcularTotales();
    }

    // Función para eliminar una compra
    function eliminarCompra(id) {
        compras = compras.filter(c => c.id != id);
        mostrarListaCompras();
        showNotification('Compra eliminada', 'La compra ha sido eliminada correctamente');
    }

    // Función para agregar una compra
    function agregarCompra(compraData) {
        compraData.id = compras.length + 1;
        compras.push(compraData);
    }

    // Función para actualizar una compra
    function actualizarCompra(compraData) {
        const index = compras.findIndex(c => c.id == compraData.id);
        if (index !== -1) {
            compras[index] = compraData;
        }
    }

    // Función para recolectar datos del formulario
    function recolectarDatosCompra() {
        const proveedorSelect = document.getElementById('proveedor');
        const proveedorText = proveedorSelect.options[proveedorSelect.selectedIndex].text;
        return {
            id: compraIdInput.value ? parseInt(compraIdInput.value) : null,
            fechaIngreso: document.getElementById('fechaIngreso').value,
            proveedor: proveedorText,
            factura: document.getElementById('numeroFactura').value,
            totalNeto: parseFloat(totalNeto.value.replace(/,/g, '')) || 0
        };
    }

    // Función para agregar fila de producto
    function agregarFilaProducto() {
        const tbody = document.querySelector('#detalleProductosTable tbody');
        const plantilla = document.getElementById('filaPlantilla');
        const nuevaFila = plantilla.cloneNode(true);
        nuevaFila.id = '';
        nuevaFila.style.display = '';
        tbody.appendChild(nuevaFila);
        renumerarFilas();
    }

    // Función para renumerar filas
    function renumerarFilas() {
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        filas.forEach((fila, index) => {
            fila.querySelector('.numero-fila').textContent = index + 1;
        });
    }

    // Función para calcular totales
    function calcularTotales() {
        let totalBrutoValue = 0;
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        filas.forEach(fila => {
            const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
            const costo = parseFloat(fila.querySelector('.costo-producto').value) || 0;
            totalBrutoValue += cantidad * costo;
        });
        totalBruto.value = formatearNumero(totalBrutoValue);

        const descuento1Value = parseFloat(descuento1.value.replace(/,/g, '')) || 0;
        const baseImponibleValue = totalBrutoValue - descuento1Value;
        baseImponible.value = formatearNumero(baseImponibleValue);

        let itbisValue = 0;
        filas.forEach(fila => {
            const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
            const costo = parseFloat(fila.querySelector('.costo-producto').value) || 0;
            const itbisPorProducto = parseFloat(fila.querySelector('.itbis-producto').value) || 0;
            itbisValue += (cantidad * costo * (itbisPorProducto / 100));
        });
        itbis.value = formatearNumero(itbisValue);

        const totalNetoValue = baseImponibleValue + itbisValue;
        totalNeto.value = formatearNumero(totalNetoValue);
    }

    // Función para validar el formulario
    function validarFormulario() {
        if (!document.getElementById('fechaIngreso').value) return false;
        if (!document.getElementById('numeroFactura').value) return false;
        if (!document.getElementById('proveedor').value) return false;
        if (!document.getElementById('formaPago').value) return false;
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        if (filas.length === 0) return false;
        let productosValidos = true;
        filas.forEach(fila => {
            const referencia = fila.querySelector('.referencia-producto').value;
            const descripcion = fila.querySelector('.descripcion-producto').value;
            const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
            const costo = parseFloat(fila.querySelector('.costo-producto').value) || 0;
            if (!referencia || !descripcion || cantidad <= 0 || costo <= 0) {
                productosValidos = false;
            }
        });
        return productosValidos;
    }

    // Función para resetear el formulario
    function resetearFormulario() {
        compraForm.reset();
        document.getElementById('fechaIngreso').valueAsDate = new Date();
        const tbody = document.querySelector('#detalleProductosTable tbody');
        tbody.querySelectorAll('tr:not(#filaPlantilla)').forEach(row => row.remove());
        totalBruto.value = '0.00';
        descuento1.value = '0.00';
        baseImponible.value = '0.00';
        itbis.value = '0.00';
        totalNeto.value = '0.00';
        agregarFilaProducto();
    }

    // Función para verificar si hay datos en el formulario
    function hayDatosEnFormulario() {
        if (document.getElementById('numeroFactura').value) return true;
        if (document.getElementById('proveedor').value) return true;
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        for (let fila of filas) {
            const referencia = fila.querySelector('.referencia-producto').value;
            const descripcion = fila.querySelector('.descripcion-producto').value;
            const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
            const costo = parseFloat(fila.querySelector('.costo-producto').value) || 0;
            if (referencia || descripcion || cantidad > 1 || costo > 0) return true;
        }
        return false;
    }

    // Función para mostrar el modal
    function showModal(message, callback) {
        confirmMessage.textContent = message;
        modalCallback = callback;
        confirmModal.classList.add('active');
    }

    // Función para ocultar el modal
    function hideModal() {
        confirmModal.classList.remove('active');
        modalCallback = null;
    }

    // Función para formatear números
    function formatearNumero(numero) {
        return new Intl.NumberFormat('es-DO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    // Función para mostrar notificaciones
    function showNotification(title, message, type = 'success') {
        const toastTitle = notification.querySelector('.toast-title');
        const toastMessage = notification.querySelector('.toast-message');
        const toastIcon = notification.querySelector('.toast-icon .material-icons');
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        if (type === 'error') {
            toastIcon.textContent = 'error';
            notification.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            toastIcon.style.backgroundColor = 'var(--danger)';
        } else {
            toastIcon.textContent = 'check_circle';
            notification.style.backgroundColor = 'var(--success-light)';
            toastIcon.style.backgroundColor = 'var(--success)';
        }
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    }
});