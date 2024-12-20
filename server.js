import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001; // Changed port number

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const filePath = path.join(process.cwd(), 'suppliersData.json');

app.get('/suppliers', (req, res) => {
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliersData = JSON.parse(data);
            console.log('Suppliers data:', suppliersData);
            res.send(suppliersData);
        } catch (parseError) {
            console.error('Error parsing suppliers data:', parseError);
            res.status(500).send('Error parsing suppliers data');
        }
    });
});

app.post('/suppliers', (req, res) => {
    const newSupplier = req.body;
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliersData = JSON.parse(data);
            console.log('Suppliers data before adding new supplier:', suppliersData);
            if (!Array.isArray(suppliersData.value)) {
                throw new Error('Suppliers data is not an array');
            }
            suppliersData.value.push(newSupplier);
            console.log('Suppliers data after adding new supplier:', suppliersData);
            fs.writeFile(filePath, JSON.stringify(suppliersData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving suppliers data:', err);
                    return res.status(500).send('Error saving suppliers data');
                }
                res.send('Supplier added successfully');
            });
        } catch (parseError) {
            console.error('Error parsing suppliers data:', parseError);
            res.status(500).send('Error parsing suppliers data');
        }
    });
});

app.put('/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    const updatedSupplier = req.body;
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliersData = JSON.parse(data);
            console.log('Suppliers data before updating supplier:', suppliersData);
            if (!Array.isArray(suppliersData.value)) {
                throw new Error('Suppliers data is not an array');
            }
            const index = suppliersData.value.findIndex(supplier => supplier.ID.toString() === supplierId);
            if (index === -1) {
                return res.status(404).send('Supplier not found');
            }
            suppliersData.value[index] = updatedSupplier;
            console.log('Suppliers data after updating supplier:', suppliersData);
            fs.writeFile(filePath, JSON.stringify(suppliersData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving suppliers data:', err);
                    return res.status(500).send('Error saving suppliers data');
                }
                res.send('Supplier updated successfully');
            });
        } catch (parseError) {
            console.error('Error parsing suppliers data:', parseError);
            res.status(500).send('Error parsing suppliers data');
        }
    });
});

app.delete('/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliersData = JSON.parse(data);
            console.log('Suppliers data before deleting supplier:', suppliersData);
            if (!Array.isArray(suppliersData.value)) {
                throw new Error('Suppliers data is not an array');
            }
            const index = suppliersData.value.findIndex(supplier => supplier.ID.toString() === supplierId);
            if (index === -1) {
                return res.status(404).send('Supplier not found');
            }
            suppliersData.value.splice(index, 1);
            console.log('Suppliers data after deleting supplier:', suppliersData);
            fs.writeFile(filePath, JSON.stringify(suppliersData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving suppliers data:', err);
                    return res.status(500).send('Error saving suppliers data');
                }
                res.send('Supplier deleted successfully');
            });
        } catch (parseError) {
            console.error('Error parsing suppliers data:', parseError);
            res.status(500).send('Error parsing suppliers data');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});