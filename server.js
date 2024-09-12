const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de MongoDB
const url = 'mongodb://localhost:27017'; // URL de conexión a MongoDB
const dbName = 'confessionsDB'; // Nombre de la base de datos
let db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  db = client.db(dbName);
  console.log(`Conectado a la base de datos ${dbName}`);
});

// Ruta para agregar una confesión
app.post('/confessions', (req, res) => {
  const confession = req.body;
  db.collection('confessions').insertOne(confession, (err, result) => {
    if (err) throw err;
    res.status(201).send(result.ops[0]);
  });
});

// Ruta para obtener todas las confesiones
app.get('/confessions', (req, res) => {
  db.collection('confessions').find().toArray((err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
