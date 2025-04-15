document.addEventListener("DOMContentLoaded", () => {
    feather.replace();

    // Elementos del DOM
    const supplierListView = document.getElementById("supplierListView");
    const supplierFormView = document.getElementById("supplierFormView");
    const addSupplierBtn = document.getElementById("addSupplierBtn");
    const backBtn = document.getElementById("backBtn");
    const supplierList = document.getElementById("supplierList");
    const formTitle = document.getElementById("formTitle");
    const supplierId = document.getElementById("supplierId");
    const supplierDate = document.getElementById("supplierDate");
    const supplierDateList = document.getElementById("supplierDateList");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    const saveBtn = document.querySelector('[data-action="save"]');
    const exitBtn = document.querySelector('[data-action="exit"]');
    const viewSuppliersBtn = document.querySelector('[data-action="view-suppliers"]');
    const addSupplierSideBtn = document.querySelector('[data-action="add-supplier"]');
    let isEditing = false;
    let editIndex = null;

    const suppliers = [
        {
            id: "PROV0001",
            nombre: "Distribuidora ABC SRL",
            rnc: "123-456789-0",
            direccion: "Calle Principal #123, Santo Domingo",
            telefono: "(809) 555-1234",
            email: "contacto@distribuidoraabc.com",
            contacto: "Ana López",
            estado: "Activo",
            tipo: "Nacional",
            condicionesPago: "30 días neto",
            moneda: "RD$",
            notas: "",
            comentarios: ["Proveedor confiable, entrega a tiempo"],
        },
        {
            id: "PROV0002",
            nombre: "Importadora XYZ",
            rnc: "987-654321-0",
            direccion: "Avenida 27 de Febrero #456, Santiago",
            telefono: "(809) 555-5678",
            email: "info@importadoraxyz.com",
            contacto: "Carlos Gómez",
            estado: "Activo",
            tipo: "Internacional",
            condicionesPago: "60 días neto",
            moneda: "USD$",
            notas: "Especializado en electrónica",
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

    function renderSupplierList() {
        supplierList.innerHTML = "";
        suppliers.forEach((supplier, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-label="ID Proveedor">${supplier.id}</td>
                <td data-label="Nombre">${supplier.nombre}</td>
                <td data-label="Contacto">${supplier.contacto}</td>
                <td data-label="Teléfono">${supplier.telefono}</td>
                <td data-label="Estado">${supplier.estado}</td>
                <td data-label="Acciones">
                    <button class="btn-icon edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                    <button class="btn-icon btn-danger" data-index="${index}"><i data-feather="trash"></i></button>
                </td>
            `;
            supplierList.appendChild(row);
        });
        feather.replace();
        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                editSupplier(index);
            });
        });
        document.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                showModal("¿Estás seguro de que deseas eliminar este proveedor?", () => {
                    suppliers.splice(index, 1);
                    renderSupplierList();
                    showToast("Proveedor eliminado correctamente");
                });
            });
        });
    }

    function editSupplier(index) {
        isEditing = true;
        editIndex = index;
        const supplier = suppliers[index];
        formTitle.textContent = "Editar Proveedor";
        supplierId.textContent = supplier.id;
        supplierDate.textContent = new Date().toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        document.getElementById("supplierName").value = supplier.nombre;
        document.getElementById("rnc").value = supplier.rnc;
        document.getElementById("address").value = supplier.direccion;
        document.getElementById("phone").value = supplier.telefono;
        document.getElementById("email").value = supplier.email;
        document.getElementById("contactName").value = supplier.contacto;
        document.getElementById("status").value = supplier.estado;
        document.getElementById("supplierType").value = supplier.tipo;
        document.getElementById("paymentTerms").value = supplier.condicionesPago;
        document.getElementById("currency").value = supplier.moneda;
        document.getElementById("notes").value = supplier.notas;
        document.getElementById("supplierComment").value = "";
        const commentList = document.getElementById("commentList");
        commentList.innerHTML = supplier.comentarios.map(comment => `<li>${comment}</li>`).join("");
        switchView(supplierFormView, supplierListView);
    }

    function resetForm() {
        formTitle.textContent = "Nuevo Proveedor";
        supplierId.textContent = `PROV${String(suppliers.length + 1).padStart(4, "0")}`;
        const currentDate = new Date().toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        supplierDate.textContent = currentDate;
        supplierDateList.textContent = currentDate;
        document.getElementById("supplierName").value = "";
        document.getElementById("rnc").value = "";
        document.getElementById("address").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("contactName").value = "";
        document.getElementById("status").value = "Activo";
        document.getElementById("supplierType").value = "Nacional";
        document.getElementById("paymentTerms").value = "";
        document.getElementById("currency").value = "RD$";
        document.getElementById("notes").value = "";
        document.getElementById("supplierComment").value = "";
        document.getElementById("commentList").innerHTML = "";
        isEditing = false;
        editIndex = null;
    }

    addSupplierBtn.addEventListener("click", () => {
        resetForm();
        switchView(supplierFormView, supplierListView);
    });

    addSupplierSideBtn.addEventListener("click", () => {
        resetForm();
        switchView(supplierFormView, supplierListView);
    });

    backBtn.addEventListener("click", () => {
        showModal("¿Estás seguro de que deseas volver sin guardar?", () => {
            switchView(supplierListView, supplierFormView);
        });
    });

    saveBtn.addEventListener("click", () => {
        const supplierForm = document.getElementById("supplierForm");
        if (!supplierForm.checkValidity()) {
            supplierForm.reportValidity();
            showToast("Por favor complete todos los campos requeridos");
            return;
        }
        const newSupplier = {
            id: supplierId.textContent,
            nombre: document.getElementById("supplierName").value,
            rnc: document.getElementById("rnc").value,
            direccion: document.getElementById("address").value,
            telefono: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            contacto: document.getElementById("contactName").value,
            estado: document.getElementById("status").value,
            tipo: document.getElementById("supplierType").value,
            condicionesPago: document.getElementById("paymentTerms").value,
            moneda: document.getElementById("currency").value,
            notas: document.getElementById("notes").value,
            comentarios: [
                ...(isEditing ? suppliers[editIndex].comentarios : []),
                document.getElementById("supplierComment").value,
            ].filter((c) => c),
        };
        if (isEditing) {
            suppliers[editIndex] = newSupplier;
            showToast("Proveedor actualizado correctamente");
        } else {
            suppliers.push(newSupplier);
            showToast("Proveedor creado correctamente");
        }
        renderSupplierList();
        switchView(supplierListView, supplierFormView);
    });

    exitBtn.addEventListener("click", () => {
        showModal("¿Estás seguro de que deseas salir sin guardar?", () => {
            switchView(supplierListView, supplierFormView);
        });
    });

    viewSuppliersBtn.addEventListener("click", () => {
        switchView(supplierListView, supplierFormView);
    });

    document.querySelector(".toast-close").addEventListener("click", () => {
        toast.classList.remove("show");
    });

    renderSupplierList();
});