document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const listadoCompras = document.getElementById('listadoCompras');
    const formularioCompra = document.getElementById('formularioCompra');
    const tituloFormulario = document.getElementById('tituloFormulario');
    const compraForm = document.getElementById('compraForm');
    const compraIdInput = document.getElementById('compraId');
    
    // Botones
    const nuevaCompraBtn = document.getElementById('nuevaCompraBtn');
    const volverListadoBtn = document.getElementById('volverListadoBtn');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const guardarCompraBtn = document.getElementById('guardarCompraBtn');
    const cancelarCompraBtn = document.getElementById('cancelarCompraBtn');
    
    // Campos de totales
    const subtotalCompra = document.getElementById('subtotalCompra');
    const descuentoPorcentaje = document.getElementById('descuentoPorcentaje');
    const descuentoMonto = document.getElementById('descuentoMonto');
    const impuestosCompra = document.getElementById('impuestosCompra');
    const totalCompra = document.getElementById('totalCompra');
    
    // Modal de confirmación
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    
    // Notificación
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    
    // Variable para almacenar el elemento a eliminar
    let elementToDelete = null;
    let deleteType = null;
    
    // Establecer fecha actual
    document.getElementById('fechaCompra').valueAsDate = new Date();
    
    // Mostrar formulario de nueva compra
    nuevaCompraBtn.addEventListener('click', function() {
        mostrarFormulario();
        resetearFormulario();
        tituloFormulario.textContent = 'Nueva Compra';
        compraIdInput.value = '';
        
        // Agregar primera fila de producto
        agregarFilaProducto();
    });
    
    // Volver al listado
    volverListadoBtn.addEventListener('click', function() {
        if (hayDatosEnFormulario()) {
            mostrarConfirmacion(
                '¿Está seguro que desea volver al listado? Los cambios no guardados se perderán.',
                'Volver',
                function() {
                    mostrarListado();
                }
            );
        } else {
            mostrarListado();
        }
    });
    
    // Agregar fila de producto
    agregarProductoBtn.addEventListener('click', function() {
        agregarFilaProducto();
    });
    
    // Guardar compra
    compraForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Simular guardado
        guardarCompraBtn.disabled = true;
        guardarCompraBtn.innerHTML = '<span class="material-icons">save</span> Guardando...';
        
        setTimeout(() => {
            guardarCompraBtn.disabled = false;
            guardarCompraBtn.innerHTML = '<span class="material-icons">save</span> Guardar Compra';
            
            if (compraIdInput.value) {
                showNotification('Compra actualizada', 'La compra ha sido actualizada correctamente');
            } else {
                showNotification('Compra guardada', 'La compra ha sido guardada correctamente');
            }
            
            mostrarListado();
            
            // Actualizar listado (simulado)
            if (!compraIdInput.value) {
                agregarCompraATabla();
            }
        }, 1500);
    });
    
    // Cancelar compra
    cancelarCompraBtn.addEventListener('click', function() {
        if (hayDatosEnFormulario()) {
            mostrarConfirmacion(
                '¿Está seguro que desea cancelar esta compra? Los cambios no guardados se perderán.',
                'Cancelar',
                function() {
                    mostrarListado();
                }
            );
        } else {
            mostrarListado();
        }
    });
    
    // Cerrar modal de confirmación
    [closeConfirmModal, cancelConfirmBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            confirmModal.classList.remove('show');
        });
    });
    
    // Confirmar acción
    confirmActionBtn.addEventListener('click', function() {
        confirmModal.classList.remove('show');
        
        if (deleteType === 'compra' && elementToDelete) {
            elementToDelete.remove();
            showNotification('Compra eliminada', 'La compra ha sido eliminada correctamente');
            elementToDelete = null;
        } else if (deleteType === 'fila' && elementToDelete) {
            elementToDelete.remove();
            renumerarFilas();
            calcularTotales();
        } else if (typeof elementToDelete === 'function') {
            elementToDelete();
            elementToDelete = null;
        }
    });
    
    // Cerrar notificación
    notificationCloseBtn.addEventListener('click', function() {
        notification.classList.remove('show');
    });
    
    // Delegación de eventos para la tabla de compras
    document.getElementById('comprasTable').addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        const row = target.closest('tr');
        const compraId = target.getAttribute('data-id');
        
        if (target.classList.contains('edit-btn') || target.querySelector('.material-icons').textContent === 'edit') {
            editarCompra(compraId);
        } else if (target.classList.contains('view-btn') || target.querySelector('.material-icons').textContent === 'visibility') {
            verDetalleCompra(compraId);
        } else if (target.classList.contains('delete-btn') || target.querySelector('.material-icons').textContent === 'delete') {
            elementToDelete = row;
            deleteType = 'compra';
            mostrarConfirmacion(
                `¿Está seguro que desea eliminar la compra #${compraId}?`,
                'Eliminar'
            );
        }
    });
    
    // Delegación de eventos para la tabla de productos
    document.getElementById('detalleProductosTable').addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        if (target.classList.contains('eliminar-fila')) {
            const row = target.closest('tr');
            
            // Si solo hay una fila, no permitir eliminarla
            const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
            if (filas.length === 1) {
                showNotification('Error', 'Debe haber al menos un producto en la compra', 'error');
                return;
            }
            
            elementToDelete = row;
            deleteType = 'fila';
            mostrarConfirmacion(
                '¿Está seguro que desea eliminar este producto de la compra?',
                'Eliminar'
            );
        }
    });
    
    // Delegación de eventos para cambios en productos
    document.getElementById('detalleProductosTable').addEventListener('change', function(e) {
        const target = e.target;
        
        if (target.classList.contains('producto-select')) {
            const row = target.closest('tr');
            const precioInput = row.querySelector('.precio-producto');
            
            // Simular obtención de precio según producto seleccionado
            if (target.value) {
                const precios = {
                    '1': 10500.00,
                    '2': 5200.00,
                    '3': 1200.00
                };
                precioInput.value = precios[target.value] || 0;
            } else {
                precioInput.value = 0;
            }
            
            calcularSubtotalFila(row);
            calcularTotales();
        } else if (target.classList.contains('cantidad-producto') || target.classList.contains('precio-producto')) {
            const row = target.closest('tr');
            calcularSubtotalFila(row);
            calcularTotales();
        }
    });
    
    // Calcular descuento cuando cambia el porcentaje
    descuentoPorcentaje.addEventListener('input', function() {
        calcularTotales();
    });
    
    // Función para mostrar el formulario
    function mostrarFormulario() {
        listadoCompras.style.display = 'none';
        formularioCompra.style.display = 'block';
    }
    
    // Función para mostrar el listado
    function mostrarListado() {
        formularioCompra.style.display = 'none';
        listadoCompras.style.display = 'block';
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
    
    // Función para calcular subtotal de una fila
    function calcularSubtotalFila(fila) {
        const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
        const precio = parseFloat(fila.querySelector('.precio-producto').value) || 0;
        const subtotal = cantidad * precio;
        
        fila.querySelector('.subtotal-producto').textContent = formatearNumero(subtotal);
    }
    
    // Función para calcular totales
    function calcularTotales() {
        // Calcular subtotal
        let subtotal = 0;
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        
        filas.forEach(fila => {
            const subtotalTexto = fila.querySelector('.subtotal-producto').textContent;
            subtotal += parseFloat(subtotalTexto.replace(/,/g, '')) || 0;
        });
        
        // Mostrar subtotal
        subtotalCompra.textContent = formatearNumero(subtotal);
        
        // Calcular descuento
        const porcentajeDescuento = parseFloat(descuentoPorcentaje.value) || 0;
        const montoDescuento = subtotal * (porcentajeDescuento / 100);
        descuentoMonto.value = formatearNumero(montoDescuento);
        
        // Calcular base imponible e impuestos
        const baseImponible = subtotal - montoDescuento;
        const impuestos = baseImponible * 0.18; // 18% de impuestos
        impuestosCompra.textContent = formatearNumero(impuestos);
        
        // Calcular total
        const total = baseImponible + impuestos;
        totalCompra.textContent = formatearNumero(total);
    }
    
    // Función para editar una compra
    function editarCompra(id) {
        // Simular carga de datos
        mostrarFormulario();
        resetearFormulario();
        
        tituloFormulario.textContent = `Editar Compra #${id}`;
        compraIdInput.value = id;
        
        // Simular datos de la compra
        if (id === '1') {
            document.getElementById('fechaCompra').value = '2025-03-15';
            document.getElementById('numeroFactura').value = 'F-12345';
            document.getElementById('proveedor').value = '1';
            document.getElementById('condicionPago').value = 'contado';
            document.getElementById('observaciones').value = 'Compra de equipos informáticos';
            
            // Agregar productos
            agregarFilaProducto();
            const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
            
            // Producto 1
            filas[0].querySelector('.producto-select').value = '1';
            filas[0].querySelector('.cantidad-producto').value = '2';
            filas[0].querySelector('.precio-producto').value = '10500.00';
            calcularSubtotalFila(filas[0]);
            
            // Producto 2
            agregarFilaProducto();
            filas[1].querySelector('.producto-select').value = '2';
            filas[1].querySelector('.cantidad-producto').value = '1';
            filas[1].querySelector('.precio-producto').value = '5200.00';
            calcularSubtotalFila(filas[1]);
            
            descuentoPorcentaje.value = '5';
        } else if (id === '2') {
            document.getElementById('fechaCompra').value = '2025-03-14';
            document.getElementById('numeroFactura').value = 'F-9876';
            document.getElementById('proveedor').value = '2';
            document.getElementById('condicionPago').value = 'credito30';
            document.getElementById('observaciones').value = 'Compra de suministros de oficina';
            
            // Agregar productos
            agregarFilaProducto();
            const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
            
            // Producto 1
            filas[0].querySelector('.producto-select').value = '3';
            filas[0].querySelector('.cantidad-producto').value = '15';
            filas[0].querySelector('.precio-producto').value = '1200.00';
            calcularSubtotalFila(filas[0]);
            
            descuentoPorcentaje.value = '0';
        }
        
        calcularTotales();
    }
    
    // Función para ver detalle de una compra
    function verDetalleCompra(id) {
        // Simular visualización de detalle (en este caso, igual que editar pero con campos deshabilitados)
        editarCompra(id);
        
        // Deshabilitar campos
        const inputs = document.querySelectorAll('#compraForm input, #compraForm select, #compraForm textarea');
        inputs.forEach(input => {
            input.setAttribute('disabled', 'disabled');
        });
        
        // Cambiar título y botones
        tituloFormulario.textContent = `Detalle de Compra #${id}`;
        document.getElementById('guardarCompraBtn').style.display = 'none';
        
        // Mostrar notificación
        showNotification('Detalle de compra', `Visualizando detalle de la compra #${id}`);
    }
    
    // Función para validar el formulario
    function validarFormulario() {
        // Validar campos obligatorios
        if (!document.getElementById('fechaCompra').value) return false;
        if (!document.getElementById('numeroFactura').value) return false;
        if (!document.getElementById('proveedor').value) return false;
        if (!document.getElementById('condicionPago').value) return false;
        
        // Validar que haya al menos un producto
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        if (filas.length === 0) return false;
        
        // Validar que todos los productos tengan datos completos
        let productosValidos = true;
        filas.forEach(fila => {
            const producto = fila.querySelector('.producto-select').value;
            const cantidad = fila.querySelector('.cantidad-producto').value;
            const precio = fila.querySelector('.precio-producto').value;
            
            if (!producto || !cantidad || !precio || cantidad <= 0 || precio <= 0) {
                productosValidos = false;
            }
        });
        
        return productosValidos;
    }
    
    // Función para resetear el formulario
    function resetearFormulario() {
        compraForm.reset();
        document.getElementById('fechaCompra').valueAsDate = new Date();
        
        // Limpiar tabla de productos
        const tbody = document.querySelector('#detalleProductosTable tbody');
        const filas = tbody.querySelectorAll('tr:not([style="display: none;"])');
        filas.forEach(fila => {
            if (fila.id !== 'filaPlantilla') {
                fila.remove();
            }
        });
        
        // Habilitar campos
        const inputs = document.querySelectorAll('#compraForm input, #compraForm select, #compraForm textarea');
        inputs.forEach(input => {
            input.removeAttribute('disabled');
        });
        
        // Mostrar botón guardar
        document.getElementById('guardarCompraBtn').style.display = '';
        
        // Resetear totales
        subtotalCompra.textContent = '0.00';
        descuentoPorcentaje.value = '0';
        descuentoMonto.value = '0.00';
        impuestosCompra.textContent = '0.00';
        totalCompra.textContent = '0.00';
    }
    
    // Función para verificar si hay datos en el formulario
    function hayDatosEnFormulario() {
        if (document.getElementById('numeroFactura').value) return true;
        if (document.getElementById('proveedor').value) return true;
        if (document.getElementById('observaciones').value) return true;
        
        // Verificar si hay productos con datos
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        let hayDatos = false;
        
        filas.forEach(fila => {
            const producto = fila.querySelector('.producto-select').value;
            if (producto) {
                hayDatos = true;
            }
        });
        
        return hayDatos;
    }
    
    // Función para mostrar confirmación
    function mostrarConfirmacion(mensaje, accionTexto, callback) {
        confirmMessage.textContent = mensaje;
        confirmActionBtn.textContent = accionTexto;
        
        if (callback) {
            elementToDelete = callback;
        }
        
        confirmModal.classList.add('show');
    }
    
    // Función para agregar compra a la tabla (simulado)
    function agregarCompraATabla() {
        const tbody = document.querySelector('#comprasTable tbody');
        const nuevaFila = document.createElement('tr');
        
        // Obtener último ID y aumentarlo en 1
        const filas = tbody.querySelectorAll('tr');
        const ultimoId = filas.length > 0 ? parseInt(filas[filas.length - 1].cells[1].textContent) : 0;
        const nuevoId = ultimoId + 1;
        
        // Obtener datos del formulario
        const fecha = document.getElementById('fechaCompra').value;
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES');
        const numeroFactura = document.getElementById('numeroFactura').value;
        const proveedorSelect = document.getElementById('proveedor');
        const proveedor = proveedorSelect.options[proveedorSelect.selectedIndex].text;
        const total = document.getElementById('totalCompra').textContent;
        
        // Crear contenido de la fila
        nuevaFila.innerHTML = `
            <td>
                <label class="checkbox-container">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${nuevoId}</td>
            <td>${fechaFormateada}</td>
            <td>${proveedor}</td>
            <td>${numeroFactura}</td>
            <td>${total}</td>
            <td><span class="badge warning">Pendiente</span></td>
            <td>
                <div class="row-actions">
                    <button class="icon-btn edit-btn" title="Editar" data-id="${nuevoId}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn view-btn" title="Ver detalles" data-id="${nuevoId}">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="icon-btn danger delete-btn" title="Eliminar" data-id="${nuevoId}">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
        `;
        
        tbody.insertBefore(nuevaFila, tbody.firstChild);
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
            notification.style.borderLeftColor = 'var(--danger)';
            toastIcon.style.color = 'var(--danger)';
        } else {
            toastIcon.textContent = 'check_circle';
            notification.style.borderLeftColor = 'var(--success)';
            toastIcon.style.color = 'var(--success)';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
});