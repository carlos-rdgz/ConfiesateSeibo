const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuración para el manejo de JSON en POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Hacer que la carpeta 'public' sea accesible
app.use(express.static('public'));

// Cargar la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Leer confesiones desde el archivo
const leerConfesiones = () => {
  try {
    const data = fs.readFileSync('confesiones.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Si no hay archivo, retornar una lista vacía
  }
};

// Guardar las confesiones en un archivo
const guardarConfesiones = (confesiones) => {
  fs.writeFileSync('confesiones.json', JSON.stringify(confesiones, null, 2));
};

// Obtener todas las confesiones para mostrarlas en la segunda página
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

  // Leer las confesiones existentes y añadir la nueva
  const confesiones = leerConfesiones();
  confesiones.push(nuevaConfesion);
  guardarConfesiones(confesiones);

  res.json({ message: 'Confesión enviada con éxito' });
});

// Escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
