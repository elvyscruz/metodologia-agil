// JavaScript para la Semana 1 - Metodologías Ágiles

// Estado global de la aplicación
const appState = {
    currentLesson: 1,
    completedLessons: [],
    userProgress: {
        totalPoints: 0,
        timeSpent: 0,
        quizScores: [],
        notes: '',
        achievements: ['Primer Paso']
    },
    lessonData: {
        1: { title: '¿Qué son las Metodologías Ágiles?', duration: 15, points: 50 },
        2: { title: 'Historia y Orígenes', duration: 20, points: 60 },
        3: { title: 'El Manifiesto Ágil', duration: 25, points: 80 },
        4: { title: 'Principios Ágiles', duration: 30, points: 100 },
        5: { title: 'Comparación: Ágil vs Tradicional', duration: 20, points: 60 },
        6: { title: 'Beneficios y Desafíos', duration: 15, points: 50 }
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserProgress();
    startProgressTracking();
});

// Inicializar botones de completación de lecciones
function initializeLessonCompletionButtons() {
    console.log(`🔄 Inicializando botones de completación`);
    console.log(`📊 Lecciones completadas actuales: ${appState.completedLessons}`);

    for (let i = 1; i <= 6; i++) {
        const lessonElement = document.getElementById(`lesson-${i}`);
        if (lessonElement) {
            const completionButtons = lessonElement.querySelector('.completion-buttons');
            if (completionButtons) {
                // Buscar el botón de siguiente lección
                const nextBtn = completionButtons.querySelector('button[onclick="nextLesson()"]');
                if (nextBtn) {
                    // Si la lección está completada, habilitar el botón de siguiente lección
                    const shouldEnable = appState.completedLessons.includes(i);
                    nextBtn.disabled = !shouldEnable;

                    if (shouldEnable) {
                        console.log(`✅ Botón de lección ${i} habilitado (lección completada)`);
                    } else {
                        console.log(`🔒 Botón de lección ${i} deshabilitado (lección no completada)`);
                    }
                } else {
                    // Intento alternativo: buscar por texto
                    const allButtons = completionButtons.querySelectorAll('button');
                    for (let btn of allButtons) {
                        if (btn.textContent.includes('Siguiente Lección')) {
                            const shouldEnable = appState.completedLessons.includes(i);
                            btn.disabled = !shouldEnable;

                            if (shouldEnable) {
                                console.log(`✅ Botón de lección ${i} habilitado por texto (lección completada)`);
                            } else {
                                console.log(`🔒 Botón de lección ${i} deshabilitado por texto (lección no completada)`);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    // También actualizar el botón de la lección actual específicamente
    updateCurrentLessonButton();
}

// Función para actualizar específicamente el botón de la lección actual
function updateCurrentLessonButton() {
    const currentLesson = appState.currentLesson;
    const currentLessonElement = document.getElementById(`lesson-${currentLesson}`);

    if (currentLessonElement) {
        const completionButtons = currentLessonElement.querySelector('.completion-buttons');
        if (completionButtons) {
            // Buscar el botón de siguiente lección
            const nextBtn = completionButtons.querySelector('button[onclick="nextLesson()"]');
            if (nextBtn) {
                const shouldEnable = appState.completedLessons.includes(currentLesson);
                nextBtn.disabled = !shouldEnable;
                console.log(`🎯 Botón de lección actual ${currentLesson} actualizado: ${shouldEnable ? 'habilitado' : 'deshabilitado'}`);
            }
        }
    }
}

// Inicializar la aplicación
function initializeApp() {
    console.log('🚀 Inicializando Semana 1: Introducción a las Metodologías Ágiles');

    // Marcar lección actual como activa
    updateLessonNavigation();

    // Actualizar progreso inicial
    updateProgressDisplay();

    // Cargar notas guardadas
    loadNotes();

    // Inicializar tooltips y animaciones
    initializeTooltips();
    setupAnimations();
    // Inicializar botones de completación
    initializeLessonCompletionButtons();
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación entre lecciones
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', function() {
            const lessonId = parseInt(this.dataset.lesson);
            if (canAccessLesson(lessonId)) {
                switchToLesson(lessonId);
            } else {
                showNotification('Completa la lección anterior para desbloquear esta', 'warning');
            }
        });
    });

    // Quiz interactivo
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            handleQuizAnswer(this);
        });
    });

    // Video player
    setupVideoPlayer();

    // Sistema de notas
    const notesArea = document.getElementById('notesArea');
    if (notesArea) {
        notesArea.addEventListener('input', debounce(saveNotes, 1000));
    }

    // Botones de ayuda
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleHelpRequest(this.textContent.trim());
        });
    });

    // Scrollspy para navegación
    setupScrollSpy();

    // Atajos de teclado
    setupKeyboardShortcuts();
}

// Sistema de navegación de lecciones
function updateLessonNavigation() {
    document.querySelectorAll('.lesson-item').forEach((item, index) => {
        const lessonId = parseInt(item.dataset.lesson);
        const statusIcon = item.querySelector('.lesson-status i');

        if (lessonId === appState.currentLesson) {
            item.classList.add('active');
            if (statusIcon) {
                statusIcon.className = 'fas fa-play-circle';
                statusIcon.style.color = 'var(--accent-color)';
            }
        } else if (appState.completedLessons.includes(lessonId)) {
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.style.color = '#10b981';
            }
        } else if (canAccessLesson(lessonId)) {
            if (statusIcon) {
                statusIcon.className = 'fas fa-lock-open';
                statusIcon.style.color = 'var(--primary-color)';
            }
        }
    });
}

function canAccessLesson(lessonId) {
    console.log(`🔍 Verificando acceso a lección ${lessonId}`);
    console.log(`📊 Lecciones completadas: ${appState.completedLessons}`);
    console.log(`🔍 ¿Incluye lección ${lessonId - 1}? ${appState.completedLessons.includes(lessonId - 1)}`);

    // La primera lección siempre está disponible
    if (lessonId === 1) return true;

    // Las demás lecciones requieren completar la anterior
    const canAccess = appState.completedLessons.includes(lessonId - 1);
    console.log(`✅ Acceso concedido: ${canAccess}`);
    return canAccess;
}

function switchToLesson(lessonId) {
    if (!canAccessLesson(lessonId)) return;

    // Ocultar lección actual
    document.querySelectorAll('.lesson-content').forEach(content => {
        content.style.display = 'none';
    });

    // Mostrar nueva lección
    const newLesson = document.getElementById(`lesson-${lessonId}`);
    if (newLesson) {
        newLesson.style.display = 'block';
        newLesson.style.animation = 'fadeIn 0.5s ease';
    }

    // Actualizar estado
    appState.currentLesson = lessonId;
    updateLessonNavigation();

    // Scroll al inicio del contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Marcar como iniciada si es la primera vez
    if (!appState.completedLessons.includes(lessonId) && lessonId !== 1) {
        markLessonAsStarted(lessonId);
    }

    // Importante: actualizar botones de la lección actual
    setTimeout(() => {
        updateCurrentLessonButton();
    }, 100);

    saveUserProgress();
}

// Sistema de Video Player
function setupVideoPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const videoOverlay = document.querySelector('.video-overlay');
    const controlBtns = document.querySelectorAll('.control-btn');

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            simulateVideoPlay();
        });
    }

    if (videoOverlay) {
        videoOverlay.addEventListener('click', function() {
            simulateVideoPlay();
        });
    }

    // Controles del video
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleVideoControl(this);
        });
    });
}

function simulateVideoPlay() {
    const videoOverlay = document.querySelector('.video-overlay');
    const playBtn = document.querySelector('.play-btn');
    const progressFill = document.querySelector('.video-controls .progress-fill');

    if (videoOverlay) {
        videoOverlay.style.display = 'none';
    }

    // Simular progreso del video
    if (progressFill) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            progressFill.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                markLessonAsCompleted(appState.currentLesson);
            }
        }, 1000);
    }

    showNotification('▶️ Video iniciado. El progreso se guardará automáticamente.', 'info');
}

function handleVideoControl(btn) {
    const icon = btn.querySelector('i');

    if (icon.classList.contains('fa-play')) {
        icon.className = 'fas fa-pause';
        showNotification('Video pausado', 'info');
    } else if (icon.classList.contains('fa-pause')) {
        icon.className = 'fas fa-play';
        showNotification('Video reanudado', 'info');
    } else if (icon.classList.contains('fa-expand')) {
        showNotification('Modo pantalla completa', 'info');
    } else if (icon.classList.contains('fa-cog')) {
        showVideoSettings();
    }
}

