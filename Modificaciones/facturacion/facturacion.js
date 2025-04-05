document.addEventListener("DOMContentLoaded", () => {
    feather.replace()
  
    // Elementos del DOM
    const invoiceListView = document.getElementById("invoiceListView")
    const invoiceFormView = document.getElementById("invoiceFormView")
    const addInvoiceBtn = document.getElementById("addInvoiceBtn")
    const backBtn = document.getElementById("backBtn")
    const invoiceList = document.getElementById("invoiceList")
    const formTitle = document.getElementById("formTitle")
    const invoiceId = document.getElementById("invoiceId")
    const invoiceDate = document.getElementById("invoiceDate")
    const invoiceDateList = document.getElementById("invoiceDateList")
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toastMessage")
    const modal = document.getElementById("myModal")
    const modalMessage = document.getElementById("modalMessage")
    const modalConfirm = document.getElementById("modalConfirm")
    const modalCancel = document.getElementById("modalCancel")
    const productModal = document.getElementById("productModal")
    const modalProductList = document.getElementById("modalProductList")
    const productModalCancel = document.getElementById("productModalCancel")
    const tabs = document.querySelectorAll(".tab")
    const tabContents = document.querySelectorAll(".tab-content")
    const productList = document.getElementById("productList")
    const addProductBtn = document.querySelector('[data-action="add-product"]')
    const searchClientBtn = document.querySelector(".search-client")
    const searchVendorBtn = document.querySelector(".search-vendor")
    const saveBtn = document.querySelector('[data-action="save"]')
    const exitBtn = document.querySelector('[data-action="exit"]')
    const viewInvoicesBtn = document.querySelector('[data-action="view-invoices"]')
    let isEditing = false
    let editIndex = null
    let editingProduct = false
    let editingProductIndex = null
  
    // Datos iniciales
    const invoices = [
      {
        id: "FACT000274",
        fecha: "19/12/2024 14:30",
        cliente: "PABLO ALEJANDRO DIAZ CRUZ",
        total: 26196.0,
        estado: "Pendiente",
        productos: [],
        comentarios: [],
      },
      {
        id: "FACT000275",
        fecha: "20/12/2024 09:15",
        cliente: "MARIA RODRIGUEZ",
        total: 15000.0,
        estado: "Pagada",
        productos: [],
        comentarios: [],
      },
    ]
  
    const clientes = [
      {
        id: "1",
        nombre: "PABLO ALEJANDRO DIAZ CRUZ",
        limiteCredito: "1,000,000.00",
        direccion: "LOS LLANOS DE GURABO TIGAYGA #42, SANTIAGO",
        telefono: "(809) 447-7816",
        celular: "(809) 447-7816",
      },
      {
        id: "2",
        nombre: "MARIA RODRIGUEZ",
        limiteCredito: "500,000.00",
        direccion: "AVENIDA 27 DE FEBRERO #123, SANTO DOMINGO",
        telefono: "(809) 555-1234",
        celular: "(809) 555-5678",
      },
    ]
  
    const vendedores = [{ id: "1", nombre: "PABLO A DIAZ CRUZ" }]
  
    // Catálogo de productos disponibles para seleccionar
    const catalogoProductos = [
      {
        id: 1,
        codigo: "10",
        referencia: "REF-10",
        descripcion: "CPU DELL CI5 DESKTOP",
        precio: 10500.0,
        impuesto: 3780.0,
        precio1: 10500.0,
        precio2: 10500.0,
        existencia: 5.0,
      },
      {
        id: 2,
        codigo: "12",
        referencia: "REF-12",
        descripcion: "TECLADO LOGITECH",
        precio: 1200.0,
        impuesto: 216.0,
        precio1: 1200.0,
        precio2: 1200.0,
        existencia: 10.0,
      },
      {
        id: 3,
        codigo: "15",
        referencia: "REF-15",
        descripcion: 'MONITOR DELL 24"',
        precio: 8500.0,
        impuesto: 1530.0,
        precio1: 8500.0,
        precio2: 8500.0,
        existencia: 8.0,
      },
      {
        id: 4,
        codigo: "20",
        referencia: "REF-20",
        descripcion: "MOUSE INALÁMBRICO",
        precio: 850.0,
        impuesto: 153.0,
        precio1: 850.0,
        precio2: 850.0,
        existencia: 15.0,
      },
      {
        id: 5,
        codigo: "25",
        referencia: "REF-25",
        descripcion: "IMPRESORA HP LASERJET",
        precio: 12000.0,
        impuesto: 2160.0,
        precio1: 12000.0,
        precio2: 12000.0,
        existencia: 3.0,
      },
    ]
  
    let productos = [
      {
        id: 1,
        codigo: "10",
        referencia: "REF-10",
        descripcion: "CPU DELL CI5 DESKTOP",
        cantidad: 2,
        precio: 10500.0,
        impuesto: 3780.0,
        total: 24780.0,
        precio1: 10500.0,
        precio2: 10500.0,
        existencia: 5.0,
      },
      {
        id: 2,
        codigo: "12",
        referencia: "REF-12",
        descripcion: "TECLADO LOGITECH",
        cantidad: 1,
        precio: 1200.0,
        impuesto: 216.0,
        total: 1416.0,
        precio1: 1200.0,
        precio2: 1200.0,
        existencia: 10.0,
      },
    ]
  
    // Funciones de utilidad
    function switchView(viewToShow, viewToHide) {
      viewToHide.classList.remove("active")
      setTimeout(() => {
        viewToShow.classList.add("active")
      }, 300)
    }
  
    function showToast(message) {
      toastMessage.textContent = message
      toast.classList.add("show")
      setTimeout(() => toast.classList.remove("show"), 3000)
    }
  
    function showModal(message, onConfirm) {
      modalMessage.innerHTML = message
      modal.classList.add("show")
      modalConfirm.onclick = () => {
        onConfirm()
        modal.classList.remove("show")
      }
      modalCancel.onclick = () => modal.classList.remove("show")
      document.querySelector(".modal-close").onclick = () => modal.classList.remove("show")
    }
  
    // Mostrar modal de selección de productos
    function showProductModal(onSelect) {
      renderModalProductList()
      productModal.classList.add("show")
  
      // Limpiar el campo de búsqueda
      const searchField = document.getElementById("modalProductSearch")
      if (searchField) {
        searchField.value = ""
        searchField.focus()
      }
  
      // Configurar eventos para cerrar el modal
      productModalCancel.onclick = () => productModal.classList.remove("show")
      document.querySelector(".product-modal-close").onclick = () => productModal.classList.remove("show")
  
      // Cerrar modal con Escape
      document.addEventListener("keydown", function closeOnEscape(e) {
        if (e.key === "Escape" && productModal.classList.contains("show")) {
          productModal.classList.remove("show")
          document.removeEventListener("keydown", closeOnEscape)
        }
      })
    }
  
    // Filtrar productos en el modal
    function filterModalProducts(searchTerm) {
      const filteredProducts = catalogoProductos.filter(
        (product) =>
          product.codigo.toLowerCase().includes(searchTerm) || product.descripcion.toLowerCase().includes(searchTerm),
      )
      renderModalProductList(filteredProducts)
    }
  
    // Renderizar lista de productos en el modal
    function renderModalProductList(productsToRender = catalogoProductos) {
      modalProductList.innerHTML = ""
      productsToRender.forEach((product) => {
        const row = document.createElement("tr")
        row.innerHTML = `
        <td data-label="Código">${product.codigo}</td>
        <td data-label="Descripción">${product.descripcion}</td>
        <td data-label="Precio">${product.precio.toFixed(2)}</td>
        <td data-label="Existencia">${product.existencia.toFixed(2)}</td>
        <td data-label="Acciones">
          <button class="btn-icon primary select-product-btn" data-id="${product.id}" title="Seleccionar producto">
            <i data-feather="plus-circle"></i>
          </button>
        </td>
      `
        modalProductList.appendChild(row)
      })
      feather.replace()
  
      // Asegurar que los botones de selección sean visibles y funcionales
      document.querySelectorAll(".select-product-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = Number.parseInt(e.currentTarget.getAttribute("data-id"))
          const selectedProduct = catalogoProductos.find((p) => p.id === productId)
          if (editingProduct && editingProductIndex !== null) {
            updateProduct(selectedProduct)
          } else {
            addNewProduct(selectedProduct)
          }
          productModal.classList.remove("show")
        })
      })
    }
  
    // Renderizar lista de facturas
    function renderInvoiceList() {
      invoiceList.innerHTML = ""
      invoices.forEach((invoice, index) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td data-label="ID Factura">${invoice.id}</td>
                  <td data-label="Fecha">${invoice.fecha}</td>
                  <td data-label="Cliente">${invoice.cliente}</td>
                  <td data-label="Total">${invoice.total.toFixed(2)}</td>
                  <td data-label="Estado">${invoice.estado}</td>
                  <td data-label="Acciones">
                      <button class="btn-icon edit-btn" data-index="${index}"><i data-feather="edit"></i></button>
                      <button class="btn-icon btn-danger" data-index="${index}"><i data-feather="trash"></i></button>
                  </td>
              `
        invoiceList.appendChild(row)
      })
      feather.replace()
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.currentTarget.getAttribute("data-index")
          editInvoice(index)
        })
      })
      document.querySelectorAll(".btn-danger").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.currentTarget.getAttribute("data-index")
          showModal("¿Estás seguro de que deseas eliminar esta factura?", () => {
            invoices.splice(index, 1)
            renderInvoiceList()
            showToast("Factura eliminada correctamente")
          })
        })
      })
    }
  
    // Renderizar lista de productos
    function renderProductList() {
      productList.innerHTML = ""
      productos.forEach((product, index) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td data-label="#">${index + 1}</td>
                  <td data-label="Código">${product.codigo}</td>
                  <td data-label="Referencia">${product.referencia}</td>
                  <td data-label="Descripción">${product.descripcion}</td>
                  <td data-label="Cant."><input type="number" value="${product.cantidad}" class="qty-input" data-index="${index}"></td>
                  <td data-label="Precio">${product.precio.toFixed(2)}</td>
                  <td data-label="Impuesto">${product.impuesto.toFixed(2)}</td>
                  <td data-label="Total">${product.total.toFixed(2)}</td>
                  <td data-label="Acciones">
                      <button class="btn-icon edit-btn" data-index="${index}" data-action="edit-product"><i data-feather="edit"></i></button>
                      <button class="btn-icon btn-danger" data-index="${index}" data-action="delete-line"><i data-feather="trash"></i></button>
                  </td>
              `
        productList.appendChild(row)
      })
      feather.replace()
      document.querySelectorAll(".qty-input").forEach((input) => {
        input.addEventListener("change", (e) => {
          const index = e.target.getAttribute("data-index")
          const newQty = Number.parseFloat(e.target.value)
          productos[index].cantidad = newQty
          productos[index].total = productos[index].precio * newQty + productos[index].impuesto * newQty
          updateTotals()
          renderProductList()
        })
      })
      document.querySelectorAll('[data-action="edit-product"]').forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.currentTarget.getAttribute("data-index")
          editingProduct = true
          editingProductIndex = index
          showProductModal(updateProduct)
        })
      })
      document.querySelectorAll('[data-action="delete-line"]').forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = e.currentTarget.getAttribute("data-index")
          showModal("¿Estás seguro de que deseas eliminar este producto?", () => {
            productos.splice(index, 1)
            updateTotals()
            renderProductList()
            showToast("Producto eliminado correctamente")
          })
        })
      })
    }
  
    // Actualizar totales
    function updateTotals() {
      const grossTotal = productos.reduce((sum, product) => sum + product.precio * product.cantidad, 0)
      const itbis = productos.reduce((sum, product) => sum + product.impuesto * product.cantidad, 0)
      const netTotal = grossTotal + itbis
      document.getElementById("grossTotal").textContent = grossTotal.toFixed(2)
      document.getElementById("itbis").textContent = itbis.toFixed(2)
      document.getElementById("netTotal").textContent = netTotal.toFixed(2)
      document.getElementById("taxableBase").textContent = grossTotal.toFixed(2)
    }
  
    // Editar factura
    function editInvoice(index) {
      isEditing = true
      editIndex = index
      const invoice = invoices[index]
      formTitle.textContent = "Editar Factura"
      invoiceId.textContent = invoice.id
      invoiceDate.textContent = invoice.fecha
      const cliente = clientes.find((c) => c.nombre === invoice.cliente)
      if (cliente) {
        document.getElementById("clientId").value = cliente.id
        document.getElementById("clientName").value = cliente.nombre
        document.getElementById("creditLimit").value = cliente.limiteCredito
        document.getElementById("shippingAddress").value = cliente.direccion
        document.getElementById("phone").value = cliente.telefono
        document.getElementById("mobile").value = cliente.celular
      }
      productos = invoice.productos.length ? [...invoice.productos] : [...productos]
      renderProductList()
      updateTotals()
      switchView(invoiceFormView, invoiceListView)
    }
  
    // Añadir nuevo producto
    function addNewProduct(product) {
      const newProduct = {
        id: product.id,
        codigo: product.codigo,
        referencia: product.referencia,
        descripcion: product.descripcion,
        cantidad: 1,
        precio: product.precio,
        impuesto: product.impuesto,
        total: product.precio + product.impuesto,
        precio1: product.precio1,
        precio2: product.precio2,
        existencia: product.existencia,
      }
      productos.push(newProduct)
      renderProductList()
      updateTotals()
      showToast("Producto añadido correctamente")
    }
  
    // Actualizar producto existente
    function updateProduct(product) {
      if (editingProduct && editingProductIndex !== null) {
        const currentQty = productos[editingProductIndex].cantidad
        productos[editingProductIndex] = {
          id: product.id,
          codigo: product.codigo,
          referencia: product.referencia,
          descripcion: product.descripcion,
          cantidad: currentQty,
          precio: product.precio,
          impuesto: product.impuesto,
          total: product.precio * currentQty + product.impuesto * currentQty,
          precio1: product.precio1,
          precio2: product.precio2,
          existencia: product.existencia,
        }
        editingProduct = false
        editingProductIndex = null
        renderProductList()
        updateTotals()
        showToast("Producto actualizado correctamente")
      }
    }
  
    // Resetear formulario
    function resetForm() {
      formTitle.textContent = "Nueva Factura"
      invoiceId.textContent = `FACT${String(invoices.length + 1).padStart(6, "0")}`
      const currentDate = new Date().toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      invoiceDate.textContent = currentDate
      invoiceDateList.textContent = currentDate
      document.getElementById("clientId").value = clientes[0].id
      document.getElementById("clientName").value = clientes[0].nombre
      document.getElementById("creditLimit").value = clientes[0].limiteCredito
      document.getElementById("shippingAddress").value = clientes[0].direccion
      document.getElementById("phone").value = clientes[0].telefono
      document.getElementById("mobile").value = clientes[0].celular
      document.getElementById("vendorId").value = vendedores[0].id
      document.getElementById("vendorName").value = vendedores[0].nombre
      document.getElementById("currency").value = "RD$"
      document.getElementById("warehouse").value = "ALMACEN PRINCIPAL"
      document.getElementById("project").value = "SOFTWARE EVOLUTION ARPA SRL"
      document.getElementById("ncfType").value = "FACTURA VALIDA CREDITO FISCAL"
      document.getElementById("saleType").value = "INGRESOS POR OPERACIONES NO FINANCIERAS"
      document.getElementById("paperType").value = "FACTURA PEQUEÑA"
      document.querySelector('input[name="paymentType"][value="credito"]').checked = true
      document.getElementById("itbisIncluded").checked = true
      document.getElementById("cardPercentage").value = "0.00"
      document.getElementById("rate").value = "1.00"
      document.getElementById("invoiceComment").value = ""
      productos = []
      renderProductList()
      updateTotals()
      isEditing = false
      editIndex = null
    }
  
    // Manejo de tabs
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
        tab.classList.add("active")
        document.getElementById(tab.getAttribute("data-tab")).classList.add("active")
      })
    })
  
    // Añadir producto
    addProductBtn.addEventListener("click", () => {
      editingProduct = false
      editingProductIndex = null
      showProductModal(addNewProduct)
    })
  
    // Buscar cliente
    searchClientBtn.addEventListener("click", () => {
      let clientList = "<ul>"
      clientes.forEach((cliente) => {
        clientList += `<li data-id="${cliente.id}">${cliente.nombre}</li>`
      })
      clientList += "</ul>"
      showModal(clientList, () => {
        const selectedClient = document.querySelector("#modalMessage li:hover")
        if (selectedClient) {
          const cliente = clientes.find((c) => c.id === selectedClient.getAttribute("data-id"))
          document.getElementById("clientId").value = cliente.id
          document.getElementById("clientName").value = cliente.nombre
          document.getElementById("creditLimit").value = cliente.limiteCredito
          document.getElementById("shippingAddress").value = cliente.direccion
          document.getElementById("phone").value = cliente.telefono
          document.getElementById("mobile").value = cliente.celular
          showToast("Cliente seleccionado correctamente")
        }
      })
    })
  
    // Buscar vendedor
    searchVendorBtn.addEventListener("click", () => {
      let vendorList = "<ul>"
      vendedores.forEach((vendor) => {
        vendorList += `<li data-id="${vendor.id}">${vendor.nombre}</li>`
      })
      vendorList += "</ul>"
      showModal(vendorList, () => {
        const selectedVendor = document.querySelector("#modalMessage li:hover")
        if (selectedVendor) {
          const vendor = vendedores.find((v) => v.id === selectedVendor.getAttribute("data-id"))
          document.getElementById("vendorId").value = vendor.id
          document.getElementById("vendorName").value = vendor.nombre
          showToast("Vendedor seleccionado correctamente")
        }
      })
    })
  
    // Guardar factura
    saveBtn.addEventListener("click", () => {
      const newInvoice = {
        id: invoiceId.textContent,
        fecha: invoiceDate.textContent,
        cliente: document.getElementById("clientName").value,
        total: Number.parseFloat(document.getElementById("netTotal").textContent),
        estado: "Pendiente",
        productos: [...productos],
        comentarios: [document.getElementById("invoiceComment").value].filter((c) => c),
      }
      if (isEditing) {
        invoices[editIndex] = newInvoice
        showToast("Factura actualizada correctamente")
      } else {
        invoices.push(newInvoice)
        showToast("Factura creada correctamente")
      }
      renderInvoiceList()
      switchView(invoiceListView, invoiceFormView)
    })
  
    // Salir
    exitBtn.addEventListener("click", () => {
      showModal("¿Estás seguro de que deseas salir sin guardar?", () => {
        switchView(invoiceListView, invoiceFormView)
      })
    })
  
    // Ver facturas
    viewInvoicesBtn.addEventListener("click", () => {
      switchView(invoiceListView, invoiceFormView)
    })
  
    // Eventos principales
    addInvoiceBtn.addEventListener("click", () => {
      resetForm()
      switchView(invoiceFormView, invoiceListView)
    })
  
    backBtn.addEventListener("click", () => {
      showModal("¿Estás seguro de que deseas volver sin guardar?", () => {
        switchView(invoiceListView, invoiceFormView)
      })
    })
  
    // Inicialización
    invoiceListView.classList.add("active")
    invoiceFormView.classList.remove("active")
    renderInvoiceList()
  
    // Cerrar toast al hacer clic en el botón de cerrar
    document.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.remove("show")
    })
  
    // Mejorar la búsqueda de productos en el modal
    document.getElementById("modalProductSearch")?.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const filteredProducts = catalogoProductos.filter(
        (product) =>
          product.codigo.toLowerCase().includes(searchTerm) ||
          product.descripcion.toLowerCase().includes(searchTerm) ||
          product.referencia.toLowerCase().includes(searchTerm),
      )
      renderModalProductList(filteredProducts)
    })
  })
  
  