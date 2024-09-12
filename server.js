const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Sirve los archivos estáticos como HTML, CSS, JS desde la carpeta 'public'
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta para manejar el envío de confesiones
app.post('/confesiones', (req, res) => {
  const confesion = req.body.confesion;
  // Aquí podrías guardar la confesión en una base de datos o en memoria
  console.log('Confesión recibida:', confesion);
  res.redirect('/'); // Redirige al usuario de vuelta a la página principal
});

// Define el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
