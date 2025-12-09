const express = require('express');
// const db = require('./src/db');
const purchasesRoutes = require('./src/purchasesRoutes')
const productRoutes = require('./src/productRoutes')
const app = express();
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.render('admin');
});

app.get('/products', (req, res) => {
    res.render('products');
});

app.use(express.static('public'));

app.use('/api/purchases', purchasesRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, ()=> {
    console.log(`backend berjalan pada http://localhost:${PORT}`);
})
