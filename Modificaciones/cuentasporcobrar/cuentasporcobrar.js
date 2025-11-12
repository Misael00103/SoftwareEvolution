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
    const registrarPagoRapidoBtn = document.getElementById('registrarPagoRapidoBtn');
    const verReportesBtn = document.getElementById('verReportesBtn');
    const enviarRecordatorioBtn = document.getElementById('enviarRecordatorioBtn');
    const exportarExcelBtn = document.getElementById('exportarExcelBtn');
    const detailModal = document.getElementById('detailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const detailContent = document.getElementById('detailContent');
    const pageInfo = document.querySelector('.page-info');
    const pagination = document.querySelector('.pagination');
    let elementToDelete = null;
    let deleteType = null;
    let currentPage = 1;
    const itemsPerPage = 4;

    document.getElementById('fechaFactura').valueAsDate = new Date();

    function switchView(hideView, showView) {
        if (!hideView || !showView) return;
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
        const toastIcon = notification.querySelector('.toast-icon i');
        notification.querySelector('.toast-title').textContent = 'Exportación';
        notification.querySelector('.toast-message').textContent = 'Exportando datos a Excel...';
        notification.style.borderLeftColor = 'var(--info)';
        if (toastIcon) {
            toastIcon.setAttribute('data-feather', 'info');
            feather.replace();
        }
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
        setTimeout(() => {
            notification.querySelector('.toast-title').textContent = 'Exportación completada';
            notification.querySelector('.toast-message').textContent = 'Los datos han sido exportados correctamente';
            notification.style.borderLeftColor = 'var(--success)';
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'check-circle');
                feather.replace();
            }
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

    if (volverListadoPagoBtn) {
        volverListadoPagoBtn.addEventListener('click', function() {
            if (!pagoForm) return;
            const inputs = pagoForm.querySelectorAll('input, select, textarea');
            const hasData = Array.from(inputs).some(input => {
                const value = input.value.trim();
                return value !== '' && value !== '0.00' && value !== '0';
            });
            
            if (hasData) {
                if (confirmMessage) {
                    confirmMessage.textContent = '¿Está seguro que desea volver al listado? Los cambios no guardados se perderán.';
                }
                if (confirmActionBtn) {
                    confirmActionBtn.textContent = 'Volver';
                }
                elementToDelete = function() {
                    switchView(formularioPago, listadoCuentas);
                    if (pagoForm) pagoForm.reset();
                    document.getElementById('pagoFecha').valueAsDate = new Date();
                };
                if (confirmModal) {
                    confirmModal.classList.add('show');
                }
            } else {
                switchView(formularioPago, listadoCuentas);
                if (pagoForm) pagoForm.reset();
                if (document.getElementById('pagoFecha')) {
                    document.getElementById('pagoFecha').valueAsDate = new Date();
                }
            }
        });
    }

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
            const toastIcon = notification.querySelector('.toast-icon i');
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'alert-circle');
                feather.replace();
            }
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            return;
        }
        guardarCuentaBtn.disabled = true;
        guardarCuentaBtn.innerHTML = '<i data-feather="save"></i> Guardando...';
        feather.replace();
        setTimeout(() => {
            guardarCuentaBtn.disabled = false;
            guardarCuentaBtn.innerHTML = '<i data-feather="save"></i> Guardar Cuenta';
            feather.replace();
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
                            <button class="icon-button payment-btn" title="Registrar pago" data-id="${numCuentas}" ${estado === 'pagada' ? 'disabled' : ''}><i data-feather="dollar-sign"></i></button>
                            <button class="icon-button edit-btn" title="Editar" data-id="${numCuentas}"><i data-feather="edit"></i></button>
                            <button class="icon-button view-btn" title="Ver detalles" data-id="${numCuentas}"><i data-feather="eye"></i></button>
                            <button class="icon-button delete-btn" title="Eliminar" data-id="${numCuentas}"><i data-feather="trash-2"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(fila);
                feather.replace();
                updatePagination();
                notification.querySelector('.toast-title').textContent = 'Cuenta guardada';
                notification.querySelector('.toast-message').textContent = 'La cuenta ha sido guardada correctamente';
            }
            notification.style.borderLeftColor = 'var(--success)';
            const toastIcon = notification.querySelector('.toast-icon i');
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'check-circle');
                feather.replace();
            }
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
            const toastIcon = notification.querySelector('.toast-icon i');
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'alert-circle');
                feather.replace();
            }
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            return;
        }
        guardarPagoBtn.disabled = true;
        guardarPagoBtn.innerHTML = '<i data-feather="save"></i> Guardando...';
        feather.replace();
        setTimeout(() => {
            guardarPagoBtn.disabled = false;
            guardarPagoBtn.innerHTML = '<i data-feather="dollar-sign"></i> Registrar Pago';
            feather.replace();
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
            const toastIcon = notification.querySelector('.toast-icon i');
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'check-circle');
                feather.replace();
            }
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
            const toastIcon = notification.querySelector('.toast-icon i');
            if (toastIcon) {
                toastIcon.setAttribute('data-feather', 'check-circle');
                feather.replace();
            }
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
            updatePagination();
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

    // Funciones para acciones rápidas
    function showNotification(title, message, type = 'success') {
        const toastTitle = notification.querySelector('.toast-title');
        const toastMessage = notification.querySelector('.toast-message');
        const toastIcon = notification.querySelector('.toast-icon i');
        
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;
        
        if (toastIcon) {
            if (type === 'error') {
                toastIcon.setAttribute('data-feather', 'alert-circle');
                notification.style.borderLeftColor = 'var(--danger)';
            } else if (type === 'info') {
                toastIcon.setAttribute('data-feather', 'info');
                notification.style.borderLeftColor = 'var(--primary)';
            } else {
                toastIcon.setAttribute('data-feather', 'check-circle');
                notification.style.borderLeftColor = 'var(--success)';
            }
            feather.replace();
        }
        
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    }

    // Botón Registrar Pago Rápido
    if (registrarPagoRapidoBtn) {
        registrarPagoRapidoBtn.addEventListener('click', function() {
            const tbody = document.querySelector('#cuentasTable tbody');
            const rows = tbody.querySelectorAll('tr');
            let hasPendiente = false;
            
            rows.forEach(row => {
                const estadoCell = row.cells[8];
                if (estadoCell && estadoCell.textContent.trim().toLowerCase() === 'pendiente') {
                    hasPendiente = true;
                }
            });
            
            if (!hasPendiente) {
                showNotification('Información', 'No hay cuentas pendientes para registrar pago', 'info');
                return;
            }
            
            // Abrir el formulario de pago sin cuenta específica
            switchView(listadoCuentas, formularioPago);
            const pagoIdCuenta = document.getElementById('pagoIdCuenta');
            const pagoCliente = document.getElementById('pagoCliente');
            const pagoFactura = document.getElementById('pagoFactura');
            const pagoMontoTotal = document.getElementById('pagoMontoTotal');
            const pagoMontoPendiente = document.getElementById('pagoMontoPendiente');
            const pagoFecha = document.getElementById('pagoFecha');
            
            if (pagoIdCuenta) pagoIdCuenta.value = '';
            if (pagoCliente) pagoCliente.value = '';
            if (pagoFactura) pagoFactura.value = '';
            if (pagoMontoTotal) pagoMontoTotal.value = '';
            if (pagoMontoPendiente) pagoMontoPendiente.value = '';
            if (pagoFecha) pagoFecha.valueAsDate = new Date();
            
            // Asegurar que el botón de volver esté disponible
            if (volverListadoPagoBtn) {
                volverListadoPagoBtn.style.display = '';
            }
            
            showNotification('Registrar Pago', 'Seleccione una cuenta de la lista o complete el formulario', 'info');
        });
    }

    // Botón Ver Reportes
    if (verReportesBtn) {
        verReportesBtn.addEventListener('click', function() {
            showNotification('Reportes', 'Generando reportes de cuentas por cobrar...', 'info');
            setTimeout(() => {
                showNotification('Reportes', 'Los reportes se han generado correctamente', 'success');
            }, 1500);
        });
    }

    // Botón Enviar Recordatorio
    if (enviarRecordatorioBtn) {
        enviarRecordatorioBtn.addEventListener('click', function() {
            const tbody = document.querySelector('#cuentasTable tbody');
            const rows = tbody.querySelectorAll('tr');
            let cuentasVencidas = 0;
            
            rows.forEach(row => {
                const estadoCell = row.cells[8];
                if (estadoCell && estadoCell.textContent.trim().toLowerCase() === 'vencida') {
                    cuentasVencidas++;
                }
            });
            
            if (cuentasVencidas === 0) {
                showNotification('Información', 'No hay cuentas vencidas para enviar recordatorio', 'info');
                return;
            }
            
            showNotification('Recordatorio', `Enviando recordatorios a ${cuentasVencidas} cliente(s)...`, 'info');
            setTimeout(() => {
                showNotification('Recordatorio', `Se han enviado ${cuentasVencidas} recordatorio(s) correctamente`, 'success');
            }, 1500);
        });
    }

    // Botón Exportar a Excel
    if (exportarExcelBtn) {
        exportarExcelBtn.addEventListener('click', function() {
            // Función para exportar a Excel
            const table = document.getElementById('cuentasTable');
            const rows = table.querySelectorAll('tr');
            let csvContent = 'No.,Cliente,Factura,Fecha,Vencimiento,Monto,Pagado,Pendiente,Estado\n';
            
            rows.forEach((row, index) => {
                if (index === 0) return; // Saltar el encabezado
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    const rowData = Array.from(cells).map(cell => {
                        let text = cell.textContent.trim();
                        // Remover el badge del estado
                        if (cell.querySelector('.badge')) {
                            text = cell.querySelector('.badge').textContent.trim();
                        }
                        // Escapar comillas y envolver en comillas si contiene comas
                        text = text.replace(/"/g, '""');
                        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                            text = `"${text}"`;
                        }
                        return text;
                    });
                    csvContent += rowData.join(',') + '\n';
                }
            });
            
            // Crear y descargar el archivo
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `cuentas_por_cobrar_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Exportación', 'Los datos han sido exportados a Excel correctamente', 'success');
        });
    }

    // Cerrar modal de detalles
    if (closeDetailModal) {
        closeDetailModal.addEventListener('click', function() {
            if (detailModal) {
                detailModal.classList.remove('show');
            }
        });
    }

    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            if (detailModal) {
                detailModal.classList.remove('show');
            }
        });
    }

    // Cerrar modal al hacer clic fuera
    if (detailModal) {
        detailModal.addEventListener('click', function(e) {
            if (e.target === detailModal) {
                detailModal.classList.remove('show');
            }
        });
    }

    // Función para actualizar la paginación
    function updatePagination() {
        const table = document.getElementById('cuentasTable');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalItems = rows.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Actualizar información de página
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        if (pageInfo) {
            pageInfo.textContent = `Mostrando ${start}-${end} de ${totalItems} registros`;
        }
        
        // Mostrar/ocultar filas según la página actual
        rows.forEach((row, index) => {
            const pageNumber = Math.floor(index / itemsPerPage) + 1;
            if (pageNumber === currentPage) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Actualizar botones de paginación
        if (pagination) {
            const pageButtons = pagination.querySelectorAll('.page-btn');
            const prevBtn = pageButtons[0];
            const nextBtn = pageButtons[pageButtons.length - 1];
            const numberButtons = Array.from(pageButtons).slice(1, -1);
            
            // Actualizar botón anterior
            if (prevBtn) {
                prevBtn.disabled = currentPage === 1;
            }
            
            // Actualizar botón siguiente
            if (nextBtn) {
                nextBtn.disabled = currentPage === totalPages || totalPages === 0;
            }
            
            // Actualizar números de página
            numberButtons.forEach((btn, index) => {
                const pageNum = index + 1;
                if (pageNum <= totalPages) {
                    btn.textContent = pageNum;
                    btn.classList.toggle('active', pageNum === currentPage);
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                }
            });
            
            // Agregar más botones si hay más páginas
            if (totalPages > 3) {
                // Mantener solo 3 botones visibles alrededor de la página actual
                numberButtons.forEach((btn, index) => {
                    const pageNum = index + 1;
                    if (pageNum < currentPage - 1 || pageNum > currentPage + 1) {
                        if (pageNum !== 1 && pageNum !== totalPages) {
                            btn.style.display = 'none';
                        }
                    }
                });
            }
        }
    }

    // Event listeners para botones de paginación
    if (pagination) {
        pagination.addEventListener('click', function(e) {
            const target = e.target.closest('.page-btn');
            if (!target || target.disabled) return;
            
            const table = document.getElementById('cuentasTable');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const totalPages = Math.ceil(rows.length / itemsPerPage);
            
            if (target.textContent.trim() === '') {
                // Es un botón de flecha
                const isNext = target.querySelector('i[data-feather="chevron-right"]');
                if (isNext && currentPage < totalPages) {
                    currentPage++;
                } else if (!isNext && currentPage > 1) {
                    currentPage--;
                }
            } else {
                // Es un botón de número
                const pageNum = parseInt(target.textContent.trim());
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    currentPage = pageNum;
                }
            }
            
            updatePagination();
            feather.replace();
        });
    }

    // Inicializar paginación
    updatePagination();

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
            // Mostrar detalles en un modal
            const cliente = row.cells[1].textContent;
            const factura = row.cells[2].textContent;
            const fecha = row.cells[3].textContent;
            const vencimiento = row.cells[4].textContent;
            const monto = row.cells[5].textContent;
            const pagado = row.cells[6].textContent;
            const pendiente = row.cells[7].textContent;
            const estado = row.cells[8].textContent.trim();
            
            detailContent.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <strong>Número de Cuenta:</strong>
                        <p>#${cuentaId}</p>
                    </div>
                    <div>
                        <strong>Cliente:</strong>
                        <p>${cliente}</p>
                    </div>
                    <div>
                        <strong>Número de Factura:</strong>
                        <p>${factura}</p>
                    </div>
                    <div>
                        <strong>Fecha:</strong>
                        <p>${fecha}</p>
                    </div>
                    <div>
                        <strong>Fecha de Vencimiento:</strong>
                        <p>${vencimiento}</p>
                    </div>
                    <div>
                        <strong>Estado:</strong>
                        <p>${estado}</p>
                    </div>
                    <div>
                        <strong>Monto Total:</strong>
                        <p style="font-size: 1.125rem; font-weight: 600; color: var(--primary);">${monto}</p>
                    </div>
                    <div>
                        <strong>Monto Pagado:</strong>
                        <p style="font-size: 1.125rem; font-weight: 600; color: var(--success);">${pagado}</p>
                    </div>
                    <div>
                        <strong>Monto Pendiente:</strong>
                        <p style="font-size: 1.125rem; font-weight: 600; color: var(--warning);">${pendiente}</p>
                    </div>
                </div>
            `;
            
            if (detailModal) {
                detailModal.classList.add('show');
                feather.replace();
            }
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