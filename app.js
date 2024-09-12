// Importar los módulos de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';

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

// Referencias a los elementos del DOM
const confessionForm = document.getElementById('confession-form');
const confessionTextarea = document.getElementById('confession');
const confessionsContainer = document.getElementById('confessions-container');

// Guardar confesión en Firestore
confessionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = confessionTextarea.value.trim();

  if (message) {
    try {
      await addDoc(collection(db, 'confessions'), {
        message: message,
        date: new Date()
      });
      alert('Confesión enviada');
      confessionTextarea.value = '';  // Limpiar el formulario
      loadConfessions();  // Cargar confesiones después de enviar
    } catch (e) {
      console.error("Error añadiendo el documento: ", e);
    }
  }
});

// Cargar y mostrar confesiones
async function loadConfessions() {
  const q = query(collection(db, 'confessions'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  confessionsContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar las confesiones

  querySnapshot.forEach((doc) => {
    const confessionData = doc.data();
    const confessionElement = document.createElement('div');
    confessionElement.className = 'confession-box';
    confessionElement.innerText = confessionData.message;
    confessionsContainer.appendChild(confessionElement);
  });
}

// Cargar confesiones al inicio
loadConfessions();

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

// --- TEMPORIZADOR ---
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

// --- NAVEGACIÓN ---
const backToConfessionBtn = document.getElementById('back-to-confession');
const viewResponsesBtn = document.getElementById('view-responses');

if (backToConfessionBtn) {
  backToConfessionBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirigir a la página principal
  });
}

if (viewResponsesBtn) {
  viewResponsesBtn.addEventListener('click', () => {
    window.location.href = 'responses.html'; // Redirigir a la página de respuestas
  });
}
