document.addEventListener("DOMContentLoaded", () => {
    feather.replace();

    // Elementos del DOM
    const employeeListView = document.getElementById("employeeListView");
    const employeeFormView = document.getElementById("employeeFormView");
    const addEmployeeBtn = document.getElementById("addEmployeeBtn");
    const backBtn = document.getElementById("backBtn");
    const employeeList = document.getElementById("employeeList");
    const formTitle = document.getElementById("formTitle");
    const employeeId = document.getElementById("employeeId");
    const employeeDate = document.getElementById("employeeDate");
    const employeeDateList = document.getElementById("employeeDateList");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const saveBtn = document.querySelector('[data-action="save"]');
    const exitBtn = document.querySelector('[data-action="exit"]');
    const viewEmployeesBtn = document.querySelector('[data-action="view-employees"]');
    const addEmployeeSideBtn = document.querySelector('[data-action="add-employee"]');
    let isEditing = false;
    let editIndex = null;

    const employees = [
        {
            id: "EMP0001",
            nombre: "María González",
            cedula: "402-1234567-8",
            direccion: "Calle Secundaria #456, Santiago",
            telefono: "(809) 555-9876",
            email: "maria.gonzalez@empresa.com",
            estado: "Activo",
            departamento: "Ventas",
            puesto: "Analista",
            salario: 35000,
            fechaContratacion: "2024-01-15",
            notas: "",
            comentarios: ["Excelente desempeño en el último trimestre"],
        },
        {
            id: "EMP0002",
            nombre: "Carlos Rodríguez",
            cedula: "031-9876543-2",
            direccion: "Avenida Principal #789, Santo Domingo",
            telefono: "(809) 555-4321",
            email: "carlos.rodriguez@empresa.com",
            estado: "Activo",
            departamento: "TI",
            puesto: "Desarrollador",
            salario: 45000,
            fechaContratacion: "2023-06-01",
            notas: "Especialista en sistemas ERP",
            comentarios: [],
        },
    ];

    function switchView(viewToShow, viewToHide) {
        viewToHide.classList.remove("active");
        setTimeout(() => {
            viewToShow.classList.add("active");
        }, 300);
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function showModal(message, onConfirm) {
        modalMessage.innerHTML = message;
        modal.classList.add("show");
        modalConfirm.onclick = () => {
            onConfirm();
            modal.classList.remove("show");
        };
        modalCancel.onclick = () => modal.classList.remove("show");
        document.querySelector(".modal-close").onclick = () => modal.classList.remove("show");
    }

    function renderEmployeeList() {
        employeeList.innerHTML = "";
        employees.forEach((employee, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-label="ID Empleado">${employee.id}</td>
                <td data-label="Nombre">${employee.nombre}</td>
                <td data-label="Departamento">${employee.departamento}</td>
                <td data-label="Teléfono">${employee.telefono}</td>
                <td data-label="Estado">${employee.estado}</td>
                <td data-label="Acciones">
                    <button class="btn-icon edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                    <button class="btn-icon btn-danger" data-index="${index}"><i data-feather="trash"></i></button>
                </td>
            `;
            employeeList.appendChild(row);
        });
        feather.replace();
        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                editEmployee(index);
            });
        });
        document.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                showModal("¿Estás seguro de que deseas eliminar este empleado?", () => {
                    employees.splice(index, 1);
                    renderEmployeeList();
                    showToast("Empleado eliminado correctamente");
                });
            });
        });
    }

    function editEmployee(index) {
        isEditing = true;
        editIndex = index;
        const employee = employees[index];
        formTitle.textContent = "Editar Empleado";
        employeeId.textContent = employee.id;
        employeeDate.textContent = new Date().toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        document.getElementById("employeeName").value = employee.nombre;
        document.getElementById("cedula").value = employee.cedula;
        document.getElementById("address").value = employee.direccion;
        document.getElementById("phone").value = employee.telefono;
        document.getElementById("email").value = employee.email;
        document.getElementById("status").value = employee.estado;
        document.getElementById("department").value = employee.departamento;
        document.getElementById("position").value = employee.puesto;
        document.getElementById("salary").value = employee.salario;
        document.getElementById("hireDate").value = employee.fechaContratacion;
        document.getElementById("notes").value = employee.notas;
        document.getElementById("employeeComment").value = "";
        const commentList = document.getElementById("commentList");
        commentList.innerHTML = employee.comentarios.map(comment => `<li>${comment}</li>`).join("");
        switchView(employeeFormView, employeeListView);
    }

    function resetForm() {
        formTitle.textContent = "Nuevo Empleado";
        employeeId.textContent = `EMP${String(employees.length + 1).padStart(4, "0")}`;
        const currentDate = new Date().toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        employeeDate.textContent = currentDate;
        employeeDateList.textContent = currentDate;
        document.getElementById("employeeName").value = "";
        document.getElementById("cedula").value = "";
        document.getElementById("address").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("status").value = "Activo";
        document.getElementById("department").value = "Ventas";
        document.getElementById("position").value = "";
        document.getElementById("salary").value = "";
        document.getElementById("hireDate").value = "";
        document.getElementById("notes").value = "";
        document.getElementById("employeeComment").value = "";
        document.getElementById("commentList").innerHTML = "";
        isEditing = false;
        editIndex = null;
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
        });
    });

    addEmployeeBtn.addEventListener("click", () => {
        resetForm();
        switchView(employeeFormView, employeeListView);
    });

    addEmployeeSideBtn.addEventListener("click", () => {
        resetForm();
        switchView(employeeFormView, employeeListView);
    });

    backBtn.addEventListener("click", () => {
        showModal("¿Estás seguro de que deseas volver sin guardar?", () => {
            switchView(employeeListView, employeeFormView);
        });
    });

    saveBtn.addEventListener("click", () => {
        const newEmployee = {
            id: employeeId.textContent,
            nombre: document.getElementById("employeeName").value,
            cedula: document.getElementById("cedula").value,
            direccion: document.getElementById("address").value,
            telefono: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            estado: document.getElementById("status").value,
            departamento: document.getElementById("department").value,
            puesto: document.getElementById("position").value,
            salario: parseFloat(document.getElementById("salary").value) || 0,
            fechaContratacion: document.getElementById("hireDate").value,
            notas: document.getElementById("notes").value,
            comentarios: [
                ...(isEditing ? employees[editIndex].comentarios : []),
                document.getElementById("employeeComment").value,
            ].filter((c) => c),
        };
        if (isEditing) {
            employees[editIndex] = newEmployee;
            showToast("Empleado actualizado correctamente");
        } else {
            employees.push(newEmployee);
            showToast("Empleado creado correctamente");
        }
        renderEmployeeList();
        switchView(employeeListView, employeeFormView);
    });

    exitBtn.addEventListener("click", () => {
        showModal("¿Estás seguro de que deseas salir sin guardar?", () => {
            switchView(employeeListView, employeeFormView);
        });
    });

    viewEmployeesBtn.addEventListener("click", () => {
        switchView(employeeListView, employeeFormView);
    });

    employeeListView.classList.add("active");
    employeeFormView.classList.remove("active");
    renderEmployeeList();

    document.querySelector(".toast-close").addEventListener("click", () => {
        toast.classList.remove("show");
    });
});