const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configurar body-parser para manejar solicitudes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar archivos estáticos
app.use(express.static('public'));

// Ruta para cargar la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Leer confesiones de un archivo JSON
const leerConfesiones = () => {
  try {
    const data = fs.readFileSync('confesiones.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Guardar confesiones en un archivo JSON
const guardarConfesiones = (confesiones) => {
  fs.writeFileSync('confesiones.json', JSON.stringify(confesiones, null, 2));
};

// Ruta para obtener todas las confesiones
app.get('/confesiones', (req, res) => {
  const confesiones = leerConfesiones();
  res.json(confesiones);
});

// Ruta para enviar una nueva confesión
app.post('/confesar', (req, res) => {
  const nuevaConfesion = {
    id: Date.now(),
    texto: req.body.confesion,
  };

  const confesiones = leerConfesiones();
  confesiones.push(nuevaConfesion);
  guardarConfesiones(confesiones);

  res.json({ message: 'Confesión enviada con éxito' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
