document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const tituloFormulario = document.getElementById('tituloFormulario');
    const compraForm = document.getElementById('compraForm');
    const compraIdInput = document.getElementById('compraId');
    
    // Botones
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const guardarCompraBtn = document.getElementById('guardarCompraBtn');
    const cancelarCompraBtn = document.getElementById('cancelarCompraBtn');
    
    // Campos de totales
    const totalBruto = document.getElementById('totalBruto');
    const descuento1 = document.getElementById('descuento1');
    const descItems = document.getElementById('descItems');
    const flete = document.getElementById('flete');
    const montoExento = document.getElementById('montoExento');
    const baseImponible = document.getElementById('baseImponible');
    const itbis = document.getElementById('itbis');
    const retencionImp = document.getElementById('retencionImp');
    const retencionISR = document.getElementById('retencionISR');
    const totalNeto = document.getElementById('totalNeto');
    const diferencia = document.getElementById('diferencia');
    
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
    document.getElementById('fechaIngreso').valueAsDate = new Date();
    
    // Agregar primera fila de producto al cargar la página
    agregarFilaProducto();
    
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
            guardarCompraBtn.innerHTML = '<span class="material-icons">save</span> Presentación';
            
            if (compraIdInput.value) {
                showNotification('Compra actualizada', 'La compra ha sido actualizada correctamente');
            } else {
                showNotification('Compra guardada', 'La compra ha sido guardada correctamente');
            }
            
            resetearFormulario();
        }, 1500);
    });
    
    // Cancelar compra
    cancelarCompraBtn.addEventListener('click', function() {
        if (hayDatosEnFormulario()) {
            mostrarConfirmacion(
                '¿Está seguro que desea cancelar esta compra? Los cambios no guardados se perderán.',
                'Cancelar',
                function() {
                    resetearFormulario();
                }
            );
        } else {
            resetearFormulario();
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
        
        if (deleteType === 'fila' && elementToDelete) {
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
    
    // Delegación de eventos para la tabla de productos
    document.getElementById('detalleProductosTable').addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        if (target.classList.contains('eliminar-fila') || target.classList.contains('delete-product-btn')) {
            const row = target.closest('tr') || document.querySelector('#detalleProductosTable tbody tr:last-child:not([style="display: none;"])');
            
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
        
        if (target.classList.contains('cantidad-producto') || target.classList.contains('costo-producto') || target.classList.contains('itbis-producto')) {
            calcularTotales();
        }
    });
    
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
        // Calcular Total Bruto
        let totalBrutoValue = 0;
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        
        filas.forEach(fila => {
            const cantidad = parseInt(fila.querySelector('.cantidad-producto').value) || 0;
            const costo = parseFloat(fila.querySelector('.costo-producto').value) || 0;
            totalBrutoValue += cantidad * costo;
        });
        
        totalBruto.value = formatearNumero(totalBrutoValue);
        
        // Descuento 1 y Desc. Items (simulados como 0 por ahora)
        const descuento1Value = 0;
        const descItemsValue = 0;
        descuento1.value = formatearNumero(descuento1Value);
        descItems.value = formatearNumero(descItemsValue);
        
        // Flete y Monto Exento (simulados como 0 por ahora)
        const fleteValue = 0;
        const montoExentoValue = 0;
        flete.value = formatearNumero(fleteValue);
        montoExento.value = formatearNumero(montoExentoValue);
        
        // Base Imponible
        const baseImponibleValue = totalBrutoValue - descuento1Value - descItemsValue;
        baseImponible.value = formatearNumero(baseImponibleValue);
        
        // ITBIS (18%)
        const itbisValue = baseImponibleValue * 0.18;
        itbis.value = formatearNumero(itbisValue);
        
        // Retención Imp. y Retención ISR (simulados como 0 por ahora)
        const retencionImpValue = 0;
        const retencionISRValue = 0;
        retencionImp.value = formatearNumero(retencionImpValue);
        retencionISR.value = formatearNumero(retencionISRValue);
        
        // Total Neto
        const totalNetoValue = baseImponibleValue + itbisValue - retencionImpValue - retencionISRValue;
        totalNeto.value = formatearNumero(totalNetoValue);
        
        // Diferencia (simulada como 0 por ahora)
        const diferenciaValue = 0;
        diferencia.value = formatearNumero(diferenciaValue);
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
            const cantidad = fila.querySelector('.cantidad-producto').value;
            const costo = fila.querySelector('.costo-producto').value;
            
            if (!referencia || !descripcion || !cantidad || !costo || cantidad <= 0 || costo <= 0) {
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
        const filas = tbody.querySelectorAll('tr:not([style="display: none;"])');
        filas.forEach(fila => {
            if (fila.id !== 'filaPlantilla') {
                fila.remove();
            }
        });
        
        const inputs = document.querySelectorAll('#compraForm input, #compraForm select, #compraForm textarea');
        inputs.forEach(input => {
            input.removeAttribute('disabled');
        });
        
        document.getElementById('guardarCompraBtn').style.display = '';
        
        totalBruto.value = '0.00';
        descuento1.value = '0.00';
        descItems.value = '0.00';
        flete.value = '0.00';
        montoExento.value = '0.00';
        baseImponible.value = '0.00';
        itbis.value = '18.00';
        retencionImp.value = '0.00';
        retencionISR.value = '0.00';
        totalNeto.value = '0.00';
        diferencia.value = '0.00';
        
        // Agregar una fila vacía
        agregarFilaProducto();
    }
    
    // Función para verificar si hay datos en el formulario
    function hayDatosEnFormulario() {
        if (document.getElementById('numeroFactura').value) return true;
        if (document.getElementById('proveedor').value) return true;
        
        const filas = document.querySelectorAll('#detalleProductosTable tbody tr:not([style="display: none;"])');
        let hayDatos = false;
        
        filas.forEach(fila => {
            const referencia = fila.querySelector('.referencia-producto').value;
            if (referencia) {
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