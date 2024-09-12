// --- CONFIGURACIÓN DE FIREBASE ---
// Importar Firebase (asegúrate de tener los SDK correctos en tu HTML)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKzFdJzLD0qnPc0KlJlZ3L1kH5hyo5ZJE",
  authDomain: "confiesate-seibo.firebaseapp.com",
  projectId: "confiesate-seibo",
  storageBucket: "confiesate-seibo.appspot.com",
  messagingSenderId: "385713181061",
  appId: "1:385713181061:web:be453f8eb6cb791ee2f4ec",
  measurementId: "G-8T65EVV052"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CAMBIO DE TEMA ---
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
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (canConfess && confessionText.value.trim()) {
      canConfess = false;

      // Guardar la fecha de la confesión
      localStorage.setItem('lastConfessionTime', new Date());

      // Guardar la confesión en Firestore
      try {
        await addDoc(collection(db, 'confessions'), {
          text: confessionText.value,
          date: new Date()
        });

        alert('Confesión enviada');
        confessionText.value = '';
        countdown(60); // Iniciar temporizador de 60 segundos
      } catch (error) {
        console.error('Error añadiendo documento: ', error);
      }
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
const responseContainer = document.getElementById('response-container');
if (responseContainer) {
  const fetchConfessions = async () => {
    const q = query(collection(db, 'confessions'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    responseContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar las confesiones

    querySnapshot.forEach(doc => {
      const confessionData = doc.data();
      const responseDiv = document.createElement('div');
      responseDiv.classList.add('response');

      // Si la confesión es muy larga, añadir la clase long
      if (confessionData.text.length > 100) {
        responseDiv.classList.add('long');
        responseDiv.addEventListener('click', () => {
          responseDiv.classList.toggle('expanded');
          responseDiv.style.animation = 'expandAnimation 0.5s ease';
        });
      }

      // Añadir el texto de la confesión
      responseDiv.textContent = confessionData.text;
      responseContainer.appendChild(responseDiv);
    });
  };

  fetchConfessions();
}

// --- BOTÓN VOLVER A CONFESAR ---
const backToConfessionBtn = document.getElementById('back-to-confession');
if (backToConfessionBtn) {
  backToConfessionBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirigir a la página principal
  });
}

// --- NAVEGACIÓN A RESPUESTAS ---
const viewResponsesBtn = document.getElementById('view-responses');
if (viewResponsesBtn) {
  viewResponsesBtn.addEventListener('click', () => {
    window.location.href = 'responses.html'; // Redirigir a la página de respuestas
  });
}
