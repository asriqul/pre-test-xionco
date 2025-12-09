document.addEventListener('DOMContentLoaded', () => {
    const purchaseForm = document.getElementById('purchase-form');
    const purchaseList = document.getElementById('purchase-list');
    const messageArea = document.getElementById('message-area');
    const productNameSelect = document.getElementById('product-name');
    const priceInput = document.getElementById('price');

    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name-input');
    const productPriceInput = document.getElementById('product-price-input');
    const productStockInput = document.getElementById('product-stock-input');
    const productSubmitBtn = document.getElementById('product-submit-btn');
    const productCancelEditBtn = document.getElementById('product-cancel-edit');
    const productMessageArea = document.getElementById('product-message');
    const productStockList = document.getElementById('product-stock-list');

    let currentProducts = [];


    function displayMessage(type, message) {
        if (!messageArea) return;
        messageArea.textContent = message;
        messageArea.className = `message ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000);
    }

    function displayProductMessage(type, message) {
        if (!productMessageArea) return;
        productMessageArea.textContent = message;
        productMessageArea.className = `message ${type}`;
        productMessageArea.style.display = 'block';
        setTimeout(() => {
            productMessageArea.style.display = 'none';
        }, 5000);
    }

    async function fetchPurchases() {
        purchaseList.innerHTML = '<tr><td colspan="7" style="text-align: center;">Memuat data...</td></tr>';
        try {
            const response = await fetch('/api/purchases');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal memuat data pembelian.');
            }

            renderPurchases(data);

        } catch (error) {
            console.error('Error saat memuat data:', error);
            purchaseList.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">${error.message}</td></tr>`;
        }
    }

    function renderPurchases(purchases) {
        if (!purchaseList) return;
        purchaseList.innerHTML = '';
        if (purchases.length === 0) {
            purchaseList.innerHTML = '<tr><td colspan="7" style="text-align: center;">Belum ada data pembelian.</td></tr>';
            return;
        }

        purchases.forEach(purchase => {
            const row = purchaseList.insertRow();

            const purchaseDate = new Date(purchase.purchase_date).toLocaleDateString('id-ID');
            const total = new Intl.NumberFormat('id-ID').format(purchase.total_amount);
            const unitPrice = new Intl.NumberFormat('id-ID').format(purchase.unit_price);


            row.innerHTML = `
                <td>${purchase.id}</td>
                <td>${purchaseDate}</td>
                <td>${purchase.product_name}</td>
                <td>${purchase.quantity}</td>
                <td>Rp ${unitPrice}</td>
                <td>Rp ${total}</td>
                <td>
                    <button class="btn danger cancel-btn" data-id="${purchase.id}">Cancel</button>
                </td>
            `;
        });
    }

    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const product_name = productNameSelect ? productNameSelect.value : '';
            const quantity = parseInt(document.getElementById('quantity').value);
            const price = priceInput ? parseFloat(priceInput.value) : 0;

            try {
                const response = await fetch('/api/purchases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product_name, quantity, price }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Gagal menyimpan data.');
                }

                displayMessage('success', result.message);
                purchaseForm.reset(); 
                fetchPurchases(); 

            } catch (error) {
                console.error('Error input data:', error);
                displayMessage('error', error.message);
            }
        });
    }

    if (purchaseList) {
        purchaseList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('cancel-btn')) {
                const id = e.target.dataset.id;

                if (!confirm(`Apakah Anda yakin ingin membatalkan Pembelian ID ${id}?`)) {
                    return;
                }

                try {
                    const response = await fetch(`/api/purchases/${id}`, {
                        method: 'DELETE',
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Gagal membatalkan pembelian.');
                    }

                    displayMessage('success', result.message);
                    fetchPurchases(); 

                } catch (error) {
                    console.error('Error saat membatalkan:', error);
                    displayMessage('error', error.message);
                }
            }
        });
    }

    async function fetchProductsAndStock() {
        try {
            const response = await fetch('/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();
            currentProducts = products;
            renderProducts(products);
            populateProductSelect(products);

        } catch (error) {
            console.error('Error saat memuat data produk dan stok:', error);
            const list = document.getElementById('product-stock-list');
            if (list) {
                list.innerHTML = '<tr><td colspan="5">Gagal memuat data produk. Cek konsol server.</td></tr>';
            }
        }
    }

    function renderProducts(products) {
        const list = document.getElementById('product-stock-list');
        if (!list) return;
        list.innerHTML = ''; 

        if (products.length === 0) {
            list.innerHTML = '<tr><td colspan="5">Tidak ada data produk yang tersedia.</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');

            // Tentukan warna stok: Hijau (Aman), Kuning (Sedikit), Merah (Habis)
            let stockClass = '';
            if (product.current_stock < 10) {
                stockClass = 'low-stock';
            }
            if (product.current_stock === 0) {
                stockClass = 'out-of-stock';
            }

            row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.product_name}</td>
            <td>${new Intl.NumberFormat('id-ID').format(product.unit_price)}</td>
            <td class="${stockClass}"><strong>${product.current_stock}</strong></td>
            <td>
                <button class="btn" data-action="edit-product" data-id="${product.id}">Edit</button>
                <button class="btn danger" data-action="delete-product" data-id="${product.id}">Hapus</button>
            </td>
        `;
            list.appendChild(row);
        });
    }

    function populateProductSelect(products) {
        if (!productNameSelect) return;

        productNameSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_name;
            option.textContent = `${product.product_name} (Rp ${new Intl.NumberFormat('id-ID').format(product.unit_price)})`;
            option.setAttribute('data-price', product.unit_price);
            productNameSelect.appendChild(option);
        });

        if (priceInput) {
            productNameSelect.addEventListener('change', () => {
                const selectedOption = productNameSelect.options[productNameSelect.selectedIndex];
                const price = selectedOption ? selectedOption.getAttribute('data-price') : '';
                priceInput.value = price || '';
            });
        }
    }

    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = productIdInput ? productIdInput.value : '';
            const product_name = productNameInput ? productNameInput.value : '';
            const unit_price = productPriceInput ? parseFloat(productPriceInput.value) : 0;
            const current_stock = productStockInput ? parseInt(productStockInput.value) : 0;

            const payload = { product_name, unit_price, current_stock };

            try {
                let response;
                if (id) {
                    response = await fetch(`/api/products/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                } else {
                    response = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                }

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Gagal menyimpan produk.');
                }

                displayProductMessage('success', result.message || (id ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.'));
                resetProductForm();
                await fetchProductsAndStock();
            } catch (error) {
                console.error('Error CRUD produk:', error);
                displayProductMessage('error', error.message);
            }
        });
    }

    if (productCancelEditBtn) {
        productCancelEditBtn.addEventListener('click', () => {
            resetProductForm();
        });
    }

    function resetProductForm() {
        if (!productForm) return;
        productForm.reset();
        if (productIdInput) productIdInput.value = '';
        if (productSubmitBtn) productSubmitBtn.textContent = 'Tambah Produk';
    }

    if (productStockList) {
        productStockList.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const id = button.getAttribute('data-id');
            if (!action || !id) return;

            if (action === 'edit-product') {
                const product = currentProducts.find(p => String(p.id) === id);
                if (!product) return;

                if (productIdInput) productIdInput.value = product.id;
                if (productNameInput) productNameInput.value = product.product_name;
                if (productPriceInput) productPriceInput.value = product.unit_price;
                if (productStockInput) productStockInput.value = product.current_stock;
                if (productSubmitBtn) productSubmitBtn.textContent = 'Simpan Perubahan';

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (action === 'delete-product') {
                if (!confirm(`Hapus produk ID ${id}?`)) return;

                try {
                    const response = await fetch(`/api/products/${id}`, {
                        method: 'DELETE',
                    });
                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Gagal menghapus produk.');
                    }

                    displayProductMessage('success', result.message || 'Produk berhasil dihapus.');
                    await fetchProductsAndStock();
                } catch (error) {
                    console.error('Error hapus produk:', error);
                    displayProductMessage('error', error.message);
                }
            }
        });
    }

    if (purchaseList) {
        fetchPurchases();
    }

    fetchProductsAndStock();

});
