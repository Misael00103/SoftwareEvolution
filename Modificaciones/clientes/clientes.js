document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const today = new Date().toISOString().split('T')[0];
    let clients = [
        { nombre: "Juan", apellido: "Pérez", cedula: "123456789", direccion: "Calle 123", telefono: "555-1234", celular: "555-5678", correo: "juan.perez@example.com", tipoCliente: "individual", fcreado: "2025-01-01", fmodificado: "2025-01-01", activo: true },
        { nombre: "María", apellido: "Gómez", cedula: "987654321", direccion: "Avenida 456", telefono: "555-9012", celular: "555-3456", correo: "maria.gomez@example.com", tipoCliente: "empresa", fcreado: "2025-02-01", fmodificado: "2025-02-01", activo: true },
        { nombre: "Carlos", apellido: "López", cedula: "456789123", direccion: "Plaza 789", telefono: "555-7890", celular: "555-2345", correo: "carlos.lopez@example.com", tipoCliente: "individual", fcreado: "2025-03-01", fmodificado: "2025-03-01", activo: false }
    ];
    let isEditing = false;
    let editIndex = null;

    const clientListView = document.getElementById('clientListView');
    const clientFormView = document.getElementById('clientFormView');
    const addClientBtn = document.getElementById('addClientBtn');
    const backBtn = document.getElementById('backBtn');
    const form = document.getElementById('clientForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const closeConfirmDialog = document.getElementById('closeConfirmDialog');
    const cancelConfirmDialog = document.getElementById('cancelConfirmDialog');
    const confirmDialogConfirm = document.getElementById('confirmDialogConfirm');
    const clientList = document.getElementById('clientList');
    const formTitle = document.getElementById('formTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    function renderClientList() {
        clientList.innerHTML = '';
        clients.forEach((client, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Nombre">${client.nombre}</td>
                <td data-label="Apellido">${client.apellido}</td>
                <td data-label="Cédula">${client.cedula}</td>
                <td data-label="Teléfono">${client.telefono}</td>
                <td data-label="Correo">${client.correo}</td>
                <td data-label="Tipo">${client.tipoCliente}</td>
                <td data-label="Estado">${client.activo ? 'Activo' : 'Inactivo'}</td>
                <td data-label="Acciones">
                    <button class="edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                </td>
            `;
            clientList.appendChild(row);
        });
        feather.replace();
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                editClient(index);
            });
        });
    }

    function editClient(index) {
        isEditing = true;
        editIndex = index;
        const client = clients[index];
        formTitle.innerHTML = '<i data-feather="edit"></i> Editar Cliente';
        feather.replace();
        document.getElementById('nombre').value = client.nombre;
        document.getElementById('apellido').value = client.apellido;
        document.getElementById('cedula').value = client.cedula;
        document.getElementById('direccion').value = client.direccion;
        document.getElementById('telefono').value = client.telefono;
        document.getElementById('celular').value = client.celular || '';
        document.getElementById('correo').value = client.correo;
        document.getElementById('tipoCliente').value = client.tipoCliente;
        document.getElementById('fcreado').value = client.fcreado;
        document.getElementById('fmodificado').value = today;
        document.getElementById('activo').checked = client.activo;
        switchView(clientFormView, clientListView);
    }

    function switchView(viewToShow, viewToHide) {
        console.log('Switching from:', viewToHide.id, 'to:', viewToShow.id);
        viewToHide.classList.remove('active');
        setTimeout(() => {
            viewToShow.classList.add('active');
            console.log('View switched, active view:', document.querySelector('.view.active').id);
        }, 300);
    }

    addClientBtn.addEventListener('click', () => {
        resetForm();
        switchView(clientFormView, clientListView);
    });

    backBtn.addEventListener('click', () => {
        switchView(clientListView, clientFormView);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const formData = new FormData(form);
        const clientData = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            cedula: formData.get('cedula'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            celular: formData.get('celular'),
            correo: formData.get('correo'),
            tipoCliente: formData.get('tipoCliente'),
            fcreado: formData.get('fcreado'),
            fmodificado: formData.get('fmodificado'),
            activo: formData.get('activo') === 'on'
        };
        confirmationDetails.innerHTML = `
            <p><strong>Nombre:</strong> ${clientData.nombre}</p>
            <p><strong>Apellido:</strong> ${clientData.apellido}</p>
            <p><strong>Cédula:</strong> ${clientData.cedula}</p>
            <p><strong>Dirección:</strong> ${clientData.direccion}</p>
            <p><strong>Teléfono:</strong> ${clientData.telefono}</p>
            <p><strong>Celular:</strong> ${clientData.celular || 'N/A'}</p>
            <p><strong>Correo:</strong> ${clientData.correo}</p>
            <p><strong>Tipo de Cliente:</strong> ${clientData.tipoCliente}</p>
            <p><strong>Fecha de Creación:</strong> ${clientData.fcreado}</p>
            <p><strong>Fecha de Modificación:</strong> ${clientData.fmodificado}</p>
            <p><strong>Activo:</strong> ${clientData.activo ? 'Sí' : 'No'}</p>
        `;
        confirmDialog.classList.add('show');
    });

    closeConfirmDialog.addEventListener('click', () => confirmDialog.classList.remove('show'));
    cancelConfirmDialog.addEventListener('click', () => confirmDialog.classList.remove('show'));
    confirmDialogConfirm.addEventListener('click', () => {
        confirmDialog.classList.remove('show');
        const formData = new FormData(form);
        const newClient = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            cedula: formData.get('cedula'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            celular: formData.get('celular'),
            correo: formData.get('correo'),
            tipoCliente: formData.get('tipoCliente'),
            fcreado: formData.get('fcreado'),
            fmodificado: formData.get('fmodificado'),
            activo: formData.get('activo') === 'on'
        };
        if (isEditing) {
            clients[editIndex] = newClient;
            toastMessage.textContent = 'Cliente actualizado correctamente';
        } else {
            clients.push(newClient);
            toastMessage.textContent = 'Cliente guardado correctamente';
        }
        renderClientList();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Guardando';
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            showToast();
            resetForm();
            switchView(clientListView, clientFormView);
        }, 1500);
    });

    cancelBtn.addEventListener('click', () => {
        resetForm();
        switchView(clientListView, clientFormView);
    });

    const inputs = document.querySelectorAll('.input-container input, .input-container select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const icon = input.nextElementSibling;
            if (icon && icon.classList.contains('input-icon')) icon.style.color = 'var(--primary)';
        });
        input.addEventListener('blur', () => {
            const icon = input.nextElementSibling;
            if (icon && icon.classList.contains('input-icon') && !input.value) icon.style.color = 'var(--text-secondary)';
        });
    });

    function resetForm() {
        form.reset();
        document.getElementById('fcreado').value = today;
        document.getElementById('fmodificado').value = today;
        document.getElementById('activo').checked = true;
        formTitle.innerHTML = '<i data-feather="user-plus"></i> Nuevo Cliente';
        feather.replace();
        isEditing = false;
        editIndex = null;
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    clientListView.classList.add('active');
    clientFormView.classList.remove('active');
    renderClientList();
});