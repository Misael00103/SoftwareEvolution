document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    // Referencias a elementos del DOM
    const cuadreListView = document.getElementById('cuadreListView');
    const cuadreFormView = document.getElementById('cuadreFormView');
    const addCuadreBtn = document.getElementById('addCuadreBtn');
    const backBtn = document.getElementById('backBtn');
    const cuadreList = document.getElementById('cuadreList');
    const formTitle = document.getElementById('formTitle');
    const cuadreId = document.getElementById('cuadreId');
    const cantidadInputs = document.querySelectorAll('.cantidad-input');
    const subtotalCells = document.querySelectorAll('.subtotal');
    const totalEfectivoCell = document.getElementById('totalEfectivo');
    const ventaContadoInput = document.getElementById('ventaContado');
    const cobrosRealizadosInput = document.getElementById('cobrosRealizados');
    const otrosIngresosInput = document.getElementById('otrosIngresos');
    const notasCreditoInput = document.getElementById('notasCredito');
    const totalResumenInput = document.getElementById('totalResumen');
    const totalChequesInput = document.getElementById('totalCheques');
    const totalTarjetaInput = document.getElementById('totalTarjeta');
    const totalTransferenciaInput = document.getElementById('totalTransferencia');
    const sobranteFaltanteInput = document.getElementById('sobranteFaltante');
    const obtenerValoresBtn = document.getElementById('obtenerValoresBtn');
    const aceptarBtn = document.getElementById('aceptarBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const printBtn = document.getElementById('printBtn');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    const confirmModal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');

    // Datos iniciales
    let cuadres = [
        {
            id: 'CUADRE0001',
            fecha: '2025-04-08',
            sucursal: 'LOS PEPINES',
            cajero: 'SOFTWARE EVOLUTION ARPA SRL',
            efectivo: { '1': 10, '5': 5, '10': 0, '20': 0, '50': 0, '100': 0, '500': 0, '1000': 0, '2000': 0 },
            totalEfectivo: 35.00,
            ventaContado: 100.00,
            cobrosRealizados: 50.00,
            otrosIngresos: 0.00,
            notasCredito: 10.00,
            totalResumen: 140.00,
            totalCheques: 0.00,
            totalTarjeta: 0.00,
            totalTransferencia: 0.00,
            sobranteFaltante: -105.00
        }
    ];
    let isEditing = false;
    let editIndex = null;
    let modalCallback = null;

    // Funciones de utilidad
    function switchView(viewToShow, viewToHide) {
        viewToHide.classList.remove('active');
        viewToShow.classList.add('active');
    }

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
        setTimeout(() => notification.classList.remove('show'), 5000);
    }

    function showModal(message, callback) {
        modalMessage.textContent = message;
        modalCallback = callback;
        confirmModal.classList.add('active');
    }

    function hideModal() {
        confirmModal.classList.remove('active');
        modalCallback = null;
    }

    // Renderizar lista de cuadres
    function renderCuadreList() {
        cuadreList.innerHTML = '';
        cuadres.forEach((cuadre, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="ID Cuadre">${cuadre.id}</td>
                <td data-label="Fecha">${cuadre.fecha}</td>
                <td data-label="Sucursal">${cuadre.sucursal}</td>
                <td data-label="Cajero">${cuadre.cajero}</td>
                <td data-label="Total Efectivo">${formatearNumero(cuadre.totalEfectivo)}</td>
                <td data-label="Sobrante/Faltante">${formatearNumero(cuadre.sobranteFaltante)}</td>
                <td data-label="Acciones">
                    <button class="icon-btn edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                    <button class="icon-btn btn-danger" data-index="${index}"><i data-feather="trash-2"></i></button>
                </td>
            `;
            cuadreList.appendChild(row);
        });
        feather.replace(); // Re-renderizar iconos Feather
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                editCuadre(index);
            });
        });
        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                showModal('¿Está seguro de que desea eliminar este cuadre?', () => {
                    cuadres.splice(index, 1);
                    renderCuadreList();
                    showNotification('Cuadre eliminado', 'El cuadre de caja ha sido eliminado correctamente');
                });
            });
        });
    }

    // Editar cuadre
    function editCuadre(index) {
        isEditing = true;
        editIndex = index;
        const cuadre = cuadres[index];
        if (formTitle) formTitle.textContent = 'Editar Cuadre de Caja';
        if (cuadreId) cuadreId.textContent = cuadre.id;
        const fecha = document.getElementById('fecha');
        if (fecha) fecha.value = cuadre.fecha;
        const sucursal = document.getElementById('sucursal');
        if (sucursal) sucursal.value = cuadre.sucursal;
        const cajero = document.getElementById('cajero');
        if (cajero) cajero.value = cuadre.cajero;
        cantidadInputs.forEach(input => {
            if (input && input.parentElement && input.parentElement.parentElement) {
                const valor = input.parentElement.parentElement.getAttribute('data-valor');
                if (valor) input.value = cuadre.efectivo[valor] || 0;
            }
        });
        if (ventaContadoInput) ventaContadoInput.value = cuadre.ventaContado.toFixed(2);
        if (cobrosRealizadosInput) cobrosRealizadosInput.value = cuadre.cobrosRealizados.toFixed(2);
        if (otrosIngresosInput) otrosIngresosInput.value = cuadre.otrosIngresos.toFixed(2);
        if (notasCreditoInput) notasCreditoInput.value = cuadre.notasCredito.toFixed(2);
        if (totalChequesInput) totalChequesInput.value = cuadre.totalCheques.toFixed(2);
        if (totalTarjetaInput) totalTarjetaInput.value = cuadre.totalTarjeta.toFixed(2);
        if (totalTransferenciaInput) totalTransferenciaInput.value = cuadre.totalTransferencia.toFixed(2);
        calcularSubtotales();
        calcularTotalEfectivo();
        calcularTotalResumen();
        calcularSobranteFaltante();
        switchView(cuadreFormView, cuadreListView);
    }

    // Resetear formulario
    function resetForm() {
        if (formTitle) formTitle.textContent = 'Nuevo Cuadre de Caja';
        if (cuadreId) cuadreId.textContent = `CUADRE${String(cuadres.length + 1).padStart(4, '0')}`;
        const fecha = document.getElementById('fecha');
        if (fecha) fecha.valueAsDate = new Date();
        const sucursal = document.getElementById('sucursal');
        if (sucursal) sucursal.value = 'LOS PEPINES';
        const cajero = document.getElementById('cajero');
        if (cajero) cajero.value = 'SOFTWARE EVOLUTION ARPA SRL';
        cantidadInputs.forEach(input => {
            if (input) input.value = 0;
        });
        subtotalCells.forEach(cell => {
            if (cell) cell.textContent = '0.00';
        });
        if (totalEfectivoCell) totalEfectivoCell.textContent = '0.00';
        if (ventaContadoInput) ventaContadoInput.value = '0.00';
        if (cobrosRealizadosInput) cobrosRealizadosInput.value = '0.00';
        if (otrosIngresosInput) otrosIngresosInput.value = '0.00';
        if (notasCreditoInput) notasCreditoInput.value = '0.00';
        if (totalResumenInput) totalResumenInput.value = '0.00';
        if (totalChequesInput) totalChequesInput.value = '0.00';
        if (totalTarjetaInput) totalTarjetaInput.value = '0.00';
        if (totalTransferenciaInput) totalTransferenciaInput.value = '0.00';
        if (sobranteFaltanteInput) {
            sobranteFaltanteInput.value = '0.00';
            sobranteFaltanteInput.style.color = 'var(--text)';
            sobranteFaltanteInput.style.backgroundColor = '';
        }
        isEditing = false;
        editIndex = null;
    }

    // Calcular subtotales
    function calcularSubtotales() {
        const filas = document.querySelectorAll('#denominacionesTable tbody tr');
        filas.forEach(fila => {
            const valor = parseFloat(fila.getAttribute('data-valor'));
            const cantidad = parseInt(fila.querySelector('.cantidad-input').value) || 0;
            const subtotal = valor * cantidad;
            fila.querySelector('.subtotal').textContent = formatearNumero(subtotal);
        });
    }

    // Calcular total efectivo
    function calcularTotalEfectivo() {
        let total = 0;
        subtotalCells.forEach(cell => {
            total += parseFloat(cell.textContent.replace(/,/g, '')) || 0;
        });
        totalEfectivoCell.textContent = formatearNumero(total);
    }

    // Calcular total resumen
    function calcularTotalResumen() {
        const ventaContado = parseFloat(ventaContadoInput.value) || 0;
        const cobrosRealizados = parseFloat(cobrosRealizadosInput.value) || 0;
        const otrosIngresos = parseFloat(otrosIngresosInput.value) || 0;
        const notasCredito = parseFloat(notasCreditoInput.value) || 0;
        const total = ventaContado + cobrosRealizados + otrosIngresos - notasCredito;
        totalResumenInput.value = formatearNumero(total);
    }

    // Calcular sobrante/faltante
    function calcularSobranteFaltante() {
        const totalEfectivo = parseFloat(totalEfectivoCell.textContent.replace(/,/g, '')) || 0;
        const totalResumen = parseFloat(totalResumenInput.value.replace(/,/g, '')) || 0;
        const totalCheques = parseFloat(totalChequesInput.value) || 0;
        const totalTarjeta = parseFloat(totalTarjetaInput.value) || 0;
        const totalTransferencia = parseFloat(totalTransferenciaInput.value) || 0;
        const totalMediosPago = totalEfectivo + totalCheques + totalTarjeta + totalTransferencia;
        const diferencia = totalMediosPago - totalResumen;
        sobranteFaltanteInput.value = formatearNumero(diferencia);
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

    // Formatear números
    function formatearNumero(numero) {
        return new Intl.NumberFormat('es-DO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    // Validar formulario
    function validarFormulario() {
        if (!document.getElementById('fecha').value) return false;
        if (!document.getElementById('sucursal').value) return false;
        if (!document.getElementById('cajero').value) return false;
        return true;
    }

    // Eventos
    cantidadInputs.forEach(input => {
        input.addEventListener('input', () => {
            calcularSubtotales();
            calcularTotalEfectivo();
            calcularSobranteFaltante();
        });
    });

    [ventaContadoInput, cobrosRealizadosInput, otrosIngresosInput, notasCreditoInput].forEach(input => {
        input.addEventListener('input', () => {
            calcularTotalResumen();
            calcularSobranteFaltante();
        });
    });

    [totalChequesInput, totalTarjetaInput, totalTransferenciaInput].forEach(input => {
        input.addEventListener('input', calcularSobranteFaltante);
    });

    if (obtenerValoresBtn) {
        obtenerValoresBtn.addEventListener('click', () => {
            if (ventaContadoInput) ventaContadoInput.value = (Math.random() * 10000).toFixed(2);
            if (cobrosRealizadosInput) cobrosRealizadosInput.value = (Math.random() * 5000).toFixed(2);
            if (otrosIngresosInput) otrosIngresosInput.value = (Math.random() * 1000).toFixed(2);
            if (notasCreditoInput) notasCreditoInput.value = (Math.random() * 500).toFixed(2);
            if (totalChequesInput) totalChequesInput.value = (Math.random() * 3000).toFixed(2);
            if (totalTarjetaInput) totalTarjetaInput.value = (Math.random() * 4000).toFixed(2);
            if (totalTransferenciaInput) totalTransferenciaInput.value = (Math.random() * 2000).toFixed(2);
            calcularTotalResumen();
            calcularSobranteFaltante();
            showNotification('Valores obtenidos', 'Se han cargado los valores del sistema correctamente');
        });
    }

    const cuadreForm = document.getElementById('cuadreForm');
    if (cuadreForm) {
        cuadreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validarFormulario()) {
            showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
            return;
        }
        const efectivo = {};
        cantidadInputs.forEach(input => {
            const valor = input.parentElement.parentElement.getAttribute('data-valor');
            efectivo[valor] = parseInt(input.value) || 0;
        });
        const newCuadre = {
            id: cuadreId.textContent,
            fecha: document.getElementById('fecha').value,
            sucursal: document.getElementById('sucursal').value,
            cajero: document.getElementById('cajero').value,
            efectivo: efectivo,
            totalEfectivo: parseFloat(totalEfectivoCell.textContent.replace(/,/g, '')),
            ventaContado: parseFloat(ventaContadoInput.value),
            cobrosRealizados: parseFloat(cobrosRealizadosInput.value),
            otrosIngresos: parseFloat(otrosIngresosInput.value),
            notasCredito: parseFloat(notasCreditoInput.value),
            totalResumen: parseFloat(totalResumenInput.value.replace(/,/g, '')),
            totalCheques: parseFloat(totalChequesInput.value),
            totalTarjeta: parseFloat(totalTarjetaInput.value),
            totalTransferencia: parseFloat(totalTransferenciaInput.value),
            sobranteFaltante: parseFloat(sobranteFaltanteInput.value.replace(/,/g, ''))
        };
        if (isEditing) {
            cuadres[editIndex] = newCuadre;
            showNotification('Cuadre actualizado', 'El cuadre de caja ha sido actualizado correctamente');
        } else {
            cuadres.push(newCuadre);
            showNotification('Cuadre guardado', 'El cuadre de caja ha sido guardado correctamente');
        }
        renderCuadreList();
        switchView(cuadreListView, cuadreFormView);
        });
    }

    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', () => {
            showModal('¿Está seguro de que desea cancelar este cuadre de caja?', () => {
                resetForm();
                switchView(cuadreListView, cuadreFormView);
            });
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showModal('¿Está seguro de que desea volver sin guardar?', () => {
                switchView(cuadreListView, cuadreFormView);
            });
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            const originalTitle = document.title;
            const fecha = document.getElementById('fecha');
            const sucursal = document.getElementById('sucursal');
            if (fecha && sucursal) {
                document.title = `Cuadre de Caja - ${sucursal.value} - ${fecha.value}`;
                window.print();
                setTimeout(() => document.title = originalTitle, 100);
            }
        });
    }

    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', () => {
            if (notification) {
                notification.classList.remove('show');
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', hideModal);
    }
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            if (modalCallback) modalCallback();
            hideModal();
        });
    }

    if (addCuadreBtn) {
        addCuadreBtn.addEventListener('click', () => {
            resetForm();
            switchView(cuadreFormView, cuadreListView);
        });
    }

    // Inicialización
    if (cuadreListView) {
        cuadreListView.classList.add('active');
    }
    if (cuadreFormView) {
        cuadreFormView.classList.remove('active');
    }
    renderCuadreList();
});