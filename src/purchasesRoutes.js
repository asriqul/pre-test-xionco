
const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.post('/', async (req, res) => {
    const { product_name, quantity, price } = req.body;

    const totalAmount = quantity * price;

    const sql = 'INSERT INTO purchases (product_name, quantity, unit_price, total_amount, purchase_date) VALUES (?, ?, ?, ?, NOW())';
    const values = [product_name, quantity, price, totalAmount];

    try {
        const [result] = await db.execute(sql, values);

        res.status(201).json({
            message: 'Pembelian berhasil diinput',
            purchase_id: result.insertId
        });
    } catch (err) {
        console.error('Error saat input pembelian:', err);
        res.status(500).json({ error: 'Gagal menginput pembelian' });
    }
});

router.delete('/:id', async (req, res) => {
    const purchaseId = req.params.id;
    const sql = 'DELETE FROM purchases WHERE id = ?';

    try {
        const [result] = await db.execute(sql, [purchaseId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Pembelian dengan ID ${purchaseId} tidak ditemukan.` });
        }

        res.json({ message: `Pembelian ID ${purchaseId} berhasil dibatalkan oleh Admin.` });

    } catch (err) {
        console.error('Error saat membatalkan pembelian:', err);
        res.status(500).json({ error: 'Gagal membatalkan pembelian' });
    }
});
router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM purchases ORDER BY purchase_date DESC';

    try {
        const [rows] = await db.query(sql);

        res.status(200).json(rows);

    } catch (err) {
        console.error('Error saat mengambil data pembelian:', err);

        res.status(500).json({ error: 'Gagal memuat daftar pembelian dari database.' });
    }
});

module.exports = router;