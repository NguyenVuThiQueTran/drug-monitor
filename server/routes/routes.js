const express = require('express'); // As in the server.js
const route = express.Router();     // Allows us use express router in this file
const services = require('../services/render');
const controller = require('../controller/controller');
const validateDrug = require('../middleware/validateDrug'); // <--- thêm dòng này

// Render routes
route.get('/', services.home);
route.get('/manage', services.manage);
route.get('/dosage', services.dosage);
route.get('/purchase', services.purchase);
route.get('/add-drug', services.addDrug);
route.get('/update-drug', services.updateDrug);

// API for CRUD operations
route.post('/api/drugs', validateDrug, controller.create);  // <--- thêm middleware
route.get('/api/drugs', controller.find);
route.put('/api/drugs/:id', validateDrug, controller.update); // <--- thêm middleware
route.delete('/api/drugs/:id', controller.delete);
route.post('/api/drugs/purchase', controller.purchase); // <--- thêm purchase

module.exports = route;