function showVideoSettings() {
    showModal('Configuración de Video', `
        <div class="video-settings">
            <div class="setting-item">
                <label>Calidad:</label>
                <select>
                    <option>1080p HD</option>
                    <option>720p</option>
                    <option>480p</option>
                    <option>360p</option>
                </select>
            </div>
            <div class="setting-item">
                <label>Velocidad:</label>
                <select>
                    <option>0.75x</option>
                    <option selected>1x</option>
                    <option>1.25x</option>
                    <option>1.5x</option>
                    <option>2x</option>
                </select>
            </div>
            <div class="setting-item">
                <label>Subtítulos:</label>
                <select>
                    <option>Español</option>
                    <option>Inglés</option>
                    <option>Desactivados</option>
                </select>
            </div>
        </div>
    `);
}

// Sistema de Quiz Interactivo
function handleQuizAnswer(selectedOption) {
    const isCorrect = selectedOption.dataset.correct === 'true';
    const quizOptions = document.querySelectorAll('.quiz-option');
    const feedback = document.querySelector('.quiz-feedback');

    // Deshabilitar todas las opciones
    quizOptions.forEach(option => {
        option.style.pointerEvents = 'none';

        if (option.dataset.correct === 'true') {
            option.classList.add('correct');
        } else if (option === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    // Mostrar feedback
    if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        const feedbackIcon = feedback.querySelector('.feedback-icon');
        const feedbackText = feedback.querySelector('.feedback-text');

        if (isCorrect) {
            feedbackIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            feedbackText.textContent = '¡Correcto! Las metodologías ágiles se caracterizan por su capacidad de adaptación al cambio y entrega iterativa de valor.';

            // Añadir puntos
            addPoints(25);
            updateQuizScore(true);

            // Desbloquear siguiente lección
            setTimeout(() => {
                if (appState.currentLesson < 6) {
                    unlockNextLesson();
                }
            }, 2000);
        } else {
            feedbackIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            feedbackText.textContent = 'Incorrecto. La característica principal de las metodologías ágiles es su capacidad para adaptarse rápidamente a los cambios y entregar valor de forma iterativa.';

            updateQuizScore(false);
        }
    }

    // Guardar progreso del quiz
    saveUserProgress();
}

function updateQuizScore(isCorrect) {
    const quizKey = `quiz_lesson_${appState.currentLesson}`;
    appState.userProgress.quizScores.push({
        lesson: appState.currentLesson,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    });
}

// Sistema de Progreso y Gamificación
function updateProgressDisplay() {
    const progressFill = document.getElementById('weekProgress');
    const progressText = document.querySelector('.progress-text');
    const completedCount = appState.completedLessons.length;
    const totalLessons = Object.keys(appState.lessonData).length;
    const percentage = Math.round((completedCount / totalLessons) * 100);

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}% completado`;
    }

    // Actualizar estadísticas
    updateStatistics();

    // Actualizar logros
    updateAchievements();
}

function updateStatistics() {
    const statValues = document.querySelectorAll('.stat-value');

    if (statValues[0]) {
        statValues[0].textContent = `${appState.completedLessons.length}/6`;
    }

    if (statValues[1]) {
        statValues[1].textContent = appState.userProgress.totalPoints;
    }

    if (statValues[2]) {
        const hours = Math.floor(appState.userProgress.timeSpent / 3600);
        const minutes = Math.floor((appState.userProgress.timeSpent % 3600) / 60);
        statValues[2].textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
}

function updateAchievements() {
    const achievementList = document.querySelector('.achievement-list');
    if (!achievementList) return;

    // Definir logros disponibles
    const allAchievements = [
        { id: 'Primer Paso', icon: 'fa-medal', unlocked: true },
        { id: 'Explorador Ágil', icon: 'fa-compass', unlocked: appState.completedLessons.length >= 3 },
        { id: 'Maestro de la Semana', icon: 'fa-crown', unlocked: appState.completedLessons.length >= 6 },
        { id: 'Quiz Perfecto', icon: 'fa-star', unlocked: checkPerfectQuizScore() },
        { id: 'Estudiante Dedicado', icon: 'fa-clock', unlocked: appState.userProgress.timeSpent >= 3600 }
    ];

    // Actualizar logros del usuario
    appState.userProgress.achievements = allAchievements
        .filter(a => a.unlocked)
        .map(a => a.id);

    // Renderizar logros
    achievementList.innerHTML = allAchievements.map(achievement => `
        <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <i class="fas ${achievement.icon}"></i>
            <span>${achievement.id}</span>
        </div>
    `).join('');

    // Mostrar notificación por nuevos logros
    checkNewAchievements(allAchievements);
}

function checkPerfectQuizScore() {
    const recentQuizzes = appState.userProgress.quizScores.filter(
        q => q.lesson === appState.currentLesson
    );
    return recentQuizzes.some(q => q.correct);
}

function checkNewAchievements(allAchievements) {
    const newAchievements = allAchievements.filter(a =>
        a.unlocked && !appState.userProgress.achievements.includes(a.id)
    );

    newAchievements.forEach(achievement => {
        showNotification(`🏆 ¡Nuevo logro desbloqueado: ${achievement.id}!`, 'success');
    });
}

function addPoints(points) {
    appState.userProgress.totalPoints += points;
    updateStatistics();

    // Animación de puntos
    showPointsAnimation(points);
}

function showPointsAnimation(points) {
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-animation';
    pointsDisplay.textContent = `+${points} puntos`;
    pointsDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 1.2rem;
        z-index: 1000;
        animation: pointsFloat 2s ease-out forwards;
    `;

    document.body.appendChild(pointsDisplay);

    setTimeout(() => {
        pointsDisplay.remove();
    }, 2000);
}

// Sistema de Notas
function saveNotes() {
    const notesArea = document.getElementById('notesArea');
    if (notesArea) {
        appState.userProgress.notes = notesArea.value;
        localStorage.setItem('week1_notes', notesArea.value);
    }
}

function loadNotes() {
    const savedNotes = localStorage.getItem('week1_notes');
    const notesArea = document.getElementById('notesArea');

    if (savedNotes && notesArea) {
        notesArea.value = savedNotes;
        appState.userProgress.notes = savedNotes;
    }
}

// Sistema de Ayuda
function handleHelpRequest(requestType) {
    const helpContent = {
        'Chat con Tutor': {
            title: 'Chat con Tutor',
            content: `
                <div class="tutor-chat">
                    <div class="chat-messages">
                        <div class="message tutor">
                            <strong>Tutor:</strong> ¡Hola! Soy tu tutor personal para esta semana. ¿En qué puedo ayudarte con las metodologías ágiles?
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Escribe tu pregunta..." id="tutorQuestion">
                        <button onclick="sendTutorMessage()">Enviar</button>
                    </div>
                </div>
            `
        },
        'Recursos Adicionales': {
            title: 'Recursos Adicionales',
            content: `
                <div class="additional-resources">
                    <h4>📚 Lecturas Recomendadas</h4>
                    <ul>
                        <li><a href="#">Agile Manifesto - Official Site</a></li>
                        <li><a href="#">Scrum Guide 2024</a></li>
                        <li><a href="#">User Stories Applied - Mike Cohn</a></li>
                    </ul>

                    <h4>🎥 Videos Complementarios</h4>
                    <ul>
                        <li><a href="#">Historia del Manifiesto Ágil (10 min)</a></li>
                        <li><a href="#">Casos de Éxito Ágiles (15 min)</a></li>
                    </ul>

                    <h4>🛠️ Herramientas Útiles</h4>
                    <ul>
                        <li><a href="#">Trello para principiantes</a></li>
                        <li><a href="#">Jira básico</a></li>
                    </ul>
                </div>
            `
        },
        'Foro de Discusión': {
            title: 'Foro de Discusión',
            content: `
                <div class="discussion-forum">
                    <h4>📌 Temas Activos</h4>
                    <div class="forum-topics">
                        <div class="topic">
                            <h5>¿Cuál es vuestra experiencia con metodologías ágiles?</h5>
                            <div class="topic-meta">15 respuestas • Última: hace 2 horas</div>
                        </div>
                        <div class="topic">
                            <h5>Dudas sobre el Manifiesto Ágil</h5>
                            <div class="topic-meta">8 respuestas • Última: hace 5 horas</div>
                        </div>
                    </div>

                    <button class="btn btn-primary">Ver todos los temas</button>
                </div>
            `
        }
    };

    const help = helpContent[requestType];
    if (help) {
        showModal(help.title, help.content);
    }
}

// Sistema de Notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sistema de Modales
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: var(--text-dark);">${title}</h3>
                <button onclick="this.closest('.modal-overlay').remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-light);
                ">×</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Sistema de Persistencia
function saveUserProgress() {
    const progressData = {
        currentLesson: appState.currentLesson,
        completedLessons: appState.completedLessons,
        userProgress: appState.userProgress,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('week1_progress', JSON.stringify(progressData));
}

function loadUserProgress() {
    const savedProgress = localStorage.getItem('week1_progress');

    if (savedProgress) {
        try {
            const data = JSON.parse(savedProgress);
            appState.currentLesson = data.currentLesson || 1;
            appState.completedLessons = data.completedLessons || [];
            appState.userProgress = { ...appState.userProgress, ...data.userProgress };

            console.log(`📂 Progreso cargado: Lección actual ${appState.currentLesson}, Completadas: ${appState.completedLessons}`);

            updateProgressDisplay();
            updateLessonNavigation();

            // Importante: inicializar botones después de cargar el progreso
            setTimeout(() => {
                initializeLessonCompletionButtons();
            }, 100);
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    }
}

// Sistema de Seguimiento de Tiempo
function startProgressTracking() {
    let startTime = Date.now();

    setInterval(() => {
        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - startTime) / 1000);
        appState.userProgress.timeSpent += 1;

        // Actualizar cada minuto
        if (timeSpent % 60 === 0) {
            updateStatistics();
            saveUserProgress();
        }
    }, 1000);
}

// Funciones de Utilidad
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function markLessonAsCompleted(lessonId) {
    if (!appState.completedLessons.includes(lessonId)) {
        appState.completedLessons.push(lessonId);

        // Añadir puntos de la lección
        const lessonPoints = appState.lessonData[lessonId]?.points || 50;
        addPoints(lessonPoints);

        updateProgressDisplay();
        updateLessonNavigation();
        saveUserProgress();

        showNotification(`✅ ¡Lección ${lessonId} completada! +${lessonPoints} puntos`, 'success');

        // Habilitar botón de siguiente lección inmediatamente
        enableNextLessonButton(lessonId);

        // Desbloquear siguiente lección
        if (lessonId < 6) {
            unlockNextLesson();
        } else {
            showNotification('🎉 ¡Felicidades! Has completado todas las lecciones de la Semana 1', 'success');
        }
    }
}

// Función específica para habilitar el botón de siguiente lección
function enableNextLessonButton(lessonId) {
    const currentLessonElement = document.getElementById(`lesson-${lessonId}`);
    if (currentLessonElement) {
        const completionButtons = currentLessonElement.querySelector('.completion-buttons');
        if (completionButtons) {
            // Buscar el botón de siguiente lección
            const nextBtn = completionButtons.querySelector('button[onclick="nextLesson()"]');
            if (nextBtn) {
                nextBtn.disabled = false;
                console.log(`✅ Botón de siguiente lección habilitado para lección ${lessonId}`);
            } else {
                // Intento alternativo: buscar por texto
                const allButtons = completionButtons.querySelectorAll('button');
                for (let btn of allButtons) {
                    if (btn.textContent.includes('Siguiente Lección')) {
                        btn.disabled = false;
                        console.log(`✅ Botón de siguiente lección habilitado por texto para lección ${lessonId}`);
                        break;
                    }
                }
            }
        }
    }
}

function markLessonAsStarted(lessonId) {
    // Aquí se podría registrar el inicio de una lección para analíticas
    console.log(`Lección ${lessonId} iniciada`);
}

function unlockNextLesson() {
    const nextLesson = appState.currentLesson + 1;
    if (nextLesson <= 6) {
        updateLessonNavigation();
        showNotification(`🔓 Lección ${nextLesson} desbloqueada`, 'info');
    }
}

// Función para marcar la lección actual como completada
function markCurrentLessonComplete() {
    const currentLesson = appState.currentLesson;
    console.log(`🔍 Marcando lección ${currentLesson} como completada`);
    console.log(`📊 Lecciones completadas antes: ${appState.completedLessons}`);

    if (!appState.completedLessons.includes(currentLesson)) {
        markLessonAsCompleted(currentLesson);
        console.log(`📊 Lecciones completadas después: ${appState.completedLessons}`);

        showNotification(`✅ Lección ${currentLesson} marcada como completada`, 'success');
        updateLessonNavigation();

        // Actualizar botones inmediatamente después de marcar como completada
        setTimeout(() => {
            initializeLessonCompletionButtons();
        }, 100);
    } else {
        console.log(`ℹ️ La lección ${currentLesson} ya estaba completada`);
        showNotification('Esta lección ya está marcada como completada', 'info');
    }
}

function nextLesson() {
    const nextLesson = appState.currentLesson + 1;
    console.log(`🔍 Intentando navegar a la lección ${nextLesson}`);
    console.log(`📊 Lección actual: ${appState.currentLesson}`);
    console.log(`✅ Lecciones completadas: ${appState.completedLessons}`);
    console.log(`🔒 ¿Puede acceder a lección ${nextLesson}? ${canAccessLesson(nextLesson)}`);

    if (nextLesson <= 6) {
        if (canAccessLesson(nextLesson)) {
            switchToLesson(nextLesson);
        } else {
            showNotification(`❌ Debes completar la lección ${appState.currentLesson} antes de continuar`, 'error');
        }
    } else {
        showNotification('Esta es la última lección de la semana', 'info');
    }
}

// Atajos de Teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S: Guardar notas
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveNotes();
            showNotification('Notas guardadas', 'success');
        }

        // Flecha derecha: Siguiente lección
        if (e.key === 'ArrowRight' && !e.target.matches('input, textarea')) {
            nextLesson();
        }

        // Flecha izquierda: Lección anterior
        if (e.key === 'ArrowLeft' && !e.target.matches('input, textarea')) {
            const prevLesson = appState.currentLesson - 1;
            if (prevLesson >= 1) {
                switchToLesson(prevLesson);
            }
        }
    });
}

