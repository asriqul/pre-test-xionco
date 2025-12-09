const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
    const sql = `
        SELECT 
            p.id, 
            p.product_name, 
            p.unit_price, 
            s.current_stock
        FROM 
            products p
        JOIN 
            stock s ON p.id = s.product_id
        ORDER BY 
            p.id ASC
    `;

    try {
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error saat mengambil data produk dan stok:', err);
        res.status(500).json({ error: 'Gagal memuat daftar produk dari database.' });
    }
});

router.post('/', async (req, res) => {
    const { product_name, unit_price, current_stock } = req.body;

    if (!product_name || unit_price == null || current_stock == null) {
        return res.status(400).json({ error: 'product_name, unit_price, dan current_stock wajib diisi.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [productResult] = await connection.execute(
            'INSERT INTO products (product_name, unit_price) VALUES (?, ?)',
            [product_name, unit_price]
        );

        const productId = productResult.insertId;

        await connection.execute(
            'INSERT INTO stock (product_id, current_stock) VALUES (?, ?)',
            [productId, current_stock]
        );

        await connection.commit();

        res.status(201).json({
            id: productId,
            product_name,
            unit_price,
            current_stock,
        });
    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch (_) {}
        }
        console.error('Error saat menambah produk:', err);
        res.status(500).json({ error: 'Gagal menambah produk.' });
    } finally {
        if (connection) connection.release();
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { product_name, unit_price, current_stock } = req.body;

    if (!product_name || unit_price == null || current_stock == null) {
        return res.status(400).json({ error: 'product_name, unit_price, dan current_stock wajib diisi.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [productResult] = await connection.execute(
            'UPDATE products SET product_name = ?, unit_price = ? WHERE id = ?',
            [product_name, unit_price, id]
        );

        await connection.execute(
            'UPDATE stock SET current_stock = ? WHERE product_id = ?',
            [current_stock, id]
        );

        await connection.commit();

        if (productResult.affectedRows === 0) {
            return res.status(404).json({ error: `Produk dengan ID ${id} tidak ditemukan.` });
        }

        res.json({ message: 'Produk berhasil diperbarui.' });
    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch (_) {}
        }
        console.error('Error saat memperbarui produk:', err);
        res.status(500).json({ error: 'Gagal memperbarui produk.' });
    } finally {
        if (connection) connection.release();
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.execute('DELETE FROM stock WHERE product_id = ?', [id]);
        const [productResult] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

        await connection.commit();

        if (productResult.affectedRows === 0) {
            return res.status(404).json({ error: `Produk dengan ID ${id} tidak ditemukan.` });
        }

        res.json({ message: `Produk dengan ID ${id} berhasil dihapus.` });
    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch (_) {}
        }
        console.error('Error saat menghapus produk:', err);
        res.status(500).json({ error: 'Gagal menghapus produk.' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;