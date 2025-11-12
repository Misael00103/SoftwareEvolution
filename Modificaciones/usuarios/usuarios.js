document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  const today = new Date().toISOString().split('T')[0];
  let users = [
      { nombre: "Ana", apellido: "Martínez", cedula: "123456789", direccion: "Calle 123", telefono: "555-1234", celular: "555-5678", nombreusuario: "ana.m", clave: "pass123", departamentoid: 1, almacenid: 2, roleid: 3, fcreado: "2025-01-01", fmodificado: "2025-01-01", activo: true },
      { nombre: "Luis", apellido: "García", cedula: "987654321", direccion: "Avenida 456", telefono: "555-9012", celular: "555-3456", nombreusuario: "luis.g", clave: "pass456", departamentoid: 2, almacenid: 1, roleid: 1, fcreado: "2025-02-01", fmodificado: "2025-02-01", activo: true },
      { nombre: "Sofía", apellido: "Rodríguez", cedula: "456789123", direccion: "Plaza 789", telefono: "555-7890", celular: "555-2345", nombreusuario: "sofia.r", clave: "pass789", departamentoid: 3, almacenid: 3, roleid: 2, fcreado: "2025-03-01", fmodificado: "2025-03-01", activo: false }
  ];
  let isEditing = false;
  let editIndex = null;

  const userListView = document.getElementById('userListView');
  const userFormView = document.getElementById('userFormView');
  const newUserBtn = document.getElementById('newUserBtn');
  const backBtn = document.getElementById('backBtn');
  const form = document.getElementById('userForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmationDetails = document.getElementById('confirmationDetails');
  const closeConfirmDialog = document.getElementById('closeConfirmDialog');
  const cancelConfirmDialog = document.getElementById('cancelConfirmDialog');
  const confirmDialogConfirm = document.getElementById('confirmDialogConfirm');
  const userList = document.getElementById('userList');
  const formTitle = document.getElementById('formTitle');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const passwordInput = document.getElementById('clave');
  const togglePasswordBtn = document.querySelector('.toggle-password');

  function renderUserList() {
      userList.innerHTML = '';
      users.forEach((user, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td data-label="Nombre">${user.nombre}</td>
              <td data-label="Apellido">${user.apellido}</td>
              <td data-label="Cédula">${user.cedula}</td>
              <td data-label="Teléfono">${user.telefono}</td>
              <td data-label="Usuario">${user.nombreusuario}</td>
              <td data-label="Estado">${user.activo ? 'Activo' : 'Inactivo'}</td>
              <td data-label="Acciones">
                  <button class="edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                  <button class="btn-danger" data-index="${index}"><i data-feather="trash-2"></i></button>
              </td>
          `;
          userList.appendChild(row);
      });
      feather.replace();
      document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', (e) => {
              const index = e.currentTarget.getAttribute('data-index');
              editUser(index);
          });
      });
      
      document.querySelectorAll('.btn-danger').forEach(button => {
          button.addEventListener('click', (e) => {
              const index = e.currentTarget.getAttribute('data-index');
              if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
                  users.splice(index, 1);
                  localStorage.setItem('users', JSON.stringify(users));
                  renderUserList();
              }
          });
      });
  }

  function editUser(index) {
      isEditing = true;
      editIndex = index;
      const user = users[index];
      formTitle.innerHTML = '<i data-feather="edit"></i> Editar Usuario';
      feather.replace();
      document.getElementById('nombre').value = user.nombre;
      document.getElementById('apellido').value = user.apellido;
      document.getElementById('cedula').value = user.cedula;
      document.getElementById('direccion').value = user.direccion;
      document.getElementById('telefono').value = user.telefono;
      document.getElementById('celular').value = user.celular || '';
      document.getElementById('nombreusuario').value = user.nombreusuario;
      document.getElementById('clave').value = user.clave;
      document.getElementById('departamentoid').value = user.departamentoid;
      document.getElementById('almacenid').value = user.almacenid;
      document.getElementById('roleid').value = user.roleid;
      document.getElementById('fcreado').value = user.fcreado;
      document.getElementById('fmodificado').value = today;
      document.getElementById('activo').checked = user.activo;
      switchView(userFormView, userListView);
  }

  function switchView(viewToShow, viewToHide) {
      viewToHide.classList.remove('active');
      setTimeout(() => {
          viewToShow.classList.add('active');
      }, 300);
  }

  newUserBtn.addEventListener('click', () => {
      resetForm();
      switchView(userFormView, userListView);
  });

  backBtn.addEventListener('click', () => {
      switchView(userListView, userFormView);
  });

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
          form.reportValidity();
          return;
      }
      const formData = new FormData(form);
      const userData = {
          nombre: formData.get('nombre'),
          apellido: formData.get('apellido'),
          cedula: formData.get('cedula'),
          direccion: formData.get('direccion'),
          telefono: formData.get('telefono'),
          celular: formData.get('celular'),
          nombreusuario: formData.get('nombreusuario'),
          clave: formData.get('clave'),
          departamentoid: formData.get('departamentoid'),
          almacenid: formData.get('almacenid'),
          roleid: formData.get('roleid'),
          fcreado: formData.get('fcreado'),
          fmodificado: formData.get('fmodificado'),
          activo: formData.get('activo') === 'on'
      };
      confirmationDetails.innerHTML = `
          <p><strong>Nombre:</strong> ${userData.nombre}</p>
          <p><strong>Apellido:</strong> ${userData.apellido}</p>
          <p><strong>Cédula:</strong> ${userData.cedula}</p>
          <p><strong>Dirección:</strong> ${userData.direccion}</p>
          <p><strong>Teléfono:</strong> ${userData.telefono}</p>
          <p><strong>Celular:</strong> ${userData.celular || 'N/A'}</p>
          <p><strong>Nombre de Usuario:</strong> ${userData.nombreusuario}</p>
          <p><strong>Clave:</strong> ${userData.clave}</p>
          <p><strong>ID del Departamento:</strong> ${userData.departamentoid}</p>
          <p><strong>ID del Almacén:</strong> ${userData.almacenid}</p>
          <p><strong>ID del Rol:</strong> ${userData.roleid}</p>
          <p><strong>Fecha de Creación:</strong> ${userData.fcreado}</p>
          <p><strong>Fecha de Modificación:</strong> ${userData.fmodificado}</p>
          <p><strong>Activo:</strong> ${userData.activo ? 'Sí' : 'No'}</p>
      `;
      confirmDialog.classList.add('show');
  });

  closeConfirmDialog.addEventListener('click', () => confirmDialog.classList.remove('show'));
  cancelConfirmDialog.addEventListener('click', () => confirmDialog.classList.remove('show'));

  confirmDialogConfirm.addEventListener('click', () => {
      confirmDialog.classList.remove('show');
      const formData = new FormData(form);
      const newUser = {
          nombre: formData.get('nombre'),
          apellido: formData.get('apellido'),
          cedula: formData.get('cedula'),
          direccion: formData.get('direccion'),
          telefono: formData.get('telefono'),
          celular: formData.get('celular'),
          nombreusuario: formData.get('nombreusuario'),
          clave: formData.get('clave'),
          departamentoid: formData.get('departamentoid'),
          almacenid: formData.get('almacenid'),
          roleid: formData.get('roleid'),
          fcreado: formData.get('fcreado'),
          fmodificado: formData.get('fmodificado'),
          activo: formData.get('activo') === 'on'
      };
      if (isEditing) {
          users[editIndex] = newUser;
          toastMessage.textContent = 'Usuario actualizado correctamente';
      } else {
          users.push(newUser);
          toastMessage.textContent = 'Usuario guardado correctamente';
      }
      renderUserList();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span>'; // Solo el spinner
      submitBtn.disabled = true;
      setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          showToast();
          resetForm();
          switchView(userListView, userFormView);
      }, 1500);
  });

  cancelBtn.addEventListener('click', () => {
      resetForm();
      switchView(userListView, userFormView);
  });

  togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      const eyeIcon = togglePasswordBtn.querySelector('i');
      eyeIcon.setAttribute('data-feather', type === 'password' ? 'eye' : 'eye-off');
      feather.replace();
  });

  const inputs = document.querySelectorAll('.input-container input');
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
      formTitle.innerHTML = '<i data-feather="user-plus"></i> Nuevo Usuario';
      feather.replace();
      isEditing = false;
      editIndex = null;
  }

  function showToast() {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
  }

  userListView.classList.add('active');
  userFormView.classList.remove('active');
  renderUserList();
});