// ScrollSpy
function setupScrollSpy() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.lesson-nav a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Aquí se podría actualizar la navegación según la sección visible
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Tooltips
function initializeTooltips() {
    // Inicializar tooltips para elementos interactivos
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, this.dataset.tooltip);
        });

        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Animaciones
function setupAnimations() {
    // Animación de entrada para elementos
    const animatedElements = document.querySelectorAll('.concept-card, .characteristic-card, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Añadir estilos CSS adicionales para animaciones
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes slideInUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pointsFloat {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -80%) scale(1); opacity: 0; }
    }

    .video-settings {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
    }

    .setting-item label {
        font-weight: 500;
        color: var(--text-dark);
    }

    .setting-item select {
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: white;
    }

    .tutor-chat {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .chat-messages {
        background: var(--bg-light);
        padding: 1rem;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
    }

    .message {
        margin-bottom: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
    }

    .message.tutor {
        background: rgba(79, 70, 229, 0.1);
        border-left: 3px solid var(--primary-color);
    }

    .chat-input {
        display: flex;
        gap: 0.5rem;
    }

    .chat-input input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
    }

    .additional-resources h4 {
        color: var(--text-dark);
        margin: 1.5rem 0 0.5rem 0;
    }

    .additional-resources h4:first-child {
        margin-top: 0;
    }

    .additional-resources ul {
        list-style: none;
        padding: 0;
        margin-bottom: 1rem;
    }

    .additional-resources li {
        padding: 0.5rem 0;
    }

    .additional-resources a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .additional-resources a:hover {
        text-decoration: underline;
    }

    .forum-topics {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .topic {
        padding: 1rem;
        background: var(--bg-light);
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
    }

    .topic:hover {
        background: rgba(79, 70, 229, 0.1);
    }

    .topic h5 {
        margin: 0 0 0.5rem 0;
        color: var(--text-dark);
    }

    .topic-meta {
        font-size: 0.9rem;
        color: var(--text-light);
    }
`;
document.head.appendChild(additionalStyles);

// Exportar funciones para uso global
window.nextLesson = nextLesson;
window.saveNotes = saveNotes;
window.showModal = showModal;
window.markCurrentLessonComplete = markCurrentLessonComplete;
window.sendTutorMessage = function() {
    const input = document.getElementById('tutorQuestion');
    if (input && input.value.trim()) {
        showNotification('Tu pregunta ha sido enviada al tutor', 'success');
        input.value = '';
    }
};

// Función para ir al quiz semanal
function goToWeeklyQuiz() {
    showNotification('📝 Cargando Quiz Semanal...', 'info');
    setTimeout(() => {
        showWeeklyQuiz();
    }, 500);
}

// Función para ir al proyecto práctico
function goToProject() {
    showNotification('📋 Cargando Proyecto Práctico...', 'info');
    setTimeout(() => {
        showPracticalProject();
    }, 500);
}

// Mostrar Quiz Semanal
function showWeeklyQuiz() {
    const quizHTML = `
        <div class="weekly-quiz-container">
            <div class="quiz-header">
                <h2><i class="fas fa-clipboard-check"></i> Quiz Semanal - Semana 1</h2>
                <div class="quiz-info">
                    <span><i class="fas fa-clock"></i> 45 minutos</span>
                    <span><i class="fas fa-star"></i> 200 puntos</span>
                    <span><i class="fas fa-trophy"></i> 70% para aprobar</span>
                </div>
            </div>

            <div class="quiz-intro">
                <p>Este quiz evalúa tu comprensión de los conceptos fundamentales de las metodologías ágiles cubiertos en la Semana 1.</p>
                <div class="quiz-instructions">
                    <h4>Instrucciones:</h4>
                    <ul>
                        <li>Responde todas las preguntas</li>
                        <li>Tienes 45 minutos para completar el quiz</li>
                        <li>Necesitas 70% de respuestas correctas para aprobar</li>
                        <li>Puedes revisar tus respuestas antes de enviar</li>
                    </ul>
                </div>
            </div>

            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="quizProgressBar" style="width: 0%"></div>
                </div>
                <span class="progress-text">Pregunta <span id="currentQuestion">1</span> de <span id="totalQuestions">20</span></span>
            </div>

            <div class="quiz-questions" id="quizQuestions">
                <!-- Las preguntas se generarán dinámicamente -->
            </div>

            <div class="quiz-actions">
                <button class="btn btn-secondary" onclick="previousQuestion()" id="prevBtn" disabled>
                    <i class="fas fa-arrow-left"></i> Anterior
                </button>
                <button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn">
                    Siguiente <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn btn-success" onclick="submitQuiz()" id="submitBtn" style="display: none;">
                    <i class="fas fa-check"></i> Enviar Quiz
                </button>
            </div>
        </div>
    `;

    showModal('Quiz Semanal - Semana 1', quizHTML);
    initializeWeeklyQuiz();
}

// Inicializar Quiz Semanal
function initializeWeeklyQuiz() {
    const quizQuestions = [
        {
            question: "¿Cuál es la característica principal que distingue a las metodologías ágiles de las tradicionales?",
            options: [
                "Documentación extensiva y detallada",
                "Adaptabilidad al cambio y entrega iterativa",
                "Planificación rígida y secuencial",
                "Enfoque únicamente en tecnología"
            ],
            correct: 1,
            explanation: "Las metodologías ágiles se caracterizan por su capacidad para adaptarse rápidamente a los cambios y entregar valor de forma iterativa."
        },
        {
            question: "¿En qué año se publicó el Manifiesto Ágil?",
            options: ["1995", "1998", "2001", "2005"],
            correct: 2,
            explanation: "El Manifiesto Ágil fue publicado en 2001 por 17 expertos en desarrollo de software."
        },
        {
            question: "¿Cuántos valores fundamentales establece el Manifiesto Ágil?",
            options: ["2", "4", "6", "12"],
            correct: 1,
            explanation: "El Manifiesto Ágil establece 4 valores fundamentales: individuos e interacciones, software funcionando, colaboración con el cliente, y respuesta ante el cambio."
        },
        {
            question: "¿Cuántos principios incluye el Manifiesto Ágil?",
            options: ["4", "8", "12", "16"],
            correct: 2,
            explanation: "El Manifiesto Ágil incluye 12 principios que complementan los 4 valores fundamentales."
        },
        {
            question: "¿Qué método fue creado por Ken Schwaber y Jeff Sutherland?",
            options: ["Extreme Programming", "Scrum", "Crystal", "DSDM"],
            correct: 1,
            explanation: "Scrum fue desarrollado por Ken Schwaber y Jeff Sutherland como framework para gestión de proyectos complejos."
        },
        {
            question: "¿Qué principio ágil establece: 'El software funcionando es la medida principal de progreso'?",
            options: ["Principio 1", "Principio 4", "Principio 7", "Principio 10"],
            correct: 2,
            explanation: "El Principio 7 establece que el software funcionando es la medida principal de progreso en lugar de métricas como líneas de código o documentación."
        },
        {
            question: "¿Cuál es el término correcto para los ciclos cortos en Scrum?",
            options: ["Phases", "Milestones", "Sprints", "Iterations"],
            correct: 2,
            explanation: "En Scrum, los ciclos cortos de trabajo se llaman Sprints, que típicamente duran de 2 a 4 semanas."
        },
        {
            question: "¿Qué metodología enfatiza la comunicación cara a cara como el método más eficiente?",
            options: ["Todas las metodologías ágiles", "Solo Scrum", "Solo Extreme Programming", "Ninguna metodología tradicional"],
            correct: 0,
            explanation: "El Principio 6 del Manifiesto Ágil establece que la comunicación cara a cara es el método más eficiente y efectivo para todo el desarrollo de software ágil."
        },
        {
            question: "¿Qué significa el principio YAGNI en desarrollo ágil?",
            options: ["You Always Need It", "You Aren't Gonna Need It", "You Are Going Near It", "You Ask Good News Immediately"],
            correct: 1,
            explanation: "YAGNI significa 'You Aren't Gonna Need It' (No lo vas a necesitar), un principio que promueve no añadir funcionalidad hasta que sea realmente necesaria."
        },
        {
            question: "¿Cuál es el principal beneficio de las metodologías ágiles para el cliente?",
            options: ["Documentación completa", "Proceso predecible", "Mayor satisfacción y valor entregado temprano", "Menor costo inicial"],
            correct: 2,
            explanation: "Los clientes obtienen mayor satisfacción a través de entregas tempranas de valor y la capacidad de ajustar requisitos según sus necesidades."
        },
        {
            question: "¿Qué tipo de proyectos es más adecuado para el modelo en cascada tradicional?",
            options: [
                "Proyectos con requisitos inciertos",
                "Proyectos con alta complejidad",
                "Proyectos con requisitos muy claros y estables",
                "Proyectos donde el time-to-market es crítico"
            ],
            correct: 2,
            explanation: "El modelo en cascada funciona mejor con proyectos que tienen requisitos muy claros, estables y bien definidos desde el inicio."
        },
        {
            question: "¿Qué es una 'retrospective' en metodologías ágiles?",
            options: [
                "Una reunión de planificación al inicio del proyecto",
                "Una reunión para revisar el progreso con el cliente",
                "Una reunión para evaluar y mejorar el proceso de trabajo",
                "Una reunión para probar el software final"
            ],
            correct: 2,
            explanation: "Una retrospectiva es una reunión al final de cada ciclo donde el equipo reflexiona sobre su proceso e identifica mejoras."
        },
        {
            question: "¿Cuál es la duración típica de un Sprint en Scrum?",
            options: ["1 semana", "2-4 semanas", "6-8 semanas", "3 meses"],
            correct: 1,
            explanation: "Los Sprints típicamente duran de 2 a 4 semanas, aunque algunos equipos usan Sprints de 1 semana."
        },
        {
            question: "¿Qué principio ágil promueve el desarrollo sostenible?",
            options: [
                "Principio 5: Proyectos con personas motivadas",
                "Principio 8: Desarrollo sostenible",
                "Principio 11: Arquitecturas emergentes",
                "Principio 12: Reflexión y ajuste"
            ],
            correct: 1,
            explanation: "El Principio 8 promueve el desarrollo sostenible, permitiendo que los patrocinadores, desarrolladores y usuarios mantengan un ritmo constante indefinidamente."
        },
        {
            question: "¿Qué significa el valor 'Individuos e interacciones sobre procesos y herramientas'?",
            options: [
                "Que los procesos y herramientas no son necesarios",
                "Que las personas y su colaboración son más importantes que los procesos rígidos",
                "Que las herramientas deben usarse sin procesos",
                "Que las interacciones solo deben ser virtuales"
            ],
            correct: 1,
            explanation: "Este valor enfatiza que las personas y su capacidad para colaborar son más importantes que los procesos rígidos y las herramientas sofisticadas."
        },
        {
            question: "¿Qué metodología fue creada por Kent Beck?",
            options: ["Scrum", "Crystal", "Extreme Programming", "Kanban"],
            correct: 2,
            explanation: "Extreme Programming (XP) fue creada por Kent Beck y enfatiza prácticas como pair programming, TDD y releases frecuentes."
        },
        {
            question: "¿Cuál es un desafío común en la implementación de metodologías ágiles?",
            options: [
                "Demasiada documentación",
                "Resistencia cultural al cambio",
                "Falta de comunicación con el cliente",
                "Procesos demasiado flexibles"
            ],
            correct: 1,
            explanation: "La resistencia cultural al cambio es uno de los mayores desafíos en la transición a metodologías ágiles, ya que requiere un cambio fundamental en la mentalidad y formas de trabajar."
        },
        {
            question: "¿Qué es 'backlog' en metodologías ágiles?",
            options: [
                "Una lista de errores que necesitan ser corregidos",
                "Una lista priorizada de características y tareas por hacer",
                "Un registro del tiempo invertido en el proyecto",
                "Un documento con toda la documentación del proyecto"
            ],
            correct: 1,
            explanation: "El backlog es una lista priorizada de características, historias de usuario y tareas que el equipo necesita completar."
        },
        {
            question: "¿Qué factor es crítico para el éxito de la transformación ágil?",
            options: [
                "Uso de herramientas sofisticadas",
                "Documentación exhaustiva",
                "Compromiso de la dirección",
                "Procesos burocráticos estrictos"
            ],
            correct: 2,
            explanation: "El compromiso y apoyo activo de la dirección es fundamental para el éxito de cualquier transformación ágil."
        },
        {
            question: "¿Cuál es el propósito principal de las 'daily stand-up meetings'?",
            options: [
                "Reportar progreso a la dirección",
                "Compartir estado y planificar el trabajo del día",
                "Resolver todos los problemas técnicos",
                "Realizar testing del software"
            ],
            correct: 1,
            explanation: "Las daily stand-ups son reuniones breves donde cada miembro comparte qué hizo ayer, qué hará hoy y cualquier obstáculo que esté enfrentando."
        },
        {
            question: "¿Qué metodología ágil se originó en el sistema de producción de Toyota?",
            options: ["Scrum", "Kanban", "Extreme Programming", "Crystal"],
            correct: 1,
            explanation: "Kanban se originó en el sistema de producción de Toyota y se enfoca en visualizar el flujo de trabajo y limitar el trabajo en progreso."
        }
    ];

    window.currentQuizState = {
        questions: quizQuestions,
        currentIndex: 0,
        answers: new Array(quizQuestions.length).fill(null),
        startTime: Date.now(),
        timeLimit: 45 * 60 * 1000, // 45 minutos en milisegundos
        timer: null
    };

    // Actualizar información del quiz
    document.getElementById('totalQuestions').textContent = quizQuestions.length;

    // Iniciar temporizador
    startQuizTimer();

    // Mostrar primera pregunta
    showQuizQuestion(0);
}

// Temporizador del quiz
function startQuizTimer() {
    const timerElement = document.createElement('div');
    timerElement.id = 'quizTimer';
    timerElement.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    `;

    const modal = document.querySelector('.modal-content');
    if (modal) {
        modal.style.position = 'relative';
        modal.appendChild(timerElement);
    }

    let timeRemaining = window.currentQuizState.timeLimit;

    window.currentQuizState.timer = setInterval(() => {
        timeRemaining -= 1000;

        if (timeRemaining <= 0) {
            clearInterval(window.currentQuizState.timer);
            submitQuiz();
            return;
        }

        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 300000) { // Últimos 5 minutos
            timerElement.style.background = '#ef4444';
        }
    }, 1000);
}

