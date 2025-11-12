document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    const listadoCuentas = document.getElementById('listadoCuentas');
    const formularioCuenta = document.getElementById('formularioCuenta');
    const formularioPago = document.getElementById('formularioPago');
    const tituloFormulario = document.getElementById('tituloFormulario');
    const cuentaForm = document.getElementById('cuentaForm');
    const pagoForm = document.getElementById('pagoForm');
    const cuentaIdInput = document.getElementById('cuentaId');
    const nuevaCuentaBtn = document.getElementById('nuevaCuentaBtn');
    const volverListadoBtn = document.getElementById('volverListadoBtn');
    const volverListadoPagoBtn = document.getElementById('volverListadoPagoBtn');
    const agregarPagoBtn = document.getElementById('agregarPagoBtn');
    const guardarCuentaBtn = document.getElementById('guardarCuentaBtn');
    const cancelarCuentaBtn = document.getElementById('cancelarCuentaBtn');
    const guardarPagoBtn = document.getElementById('guardarPagoBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');
    const printButton = document.getElementById('printButton');
    const imprimirListadoBtn = document.getElementById('imprimirListadoBtn');
    const exportarBtn = document.getElementById('exportarBtn');
    const totalPagado = document.getElementById('totalPagado');
    const totalPendiente = document.getElementById('totalPendiente');
    const estadoCuenta = document.getElementById('estadoCuenta');
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    let elementToDelete = null;
    let deleteType = null;

    document.getElementById('fechaFactura').valueAsDate = new Date();

    function switchView(hideView, showView) {
        hideView.classList.remove('active');
        hideView.style.display = 'none';
        showView.classList.add('active');
        showView.style.display = 'block';
        feather.replace();
    }

    nuevaCuentaBtn.addEventListener('click', function() {
        switchView(listadoCuentas, formularioCuenta);
        cuentaForm.reset();
        document.getElementById('fechaFactura').valueAsDate = new Date();
        document.querySelector('#detallePagosTable tbody').innerHTML = '';
        totalPagado.value = '0.00';
        totalPendiente.value = '0.00';
        estadoCuenta.value = 'pendiente';
        tituloFormulario.textContent = 'Nueva Cuenta por Cobrar';
        cuentaIdInput.value = '';
    });

    printButton.addEventListener('click', function() {
        window.print();
    });

    imprimirListadoBtn.addEventListener('click', function() {
        window.print();
    });

    exportarBtn.addEventListener('click', function() {
        notification.querySelector('.toast-title').textContent = 'Exportación';
        notification.querySelector('.toast-message').textContent = 'Exportando datos a Excel...';
        notification.style.borderLeftColor = 'var(--info)';
        notification.querySelector('.toast-icon .material-icons').textContent = 'info';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
        setTimeout(() => {
            notification.querySelector('.toast-title').textContent = 'Exportación completada';
            notification.querySelector('.toast-message').textContent = 'Los datos han sido exportados correctamente';
            notification.style.borderLeftColor = 'var(--success)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'check_circle';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
        }, 1500);
    });

    volverListadoBtn.addEventListener('click', function() {
        const inputs = cuentaForm.querySelectorAll('input, select, textarea');
        if (Array.from(inputs).some(input => input.value !== '' && input.value !== '0.00')) {
            confirmMessage.textContent = '¿Está seguro que desea volver al listado? Los cambios no guardados se perderán.';
            confirmActionBtn.textContent = 'Volver';
            elementToDelete = function() {
                switchView(formularioCuenta, listadoCuentas);
                cuentaForm.reset();
                document.getElementById('fechaFactura').valueAsDate = new Date();
                document.querySelector('#detallePagosTable tbody').innerHTML = '';
                totalPagado.value = '0.00';
                totalPendiente.value = '0.00';
                estadoCuenta.value = 'pendiente';
            };
            confirmModal.classList.add('show');
        } else {
            switchView(formularioCuenta, listadoCuentas);
            cuentaForm.reset();
            document.getElementById('fechaFactura').valueAsDate = new Date();
            document.querySelector('#detallePagosTable tbody').innerHTML = '';
            totalPagado.value = '0.00';
            totalPendiente.value = '0.00';
            estadoCuenta.value = 'pendiente';
        }
    });

    volverListadoPagoBtn.addEventListener('click', function() {
        const inputs = pagoForm.querySelectorAll('input, select, textarea');
        if (Array.from(inputs).some(input => input.value !== '' && input.value !== '0.00')) {
            confirmMessage.textContent = '¿Está seguro que desea volver al listado? Los cambios no guardados se perderán.';
            confirmActionBtn.textContent = 'Volver';
            elementToDelete = function() {
                switchView(formularioPago, listadoCuentas);
                pagoForm.reset();
            };
            confirmModal.classList.add('show');
        } else {
            switchView(formularioPago, listadoCuentas);
            pagoForm.reset();
        }
    });

    agregarPagoBtn.addEventListener('click', function() {
        const tbody = document.querySelector('#detallePagosTable tbody');
        const fila = document.createElement('tr');
        const numFilas = tbody.children.length + 1;
        fila.innerHTML = `
            <td class="numero-fila">${numFilas}</td>
            <td><input type="date" class="fecha-pago" required></td>
            <td><select class="metodo-pago" required><option value="">Seleccionar método</option><option value="efectivo">Efectivo</option><option value="transferencia">Transferencia</option><option value="cheque">Cheque</option><option value="tarjeta">Tarjeta</option></select></td>
            <td><input type="text" class="referencia-pago" placeholder="No. Referencia"></td>
            <td><input type="number" class="monto-pago" min="0" step="0.01" value="0.00" required></td>
            <td><button type="button" class="icon-button eliminar-fila" title="Eliminar"><i data-feather="trash-2"></i></button></td>
        `;
        tbody.appendChild(fila);
        feather.replace();
    });

    cuentaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const requiredInputs = cuentaForm.querySelectorAll('[required]');
        if (!Array.from(requiredInputs).every(input => input.value.trim() !== '')) {
            notification.querySelector('.toast-title').textContent = 'Error';
            notification.querySelector('.toast-message').textContent = 'Por favor complete todos los campos requeridos';
            notification.style.borderLeftColor = 'var(--danger)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'error';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            return;
        }
        guardarCuentaBtn.disabled = true;
        guardarCuentaBtn.innerHTML = '<span class="material-icons">save</span> Guardando...';
        setTimeout(() => {
            guardarCuentaBtn.disabled = false;
            guardarCuentaBtn.innerHTML = 'Guardar Cuenta';
            const cliente = document.getElementById('cliente').options[document.getElementById('cliente').selectedIndex].text;
            const factura = document.getElementById('numeroFactura').value;
            const fecha = document.getElementById('fechaFactura').value;
            const vencimiento = document.getElementById('fechaVencimiento').value;
            const monto = parseFloat(document.getElementById('montoTotal').value).toFixed(2);
            const pagado = parseFloat(totalPagado.value).toFixed(2);
            const pendiente = parseFloat(totalPendiente.value).toFixed(2);
            const estado = estadoCuenta.value;
            if (cuentaIdInput.value) {
                notification.querySelector('.toast-title').textContent = 'Cuenta actualizada';
                notification.querySelector('.toast-message').textContent = 'La cuenta ha sido actualizada correctamente';
            } else {
                const tbody = document.querySelector('#cuentasTable tbody');
                const numCuentas = tbody.children.length + 1;
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${numCuentas}</td>
                    <td>${cliente}</td>
                    <td>${factura}</td>
                    <td>${fecha}</td>
                    <td>${vencimiento}</td>
                    <td>${monto}</td>
                    <td>${pagado}</td>
                    <td>${pendiente}</td>
                    <td><span class="badge ${estado === 'pagada' ? 'success' : estado === 'vencida' ? 'danger' : 'warning'}">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="icon-button payment-btn" title="Registrar pago" data-id="${numCuentas}" ${estado === 'pagada' ? 'disabled' : ''}><span class="material-icons">payments</span></button>
                            <button class="icon-button edit-btn" title="Editar" data-id="${numCuentas}"><span class="material-icons">edit</span></button>
                            <button class="icon-button view-btn" title="Ver detalles" data-id="${numCuentas}"><span class="material-icons">visibility</span></button>
                            <button class="icon-button delete-btn" title="Eliminar" data-id="${numCuentas}"><span class="material-icons">delete</span></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(fila);
                notification.querySelector('.toast-title').textContent = 'Cuenta guardada';
                notification.querySelector('.toast-message').textContent = 'La cuenta ha sido guardada correctamente';
            }
            notification.style.borderLeftColor = 'var(--success)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'check_circle';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            switchView(formularioCuenta, listadoCuentas);
            cuentaForm.reset();
            document.getElementById('fechaFactura').valueAsDate = new Date();
            document.querySelector('#detallePagosTable tbody').innerHTML = '';
            totalPagado.value = '0.00';
            totalPendiente.value = '0.00';
            estadoCuenta.value = 'pendiente';
        }, 1500);
    });

    cancelarCuentaBtn.addEventListener('click', function() {
        const inputs = cuentaForm.querySelectorAll('input, select, textarea');
        if (Array.from(inputs).some(input => input.value !== '' && input.value !== '0.00')) {
            confirmMessage.textContent = '¿Está seguro que desea cancelar esta cuenta? Los cambios no guardados se perderán.';
            confirmActionBtn.textContent = 'Cancelar';
            elementToDelete = function() {
                switchView(formularioCuenta, listadoCuentas);
                cuentaForm.reset();
                document.getElementById('fechaFactura').valueAsDate = new Date();
                document.querySelector('#detallePagosTable tbody').innerHTML = '';
                totalPagado.value = '0.00';
                totalPendiente.value = '0.00';
                estadoCuenta.value = 'pendiente';
            };
            confirmModal.classList.add('show');
        } else {
            switchView(formularioCuenta, listadoCuentas);
            cuentaForm.reset();
            document.getElementById('fechaFactura').valueAsDate = new Date();
            document.querySelector('#detallePagosTable tbody').innerHTML = '';
            totalPagado.value = '0.00';
            totalPendiente.value = '0.00';
            estadoCuenta.value = 'pendiente';
        }
    });

    pagoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const requiredInputs = pagoForm.querySelectorAll('[required]');
        if (!Array.from(requiredInputs).every(input => input.value.trim() !== '')) {
            notification.querySelector('.toast-title').textContent = 'Error';
            notification.querySelector('.toast-message').textContent = 'Por favor complete todos los campos requeridos';
            notification.style.borderLeftColor = 'var(--danger)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'error';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            return;
        }
        guardarPagoBtn.disabled = true;
        guardarPagoBtn.innerHTML = '<span class="material-icons">save</span> Guardando...';
        setTimeout(() => {
            guardarPagoBtn.disabled = false;
            guardarPagoBtn.innerHTML = 'Registrar Pago';
            const montoPago = parseFloat(document.getElementById('pagoMonto').value);
            const cuentaId = document.getElementById('pagoIdCuenta').value;
            const row = document.querySelector(`#cuentasTable tbody tr td:nth-child(10) button[data-id="${cuentaId}"]`).closest('tr');
            const pagadoActual = parseFloat(row.cells[6].textContent.replace(',', ''));
            const montoTotal = parseFloat(row.cells[5].textContent.replace(',', ''));
            const nuevoPagado = pagadoActual + montoPago;
            row.cells[6].textContent = nuevoPagado.toFixed(2);
            row.cells[7].textContent = (montoTotal - nuevoPagado).toFixed(2);
            row.cells[8].innerHTML = `<span class="badge ${nuevoPagado >= montoTotal ? 'success' : 'warning'}">${nuevoPagado >= montoTotal ? 'Pagada' : 'Pendiente'}</span>`;
            if (nuevoPagado >= montoTotal) row.querySelector('.payment-btn').disabled = true;
            notification.querySelector('.toast-title').textContent = 'Pago registrado';
            notification.querySelector('.toast-message').textContent = 'El pago ha sido registrado correctamente';
            notification.style.borderLeftColor = 'var(--success)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'check_circle';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            switchView(formularioPago, listadoCuentas);
            pagoForm.reset();
        }, 1500);
    });

    cancelarPagoBtn.addEventListener('click', function() {
        const inputs = pagoForm.querySelectorAll('input, select, textarea');
        if (Array.from(inputs).some(input => input.value !== '' && input.value !== '0.00')) {
            confirmMessage.textContent = '¿Está seguro que desea cancelar este pago? Los cambios no guardados se perderán.';
            confirmActionBtn.textContent = 'Cancelar';
            elementToDelete = function() {
                switchView(formularioPago, listadoCuentas);
                pagoForm.reset();
            };
            confirmModal.classList.add('show');
        } else {
            switchView(formularioPago, listadoCuentas);
            pagoForm.reset();
        }
    });

    [closeConfirmModal, cancelConfirmBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            confirmModal.classList.remove('show');
        });
    });

    confirmActionBtn.addEventListener('click', function() {
        confirmModal.classList.remove('show');
        if (deleteType === 'cuenta' && elementToDelete) {
            elementToDelete.remove();
            notification.querySelector('.toast-title').textContent = 'Cuenta eliminada';
            notification.querySelector('.toast-message').textContent = 'La cuenta ha sido eliminada correctamente';
            notification.style.borderLeftColor = 'var(--success)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'check_circle';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            elementToDelete = null;
        } else if (deleteType === 'pago' && elementToDelete) {
            elementToDelete.remove();
            const filas = document.querySelectorAll('#detallePagosTable tbody tr');
            filas.forEach((fila, index) => fila.querySelector('.numero-fila').textContent = index + 1);
            let total = 0;
            document.querySelectorAll('.monto-pago').forEach(input => total += parseFloat(input.value) || 0);
            const montoTotal = parseFloat(document.getElementById('montoTotal').value) || 0;
            totalPagado.value = total.toFixed(2);
            totalPendiente.value = (montoTotal - total).toFixed(2);
            estadoCuenta.value = total >= montoTotal ? 'pagada' : new Date(document.getElementById('fechaVencimiento').value) < new Date() ? 'vencida' : 'pendiente';
        } else if (typeof elementToDelete === 'function') {
            elementToDelete();
            elementToDelete = null;
        }
    });

    notificationCloseBtn.addEventListener('click', function() {
        notification.classList.remove('show');
    });

    document.getElementById('cuentasTable').addEventListener('click', function(e) {
        const target = e.target.closest('.icon-button');
        if (!target) return;
        const row = target.closest('tr');
        const cuentaId = target.getAttribute('data-id');
        if (target.classList.contains('edit-btn')) {
            switchView(listadoCuentas, formularioCuenta);
            tituloFormulario.textContent = `Editar Cuenta #${cuentaId}`;
            cuentaIdInput.value = cuentaId;
            document.getElementById('cliente').value = Array.from(document.getElementById('cliente').options).find(opt => opt.text === row.cells[1].textContent).value;
            document.getElementById('numeroFactura').value = row.cells[2].textContent;
            document.getElementById('fechaFactura').value = row.cells[3].textContent;
            document.getElementById('fechaVencimiento').value = row.cells[4].textContent;
            document.getElementById('montoTotal').value = row.cells[5].textContent.replace(',', '');
            totalPagado.value = row.cells[6].textContent.replace(',', '');
            totalPendiente.value = row.cells[7].textContent.replace(',', '');
            estadoCuenta.value = row.cells[8].textContent.toLowerCase();
            document.querySelector('#detallePagosTable tbody').innerHTML = '';
        } else if (target.classList.contains('view-btn')) {
            notification.querySelector('.toast-title').textContent = 'Ver detalle';
            notification.querySelector('.toast-message').textContent = `Mostrando detalles de la cuenta #${cuentaId}`;
            notification.style.borderLeftColor = 'var(--info)';
            notification.querySelector('.toast-icon .material-icons').textContent = 'info';
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
        } else if (target.classList.contains('delete-btn')) {
            elementToDelete = row;
            deleteType = 'cuenta';
            confirmMessage.textContent = `¿Está seguro que desea eliminar la cuenta #${cuentaId}?`;
            confirmActionBtn.textContent = 'Eliminar';
            confirmModal.classList.add('show');
        } else if (target.classList.contains('payment-btn')) {
            switchView(listadoCuentas, formularioPago);
            document.getElementById('pagoIdCuenta').value = cuentaId;
            document.getElementById('pagoCliente').value = row.cells[1].textContent;
            document.getElementById('pagoFactura').value = row.cells[2].textContent;
            document.getElementById('pagoMontoTotal').value = row.cells[5].textContent;
            document.getElementById('pagoMontoPendiente').value = row.cells[7].textContent;
            document.getElementById('pagoFecha').valueAsDate = new Date();
        }
    });

    document.getElementById('detallePagosTable').addEventListener('click', function(e) {
        const target = e.target.closest('.icon-button');
        if (!target || !target.classList.contains('eliminar-fila')) return;
        const row = target.closest('tr');
        elementToDelete = row;
        deleteType = 'pago';
        confirmMessage.textContent = '¿Está seguro que desea eliminar este pago?';
        confirmActionBtn.textContent = 'Eliminar';
        confirmModal.classList.add('show');
    });

    document.getElementById('detallePagosTable').addEventListener('change', function(e) {
        const target = e.target;
        if (target.classList.contains('monto-pago')) {
            let total = 0;
            document.querySelectorAll('.monto-pago').forEach(input => total += parseFloat(input.value) || 0);
            const montoTotal = parseFloat(document.getElementById('montoTotal').value) || 0;
            totalPagado.value = total.toFixed(2);
            totalPendiente.value = (montoTotal - total).toFixed(2);
            estadoCuenta.value = total >= montoTotal ? 'pagada' : new Date(document.getElementById('fechaVencimiento').value) < new Date() ? 'vencida' : 'pendiente';
        }
    });

    document.getElementById('montoTotal').addEventListener('change', function() {
        let total = 0;
        document.querySelectorAll('.monto-pago').forEach(input => total += parseFloat(input.value) || 0);
        const montoTotal = parseFloat(this.value) || 0;
        totalPagado.value = total.toFixed(2);
        totalPendiente.value = (montoTotal - total).toFixed(2);
        estadoCuenta.value = total >= montoTotal ? 'pagada' : new Date(document.getElementById('fechaVencimiento').value) < new Date() ? 'vencida' : 'pendiente';
    });

    document.getElementById('fechaVencimiento').addEventListener('change', function() {
        let total = 0;
        document.querySelectorAll('.monto-pago').forEach(input => total += parseFloat(input.value) || 0);
        const montoTotal = parseFloat(document.getElementById('montoTotal').value) || 0;
        totalPagado.value = total.toFixed(2);
        totalPendiente.value = (montoTotal - total).toFixed(2);
        estadoCuenta.value = total >= montoTotal ? 'pagada' : new Date(this.value) < new Date() ? 'vencida' : 'pendiente';
    });
});