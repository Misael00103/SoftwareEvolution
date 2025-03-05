document.addEventListener("DOMContentLoaded", () => {
    const productos = [
        {
            codigo: "10",
            referencia: "101",
            descripcion: "CPU DELL CI5 DESKTOP",
            precio: 10500,
            impuesto: 1601.69,
            existencia: 5,
        },
        { codigo: "11", referencia: "102", descripcion: 'MONITOR DELL 24"', precio: 5200, impuesto: 936, existencia: 8 },
        { codigo: "12", referencia: "103", descripcion: "TECLADO LOGITECH", precio: 1200, impuesto: 216, existencia: 15 },
        { codigo: "13", referencia: "104", descripcion: "MOUSE INALÁMBRICO", precio: 800, impuesto: 144, existencia: 20 },
        { codigo: "14", referencia: "105", descripcion: "IMPRESORA LÁSER", precio: 7500, impuesto: 1350, existencia: 3 },
    ];

    const clientes = [
        {
            id: "1",
            nombre: "PABLO ALEJANDRO DIAZ CRUZ",
            telefono: "(809) 447-7816",
            direccion: "LOS LLANOS DE GURABO TIGAYGA #42, SANTIAGO",
        },
        { id: "2", nombre: "MARIA RODRIGUEZ", telefono: "(809) 555-1234", direccion: "CALLE PRINCIPAL #10, SANTO DOMINGO" },
        { id: "3", nombre: "JUAN PEREZ", telefono: "(809) 777-5678", direccion: "AVENIDA CENTRAL #25, LA ROMANA" },
    ];

    const pedidos = [
        {
            id: "P001",
            clienteId: "1",
            productos: [
                { codigo: "10", cantidad: 2 },
                { codigo: "12", cantidad: 1 },
            ],
        },
        {
            id: "P002",
            clienteId: "2",
            productos: [
                { codigo: "11", cantidad: 1 },
                { codigo: "13", cantidad: 2 },
            ],
        },
    ];

    const facturas = [
        { id: "F001", clienteId: "1", total: 22200, fecha: "2023-05-15" },
        { id: "F002", clienteId: "2", total: 6800, fecha: "2023-05-16" },
    ];

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

    const productosTabla = document.querySelector(".products-table tbody");
    if (productosTabla) {
        if (productosTabla.querySelectorAll("tr:not(.empty-row)").length === 0) {
            const producto = productos[0];
            addProductToTable(producto.codigo, producto.descripcion, formatCurrency(producto.precio));
        }
    }

    const searchButtons = document.querySelectorAll(".input-group .icon-btn");
    searchButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const field = e.target.closest(".input-group");
            const inputSmall = field.querySelector(".input-small");
            const inputText = field.querySelector(".input-main");

            if (field.closest(".field").querySelector("label").textContent === "Cliente") {
                showInputDialog("Ingrese ID del cliente:" + " " + "por ejemplo:1,2,3", (clienteId) => {
                    const cliente = clientes.find((c) => c.id === clienteId);
                    if (cliente) {
                        inputSmall.value = cliente.id;
                        inputText.value = cliente.nombre;
                        document.querySelector('input[value*="LOS LLANOS"]').value = cliente.direccion;
                        document.querySelector('input[value*="(809) 447-7816"]').value = cliente.telefono;
                        showNotification("Cliente seleccionado: " + cliente.nombre, "success");
                    } else {
                        showNotification("Cliente no encontrado", "error");
                    }
                });
            } else if (field.closest(".field").querySelector("label").textContent === "Vendedor") {
                const vendedores = [
                    { id: "1", nombre: "PABLO A DIAZ CRUZ" },
                    { id: "2", nombre: "CARLOS MARTINEZ" },
                    { id: "3", nombre: "ANA GOMEZ" },
                ];

                showInputDialog("Ingrese ID del vendedor:" + " " + "por ejemplo:1,2,3", (vendedorId) => {
                    const vendedor = vendedores.find((v) => v.id === vendedorId);
                    if (vendedor) {
                        inputSmall.value = vendedor.id;
                        inputText.value = vendedor.nombre;
                        showNotification("Vendedor seleccionado: " + vendedor.nombre, "success");
                    } else {
                        showNotification("Vendedor no encontrado", "error");
                    }
                });
            }
        });
    });

    const addProductBtn = document.querySelector(".add-row-btn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", () => {
            openProductModal();
        });
    }

    const addProductTableBtn = document.getElementById("addProductBtn");
    if (addProductTableBtn) {
        addProductTableBtn.addEventListener("click", () => {
            openProductModal();
        });
    }

    const searchProductInput = document.querySelector(".search-box input");
    if (searchProductInput) {
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
    }

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

    function changePriceHandler() {
        const selectedRow = getSelectedRow();
        if (selectedRow) {
            const currentPrice = selectedRow.cells[5].textContent.replace(/[^\d.]/g, "");
            showInputDialog(`Ingrese el nuevo precio (Actual: ${currentPrice}):`, (newPrice) => {
                if (newPrice && !isNaN(newPrice)) {
                    selectedRow.cells[5].textContent = formatCurrency(Number.parseFloat(newPrice));
                    updateRowTotal(selectedRow);
                    updateTotals();
                    showNotification("Precio actualizado", "success");
                } else {
                    showNotification("Precio inválido", "error");
                }
            });
        } else {
            showNotification("Seleccione un producto primero", "warning");
        }
    }

    function applyDiscountHandler() {
        const selectedRow = getSelectedRow();
        if (selectedRow) {
            const currentPrice = Number.parseFloat(selectedRow.cells[5].textContent.replace(/[^\d.]/g, ""));
            showInputDialog("Ingrese el porcentaje de descuento (0-100):", (discount) => {
                if (discount && !isNaN(discount)) {
                    const discountPercent = Number.parseFloat(discount) / 100;
                    const newPrice = currentPrice * (1 - discountPercent);
                    selectedRow.cells[5].textContent = formatCurrency(newPrice);
                    updateRowTotal(selectedRow);
                    updateTotals();
                    showNotification(`Descuento de ${discount}% aplicado`, "success");
                } else {
                    showNotification("Descuento inválido", "error");
                }
            });
        } else {
            showNotification("Seleccione un producto primero", "warning");
        }
    }

    function viewImageHandler() {
        const selectedRow = getSelectedRow();
        if (selectedRow) {
            const codigo = selectedRow.cells[1].textContent;
            const producto = productos.find((p) => p.codigo === codigo);

            if (producto) {
                document.getElementById("productCode").value = producto.codigo;
                document.getElementById("productDescription").value = producto.descripcion;
                document.getElementById("productPrice1").value = formatCurrency(producto.precio);
                document.getElementById("productPrice2").value = formatCurrency(producto.precio);
                document.getElementById("productStock").value = producto.existencia.toFixed(2);

                showNotification("Imagen y detalles actualizados", "success");
            }
        } else {
            showNotification("Seleccione un producto primero", "warning");
        }
    }

    function deleteLineHandler() {
        const selectedRow = getSelectedRow();
        if (selectedRow) {
            showConfirmDialog("¿Está seguro de eliminar este producto?", () => {
                selectedRow.remove();
                updateTotals();
                showNotification("Producto eliminado", "success");
            });
        } else {
            showNotification("Seleccione un producto primero", "warning");
        }
    }

    function loadOrderHandler() {
        showInputDialog("Ingrese ID del pedido (P001 o P002):", (pedidoId) => {
            const pedido = pedidos.find((p) => p.id === pedidoId);

            if (pedido) {
                const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
                rows.forEach((row) => row.remove());

                pedido.productos.forEach((producto) => {
                    const prod = productos.find((p) => p.codigo === producto.codigo);
                    if (prod) {
                        const row = addProductToTable(prod.codigo, prod.descripcion, formatCurrency(prod.precio));
                        const qtyInput = row.querySelector(".qty-input");
                        if (qtyInput) {
                            qtyInput.value = producto.cantidad;
                            updateRowTotal(row);
                        }
                    }
                });

                updateTotals();
                showNotification(`Pedido ${pedidoId} cargado correctamente`, "success");
            } else {
                showNotification("Pedido no encontrado", "error");
            }
        });
    }

    function authorizeHandler() {
        showInputDialog("Ingrese clave de autorización:", (password) => {
            if (password === "1234") {
                showNotification("Autorización concedida", "success");
            } else {
                showNotification("Clave de autorización incorrecta", "error");
            }
        });
    }

    const saveButton = document.querySelector(".main-actions .btn.primary");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
            if (rows.length === 0) {
                showNotification("Debe agregar al menos un producto", "error");
                return;
            }

            const clienteInput = document.querySelector('.field:has(label:contains("Cliente")) .input-main');
            if (!clienteInput || !clienteInput.value) {
                showNotification("Debe seleccionar un cliente", "error");
                return;
            }

            showNotification("Factura guardada correctamente", "success");

            const facturaNum = Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0");
            document.querySelector(".invoice-number").textContent = `FACT000${facturaNum}`;
        });
    }

    const exitButton = document.querySelector(".main-actions .btn.danger");
    if (exitButton) {
        exitButton.addEventListener("click", () => {
            showConfirmDialog("¿Está seguro que desea salir? Los cambios no guardados se perderán.", () => {
                showNotification("Saliendo del sistema...", "warning");
                setTimeout(() => {
                    window.location.href = "https://example.com"; // Reemplazar con la URL de salida real
                }, 1500);
            });
        });
    }

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
                document.getElementById("productPrice1").value = precio;
                document.getElementById("productPrice2").value = precio;
                document.getElementById("productStock").value = producto.existencia.toFixed(2);
            }
        }
    });

    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("qty-input")) {
            const row = e.target.closest("tr");
            if (row) {
                updateRowTotal(row);
                updateTotals();
            }
        }
    });

    const productModal = document.getElementById("productModal");
    const modalCloseButtons = document.querySelectorAll(".modal-close, .modal .btn.secondary");

    modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (productModal) {
                productModal.classList.remove("show");
            }
        });
    });

    const modalSearchInput = document.querySelector(".modal-body .search-box input");
    if (modalSearchInput) {
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
    }

    const selectableRows = document.querySelectorAll(".selectable");
    selectableRows.forEach((row) => {
        row.addEventListener("click", () => {
            selectableRows.forEach((r) => r.classList.remove("selected"));
            row.classList.add("selected");
        });
    });

    const addFromModalButton = document.querySelector(".modal-footer .btn.primary");
    if (addFromModalButton) {
        addFromModalButton.addEventListener("click", () => {
            const selectedRow = document.querySelector(".selectable.selected");
            if (selectedRow) {
                const code = selectedRow.cells[0].textContent;
                const description = selectedRow.cells[1].textContent;
                const price = selectedRow.cells[2].textContent;

                addProductToTable(code, description, price);

                if (productModal) {
                    productModal.classList.remove("show");
                }

                showNotification("Producto agregado", "success");
            } else {
                showNotification("Por favor seleccione un producto", "warning");
            }
        });
    }

    const toastCloseButton = document.querySelector(".toast-close");
    if (toastCloseButton) {
        toastCloseButton.addEventListener("click", () => {
            const toast = document.getElementById("notification");
            if (toast) {
                toast.classList.remove("show");
            }
        });
    }

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

    const itbisCheckbox = document.querySelector('.checkbox input[type="checkbox"]');
    if (itbisCheckbox) {
        itbisCheckbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                showNotification("ITBIS incluido en el precio", "success");
            } else {
                showNotification("ITBIS no incluido en el precio", "warning");
            }
            updateTotals();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "F11") {
            e.preventDefault();
            const saveButton = document.querySelector(".main-actions .btn.primary");
            if (saveButton) {
                saveButton.click();
            }
        }

        if (e.key === "F5") {
            e.preventDefault();
            const loadOrderButton = document.getElementById("loadOrder");
            if (loadOrderButton) {
                loadOrderButton.click();
            }
        }

        if (e.key === "F8") {
            e.preventDefault();
            const authButton = document.getElementById("authorize");
            if (authButton) {
                authButton.click();
            }
        }

        if (e.key === "Escape") {
            const modals = document.querySelectorAll(".modal.show");
            modals.forEach((modal) => {
                modal.classList.remove("show");
            });
        }
    });

    updateTotals();

    function showNotification(message, type = "success") {
        const toast = document.getElementById("notification");
        const toastTitle = document.querySelector(".toast-title");
        const toastMessage = document.querySelector(".toast-message");
        const toastIcon = document.querySelector(".toast-icon i");

        if (toast && toastTitle && toastMessage && toastIcon) {
            if (type === "success") {
                toastTitle.textContent = "Éxito";
                toastIcon.className = "bx bx-check-circle";
                toastIcon.style.color = "var(--success)";
                toast.style.borderLeftColor = "var(--success)";
            } else if (type === "error") {
                toastTitle.textContent = "Error";
                toastIcon.className = "bx bx-error-circle";
                toastIcon.style.color = "var(--danger)";
                toast.style.borderLeftColor = "var(--danger)";
            } else if (type === "warning") {
                toastTitle.textContent = "Advertencia";
                toastIcon.className = "bx bx-error";
                toastIcon.style.color = "var(--warning)";
                toast.style.borderLeftColor = "var(--warning)";
            }

            toastMessage.textContent = message;

            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }
    }

    function showConfirmDialog(message, onConfirm) {
        const dialog = document.getElementById('confirmDialog');
        const messageElement = dialog.querySelector('.confirm-dialog-message');
        const confirmButton = document.getElementById('confirmDialogConfirm');
        const cancelButton = document.getElementById('confirmDialogCancel');

        messageElement.textContent = message;

        const confirmHandler = () => {
            dialog.classList.remove('show');
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
            onConfirm();
        };

        const cancelHandler = () => {
            dialog.classList.remove('show');
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
        };

        confirmButton.addEventListener('click', confirmHandler);
        cancelButton.addEventListener('click', cancelHandler);

        dialog.classList.add('show');
    }

    function showInputDialog(message, onConfirm) {
        const dialog = document.getElementById('confirmDialog');
        const messageElement = dialog.querySelector('.confirm-dialog-message');
        const confirmButton = document.getElementById('confirmDialogConfirm');
        const cancelButton = document.getElementById('confirmDialogCancel');

        messageElement.textContent = message;

        // Crear y agregar el campo de entrada
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'confirm-dialog-input';
        messageElement.appendChild(input);

        const confirmHandler = () => {
            dialog.classList.remove('show');
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
            onConfirm(input.value);
            input.remove(); // Eliminar el campo de entrada después de usarlo
        };

        const cancelHandler = () => {
            dialog.classList.remove('show');
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
            input.remove(); // Eliminar el campo de entrada si se cancela
        };

        confirmButton.addEventListener('click', confirmHandler);
        cancelButton.addEventListener('click', cancelHandler);

        dialog.classList.add('show');
        input.focus(); // Enfocar el campo de entrada
    }

    function openProductModal() {
        if (productModal) {
            productModal.classList.add("show");

            const searchInput = productModal.querySelector("input");
            if (searchInput) {
                searchInput.focus();
                searchInput.value = "";
            }
        }
    }

    function addProductToTable(code, description, price) {
        const tbody = document.querySelector("tbody");
        const emptyRow = document.querySelector(".empty-row");

        if (tbody && emptyRow) {
            const rowCount = tbody.querySelectorAll("tr:not(.empty-row)").length + 1;
            const priceValue = Number.parseFloat(price.replace(/[^\d.]/g, ""));
            const taxRate = 0.18;
            const taxValue = priceValue * taxRate;

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${rowCount}</td>
                <td>${code}</td>
                <td>REF-${code}</td>
                <td>${description}</td>
                <td>
                    <input type="number" value="1" min="1" class="qty-input">
                </td>
                <td>${formatCurrency(priceValue)}</td>
                <td>${formatCurrency(taxValue)}</td>
                <td>${formatCurrency(priceValue)}</td>
                <td>
                    <div class="row-actions">
                        <button class="icon-btn"><i class='bx bx-edit'></i></button>
                        <button class="icon-btn danger"><i class='bx bx-trash'></i></button>
                    </div>
                </td>
            `;

            tbody.insertBefore(newRow, emptyRow);

            const deleteButton = newRow.querySelector(".icon-btn.danger");
            if (deleteButton) {
                deleteButton.addEventListener("click", (e) => {
                    showConfirmDialog("¿Está seguro de eliminar este producto?", () => {
                        newRow.remove();
                        updateTotals();
                        showNotification("Producto eliminado", "success");
                    });
                });
            }

            const editButton = newRow.querySelector(".icon-btn:not(.danger)");
            if (editButton) {
                editButton.addEventListener("click", (e) => {
                    const currentPrice = newRow.cells[5].textContent.replace(/[^\d.]/g, "");
                    showInputDialog(`Ingrese el nuevo precio (Actual: ${currentPrice}):`, (newPrice) => {
                        if (newPrice && !isNaN(newPrice)) {
                            newRow.cells[5].textContent = formatCurrency(Number.parseFloat(newPrice));
                            updateRowTotal(newRow);
                            updateTotals();
                            showNotification("Precio actualizado", "success");
                        } else {
                            showNotification("Precio inválido", "error");
                        }
                    });
                });
            }

            const qtyInput = newRow.querySelector(".qty-input");
            if (qtyInput) {
                qtyInput.addEventListener("change", () => {
                    updateRowTotal(newRow);
                    updateTotals();
                });
            }

            updateTotals();
            return newRow;
        }
    }

    function updateRowTotal(row) {
        if (row) {
            const qty = Number.parseInt(row.querySelector(".qty-input").value) || 1;
            const price = Number.parseFloat(row.cells[5].textContent.replace(/[^\d.]/g, "")) || 0;
            const total = qty * price;
            const taxRate = 0.18;
            const taxValue = total * taxRate;

            row.cells[6].textContent = formatCurrency(taxValue);
            row.cells[7].textContent = formatCurrency(total);
        }
    }

    function updateTotals() {
        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
        let subtotal = 0;
        let taxTotal = 0;

        rows.forEach((row) => {
            const qty = Number.parseInt(row.querySelector(".qty-input").value) || 1;
            const price = Number.parseFloat(row.cells[5].textContent.replace(/[^\d.]/g, "")) || 0;
            const rowTotal = qty * price;
            const taxValue = Number.parseFloat(row.cells[6].textContent.replace(/[^\d.]/g, "")) || 0;

            subtotal += rowTotal;
            taxTotal += taxValue;
        });

        const totalItems = document.querySelectorAll(".total-item");
        if (totalItems.length >= 9) {
            totalItems[0].querySelector("span:last-child").textContent = formatCurrency(subtotal);

            const baseImponible = subtotal - taxTotal;
            totalItems[5].querySelector("span:last-child").textContent = formatCurrency(baseImponible);

            totalItems[6].querySelector("span:last-child").textContent = formatCurrency(taxTotal);

            totalItems[8].querySelector("span:last-child").textContent = formatCurrency(subtotal);
        }
    }

    function getSelectedRow() {
        return document.querySelector("tbody tr.selected");
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat("es-DO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    function updateAccountingDetails() {
        const accountingTable = document.getElementById("accountingTable").querySelector("tbody");
        accountingTable.innerHTML = "";

        const rows = document.querySelectorAll("tbody tr:not(.empty-row)");
        let totalVentas = 0;
        let totalITBIS = 0;

        rows.forEach((row) => {
            const qty = Number.parseInt(row.querySelector(".qty-input").value) || 1;
            const price = Number.parseFloat(row.cells[5].textContent.replace(/[^\d.]/g, "")) || 0;
            const rowTotal = qty * price;
            const taxValue = Number.parseFloat(row.cells[6].textContent.replace(/[^\d.]/g, "")) || 0;

            totalVentas += rowTotal - taxValue;
            totalITBIS += taxValue;
        });

        const entries = [
            { account: "100-1", description: "Caja", debit: totalVentas + totalITBIS, credit: 0 },
            { account: "400-1", description: "Ventas", debit: 0, credit: totalVentas },
            { account: "200-1", description: "ITBIS por Pagar", debit: 0, credit: totalITBIS },
        ];

        entries.forEach((entry) => {
            const row = accountingTable.insertRow();
            row.innerHTML = `
                <td>${entry.account}</td>
                <td>${entry.description}</td>
                <td>${formatCurrency(entry.debit)}</td>
                <td>${formatCurrency(entry.credit)}</td>
            `;
        });
    }

    const addClientBtn = document.getElementById("addClientBtn");
    if (addClientBtn) {
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
    }

    const viewClientsBtn = document.getElementById("viewClientsBtn");
    if (viewClientsBtn) {
        viewClientsBtn.addEventListener("click", () => {
            let clientList = "Lista de Clientes:\n\n";
            clientes.forEach((cliente) => {
                clientList += `ID: ${cliente.id}\nNombre: ${cliente.nombre}\nTeléfono: ${cliente.telefono}\nDirección: ${cliente.direccion}\n\n`;
            });
            showConfirmDialog(clientList);
        });
    }

    const createOrderBtn = document.getElementById("createOrderBtn");
    if (createOrderBtn) {
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
    }

    const viewOrdersBtn = document.getElementById("viewOrdersBtn");
    if (viewOrdersBtn) {
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
    }

    const viewInvoicesBtn = document.getElementById("viewInvoicesBtn");
    if (viewInvoicesBtn) {
        viewInvoicesBtn.addEventListener("click", () => {
            let invoiceList = "Lista de Facturas:\n\n";
            facturas.forEach((factura) => {
                const cliente = clientes.find((c) => c.id === factura.clienteId);
                invoiceList += `ID: ${factura.id}\nCliente: ${cliente ? cliente.nombre : "Desconocido"}\nTotal: ${formatCurrency(factura.total)}\nFecha: ${factura.fecha}\n\n`;
            });
            showConfirmDialog(invoiceList);
        });
    }

    const changeImageBtn = document.getElementById("changeImageBtn");
    const changeImageInput = document.getElementById("changeImageInput");
    if (changeImageBtn && changeImageInput) {
        changeImageBtn.addEventListener("click", () => {
            changeImageInput.click();
        });

        changeImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById("productImage").src = event.target.result;
                    showNotification("Imagen actualizada", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const invoiceComment = document.getElementById("invoiceComment");
    const commentList = document.getElementById("commentList");
    if (invoiceComment && commentList) {
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
    }
});