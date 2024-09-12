// --- CAMBIO DE TEMA ---
// Recuperar el tema guardado
const toggleThemeBtn = document.getElementById('toggle-theme');
const currentTheme = localStorage.getItem('theme');

// Aplicar el tema guardado al cargar la página
if (currentTheme) {
  document.body.classList.add(currentTheme);
}

// Función para cambiar entre temas
if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Guardar el tema seleccionado en localStorage
    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
    } else {
      localStorage.removeItem('theme');
    }
  });
}

// --- ENVÍO DE CONFESIONES Y TEMPORIZADOR ---
// Variables
const form = document.getElementById('confession-form');
const confessionText = document.getElementById('confession');
const countdownElement = document.getElementById('countdown');
let canConfess = true;

// Recuperar la fecha de la última confesión
let lastConfessionTime = localStorage.getItem('lastConfessionTime');
if (lastConfessionTime) {
  const timeDifference = Math.floor((Date.now() - new Date(lastConfessionTime)) / 1000);
  const remainingTime = 60 - timeDifference; // Ajustar el tiempo restante
  if (remainingTime > 0) {
    canConfess = false;
    countdown(remainingTime);
  }
}

// Evento para enviar la confesión
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (canConfess && confessionText.value.trim()) {
      canConfess = false;

      // Guardar la fecha de la confesión
      localStorage.setItem('lastConfessionTime', new Date());

      // Guardar la confesión en localStorage
      let confessions = JSON.parse(localStorage.getItem('confessions')) || [];
      confessions.push({ text: confessionText.value, date: new Date() });
      localStorage.setItem('confessions', JSON.stringify(confessions));

      // Limpiar el campo de texto
      confessionText.value = '';
      countdown(60); // Iniciar temporizador de 60 segundos
    }
  });
}

// Función del temporizador
function countdown(time) {
  let timer = setInterval(() => {
    countdownElement.textContent = `Espera ${time} segundos para confesar nuevamente.`;
    time--;
    if (time < 0) {
      clearInterval(timer);
      countdownElement.textContent = ''; // Limpiar el mensaje del contador
      canConfess = true;
    }
  }, 1000);
}

// --- CARGAR RESPUESTAS EN LA SEGUNDA PÁGINA ---
// Cargar confesiones desde localStorage
const responseContainer = document.getElementById('response-container');
if (responseContainer) {
  const confessions = JSON.parse(localStorage.getItem('confessions')) || [];

  // Generar los cuadros de confesiones
  confessions.forEach(confession => {
    const responseDiv = document.createElement('div');
    responseDiv.classList.add('response');

    // Si la confesión es muy larga, añadir la clase long
    if (confession.text.length > 100) {
      responseDiv.classList.add('long');
      responseDiv.addEventListener('click', () => {
        responseDiv.classList.toggle('expanded');
        responseDiv.style.animation = 'expandAnimation 0.5s ease';
      });
    }

    // Añadir el texto de la confesión
    responseDiv.textContent = confession.text;
    responseContainer.appendChild(responseDiv);
  });
}

// --- BOTÓN VOLVER A CONFESAR ---
// Botón para volver a la página principal
const backToConfessionBtn = document.getElementById('back-to-confession');
if (backToConfessionBtn) {
  backToConfessionBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirigir a la página principal
  });
}

// --- NAVEGACIÓN A RESPUESTAS ---
// Botón para ver todas las respuestas
const viewResponsesBtn = document.getElementById('view-responses');
if (viewResponsesBtn) {
  viewResponsesBtn.addEventListener('click', () => {
    window.location.href = 'responses.html'; // Redirigir a la página de respuestas
  });
}
