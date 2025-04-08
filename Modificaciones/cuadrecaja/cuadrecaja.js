document.addEventListener('DOMContentLoaded', function() {
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
                    <button class="icon-btn edit-btn" data-index="${index}"><span class="material-icons">edit</span></button>
                    <button class="icon-btn btn-danger" data-index="${index}"><span class="material-icons">delete</span></button>
                </td>
            `;
            cuadreList.appendChild(row);
        });
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
        formTitle.textContent = 'Editar Cuadre de Caja';
        cuadreId.textContent = cuadre.id;
        document.getElementById('fecha').value = cuadre.fecha;
        document.getElementById('sucursal').value = cuadre.sucursal;
        document.getElementById('cajero').value = cuadre.cajero;
        cantidadInputs.forEach(input => {
            const valor = input.parentElement.parentElement.getAttribute('data-valor');
            input.value = cuadre.efectivo[valor] || 0;
        });
        ventaContadoInput.value = cuadre.ventaContado.toFixed(2);
        cobrosRealizadosInput.value = cuadre.cobrosRealizados.toFixed(2);
        otrosIngresosInput.value = cuadre.otrosIngresos.toFixed(2);
        notasCreditoInput.value = cuadre.notasCredito.toFixed(2);
        totalChequesInput.value = cuadre.totalCheques.toFixed(2);
        totalTarjetaInput.value = cuadre.totalTarjeta.toFixed(2);
        totalTransferenciaInput.value = cuadre.totalTransferencia.toFixed(2);
        calcularSubtotales();
        calcularTotalEfectivo();
        calcularTotalResumen();
        calcularSobranteFaltante();
        switchView(cuadreFormView, cuadreListView);
    }

    // Resetear formulario
    function resetForm() {
        formTitle.textContent = 'Nuevo Cuadre de Caja';
        cuadreId.textContent = `CUADRE${String(cuadres.length + 1).padStart(4, '0')}`;
        document.getElementById('fecha').valueAsDate = new Date();
        document.getElementById('sucursal').value = 'LOS PEPINES';
        document.getElementById('cajero').value = 'SOFTWARE EVOLUTION ARPA SRL';
        cantidadInputs.forEach(input => input.value = 0);
        subtotalCells.forEach(cell => cell.textContent = '0.00');
        totalEfectivoCell.textContent = '0.00';
        ventaContadoInput.value = '0.00';
        cobrosRealizadosInput.value = '0.00';
        otrosIngresosInput.value = '0.00';
        notasCreditoInput.value = '0.00';
        totalResumenInput.value = '0.00';
        totalChequesInput.value = '0.00';
        totalTarjetaInput.value = '0.00';
        totalTransferenciaInput.value = '0.00';
        sobranteFaltanteInput.value = '0.00';
        sobranteFaltanteInput.style.color = 'var(--text)';
        sobranteFaltanteInput.style.backgroundColor = '';
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

    obtenerValoresBtn.addEventListener('click', () => {
        ventaContadoInput.value = (Math.random() * 10000).toFixed(2);
        cobrosRealizadosInput.value = (Math.random() * 5000).toFixed(2);
        otrosIngresosInput.value = (Math.random() * 1000).toFixed(2);
        notasCreditoInput.value = (Math.random() * 500).toFixed(2);
        totalChequesInput.value = (Math.random() * 3000).toFixed(2);
        totalTarjetaInput.value = (Math.random() * 4000).toFixed(2);
        totalTransferenciaInput.value = (Math.random() * 2000).toFixed(2);
        calcularTotalResumen();
        calcularSobranteFaltante();
        showNotification('Valores obtenidos', 'Se han cargado los valores del sistema correctamente');
    });

    document.getElementById('cuadreForm').addEventListener('submit', (e) => {
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

    cancelarBtn.addEventListener('click', () => {
        showModal('¿Está seguro de que desea cancelar este cuadre de caja?', () => {
            resetForm();
            switchView(cuadreListView, cuadreFormView);
        });
    });

    backBtn.addEventListener('click', () => {
        showModal('¿Está seguro de que desea volver sin guardar?', () => {
            switchView(cuadreListView, cuadreFormView);
        });
    });

    printBtn.addEventListener('click', () => {
        const originalTitle = document.title;
        const fecha = document.getElementById('fecha').value;
        const sucursal = document.getElementById('sucursal').value;
        document.title = `Cuadre de Caja - ${sucursal} - ${fecha}`;
        window.print();
        setTimeout(() => document.title = originalTitle, 100);
    });

    notificationCloseBtn.addEventListener('click', () => {
        notification.classList.remove('show');
    });

    modalCloseBtn.addEventListener('click', hideModal);
    modalCancelBtn.addEventListener('click', hideModal);
    modalConfirmBtn.addEventListener('click', () => {
        if (modalCallback) modalCallback();
        hideModal();
    });

    addCuadreBtn.addEventListener('click', () => {
        resetForm();
        switchView(cuadreFormView, cuadreListView);
    });

    // Inicialización
    cuadreListView.classList.add('active');
    cuadreFormView.classList.remove('active');
    renderCuadreList();
});