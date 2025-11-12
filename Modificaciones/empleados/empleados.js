document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los iconos de Feather
    feather.replace();

    // Elementos del DOM
    const employeeListView = document.getElementById('employeeListView');
    const employeeFormView = document.getElementById('employeeFormView');
    const employeeList = document.getElementById('employeeList');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const backBtn = document.getElementById('backBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formHeaderTitle = document.getElementById('formHeaderTitle');
    const employeeId = document.getElementById('employeeId');
    const employeeDate = document.getElementById('employeeDate');
    const employeeDateList = document.getElementById('employeeDateList');
    const employeeForm = document.getElementById('employeeForm');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDialogBtn = document.getElementById('cancelDialogBtn');
    const closeDialogBtn = document.getElementById('closeDialogBtn');
    const confirmMessage = document.getElementById('confirmMessage');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const closeToastBtn = document.getElementById('closeToastBtn');

    // Manejo de tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Datos simulados de empleados (en un entorno real, esto vendría de una API o base de datos)
    let employees = [
        { id: 'EMP0001', name: 'Juan Pérez', department: 'Ventas', phone: '809-555-1234', status: 'Activo' },
        { id: 'EMP0002', name: 'María Gómez', department: 'TI', phone: '809-555-5678', status: 'Activo' }
    ];

    let currentEmployeeId = null;

    // Función para mostrar la lista de empleados
    function renderEmployeeList() {
        employeeList.innerHTML = '';
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="ID Empleado">${employee.id}</td>
                <td data-label="Nombre">${employee.name}</td>
                <td data-label="Departamento">${employee.department}</td>
                <td data-label="Teléfono">${employee.phone}</td>
                <td data-label="Estado">${employee.status}</td>
                <td data-label="Acciones">
                    <button class="edit-btn" data-id="${employee.id}">
                        <i data-feather="edit"></i>
                    </button>
                    <button class="btn-danger" data-id="${employee.id}">
                        <i data-feather="trash-2"></i>
                    </button>
                </td>
            `;
            employeeList.appendChild(row);
        });

        // Reemplazar íconos de Feather después de renderizar
        feather.replace();

        // Añadir eventos a los botones de edición y eliminación
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editEmployee(btn.dataset.id));
        });

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => showConfirmDialog(btn.dataset.id));
        });
    }

    // Función para cambiar de vista
    function switchView(fromView, toView) {
        if (fromView) {
            fromView.classList.remove('active');
            fromView.style.display = 'none';
        }
        if (toView) {
            toView.classList.add('active');
            toView.style.display = 'block';
        }
    }

    // Función para limpiar el formulario
    function resetForm() {
        if (employeeForm) {
            employeeForm.reset();
        }
        if (formHeaderTitle) formHeaderTitle.textContent = 'Nuevo Empleado';
        currentEmployeeId = null;
        if (employeeId) employeeId.textContent = generateEmployeeId();
    }

    // Función para generar un ID de empleado
    function generateEmployeeId() {
        const lastId = employees.length ? employees[employees.length - 1].id : 'EMP0000';
        const number = parseInt(lastId.replace('EMP', '')) + 1;
        return `EMP${number.toString().padStart(4, '0')}`;
    }

    // Función para actualizar la fecha y hora
    function updateDateTime() {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        if (employeeDateList) employeeDateList.textContent = formattedDate;
        if (employeeDate) employeeDate.textContent = formattedDate;
    }

    // Función para mostrar el formulario para agregar un nuevo empleado
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            resetForm();
            updateDateTime();
            switchView(employeeListView, employeeFormView);
        });
    }

    // Función para volver a la lista desde el formulario
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView(employeeFormView, employeeListView);
        });
    }

    // Función para cancelar la edición/creación
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            switchView(employeeFormView, employeeListView);
        });
    }

    // Función para guardar un empleado
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const employeeName = document.getElementById('employeeName').value;
            const employeeLastName = document.getElementById('employeeLastName').value;
            const department = document.getElementById('department').value;
            const phone = document.getElementById('phone').value;
            const status = document.getElementById('status').value;

            if (!employeeName) {
                showToast('Por favor, ingrese el nombre del empleado.');
                return;
            }

            const employeeData = {
                id: currentEmployeeId || generateEmployeeId(),
                name: `${employeeName} ${employeeLastName}`.trim(),
                department: department || '',
                phone: phone || '',
                status: status || 'Activo'
            };

            if (currentEmployeeId) {
                // Actualizar empleado existente
                const index = employees.findIndex(emp => emp.id === currentEmployeeId);
                employees[index] = employeeData;
                showToast('Empleado actualizado con éxito.');
            } else {
                // Agregar nuevo empleado
                employees.push(employeeData);
                showToast('Empleado agregado con éxito.');
            }

            renderEmployeeList();
            switchView(employeeFormView, employeeListView);
        });
    }

    // Función para editar un empleado
    function editEmployee(id) {
        const employee = employees.find(emp => emp.id === id);
        if (!employee) return;

        currentEmployeeId = id;
        if (formHeaderTitle) formHeaderTitle.textContent = 'Editar Empleado';
        if (employeeId) employeeId.textContent = id;
        updateDateTime();

        // Separar el nombre completo en nombre y apellido (si es posible)
        const nameParts = employee.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Llenar el formulario con los datos del empleado
        const employeeNameEl = document.getElementById('employeeName');
        const employeeLastNameEl = document.getElementById('employeeLastName');
        const departmentEl = document.getElementById('department');
        const phoneEl = document.getElementById('phone');
        const statusEl = document.getElementById('status');

        if (employeeNameEl) employeeNameEl.value = firstName;
        if (employeeLastNameEl) employeeLastNameEl.value = lastName;
        if (departmentEl) departmentEl.value = employee.department || '';
        if (phoneEl) phoneEl.value = employee.phone || '';
        if (statusEl) statusEl.value = employee.status || 'Activo';

        switchView(employeeListView, employeeFormView);
    }

    // Función para mostrar el diálogo de confirmación
    function showConfirmDialog(id) {
        currentEmployeeId = id;
        if (confirmMessage) {
            confirmMessage.textContent = `¿Estás seguro de que deseas eliminar este empleado (${id})?`;
        }
        if (confirmDialog) {
            confirmDialog.classList.add('show');
        }
    }

    // Función para cerrar el diálogo de confirmación
    function closeConfirmDialog() {
        if (confirmDialog) {
            confirmDialog.classList.remove('show');
        }
        currentEmployeeId = null;
    }

    // Eventos del diálogo de confirmación
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentEmployeeId) {
                employees = employees.filter(emp => emp.id !== currentEmployeeId);
                renderEmployeeList();
                showToast('Empleado eliminado con éxito.');
                closeConfirmDialog();
            }
        });
    }

    if (cancelDialogBtn) {
        cancelDialogBtn.addEventListener('click', closeConfirmDialog);
    }
    if (closeDialogBtn) {
        closeDialogBtn.addEventListener('click', closeConfirmDialog);
    }

    // Función para mostrar notificaciones toast
    function showToast(message) {
        if (toastMessage) toastMessage.textContent = message;
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Cerrar toast manualmente
    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', () => {
            if (toast) {
                toast.classList.remove('show');
            }
        });
    }

    // Inicializar la fecha y hora
    updateDateTime();
    // Actualizar cada minuto
    setInterval(updateDateTime, 60000);

    // Inicializar la lista de empleados
    renderEmployeeList();
});