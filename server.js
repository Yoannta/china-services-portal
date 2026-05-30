const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'universities.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'sourcing_products.json');
const GROUPS_FILE = path.join(__dirname, 'data', 'sourcing_groups.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Ensure data file and upload dir exist
async function initData() {
    await fs.ensureDir(path.join(__dirname, 'data'));
    await fs.ensureDir(UPLOAD_DIR);
    if (!(await fs.pathExists(DATA_FILE))) {
        await fs.writeJson(DATA_FILE, [], { spaces: 4 });
    }
    if (!(await fs.pathExists(PRODUCTS_FILE))) {
        await fs.writeJson(PRODUCTS_FILE, [], { spaces: 4 });
    }
    if (!(await fs.pathExists(GROUPS_FILE))) {
        await fs.writeJson(GROUPS_FILE, [], { spaces: 4 });
    }
}

// API Routes
app.get('/api/universities', async (req, res) => {
    try {
        const data = await fs.readJson(DATA_FILE);
        res.json(data);
    } catch (e) { res.json([]); }
});

app.post('/api/universities', upload.array('images', 10), async (req, res) => {
    const data = await fs.readJson(DATA_FILE);
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const newUniv = {
        id: Date.now().toString(),
        name: req.body.name,
        desc: req.body.desc,
        highlights: JSON.parse(req.body.highlights || "[]"),
        images: newImages
    };
    data.push(newUniv);
    await fs.writeJson(DATA_FILE, data, { spaces: 4 });
    res.json(newUniv);
});

app.put('/api/universities/:id', upload.array('images', 10), async (req, res) => {
    const data = await fs.readJson(DATA_FILE);
    const index = data.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        const newImages = req.files && req.files.length > 0
            ? req.files.map(f => `/uploads/${f.filename}`)
            : [];
        
        let imagesToKeep = req.body.existingImages;
        if (typeof imagesToKeep === 'string') imagesToKeep = [imagesToKeep];
        if (!imagesToKeep) imagesToKeep = [];

        const updated = {
            ...data[index],
            name: req.body.name,
            desc: req.body.desc,
            highlights: JSON.parse(req.body.highlights || "[]"),
            images: [...imagesToKeep, ...newImages]
        };
        data[index] = updated;
        await fs.writeJson(DATA_FILE, data, { spaces: 4 });
        res.json(data[index]);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/api/universities/:id/image', async (req, res) => {
    const { imagePath } = req.body;
    const data = await fs.readJson(DATA_FILE);
    const index = data.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        data[index].images = (data[index].images || []).filter(img => img !== imagePath);
        await fs.writeJson(DATA_FILE, data, { spaces: 4 });
        res.json({ success: true, images: data[index].images });
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/api/universities/:id', async (req, res) => {
    let data = await fs.readJson(DATA_FILE);
    data = data.filter(u => u.id !== req.params.id);
    await fs.writeJson(DATA_FILE, data, { spaces: 4 });
    res.json({ success: true });
});

// --- SOURCING API ---

// Products
app.get('/api/sourcing/products', async (req, res) => {
    try { res.json(await fs.readJson(PRODUCTS_FILE)); } catch (e) { res.json([]); }
});

app.post('/api/sourcing/products', upload.array('images', 10), async (req, res) => {
    const data = await fs.readJson(PRODUCTS_FILE);
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const newProd = {
        id: Date.now().toString(),
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        moq: req.body.moq || 1,
        groupId: req.body.groupId || null,
        images: newImages
    };
    data.push(newProd);
    await fs.writeJson(PRODUCTS_FILE, data, { spaces: 4 });
    res.json(newProd);
});

app.put('/api/sourcing/products/:id', upload.array('images', 10), async (req, res) => {
    const data = await fs.readJson(PRODUCTS_FILE);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        // Support for keeping only a subset of existing images
        let imagesToKeep = req.body.existingImages;
        if (typeof imagesToKeep === 'string') imagesToKeep = [imagesToKeep];
        if (!imagesToKeep) imagesToKeep = [];

        data[index] = {
            ...data[index],
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            moq: req.body.moq || 1,
            groupId: req.body.groupId || null,
            images: [...imagesToKeep, ...newImages]
        };
        await fs.writeJson(PRODUCTS_FILE, data, { spaces: 4 });
        res.json(data[index]);
    } else res.status(404).send('Not found');
});

app.delete('/api/sourcing/products/:id/image', async (req, res) => {
    const { imagePath } = req.body;
    const data = await fs.readJson(PRODUCTS_FILE);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        data[index].images = (data[index].images || []).filter(img => img !== imagePath);
        await fs.writeJson(PRODUCTS_FILE, data, { spaces: 4 });
        res.json({ success: true, images: data[index].images });
    } else res.status(404).send('Not found');
});

app.delete('/api/sourcing/products/:id', async (req, res) => {
    let data = await fs.readJson(PRODUCTS_FILE);
    data = data.filter(p => p.id !== req.params.id);
    await fs.writeJson(PRODUCTS_FILE, data, { spaces: 4 });
    res.json({ success: true });
});

// Groups
app.get('/api/sourcing/groups', async (req, res) => {
    try { res.json(await fs.readJson(GROUPS_FILE)); } catch (e) { res.json([]); }
});

app.post('/api/sourcing/groups', async (req, res) => {
    const data = await fs.readJson(GROUPS_FILE);
    const newGroup = { id: Date.now().toString(), name: req.body.name };
    data.push(newGroup);
    await fs.writeJson(GROUPS_FILE, data, { spaces: 4 });
    res.json(newGroup);
});

app.delete('/api/sourcing/groups/:id', async (req, res) => {
    let data = await fs.readJson(GROUPS_FILE);
    data = data.filter(g => g.id !== req.params.id);
    await fs.writeJson(GROUPS_FILE, data, { spaces: 4 });
    
    // Optional: unlink products from this group
    let products = await fs.readJson(PRODUCTS_FILE);
    products = products.map(p => p.groupId === req.params.id ? { ...p, groupId: null } : p);
    await fs.writeJson(PRODUCTS_FILE, products, { spaces: 4 });
    
    res.json({ success: true });
});

initData().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
