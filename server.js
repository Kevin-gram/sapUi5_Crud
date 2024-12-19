import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001; // Changed port number

app.use(express.json());

app.get('/suppliers', (req, res) => {
    const filePath = path.join(process.cwd(), 'suppliersData.json');
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliers = JSON.parse(data);
            res.send(suppliers);
        } catch (parseError) {
            console.error('Error parsing suppliers data:', parseError);
            res.status(500).send('Error parsing suppliers data');
        }
    });
});

app.post('/suppliers', (req, res) => {
    const newSupplier = req.body;
    const filePath = path.join(process.cwd(), 'suppliersData.json');
    console.log(`Reading suppliers data from: ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading suppliers data:', err);
            return res.status(500).send('Error reading suppliers data');
        }
        try {
            const suppliers = JSON.parse(data);
            suppliers.push(newSupplier);
            console.log('Saving new suppliers data:', suppliers);
            fs.writeFile(filePath, JSON.stringify(suppliers, null, 2), (err) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});