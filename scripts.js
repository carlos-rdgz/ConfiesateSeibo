document.addEventListener('DOMContentLoaded', function() {
    // Cargar todas las confesiones al cargar la página
    cargarConfesiones();
  
    // Manejar el envío del formulario de confesión
    document.getElementById('confesion-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const textoConfesion = document.getElementById('confesion-text').value;
  
      // Enviar la confesión al servidor
      fetch('/confesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confesion: textoConfesion })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        document.getElementById('confesion-text').value = ''; // Limpiar el campo de texto
        cargarConfesiones(); // Cargar las confesiones de nuevo
      })
      .catch(error => console.error('Error:', error));
    });
  });
  
  // Función para cargar todas las confesiones
  function cargarConfesiones() {
    fetch('/confesiones')
      .then(response => response.json())
      .then(data => {
        const contenedor = document.getElementById('confesiones-container');
        contenedor.innerHTML = ''; // Limpiar el contenido previo
  
        // Crear un div para cada confesión
        data.forEach(confesion => {
          const div = document.createElement('div');
          div.classList.add('confesion');
          div.textContent = confesion.texto;
          contenedor.appendChild(div);
        });
      })
      .catch(error => console.error('Error al cargar las confesiones:', error));
  }
  