// Mostrar pregunta específica
function showQuizQuestion(index) {
    const question = window.currentQuizState.questions[index];
    const questionsContainer = document.getElementById('quizQuestions');

    questionsContainer.innerHTML = `
        <div class="question-card">
            <div class="question-text">
                <h3>Pregunta ${index + 1}</h3>
                <p>${question.question}</p>
            </div>
            <div class="question-options">
                ${question.options.map((option, i) => `
                    <label class="option-label">
                        <input type="radio" name="question${index}" value="${i}"
                               ${window.currentQuizState.answers[index] === i ? 'checked' : ''}
                               onchange="selectAnswer(${index}, ${i})">
                        <span class="option-text">${String.fromCharCode(65 + i)}. ${option}</span>
                    </label>
                `).join('')}
            </div>
            ${window.currentQuizState.answers[index] !== null ? `
                <div class="question-feedback">
                    <div class="feedback-icon ${window.currentQuizState.answers[index] === question.correct ? 'correct' : 'incorrect'}">
                        <i class="fas ${window.currentQuizState.answers[index] === question.correct ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    </div>
                    <div class="feedback-text">
                        ${window.currentQuizState.answers[index] === question.correct ?
                            '✅ Correcto' :
                            `❌ Incorrecto. ${question.explanation}`}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Actualizar navegación
    updateQuizNavigation();
}

