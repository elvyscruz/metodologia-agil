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
    // La primera lección siempre está disponible
    if (lessonId === 1) return true;

    // Las demás lecciones requieren completar la anterior
    return appState.completedLessons.includes(lessonId - 1);
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

            updateProgressDisplay();
            updateLessonNavigation();
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

        // Desbloquear siguiente lección
        if (lessonId < 6) {
            unlockNextLesson();
        } else {
            showNotification('🎉 ¡Felicidades! Has completado todas las lecciones de la Semana 1', 'success');
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

function nextLesson() {
    const nextLesson = appState.currentLesson + 1;
    if (nextLesson <= 6) {
        switchToLesson(nextLesson);
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
window.sendTutorMessage = function() {
    const input = document.getElementById('tutorQuestion');
    if (input && input.value.trim()) {
        showNotification('Tu pregunta ha sido enviada al tutor', 'success');
        input.value = '';
    }
};

console.log('✅ Semana 1 inicializada correctamente');