document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const cantidadInputs = document.querySelectorAll('.cantidad-input');
    const subtotalCells = document.querySelectorAll('.subtotal');
    const totalEfectivoCell = document.getElementById('totalEfectivo');
    
    // Referencias a campos de operaciones
    const ventaContadoInput = document.getElementById('ventaContado');
    const cobrosRealizadosInput = document.getElementById('cobrosRealizados');
    const otrosIngresosInput = document.getElementById('otrosIngresos');
    const notasCreditoInput = document.getElementById('notasCredito');
    const totalResumenInput = document.getElementById('totalResumen');
    
    // Referencias a campos de totales
    const totalChequesInput = document.getElementById('totalCheques');
    const totalTarjetaInput = document.getElementById('totalTarjeta');
    const totalTransferenciaInput = document.getElementById('totalTransferencia');
    const sobranteFaltanteInput = document.getElementById('sobranteFaltante');
    
    // Referencias a botones
    const obtenerValoresBtn = document.getElementById('obtenerValoresBtn');
    const aceptarBtn = document.getElementById('aceptarBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const newCuadreBtn = document.getElementById('newCuadreBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Referencias a notificaciones
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    
    // Establecer fecha actual
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Calcular subtotales cuando cambia la cantidad
    cantidadInputs.forEach(input => {
        input.addEventListener('input', function() {
            calcularSubtotales();
            calcularTotalEfectivo();
            calcularSobranteFaltante();
        });
    });
    
    // Calcular totales cuando cambian los valores de operaciones
    [ventaContadoInput, cobrosRealizadosInput, otrosIngresosInput, notasCreditoInput].forEach(input => {
        input.addEventListener('input', function() {
            calcularTotalResumen();
            calcularSobranteFaltante();
        });
    });
    
    // Calcular sobrante/faltante cuando cambian los totales
    [totalChequesInput, totalTarjetaInput, totalTransferenciaInput].forEach(input => {
        input.addEventListener('input', function() {
            calcularSobranteFaltante();
        });
    });
    
    // Botón para obtener valores
    obtenerValoresBtn.addEventListener('click', function() {
        // Simulación de obtener valores del sistema
        ventaContadoInput.value = (Math.random() * 10000).toFixed(2);
        cobrosRealizadosInput.value = (Math.random() * 5000).toFixed(2);
        otrosIngresosInput.value = (Math.random() * 1000).toFixed(2);
        notasCreditoInput.value = (Math.random() * 500).toFixed(2);
        
        calcularTotalResumen();
        
        totalChequesInput.value = (Math.random() * 3000).toFixed(2);
        totalTarjetaInput.value = (Math.random() * 4000).toFixed(2);
        totalTransferenciaInput.value = (Math.random() * 2000).toFixed(2);
        
        calcularSobranteFaltante();
        
        showNotification('Valores obtenidos', 'Se han cargado los valores del sistema correctamente');
    });
    
    // Botón para aceptar el cuadre
    document.getElementById('cuadreForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Aquí iría la lógica para guardar el cuadre
        showNotification('Cuadre guardado', 'El cuadre de caja ha sido guardado correctamente');
        
        // Simular redirección o actualización después de guardar
        const btnAceptar = document.getElementById('aceptarBtn');
        btnAceptar.disabled = true;
        btnAceptar.innerHTML = '<span class="material-icons">check</span> Guardando...';
        
        // Reiniciar formulario después de 1.5 segundos
        setTimeout(() => {
            btnAceptar.disabled = false;
            btnAceptar.innerHTML = '<span class="material-icons">check</span> Aceptar';
            crearNuevoCuadre();
        }, 1500);
    });
    
    // Botón para cancelar
    cancelarBtn.addEventListener('click', function() {
        // Preguntar al usuario si está seguro
        if (confirm('¿Está seguro que desea cancelar este cuadre de caja?')) {
            resetearFormulario();
            showNotification('Operación cancelada', 'Se ha cancelado el cuadre de caja');
        }
    });
    
    // Botón para nuevo cuadre
    newCuadreBtn.addEventListener('click', function() {
        // Si hay datos en el formulario, preguntar antes de resetear
        if (hayDatosEnFormulario()) {
            if (confirm('¿Está seguro que desea crear un nuevo cuadre? Los datos no guardados se perderán.')) {
                crearNuevoCuadre();
            }
        } else {
            crearNuevoCuadre();
        }
    });
    
    // Función para crear un nuevo cuadre
    function crearNuevoCuadre() {
        // Generar un nuevo ID de cuadre (simulado)
        const nuevoId = Math.floor(Math.random() * 10000) + 1;
        
        // Actualizar título del card (opcional)
        const cardTitle = document.querySelector('.card-header h2');
        cardTitle.innerHTML = `<span class="material-icons">account_balance_wallet</span> Cuadre de Caja #${nuevoId}`;
        
        // Resetear el formulario
        resetearFormulario();
        
        // Mostrar notificación
        showNotification('Nuevo cuadre', 'Se ha iniciado un nuevo cuadre de caja');
        
        // Enfocar el primer campo después de fecha
        setTimeout(() => {
            document.getElementById('sucursal').focus();
        }, 100);
    }
    
    // Verificar si hay datos en el formulario
    function hayDatosEnFormulario() {
        // Verificar si hay cantidades de efectivo
        let hayEfectivo = false;
        cantidadInputs.forEach(input => {
            if (parseInt(input.value) > 0) {
                hayEfectivo = true;
            }
        });
        
        // Verificar si hay valores en operaciones
        const hayOperaciones = 
            parseFloat(ventaContadoInput.value) > 0 ||
            parseFloat(cobrosRealizadosInput.value) > 0 ||
            parseFloat(otrosIngresosInput.value) > 0 ||
            parseFloat(notasCreditoInput.value) > 0;
        
        // Verificar si hay valores en otros medios de pago
        const hayOtrosMedios = 
            parseFloat(totalChequesInput.value) > 0 ||
            parseFloat(totalTarjetaInput.value) > 0 ||
            parseFloat(totalTransferenciaInput.value) > 0;
        
        return hayEfectivo || hayOperaciones || hayOtrosMedios;
    }
    
    // Botón para imprimir
    printBtn.addEventListener('click', function() {
        // Preparar para imprimir
        const originalTitle = document.title;
        const fecha = document.getElementById('fecha').value;
        const sucursal = document.getElementById('sucursal').value;
        document.title = `Cuadre de Caja - ${sucursal} - ${fecha}`;
        
        // Imprimir
        window.print();
        
        // Restaurar título
        setTimeout(() => {
            document.title = originalTitle;
        }, 100);
    });
    
    // Cerrar notificación
    notificationCloseBtn.addEventListener('click', function() {
        notification.classList.remove('show');
    });
    
    // Función para calcular subtotales
    function calcularSubtotales() {
        const filas = document.querySelectorAll('#denominacionesTable tbody tr');
        
        filas.forEach(fila => {
            const valor = parseFloat(fila.getAttribute('data-valor'));
            const cantidad = parseInt(fila.querySelector('.cantidad-input').value) || 0;
            const subtotal = valor * cantidad;
            
            fila.querySelector('.subtotal').textContent = formatearNumero(subtotal);
        });
    }
    
    // Función para calcular total efectivo
    function calcularTotalEfectivo() {
        let total = 0;
        const subtotales = document.querySelectorAll('#denominacionesTable tbody .subtotal');
        
        subtotales.forEach(cell => {
            total += parseFloat(cell.textContent.replace(/,/g, '')) || 0;
        });
        
        totalEfectivoCell.textContent = formatearNumero(total);
    }
    
    // Función para calcular total resumen
    function calcularTotalResumen() {
        const ventaContado = parseFloat(ventaContadoInput.value) || 0;
        const cobrosRealizados = parseFloat(cobrosRealizadosInput.value) || 0;
        const otrosIngresos = parseFloat(otrosIngresosInput.value) || 0;
        const notasCredito = parseFloat(notasCreditoInput.value) || 0;
        
        const total = ventaContado + cobrosRealizados + otrosIngresos - notasCredito;
        totalResumenInput.value = formatearNumero(total);
    }
    
    // Función para calcular sobrante/faltante
    function calcularSobranteFaltante() {
        const totalEfectivo = parseFloat(totalEfectivoCell.textContent.replace(/,/g, '')) || 0;
        const totalResumen = parseFloat(totalResumenInput.value.replace(/,/g, '')) || 0;
        const totalCheques = parseFloat(totalChequesInput.value) || 0;
        const totalTarjeta = parseFloat(totalTarjetaInput.value) || 0;
        const totalTransferencia = parseFloat(totalTransferenciaInput.value) || 0;
        
        const totalMediosPago = totalEfectivo + totalCheques + totalTarjeta + totalTransferencia;
        const diferencia = totalMediosPago - totalResumen;
        
        sobranteFaltanteInput.value = formatearNumero(diferencia);
        
        // Cambiar color según sea sobrante o faltante
        if (diferencia > 0) {
            sobranteFaltanteInput.style.color = 'var(--success)';
            sobranteFaltanteInput.style.backgroundColor = 'var(--success-light)';
        } else if (diferencia < 0) {
            sobranteFaltanteInput.style.color = 'var(--danger)';
            sobranteFaltanteInput.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        } else {
            sobranteFaltanteInput.style.color = 'var(--text)';
            sobranteFaltanteInput.style.backgroundColor = '';
        }
    }
    
    // Función para formatear números con separador de miles
    function formatearNumero(numero) {
        return new Intl.NumberFormat('es-DO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }
    
    // Función para validar el formulario
    function validarFormulario() {
        if (!document.getElementById('fecha').value) return false;
        if (!document.getElementById('sucursal').value) return false;
        if (!document.getElementById('cajero').value) return false;
        
        return true;
    }
    
    // Función para resetear el formulario
    function resetearFormulario() {
        document.getElementById('fecha').valueAsDate = new Date();
        document.getElementById('sucursal').value = 'LOS PEPINES';
        
        // Resetear cantidades
        cantidadInputs.forEach(input => {
            input.value = 0;
        });
        
        // Resetear subtotales
        subtotalCells.forEach(cell => {
            cell.textContent = '0.00';
        });
        
        // Resetear total efectivo
        totalEfectivoCell.textContent = '0.00';
        
        // Resetear campos de operaciones
        ventaContadoInput.value = '0.00';
        cobrosRealizadosInput.value = '0.00';
        otrosIngresosInput.value = '0.00';
        notasCreditoInput.value = '0.00';
        totalResumenInput.value = '0.00';
        
        // Resetear campos de totales
        totalChequesInput.value = '0.00';
        totalTarjetaInput.value = '0.00';
        totalTransferenciaInput.value = '0.00';
        sobranteFaltanteInput.value = '0.00';
        sobranteFaltanteInput.style.color = 'var(--text)';
        sobranteFaltanteInput.style.backgroundColor = '';
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
    
    // Inicializar cálculos
    calcularSubtotales();
    calcularTotalEfectivo();
    calcularTotalResumen();
    calcularSobranteFaltante();
});