// Seleccionar respuesta
function selectAnswer(questionIndex, answerIndex) {
    window.currentQuizState.answers[questionIndex] = answerIndex;
    showQuizQuestion(questionIndex); // Refrescar para mostrar feedback
}

// Navegación del quiz
function updateQuizNavigation() {
    const currentIndex = window.currentQuizState.currentIndex;
    const totalQuestions = window.currentQuizState.questions.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Actualizar barra de progreso
    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    document.getElementById('quizProgressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = currentIndex + 1;

    // Actualizar botones
    prevBtn.disabled = currentIndex === 0;

    if (currentIndex === totalQuestions - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    // Verificar si todas las preguntas tienen respuesta
    const allAnswered = window.currentQuizState.answers.every(answer => answer !== null);
    if (currentIndex === totalQuestions - 1 && allAnswered) {
        submitBtn.disabled = false;
    } else if (currentIndex === totalQuestions - 1) {
        submitBtn.disabled = true;
    }
}

// Siguiente pregunta
function nextQuestion() {
    if (window.currentQuizState.currentIndex < window.currentQuizState.questions.length - 1) {
        window.currentQuizState.currentIndex++;
        showQuizQuestion(window.currentQuizState.currentIndex);
    }
}

// Pregunta anterior
function previousQuestion() {
    if (window.currentQuizState.currentIndex > 0) {
        window.currentQuizState.currentIndex--;
        showQuizQuestion(window.currentQuizState.currentIndex);
    }
}

// Enviar quiz
function submitQuiz() {
    clearInterval(window.currentQuizState.timer);

    const correctAnswers = window.currentQuizState.answers.filter((answer, index) =>
        answer === window.currentQuizState.questions[index].correct
    ).length;

    const totalQuestions = window.currentQuizState.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = percentage >= 70;

    const timeTaken = Math.floor((Date.now() - window.currentQuizState.startTime) / 1000 / 60);

    const resultsHTML = `
        <div class="quiz-results">
            <div class="results-header ${passed ? 'passed' : 'failed'}">
                <div class="results-icon">
                    <i class="fas ${passed ? 'fa-trophy' : 'fa-exclamation-triangle'}"></i>
                </div>
                <h2>${passed ? '¡Felicitaciones!' : 'Necesitas mejorar'}</h2>
                <p class="results-message">
                    ${passed ?
                        'Has aprobado el quiz semanal de la Semana 1.' :
                        'No has alcanzado el 70% requerido. Te recomendamos repasar los materiales e intentar nuevamente.'}
                </p>
            </div>

            <div class="results-stats">
                <div class="stat-item">
                    <div class="stat-label">Respuestas Correctas</div>
                    <div class="stat-value">${correctAnswers}/${totalQuestions}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Puntuación</div>
                    <div class="stat-value">${percentage}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Tiempo</div>
                    <div class="stat-value">${timeTaken} minutos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Puntos Ganados</div>
                    <div class="stat-value">${passed ? '200' : '0'}</div>
                </div>
            </div>

            <div class="results-details">
                <h3>Revisión de Respuestas</h3>
                <div class="answers-review">
                    ${window.currentQuizState.questions.map((question, index) => {
                        const isCorrect = window.currentQuizState.answers[index] === question.correct;
                        return `
                            <div class="answer-review ${isCorrect ? 'correct' : 'incorrect'}">
                                <div class="answer-header">
                                    <span class="question-number">Pregunta ${index + 1}</span>
                                    <span class="answer-status">${isCorrect ? '✅ Correcto' : '❌ Incorrecto'}</span>
                                </div>
                                <div class="question-text">${question.question}</div>
                                <div class="selected-answer">
                                    <strong>Tu respuesta:</strong> ${question.options[window.currentQuizState.answers[index]]}
                                </div>
                                ${!isCorrect ? `
                                    <div class="correct-answer">
                                        <strong>Respuesta correcta:</strong> ${question.options[question.correct]}
                                    </div>
                                    <div class="explanation">
                                        <strong>Explicación:</strong> ${question.explanation}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="results-actions">
                ${passed ? `
                    <button class="btn btn-primary" onclick="closeModalAndContinue()">
                        <i class="fas fa-arrow-right"></i> Continuar al Proyecto
                    </button>
                ` : `
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-book"></i> Repasar Material
                    </button>
                    <button class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-redo"></i> Reintentar Quiz
                    </button>
                `}
            </div>
        </div>
    `;

    // Actualizar progreso del usuario
    if (passed) {
        addPoints(200);
        appState.userProgress.week1QuizPassed = true;
        saveUserProgress();
        showNotification('🎉 ¡Quiz aprobado! +200 puntos', 'success');
    } else {
        showNotification('❌ Quiz no aprobado. Repasa el material e intenta nuevamente', 'warning');
    }

    // Mostrar resultados
    const modal = document.querySelector('.modal-content');
    if (modal) {
        modal.innerHTML = resultsHTML;
    }
}

// Mostrar Proyecto Práctico
function showPracticalProject() {
    const projectHTML = `
        <div class="practical-project-container">
            <div class="project-header">
                <h2><i class="fas fa-project-diagram"></i> Proyecto Práctico - Semana 1</h2>
                <div class="project-info">
                    <span><i class="fas fa-clock"></i> 2-3 horas</span>
                    <span><i class="fas fa-star"></i> 100 puntos</span>
                    <span><i class="fas fa-trophy"></i> Evaluación individual</span>
                </div>
            </div>

            <div class="project-intro">
                <div class="project-description">
                    <h3>Análisis de Caso: Transición a Ágil</h3>
                    <p>Analiza una organización ficticia que desea transicionar de metodologías tradicionales a ágiles y desarrolla un plan completo para facilitar esta transformación.</p>
                </div>

                <div class="learning-objectives">
                    <h4>Objetivos de Aprendizaje:</h4>
                    <ul>
                        <li>Aplicar conceptos fundamentales de metodologías ágiles</li>
                        <li>Identificar desafíos y riesgos en la transición</li>
                        <li>Desarrollar un plan de implementación realista</li>
                        <li>Definir métricas de éxito adecuadas</li>
                        <li>Practicar análisis organizacional</li>
                    </ul>
                </div>
            </div>

            <div class="project-scenario">
                <h3><i class="fas fa-building"></i> Caso de Estudio: TechSolutions S.A.</h3>

                <div class="company-info">
                    <div class="company-details">
                        <h4>Información de la Empresa:</h4>
                        <ul>
                            <li><strong>Empresa:</strong> TechSolutions S.A. - Software Development Company</li>
                            <li><strong>Tamaño:</strong> 150 empleados (50 desarrolladores, 20 QA, 30 en infraestructura, 50 en ventas y administración)</li>
                            <li><strong>Industria:</strong> Desarrollo de software empresarial</li>
                            <li><strong>Clientes:</strong> Empresas medianas y grandes en sector financiero y retail</li>
                            <li><strong>Metodología Actual:</strong> Modelo en cascada tradicional con documentación extensiva</li>
                        </ul>
                    </div>

                    <div class="current-challenges">
                        <h4>Problemas Actuales:</h4>
                        <ul>
                            <li>Los proyectos típicamente tardan 30-40% más de lo planeado</li>
                            <li>Los clientes reportan insatisfacción con el tiempo de entrega</li>
                            <li>Alta rotación de personal técnico (25% anual)</li>
                            <li>Dificultad para adaptarse a cambios del mercado</li>
                            <li>Comunicación pobre entre equipos y stakeholders</li>
                            <li>Calidad del producto inconsistente</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="project-requirements">
                <h3><i class="fas fa-tasks"></i> Entregables del Proyecto</h3>

                <div class="deliverables-grid">
                    <div class="deliverable-card">
                        <div class="deliverable-number">1</div>
                        <div class="deliverable-content">
                            <h4>Diagnóstico de Situación Actual</h4>
                            <ul>
                                <li>Análisis de la metodología actual</li>
                                <li>Identificación de fortalezas y debilidades</li>
                                <li>Entrevistas con stakeholders clave</li>
                                <li>Matriz FODA (Fortalezas, Oportunidades, Debilidades, Amenazas)</li>
                            </ul>
                        </div>
                    </div>

                    <div class="deliverable-card">
                        <div class="deliverable-number">2</div>
                        <div class="deliverable-content">
                            <h4>Plan de Transición Ágil</h4>
                            <ul>
                                <li>Metodología ágil seleccionada y justificación</li>
                                <li>Estrategia de implementación por fases</li>
                                <li>Plan de capacitación y entrenamiento</li>
                                <li>Asignación de roles y responsabilidades</li>
                            </ul>
                        </div>
                    </div>

                    <div class="deliverable-card">
                        <div class="deliverable-number">3</div>
                        <div class="deliverable-content">
                            <h4>Análisis de Riesgos</h4>
                            <ul>
                                <li>Identificación de riesgos principales</li>
                                <li>Análisis de probabilidad e impacto</li>
                                <li>Plan de mitigación para cada riesgo</li>
                                <li>Estrategia de contingencia</li>
                            </ul>
                        </div>
                    </div>

                    <div class="deliverable-card">
                        <div class="deliverable-number">4</div>
                        <div class="deliverable-content">
                            <h4>Métricas de Éxito y KPIs</h4>
                            <ul>
                                <li>Indicadores de éxito cuantitativos</li>
                                <li>Métricas de calidad y productividad</li>
                                <li>Indicadores de satisfacción del cliente</li>
                                <li>Dashboard de seguimiento propuesto</li>
                            </ul>
                        </div>
                    </div>

                    <div class="deliverable-card">
                        <div class="deliverable-number">5</div>
                        <div class="deliverable-content">
                            <h4>Cronograma de Implementación</h4>
                            <ul>
                                <li>Plan de implementación detallado (6-12 meses)</li>
                                <li>Hitos principales y entregables</li>
                                <li>Asignación de recursos</li>
                                <li>Presupuesto estimado</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="project-guidelines">
                <h3><i class="fas fa-lightbulb"></i> Lineamientos para el Desarrollo</h3>

                <div class="guidelines-grid">
                    <div class="guideline-section">
                        <h4>Formato y Presentación:</h4>
                        <ul>
                            <li>Documento principal de 15-20 páginas</li>
                            <li>Incluir executive summary (1 página)</li>
                            <li>Usar gráficos, diagramas y tablas para soportar análisis</li>
                            <li>Citas y referencias a materiales del curso</li>
                            <li>Profesionalismo y claridad en la redacción</li>
                        </ul>
                    </div>

                    <div class="guideline-section">
                        <h4>Contenido Requerido:</h4>
                        <ul>
                            <li>Aplicación de conceptos vistos en la Semana 1</li>
                            <li>Análisis crítico basado en el caso presentado</li>
                            <li>Recomendaciones específicas y accionables</li>
                            <li>Justificación para cada decisión propuesta</li>
                            <li>Consideración del contexto organizacional</li>
                        </ul>
                    </div>

                    <div class="guideline-section">
                        <h4>Evaluación:</h4>
                        <div class="evaluation-criteria">
                            <div class="criteria-item">
                                <span class="criteria-label">Análisis crítico:</span>
                                <span class="criteria-weight">20%</span>
                            </div>
                            <div class="criteria-item">
                                <span class="criteria-label">Viabilidad del plan:</span>
                                <span class="criteria-weight">25%</span>
                            </div>
                            <div class="criteria-item">
                                <span class="criteria-label">Identificación de riesgos:</span>
                                <span class="criteria-weight">20%</span>
                            </div>
                            <div class="criteria-item">
                                <span class="criteria-label">Métricas apropiadas:</span>
                                <span class="criteria-weight">15%</span>
                            </div>
                            <div class="criteria-item">
                                <span class="criteria-label">Claridad y presentación:</span>
                                <span class="criteria-weight">20%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="project-tips">
                <h3><i class="fas fa-star"></i> Tips para el Éxito</h3>
                <div class="tips-grid">
                    <div class="tip-card">
                        <div class="tip-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <p>Revisa cuidadosamente todos los materiales de la Semana 1 antes de comenzar</p>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <p>Investiga casos reales de transición ágil en empresas similares</p>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <p>Considera el factor humano y la cultura organizacional</p>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <p>Sé realista sobre el tiempo y recursos necesarios</p>
                    </div>
                </div>
            </div>

            <div class="project-actions">
                <button class="btn btn-secondary" onclick="downloadProjectTemplate()">
                    <i class="fas fa-download"></i> Descargar Plantilla
                </button>
                <button class="btn btn-primary" onclick="startProject()">
                    <i class="fas fa-play"></i> Comenzar Proyecto
                </button>
            </div>
        </div>
    `;

    showModal('Proyecto Práctico - Semana 1', projectHTML);
}

// Descargar plantilla del proyecto
function downloadProjectTemplate() {
    const template = `
# Plan de Transición a Metodologías Ágiles
## TechSolutions S.A.

### Información del Estudiante
- Nombre: [Tu Nombre]
- Fecha: [Fecha Actual]
- Curso: Semana 1 - Metodologías Ágiles

### 1. Diagnóstico de Situación Actual
[Desarrollar esta sección...]

### 2. Plan de Transición Ágil
[Desarrollar esta sección...]

### 3. Análisis de Riesgos
[Desarrollar esta sección...]

### 4. Métricas de Éxito y KPIs
[Desarrollar esta sección...]

### 5. Cronograma de Implementación
[Desarrollar esta sección...]

### Referencias
- Materiales del curso Semana 1
- Manifiesto Ágil (2001)
- Otras referencias relevantes
    `;

    const blob = new Blob([template], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-proyecto-semana1.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('📄 Plantilla descargada exitosamente', 'success');
}

// Comenzar proyecto
function startProject() {
    showNotification('🚀 ¡Buena suerte con tu proyecto! Recuerda guardar tu trabajo regularmente.', 'success');
    closeModal();

    // Guardar progreso del proyecto
    appState.userProgress.week1ProjectStarted = true;
    saveUserProgress();
}

// Función para cerrar modal y continuar
function closeModalAndContinue() {
    closeModal();
    // Podríamos redirigir a una página de resumen o siguiente semana
    showNotification('🎯 ¡Excelente trabajo! Ahora puedes continuar con el proyecto práctico.', 'success');
}

// CSS adicional para quiz y proyecto
const quizAndProjectStyles = document.createElement('style');
quizAndProjectStyles.textContent = `
    .weekly-quiz-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .quiz-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid var(--border-color);
    }

    .quiz-header h2 {
        color: var(--text-dark);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .quiz-header h2 i {
        color: var(--primary-color);
    }

    .quiz-info {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .quiz-info span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
        font-size: 0.9rem;
    }

    .quiz-info span i {
        color: var(--primary-color);
    }

    .quiz-intro {
        background: var(--bg-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin-bottom: 2rem;
    }

    .quiz-intro p {
        margin-bottom: 1rem;
        color: var(--text-dark);
    }

    .quiz-instructions h4 {
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
    }

    .quiz-instructions ul {
        margin: 0;
        padding-left: 1.5rem;
        color: var(--text-light);
    }

    .quiz-progress {
        margin-bottom: 2rem;
        text-align: center;
    }

    .quiz-progress .progress-bar {
        background: var(--border-color);
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .quiz-progress .progress-fill {
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        height: 100%;
        transition: width 0.3s ease;
    }

    .progress-text {
        color: var(--text-light);
        font-size: 0.9rem;
    }

    .question-card {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        margin-bottom: 1.5rem;
    }

    .question-text h3 {
        color: var(--text-dark);
        margin: 0 0 1rem 0;
    }

    .question-text p {
        color: var(--text-dark);
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0;
    }

    .question-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .option-label {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-light);
        border-radius: var(--border-radius);
        border: 2px solid transparent;
        cursor: pointer;
        transition: var(--transition-smooth);
    }

    .option-label:hover {
        border-color: var(--primary-color);
        background: rgba(79, 70, 229, 0.05);
    }

    .option-label input[type="radio"] {
        margin-top: 2px;
        flex-shrink: 0;
    }

    .option-text {
        color: var(--text-dark);
        line-height: 1.5;
    }

    .question-feedback {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .question-feedback.correct {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid #10b981;
    }

    .question-feedback.incorrect {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
    }

    .feedback-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }

    .question-feedback.correct .feedback-icon {
        color: #10b981;
    }

    .question-feedback.incorrect .feedback-icon {
        color: #ef4444;
    }

    .feedback-text {
        color: var(--text-dark);
        line-height: 1.5;
    }

    .quiz-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .quiz-results {
        text-align: center;
    }

    .results-header {
        padding: 2rem;
        border-radius: var(--border-radius);
        margin-bottom: 2rem;
    }

    .results-header.passed {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
        border: 2px solid #10b981;
    }

    .results-header.failed {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
        border: 2px solid #ef4444;
    }

    .results-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .results-header.passed .results-icon {
        color: #10b981;
    }

    .results-header.failed .results-icon {
        color: #ef4444;
    }

    .results-header h2 {
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
    }

    .results-message {
        color: var(--text-light);
        margin: 0;
    }

    .results-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-item {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
    }

    .stat-label {
        color: var(--text-light);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        color: var(--text-dark);
        font-size: 1.5rem;
        font-weight: 700;
    }

    .results-details {
        text-align: left;
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
    }

    .results-details h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        text-align: center;
    }

    .answers-review {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .answer-review {
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border-left: 4px solid;
    }

    .answer-review.correct {
        background: rgba(16, 185, 129, 0.05);
        border-left-color: #10b981;
    }

    .answer-review.incorrect {
        background: rgba(239, 68, 68, 0.05);
        border-left-color: #ef4444;
    }

    .answer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .question-number {
        font-weight: 600;
        color: var(--text-dark);
    }

    .answer-status {
        font-weight: 600;
    }

    .answer-review.correct .answer-status {
        color: #10b981;
    }

    .answer-review.incorrect .answer-status {
        color: #ef4444;
    }

    .question-text {
        color: var(--text-dark);
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .selected-answer, .correct-answer, .explanation {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .selected-answer {
        color: var(--text-dark);
    }

    .correct-answer {
        color: #10b981;
    }

    .explanation {
        color: var(--text-light);
        font-style: italic;
    }

    .results-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    /* Estilos para Proyecto Práctico */
    .practical-project-container {
        max-width: 900px;
        margin: 0 auto;
    }

    .project-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid var(--border-color);
    }

    .project-header h2 {
        color: var(--text-dark);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .project-header h2 i {
        color: var(--primary-color);
    }

    .project-info {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .project-info span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
        font-size: 0.9rem;
    }

    .project-info span i {
        color: var(--primary-color);
    }

    .project-intro {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .project-description h3 {
        color: var(--text-dark);
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .project-description h3 i {
        color: var(--primary-color);
    }

    .project-description p {
        color: var(--text-dark);
        line-height: 1.6;
        margin: 0;
    }

    .learning-objectives {
        background: var(--bg-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        height: fit-content;
    }

    .learning-objectives h4 {
        color: var(--text-dark);
        margin: 0 0 1rem 0;
    }

    .learning-objectives ul {
        margin: 0;
        padding-left: 1.5rem;
        color: var(--text-light);
    }

    .project-scenario {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
    }

    .project-scenario h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .project-scenario h3 i {
        color: var(--primary-color);
    }

    .company-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .company-details h4, .current-challenges h4 {
        color: var(--text-dark);
        margin: 0 0 1rem 0;
    }

    .company-details ul, .current-challenges ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .company-details li, .current-challenges li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }

    .company-details li::before, .current-challenges li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    .project-requirements {
        margin-bottom: 2rem;
    }

    .project-requirements h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        text-align: center;
    }

    .deliverables-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .deliverable-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        display: flex;
        gap: 1rem;
        transition: var(--transition-smooth);
    }

    .deliverable-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
    }

    .deliverable-number {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
    }

    .deliverable-content h4 {
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
    }

    .deliverable-content ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .deliverable-content li {
        padding: 0.25rem 0;
        padding-left: 1rem;
        position: relative;
        font-size: 0.9rem;
        color: var(--text-light);
    }

    .deliverable-content li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary-color);
    }

    .project-guidelines {
        background: var(--bg-light);
        padding: 2rem;
        border-radius: var(--border-radius);
        margin-bottom: 2rem;
    }

    .project-guidelines h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .project-guidelines h3 i {
        color: var(--primary-color);
    }

    .guidelines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .guideline-section {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
    }

    .guideline-section h4 {
        color: var(--text-dark);
        margin: 0 0 1rem 0;
    }

    .guideline-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .guideline-section li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
        color: var(--text-light);
    }

    .guideline-section li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary-color);
    }

    .evaluation-criteria {
        margin-top: 1rem;
    }

    .criteria-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .criteria-item:last-child {
        border-bottom: none;
    }

    .criteria-label {
        color: var(--text-dark);
        font-weight: 500;
    }

    .criteria-weight {
        color: var(--primary-color);
        font-weight: 600;
    }

    .project-tips {
        margin-bottom: 2rem;
    }

    .project-tips h3 {
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .project-tips h3 i {
        color: var(--accent-color);
    }

    .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .tip-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        transition: var(--transition-smooth);
    }

    .tip-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
    }

    .tip-icon {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .tip-card p {
        color: var(--text-dark);
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .project-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    /* Responsive para quiz y proyecto */
    @media (max-width: 768px) {
        .project-intro,
        .company-info,
        .guidelines-grid {
            grid-template-columns: 1fr;
        }

        .deliverables-grid {
            grid-template-columns: 1fr;
        }

        .deliverable-card {
            flex-direction: column;
            text-align: center;
        }

        .tip-card {
            flex-direction: column;
            text-align: center;
        }

        .project-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(quizAndProjectStyles);

// Funciones de interactividad para las lecciones
function checkPrinciplesScenario() {
    const checkboxes = document.querySelectorAll('.principle-checkbox input:checked');
    const selectedPrinciples = Array.from(checkboxes).map(cb => parseInt(cb.value));

    const correctPrinciples = [1, 6]; // Individuos e interacciones, Desarrollo sostenible

    const isCorrect = selectedPrinciples.length === correctPrinciples.length &&
                     correctPrinciples.every(principle => selectedPrinciples.includes(principle));

    const feedbackDiv = document.getElementById('principlesFeedback');

    feedbackDiv.style.display = 'flex';
    feedbackDiv.className = `scenario-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    feedbackDiv.innerHTML = `
        <div class="feedback-icon">
            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
        </div>
        <p class="feedback-text">
            ${isCorrect ?
                '¡Correcto! Este escenario aplica los principios 1 (Individuos e interacciones sobre procesos y herramientas) y 6 (Comunicación cara a cara).' :
                'Incorrecto. Este escenario aplica principalmente los principios 1 (Individuos e interacciones) y 6 (Comunicación cara a cara).'}
        </p>
    `;

    if (isCorrect) {
        addPoints(25);
        showNotification('¡Respuesta correcta! +25 puntos', 'success');
    }
}

// Funciones para drag and drop de cronología interactiva
function initializeTimelineDragAndDrop() {
    const eventDraggables = document.querySelectorAll('.event-draggable');
    const yearSlots = document.querySelectorAll('.year-slot');

    // Atributos necesarios para los eventos
    eventDraggables.forEach(event => {
        if (!event.hasAttribute('draggable')) {
            event.setAttribute('draggable', 'true');
        }
        event.addEventListener('dragstart', handleTimelineDragStart);
        event.addEventListener('dragend', handleTimelineDragEnd);
    });

    yearSlots.forEach(slot => {
        slot.addEventListener('dragover', handleTimelineDragOver);
        slot.addEventListener('drop', handleTimelineDrop);
        slot.addEventListener('dragleave', handleTimelineDragLeave);
    });

    console.log(`🕒 Cronología inicializada: ${eventDraggables.length} eventos, ${yearSlots.length} años`);
}

function handleTimelineDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.dataTransfer.setData('text/plain', e.target.dataset.year);
    console.log(`🎯 Iniciando arrastre: ${e.target.textContent} (año ${e.target.dataset.year})`);
}

function handleTimelineDragEnd(e) {
    e.target.classList.remove('dragging');
    // Limpiar zonas de drop
    document.querySelectorAll('.year-slot').forEach(slot => {
        slot.classList.remove('drag-over');
    });
}

function handleTimelineDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleTimelineDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleTimelineDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();

    const slot = e.currentTarget;
    slot.classList.remove('drag-over');

    const draggedElement = document.querySelector('.dragging');
    if (draggedElement) {
        const correctYear = draggedElement.dataset.year;
        const slotYear = slot.dataset.year;

        console.log(`📍 Soltando ${draggedElement.textContent} en año ${slotYear} (correcto: ${correctYear})`);

        if (correctYear === slotYear) {
            // Correcto: colocar el evento en el slot
            slot.innerHTML = draggedElement.innerHTML;
            slot.classList.add('correct-placement');
            slot.setAttribute('data-event', draggedElement.textContent);

            // Ocultar el elemento original
            draggedElement.style.display = 'none';
            draggedElement.classList.add('placed');

            console.log(`✅ ¡Correcto! ${draggedElement.textContent} colocado en ${slotYear}`);
            showNotification(`✅ ¡Correcto! ${draggedElement.textContent} pertenece al año ${slotYear}`, 'success');

            // Añadir puntos
            addPoints(25);

            // Verificar si todos los eventos están colocados
            checkTimelineCompletion();
        } else {
            // Incorrecto
            slot.classList.add('incorrect-placement');
            setTimeout(() => {
                slot.classList.remove('incorrect-placement');
            }, 1000);

            console.log(`❌ Incorrecto. ${draggedElement.textContent} no pertenece al año ${slotYear}`);
            showNotification(`❌ Incorrecto. ${draggedElement.textContent} no pertenece al año ${slotYear}`, 'error');
        }
    }

    return false;
}

function checkTimelineCompletion() {
    const placedEvents = document.querySelectorAll('.event-draggable.placed');
    const totalEvents = document.querySelectorAll('.event-draggable').length;

    console.log(`📊 Progreso cronología: ${placedEvents.length}/${totalEvents} eventos colocados`);

    if (placedEvents.length === totalEvents) {
        console.log(`🎉 ¡Cronología completada!`);
        showNotification('🎉 ¡Felicitaciones! Has completado la cronología correctamente +50 puntos', 'success');
        addPoints(50);

        // Marcar lección como completada automáticamente
        if (appState.currentLesson === 2) {
            markCurrentLessonComplete();
        }
    }
}

// Funciones para drag and drop de clasificación
function initializeDragAndDrop() {
    const characteristicItems = document.querySelectorAll('.characteristic-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    characteristicItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.dataTransfer.setData('text/plain', e.target.dataset.correct);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');

    // Limpiar zonas de drop
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const zone = e.currentTarget;
    zone.classList.remove('drag-over');

    const draggedElement = document.querySelector('.dragging');
    if (draggedElement) {
        const correctMethod = draggedElement.dataset.correct;
        const targetMethod = zone.dataset.method;

        if (correctMethod === targetMethod) {
            // Añadir a la zona de drop correcta
            const clonedElement = draggedElement.cloneNode(true);
            clonedElement.classList.remove('dragging');
            clonedElement.draggable = false;
            zone.appendChild(clonedElement);

            // Ocultar el elemento original
            draggedElement.style.display = 'none';

            showNotification('¡Correcto! Elemento clasificado correctamente.', 'success');
            addPoints(10);
        } else {
            showNotification('Incorrecto. Intenta de nuevo.', 'warning');
        }
    }

    return false;
}

// Funciones para evaluar preparación ágil
function calculateAgileReadiness() {
    const leadership = parseInt(document.querySelector('input[name="leadership"]:checked')?.value || 0);
    const culture = parseInt(document.querySelector('input[name="culture"]:checked')?.value || 0);
    const skills = parseInt(document.querySelector('input[name="skills"]:checked')?.value || 0);

    const totalScore = leadership + culture + skills;
    const maxScore = 15;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let level = '';
    let recommendation = '';

    if (percentage >= 80) {
        level = 'Excelente';
        recommendation = 'Tu organización está muy bien preparada para una transición ágil exitosa.';
    } else if (percentage >= 60) {
        level = 'Buena';
        recommendation = 'Tu organización tiene una base sólida, pero necesita mejorar en algunas áreas clave.';
    } else if (percentage >= 40) {
        level = 'Moderada';
        recommendation = 'Tu organización necesita trabajar en varios aspectos antes de una transición ágil.';
    } else {
        level = 'Baja';
        recommendation = 'Tu organización requiere cambios significativos antes de considerar una transición ágil.';
    }

    const resultDiv = document.getElementById('readinessResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="readiness-result">
            <h4>Resultado de Evaluación</h4>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-number">${percentage}%</span>
                    <span class="score-label">${level}</span>
                </div>
            </div>
            <div class="breakdown">
                <div class="score-item">
                    <span>Liderazgo: ${leadership}/5</span>
                    <div class="mini-bar">
                        <div class="mini-fill" style="width: ${(leadership/5)*100}%"></div>
                    </div>
                </div>
                <div class="score-item">
                    <span>Cultura: ${culture}/5</span>
                    <div class="mini-bar">
                        <div class="mini-fill" style="width: ${(culture/5)*100}%"></div>
                    </div>
                </div>
                <div class="score-item">
                    <span>Habilidades: ${skills}/5</span>
                    <div class="mini-bar">
                        <div class="mini-fill" style="width: ${(skills/5)*100}%"></div>
                    </div>
                </div>
            </div>
            <div class="recommendation">
                <h5>Recomendación:</h5>
                <p>${recommendation}</p>
            </div>
        </div>
    `;

    showNotification(`Evaluación completada: ${level} preparación (${percentage}%)`, 'info');
}

// Inicializar funcionalidades adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar cronología interactiva si existen los elementos
    if (document.querySelector('.event-draggable')) {
        initializeTimelineDragAndDrop();
    }

    // Inicializar drag and drop de clasificación si existen los elementos
    if (document.querySelector('.characteristic-item')) {
        initializeDragAndDrop();
    }

    // Los botones se inicializan en initializeApp() y loadUserProgress()
});

// Función para inicializar botones de completación de lección
function initializeLessonCompletionButtons() {
    const currentLesson = appState.currentLesson;
    const nextLessonBtn = document.getElementById('nextLessonBtn');

    if (nextLessonBtn) {
        // El botón de siguiente lección está deshabilitado por defecto
        nextLessonBtn.disabled = !appState.completedLessons.includes(currentLesson);
    }
}

console.log('✅ Semana 1 con quiz y proyecto práctico completada');