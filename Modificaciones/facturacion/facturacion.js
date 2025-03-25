document.addEventListener("DOMContentLoaded", () => {
    const productos = [
        { codigo: "10", referencia: "101", descripcion: "CPU DELL CI5 DESKTOP", precio: 10500, impuesto: 1601.69, existencia: 5 },
        { codigo: "11", referencia: "102", descripcion: 'MONITOR DELL 24"', precio: 5200, impuesto: 936, existencia: 8 },
        { codigo: "12", referencia: "103", descripcion: "TECLADO LOGITECH", precio: 1200, impuesto: 216, existencia: 15 },
        { codigo: "13", referencia: "104", descripcion: "MOUSE INALÁMBRICO", precio: 800, impuesto: 144, existencia: 20 },
        { codigo: "14", referencia: "105", descripcion: "IMPRESORA LÁSER", precio: 7500, impuesto: 1350, existencia: 3 },
    ];

    const clientes = [
        { id: "1", nombre: "PABLO ALEJANDRO DIAZ CRUZ", telefono: "(809) 447-7816", direccion: "LOS LLANOS DE GURABO TIGAYGA #42, SANTIAGO" },
        { id: "2", nombre: "MARIA RODRIGUEZ", telefono: "(809) 555-1234", direccion: "CALLE PRINCIPAL #10, SANTO DOMINGO" },
        { id: "3", nombre: "JUAN PEREZ", telefono: "(809) 777-5678", direccion: "AVENIDA CENTRAL #25, LA ROMANA" },
    ];

    const vendedores = [
        { id: "1", nombre: "PABLO A DIAZ CRUZ" },
        { id: "2", nombre: "CARLOS MARTINEZ" },
        { id: "3", nombre: "ANA GOMEZ" },
    ];

    const pedidos = [
        { id: "P001", clienteId: "1", productos: [{ codigo: "10", cantidad: 2 }, { codigo: "12", cantidad: 1 }] },
        { id: "P002", clienteId: "2", productos: [{ codigo: "11", cantidad: 1 }, { codigo: "13", cantidad: 2 }] },
    ];

    const facturas = [
        { id: "F001", clienteId: "1", total: 22200, fecha: "2023-05-15" },
        { id: "F002", clienteId: "2", total: 6800, fecha: "2023-05-16" },
    ];

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        showConfirmDialog("¿Está seguro que desea cerrar sesión?", () => {
            showNotification("Cerrando sesión...", "warning");
            setTimeout(() => {
                window.location.href = "../Login/login.html";
            }, 1500);
        });
    });

    // Tabs functionality
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tabId).classList.add("active");
            if (tabId === "detalle-tab") {
                updateAccountingDetails();
            }
        });
    });

    // Search Cliente
    const searchClienteBtn = document.getElementById("searchClienteBtn");
    searchClienteBtn.addEventListener("click", () => {
        showInputDialog("Ingrese ID del cliente (por ejemplo: 1, 2, 3):", (clienteId) => {
            const cliente = clientes.find((c) => c.id === clienteId);
            if (cliente) {
                document.getElementById("clienteId").value = cliente.id;
                document.getElementById("clienteNombre").value = cliente.nombre;
                document.getElementById("direccionEnvio").value = cliente.direccion;
                document.getElementById("telefono").value = cliente.telefono;
                document.getElementById("celular").value = cliente.telefono;
                showNotification("Cliente seleccionado: " + cliente.nombre, "success");
            } else {
                showNotification("Cliente no encontrado", "error");
            }
        });
    });

    // Search Vendedor
    const searchVendedorBtn = document.getElementById("searchVendedorBtn");
    searchVendedorBtn.addEventListener("click", () => {
        showInputDialog("Ingrese ID del vendedor (por ejemplo: 1, 2, 3):", (vendedorId) => {
            const vendedor = vendedores.find((v) => v.id === vendedorId);
            if (vendedor) {
                document.getElementById("vendedorId").value = vendedor.id;
                document.getElementById("vendedorNombre").value = vendedor.nombre;
                showNotification("Vendedor seleccionado: " + vendedor.nombre, "success");
            } else {
                showNotification("Vendedor no encontrado", "error");
            }
        });
    });

    // Add Product (desde la fila vacía)
    const addRowBtn = document.querySelector(".add-row-btn");
    addRowBtn.addEventListener("click", openProductModal);

    // Search Product in Table
    const searchProductInput = document.getElementById("searchProductInput");
    searchProductInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");

        rows.forEach((row) => {
            const descripcion = row.cells[3].textContent.toLowerCase();
            const codigo = row.cells[1].textContent.toLowerCase();

            if (descripcion.includes(searchTerm) || codigo.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Product Actions
    const productActionButtons = document.querySelectorAll(".action-grid button");
    productActionButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const action = e.target.id || e.target.parentElement.id;

            switch (action) {
                case "changePrice":
                    changePriceHandler();
                    break;
                case "applyDiscount":
                    applyDiscountHandler();
                    break;
                case "searchProduct":
                    openProductModal();
                    break;
                case "viewImage":
                    viewImageHandler();
                    break;
                case "deleteLine":
                    deleteLineHandler();
                    break;
                case "loadOrder":
                    loadOrderHandler();
                    break;
                case "authorize":
                    authorizeHandler();
                    break;
            }
        });
    });

    // Row Actions (Edit and Delete)
    document.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".icon-btn:not(.danger)");
        const deleteBtn = e.target.closest(".icon-btn.danger");

        if (editBtn) {
            const row = editBtn.closest("tr");
            if (row) {
                changePriceHandler();
            }
        }

        if (deleteBtn) {
            const row = deleteBtn.closest("tr");
            if (row) {
                deleteLineHandler();
            }
        }
    });

    // Row Selection
    document.addEventListener("click", (e) => {
        const row = e.target.closest("tbody tr:not(.empty-row)");
        if (row) {
            const allRows = document.querySelectorAll("tbody tr");
            allRows.forEach((r) => r.classList.remove("selected"));
            row.classList.add("selected");

            const codigo = row.cells[1].textContent;
            const descripcion = row.cells[3].textContent;
            const precio = row.cells[5].textContent;

            const producto = productos.find((p) => p.codigo === codigo);
            if (producto) {
                document.getElementById("productCode").value = codigo;
                document.getElementById("productDescription").value = descripcion;
                document.getElementById("productPrice1").value = formatCurrency(precio);
                document.getElementById("productPrice2").value = formatCurrency(precio);
                document.getElementById("productStock").value = producto.existencia.toFixed(2);
            }
        }
    });

    // Quantity Update
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("qty-input")) {
            const row = e.target.closest("tr");
            if (row) {
                updateRowTotal(row);
                updateTotals();
            }
        }
    });

    // Save and Exit Buttons
    const saveButton = document.querySelector(".main-actions .btn.primary");
    saveButton.addEventListener("click", () => {
        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
        if (rows.length === 0) {
            showNotification("Debe agregar al menos un producto", "error");
            return;
        }

        const clienteInput = document.getElementById("clienteNombre");
        if (!clienteInput.value) {
            showNotification("Debe seleccionar un cliente", "error");
            return;
        }

        showNotification("Factura guardada correctamente", "success");
        const facturaNum = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        document.querySelector(".invoice-number").textContent = `FACT000${facturaNum}`;
    });

    const exitButton = document.querySelector(".main-actions .btn.danger");
    exitButton.addEventListener("click", () => {
        showConfirmDialog("¿Está seguro que desea salir? Los cambios no guardados se perderán.", () => {
            showNotification("Saliendo del sistema...", "warning");
            setTimeout(() => {
                window.location.href = "https://example.com";
            }, 1500);
        });
    });

    // Modal Close
    const productModal = document.getElementById("productModal");
    const modalCloseButtons = document.querySelectorAll(".modal-close, .modal .btn.secondary");
    modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
            productModal.classList.remove("active"); // Cambiado de "show" a "active"
        });
    });

    // Modal Search
    const modalSearchInput = document.querySelector(".modal-body .search-box input");
    modalSearchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll(".search-results tbody tr");

        rows.forEach((row) => {
            const codigo = row.cells[0].textContent.toLowerCase();
            const descripcion = row.cells[1].textContent.toLowerCase();

            if (codigo.includes(searchTerm) || descripcion.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Modal Row Selection
    const selectableRows = document.querySelectorAll(".selectable");
    selectableRows.forEach((row) => {
        row.addEventListener("click", () => {
            selectableRows.forEach((r) => r.classList.remove("selected"));
            row.classList.add("selected");
        });
    });

    // Add Product from Modal
    const addFromModalButton = document.querySelector(".modal-footer .btn.primary");
    addFromModalButton.addEventListener("click", () => {
        const selectedRow = document.querySelector(".selectable.selected");
        if (selectedRow) {
            const code = selectedRow.cells[0].textContent;
            const description = selectedRow.cells[1].textContent;
            const price = selectedRow.cells[2].textContent;

            addProductToTable(code, description, price);
            productModal.classList.remove("active"); // Cambiado de "show" a "active"
            showNotification("Producto agregado", "success");
        } else {
            showNotification("Por favor seleccione un producto", "warning");
        }
    });

    // Toast Close
    const toastCloseButton = document.querySelector(".toast-close");
    toastCloseButton.addEventListener("click", () => {
        const toast = document.getElementById("notification");
        toast.classList.remove("show");
    });

    // Payment Type
    const radioButtons = document.querySelectorAll('input[name="tipoPago"]');
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "contado") {
                showNotification("Modo de pago: Contado", "success");
            } else {
                showNotification("Modo de pago: Crédito", "success");
            }
        });
    });

    // ITBIS Checkbox
    const itbisCheckbox = document.getElementById("itbisEncima");
    itbisCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            showNotification("ITBIS incluido en el precio", "success");
        } else {
            showNotification("ITBIS no incluido en el precio", "warning");
        }
        updateTotals();
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.key === "F11") {
            e.preventDefault();
            saveButton.click();
        }

        if (e.key === "F5") {
            e.preventDefault();
            document.getElementById("loadOrder").click();
        }

        if (e.key === "F8") {
            e.preventDefault();
            document.getElementById("authorize").click();
        }

        if (e.key === "Escape") {
            const modals = document.querySelectorAll(".modal.active"); // Cambiado de "show" a "active"
            modals.forEach((modal) => {
                modal.classList.remove("active"); // Cambiado de "show" a "active"
            });
        }
    });

    // Field Updates
    const fieldsToUpdate = [
        "limiteCredito", "direccionEnvio", "telefono", "celular", "moneda", "almacen",
        "proyecto", "tipoNCF", "tipoVenta", "tipoPapel", "porcentajeTarjeta", "tasa"
    ];

    fieldsToUpdate.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        field.addEventListener("change", (e) => {
            showNotification(`${fieldId} actualizado a: ${e.target.value}`, "success");
        });
    });

    // Comment Section
    const invoiceComment = document.getElementById("invoiceComment");
    const commentList = document.getElementById("commentList");
    invoiceComment.addEventListener("change", () => {
        const comment = invoiceComment.value.trim();
        if (comment) {
            const li = document.createElement("li");
            li.textContent = comment;
            commentList.appendChild(li);
            invoiceComment.value = "";
            showNotification("Comentario agregado", "success");
        }
    });

    // Client Management
    const addClientBtn = document.getElementById("addClientBtn");
    addClientBtn.addEventListener("click", () => {
        showInputDialog("Ingrese ID del nuevo cliente:", (id) => {
            showInputDialog("Ingrese nombre del nuevo cliente:", (nombre) => {
                showInputDialog("Ingrese teléfono del nuevo cliente:", (telefono) => {
                    showInputDialog("Ingrese dirección del nuevo cliente:", (direccion) => {
                        if (id && nombre && telefono && direccion) {
                            clientes.push({ id, nombre, telefono, direccion });
                            showNotification("Nuevo cliente agregado", "success");
                        } else {
                            showNotification("Todos los campos son requeridos", "error");
                        }
                    });
                });
            });
        });
    });

    const viewClientsBtn = document.getElementById("viewClientsBtn");
    viewClientsBtn.addEventListener("click", () => {
        let clientList = "Lista de Clientes:\n\n";
        clientes.forEach((cliente) => {
            clientList += `ID: ${cliente.id}\nNombre: ${cliente.nombre}\nTeléfono: ${cliente.telefono}\nDirección: ${cliente.direccion}\n\n`;
        });
        showConfirmDialog(clientList);
    });

    // Order Management
    const createOrderBtn = document.getElementById("createOrderBtn");
    createOrderBtn.addEventListener("click", () => {
        showInputDialog("Ingrese ID del cliente:", (clienteId) => {
            const cliente = clientes.find((c) => c.id === clienteId);

            if (cliente) {
                const pedidoId = "P" + (pedidos.length + 1).toString().padStart(3, "0");
                const nuevoPedido = { id: pedidoId, clienteId, productos: [] };

                function agregarProducto() {
                    showInputDialog("Ingrese código del producto:", (codigoProducto) => {
                        showInputDialog("Ingrese cantidad:", (cantidad) => {
                            if (codigoProducto && !isNaN(cantidad)) {
                                nuevoPedido.productos.push({ codigo: codigoProducto, cantidad: Number.parseInt(cantidad) });
                            }
                            showConfirmDialog("¿Desea agregar otro producto?", (respuesta) => {
                                if (respuesta) {
                                    agregarProducto();
                                } else {
                                    pedidos.push(nuevoPedido);
                                    showNotification(`Pedido ${pedidoId} creado`, "success");
                                }
                            });
                        });
                    });
                }

                agregarProducto();
            } else {
                showNotification("Cliente no encontrado", "error");
            }
        });
    });

    const viewOrdersBtn = document.getElementById("viewOrdersBtn");
    viewOrdersBtn.addEventListener("click", () => {
        let orderList = "Lista de Pedidos:\n\n";
        pedidos.forEach((pedido) => {
            const cliente = clientes.find((c) => c.id === pedido.clienteId);
            orderList += `ID: ${pedido.id}\nCliente: ${cliente ? cliente.nombre : "Desconocido"}\nProductos:\n`;
            pedido.productos.forEach((prod) => {
                const producto = productos.find(p => p.codigo === prod.codigo);
                orderList += `  - Código: ${prod.codigo}, Descripción: ${producto ? producto.descripcion : 'Desconocido'}, Cantidad: ${prod.cantidad}\n`;
            });
            orderList += "\n";
        });
        showConfirmDialog(orderList);
    });

    // Invoice Management
    const viewInvoicesBtn = document.getElementById("viewInvoicesBtn");
    viewInvoicesBtn.addEventListener("click", () => {
        let invoiceList = "Lista de Facturas:\n\n";
        facturas.forEach((factura) => {
            const cliente = clientes.find((c) => c.id === factura.clienteId);
            invoiceList += `ID: ${factura.id}\nCliente: ${cliente ? cliente.nombre : "Desconocido"}\nTotal: ${formatCurrency(factura.total)}\nFecha: ${factura.fecha}\n\n`;
        });
        showConfirmDialog(invoiceList);
    });

    // Change Image
    const changeImageBtn = document.getElementById("changeImageBtn");
    const changeImageInput = document.getElementById("changeImageInput");
    const productImage = document.getElementById("productImage");

    changeImageBtn.addEventListener("click", () => {
        changeImageInput.click();
    });

    changeImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                productImage.src = event.target.result;
                showNotification("Imagen actualizada", "success");
            };
            reader.readAsDataURL(file);
        }
    });

    // Export Buttons in Detalle Contable
    const exportButtons = document.querySelectorAll("#detalle-tab .export-btn");
    exportButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const format = button.getAttribute("data-format");
            const accountingTable = document.getElementById("accountingTable");
            const rows = accountingTable.querySelectorAll("tbody tr");

            // Simular exportación
            let content = "Cuenta,Descripción,Débito,Crédito\n";
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                const rowData = Array.from(cells).map((cell) => cell.textContent).join(",");
                content += rowData + "\n";
            });

            // Simular exportación según el formato
            if (format === "csv") {
                showNotification(`Exportado a CSV: ${content.length} bytes`, "success");
            } else if (format === "excel") {
                showNotification(`Exportado a Excel: ${content.length} bytes`, "success");
            } else if (format === "pdf") {
                showNotification(`Exportado a PDF: ${content.length} bytes`, "success");
            }
        });
    });

    // Helper Functions
    function formatCurrency(value) {
        return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }

    function updateRowTotal(row) {
        const qty = parseFloat(row.querySelector(".qty-input").value) || 0;
        const price = parseFloat(row.cells[5].textContent.replace(/,/g, "")) || 0;
        const impuesto = parseFloat(row.cells[6].textContent.replace(/,/g, "")) || 0;
        const total = qty * (price + (itbisCheckbox.checked ? 0 : impuesto));
        row.cells[7].textContent = formatCurrency(total);
    }

    function updateTotals() {
        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
        let totalBruto = 0;
        let totalImpuesto = 0;

        rows.forEach((row) => {
            const qty = parseFloat(row.querySelector(".qty-input").value) || 0;
            const price = parseFloat(row.cells[5].textContent.replace(/,/g, "")) || 0;
            const impuesto = parseFloat(row.cells[6].textContent.replace(/,/g, "")) || 0;
            totalBruto += qty * price;
            totalImpuesto += qty * (itbisCheckbox.checked ? 0 : impuesto);
        });

        const baseImponible = totalBruto / (itbisCheckbox.checked ? 1.18 : 1);
        const itbis = itbisCheckbox.checked ? (totalBruto - baseImponible) : totalImpuesto;
        const totalNeto = totalBruto + (itbisCheckbox.checked ? 0 : totalImpuesto);

        document.getElementById("totalBruto").textContent = formatCurrency(totalBruto);
        document.getElementById("descuento1").textContent = formatCurrency(0);
        document.getElementById("descItems").textContent = formatCurrency(0);
        document.getElementById("flete").textContent = formatCurrency(0);
        document.getElementById("montoExento").textContent = formatCurrency(0);
        document.getElementById("baseImponible").textContent = formatCurrency(baseImponible);
        document.getElementById("itbis").textContent = formatCurrency(itbis);
        document.getElementById("itbis30").textContent = formatCurrency(0);
        document.getElementById("totalNeto").textContent = formatCurrency(totalNeto);
    }

    function addProductToTable(code, description, price) {
        const tbody = document.querySelector("tbody");
        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
        const rowCount = rows.length + 1;

        const producto = productos.find((p) => p.codigo === code);
        if (!producto) {
            showNotification("Producto no encontrado", "error");
            return;
        }

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>${producto.codigo}</td>
            <td>${producto.referencia}</td>
            <td>${producto.descripcion}</td>
            <td><input type="number" value="1" min="1" class="qty-input"></td>
            <td>${formatCurrency(producto.precio)}</td>
            <td>${formatCurrency(producto.impuesto)}</td>
            <td>${formatCurrency(producto.precio + (itbisCheckbox.checked ? 0 : producto.impuesto))}</td>
            <td>
                <div class="row-actions">
                    <button class="icon-btn"><i class='bx bx-edit'></i></button>
                    <button class="icon-btn danger"><i class='bx bx-trash'></i></button>
                </div>
            </td>
        `;

        tbody.insertBefore(newRow, tbody.lastElementChild);
        updateTotals();
    }

    function openProductModal() {
        const modal = document.getElementById("productModal");
        modal.classList.add("active"); // Cambiado de "show" a "active"
    }

    function changePriceHandler() {
        const selectedRow = document.querySelector("tbody tr.selected");
        if (!selectedRow) {
            showNotification("Seleccione un producto para cambiar el precio", "warning");
            return;
        }

        showInputDialog("Ingrese el nuevo precio:", (newPrice) => {
            if (!isNaN(newPrice) && newPrice > 0) {
                selectedRow.cells[5].textContent = formatCurrency(newPrice);
                updateRowTotal(selectedRow);
                updateTotals();
                showNotification("Precio actualizado", "success");
            } else {
                showNotification("Precio inválido", "error");
            }
        });
    }

    function applyDiscountHandler() {
        showInputDialog("Ingrese el porcentaje de descuento:", (discount) => {
            if (!isNaN(discount) && discount >= 0 && discount <= 100) {
                const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
                rows.forEach((row) => {
                    const price = parseFloat(row.cells[5].textContent.replace(/,/g, ""));
                    const newPrice = price * (1 - discount / 100);
                    row.cells[5].textContent = formatCurrency(newPrice);
                    updateRowTotal(row);
                });
                updateTotals();
                showNotification(`Descuento del ${discount}% aplicado`, "success");
            } else {
                showNotification("Porcentaje de descuento inválido", "error");
            }
        });
    }

    function viewImageHandler() {
        const selectedRow = document.querySelector("tbody tr.selected");
        if (!selectedRow) {
            showNotification("Seleccione un producto para ver la imagen", "warning");
            return;
        }

        const codigo = selectedRow.cells[1].textContent;
        const producto = productos.find((p) => p.codigo === codigo);
        if (producto) {
            showNotification("Mostrando imagen del producto", "info");
        }
    }

    function deleteLineHandler() {
        const selectedRow = document.querySelector("tbody tr.selected");
        if (!selectedRow) {
            showNotification("Seleccione un producto para eliminar", "warning");
            return;
        }

        showConfirmDialog("¿Está seguro que desea eliminar este producto?", () => {
            selectedRow.remove();
const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
            rows.forEach((row, index) => {
                row.cells[0].textContent = index + 1;
            });
            updateTotals();
            showNotification("Producto eliminado", "success");
        });
    }

    function loadOrderHandler() {
        showInputDialog("Ingrese ID del pedido (por ejemplo: P001, P002):", (pedidoId) => {
            const pedido = pedidos.find((p) => p.id === pedidoId);
            if (pedido) {
                const cliente = clientes.find((c) => c.id === pedido.clienteId);
                if (cliente) {
                    document.getElementById("clienteId").value = cliente.id;
                    document.getElementById("clienteNombre").value = cliente.nombre;
                    document.getElementById("direccionEnvio").value = cliente.direccion;
                    document.getElementById("telefono").value = cliente.telefono;
                    document.getElementById("celular").value = cliente.telefono;
                }

                const tbody = document.querySelector("tbody");
                const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
                rows.forEach((row) => row.remove());

                pedido.productos.forEach((prod, index) => {
                    const producto = productos.find((p) => p.codigo === prod.codigo);
                    if (producto) {
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${producto.codigo}</td>
                            <td>${producto.referencia}</td>
                            <td>${producto.descripcion}</td>
                            <td><input type="number" value="${prod.cantidad}" min="1" class="qty-input"></td>
                            <td>${formatCurrency(producto.precio)}</td>
                            <td>${formatCurrency(producto.impuesto)}</td>
                            <td>${formatCurrency(prod.cantidad * (producto.precio + (itbisCheckbox.checked ? 0 : producto.impuesto)))}</td>
                            <td>
                                <div class="row-actions">
                                    <button class="icon-btn"><i class='bx bx-edit'></i></button>
                                    <button class="icon-btn danger"><i class='bx bx-trash'></i></button>
                                </div>
                            </td>
                        `;
                        tbody.insertBefore(newRow, tbody.lastElementChild);
                    }
                });

                updateTotals();
                showNotification(`Pedido ${pedidoId} cargado`, "success");
            } else {
                showNotification("Pedido no encontrado", "error");
            }
        });
    }

    function authorizeHandler() {
        showConfirmDialog("¿Está seguro que desea autorizar esta factura?", () => {
            showNotification("Factura autorizada", "success");
        });
    }

    function updateAccountingDetails() {
        const accountingTable = document.getElementById("accountingTable");
        const tbody = accountingTable.querySelector("tbody");
        tbody.innerHTML = "";

        const totalNeto = parseFloat(document.getElementById("totalNeto").textContent.replace(/,/g, "")) || 0;
        const itbis = parseFloat(document.getElementById("itbis").textContent.replace(/,/g, "")) || 0;

        const rows = [
            { cuenta: "1101", descripcion: "Caja", debito: totalNeto, credito: 0 },
            { cuenta: "4101", descripcion: "Ventas", debito: 0, credito: totalNeto - itbis },
            { cuenta: "2105", descripcion: "ITBIS por Pagar", debito: 0, credito: itbis },
        ];

        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.cuenta}</td>
                <td>${row.descripcion}</td>
                <td>${formatCurrency(row.debito)}</td>
                <td>${formatCurrency(row.credito)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function showNotification(message, type) {
        const toast = document.getElementById("notification");
        const toastTitle = toast.querySelector(".toast-title");
        const toastMessage = toast.querySelector(".toast-message");
        const toastIcon = toast.querySelector(".toast-icon i");

        toastTitle.textContent = type === "error" ? "Error" : type === "warning" ? "Advertencia" : "Éxito";
        toastMessage.textContent = message;

        toast.classList.remove("success", "error", "warning");
        toast.classList.add(type);

        toastIcon.className = type === "error" ? "bx bx-error" : type === "warning" ? "bx bx-info-circle" : "bx bx-check-circle";

        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    function showConfirmDialog(message, callback) {
        const dialog = document.createElement("div");
        dialog.className = "confirm-dialog";
        dialog.innerHTML = `
            <div class="confirm-dialog-content">
                <h3 class="confirm-dialog-title">Confirmar</h3>
                <p class="confirm-dialog-message">${message}</p>
                <div class="confirm-dialog-actions">
                    <button class="btn secondary">Cancelar</button>
                    <button class="btn primary">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.classList.add("active");

        const cancelBtn = dialog.querySelector(".btn.secondary");
        const acceptBtn = dialog.querySelector(".btn.primary");

        cancelBtn.addEventListener("click", () => {
            dialog.remove();
            if (callback) callback(false);
        });

        acceptBtn.addEventListener("click", () => {
            dialog.remove();
            if (callback) callback(true);
        });
    }

    function showInputDialog(message, callback) {
        const dialog = document.createElement("div");
        dialog.className = "confirm-dialog";
        dialog.innerHTML = `
            <div class="confirm-dialog-content">
                <h3 class="confirm-dialog-title">Entrada</h3>
                <p class="confirm-dialog-message">${message}</p>
                <input type="text" class="dialog-input" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--border); border-radius: var(--radius);">
                <div class="confirm-dialog-actions">
                    <button class="btn secondary">Cancelar</button>
                    <button class="btn primary">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.classList.add("active");

        const input = dialog.querySelector(".dialog-input");
        const cancelBtn = dialog.querySelector(".btn.secondary");
        const acceptBtn = dialog.querySelector(".btn.primary");

        cancelBtn.addEventListener("click", () => {
            dialog.remove();
        });

        acceptBtn.addEventListener("click", () => {
            const value = input.value.trim();
            dialog.remove();
            if (callback) callback(value);
        });

        input.focus();
    }

    // Inicializar totales
    updateTotals();
});