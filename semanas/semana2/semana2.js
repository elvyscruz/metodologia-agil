// JavaScript para la Semana 2 - Scrum: Framework Ágil por Excelencia

// Estado global de la aplicación
const appState = {
    currentLesson: 1,
    completedLessons: [],
    userProgress: {
        totalPoints: 0,
        timeSpent: 0,
        quizScores: [],
        notes: '',
        achievements: ['Dominando Scrum']
    },
    lessonData: {
        1: { title: 'Introducción a Scrum', duration: 18, points: 55 },
        2: { title: 'Roles en Scrum', duration: 22, points: 70 },
        3: { title: 'Eventos Scrum', duration: 25, points: 85 },
        4: { title: 'Artefactos Scrum', duration: 20, points: 65 },
        5: { title: 'Herramientas y Técnicas Scrum', duration: 18, points: 55 },
        6: { title: 'Métricas y KPIs en Scrum', duration: 15, points: 50 }
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
                    // Si la lección anterior está completada, habilitar el botón de siguiente lección
                    const shouldEnable = canAccessLesson(i + 1);
                    nextBtn.disabled = !shouldEnable;

                    if (shouldEnable) {
                        console.log(`✅ Botón de lección ${i} habilitado (lección ${i+1} accesible)`);
                    } else {
                        console.log(`🔒 Botón de lección ${i} deshabilitado (lección ${i+1} no accesible)`);
                    }
                }
            }
        }
    }
}

// Inicializar la aplicación
function initializeApp() {
    console.log('🚀 Inicializando aplicación Semana 2');

    // Cargar el contenido JSON
    loadWeekContent();

    // Renderizar la lección inicial
    renderLesson(1);

    // Actualizar interfaz inicial
    updateUI();

    console.log('✅ Aplicación inicializada');
}

// Cargar contenido del JSON
async function loadWeekContent() {
    try {
        const response = await fetch('contenido.json');
        const weekContent = await response.json();
        appState.weekContent = weekContent;
        console.log('📚 Contenido de la semana cargado:', weekContent.titulo);
    } catch (error) {
        console.error('❌ Error cargando contenido:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Click en lecciones del sidebar
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', function() {
            const lessonId = parseInt(this.dataset.lesson);
            if (canAccessLesson(lessonId)) {
                loadLesson(lessonId);
            } else {
                showNotification('Debes completar las lecciones anteriores primero', 'warning');
            }
        });
    });

    // Botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleNavigation(action);
        });
    });
}

// Cargar una lección específica
function loadLesson(lessonId) {
    if (!canAccessLesson(lessonId)) {
        showNotification('Esta lección está bloqueada', 'warning');
        return;
    }

    console.log(`📖 Cargando lección ${lessonId}`);
    appState.currentLesson = lessonId;
    renderLesson(lessonId);
    updateUI();

    // Actualizar estado en sidebar
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-lesson="${lessonId}"]`).classList.add('active');
}

// Renderizar el contenido de una lección
function renderLesson(lessonId) {
    const content = appState.weekContent?.lecciones?.find(l => l.id === lessonId);
    if (!content) {
        console.error(`❌ No se encontró contenido para la lección ${lessonId}`);
        return;
    }

    const lessonContent = document.getElementById('lessonContent');

    let html = `
        <div class="lesson-header">
            <h1>${content.titulo}</h1>
            <div class="lesson-meta">
                <span><i class="fas fa-clock"></i> ${content.duracion} min</span>
                <span><i class="fas fa-star"></i> ${content.puntos} puntos</span>
                <span><i class="fas fa-book"></i> ${content.tipo}</span>
            </div>
        </div>

        <div class="lesson-body" id="lesson-${lessonId}">
            ${renderLessonContent(content)}
            ${renderEvaluation(content.evaluacion, lessonId)}
        </div>
    `;

    lessonContent.innerHTML = html;

    // Inicializar componentes específicos de la lección
    initializeLessonComponents(lessonId, content.tipo);
}

// Renderizar contenido específico de la lección
function renderLessonContent(content) {
    const contenido = content.contenido;
    let html = '';

    // Video
    if (contenido.video) {
        html += `
            <div class="video-container">
                <div class="video-placeholder" data-video-url="${contenido.video.url}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-info">
                        <h4>${content.titulo}</h4>
                        <p>Duración: ${contenido.video.duracion}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Conceptos clave
    if (contenido.conceptos_clave) {
        html += `
            <div class="section">
                <h3><i class="fas fa-key"></i> Conceptos Clave</h3>
                <ul class="key-concepts">
                    ${contenido.conceptos_clave.map(concept => `<li>${concept}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Resumen
    if (contenido.resumen) {
        html += `
            <div class="section">
                <h3><i class="fas fa-file-alt"></i> Resumen</h3>
                <p>${contenido.resumen}</p>
            </div>
        `;
    }

    // Contenido específico según tipo
    if (content.tipo === 'interactivo') {
        if (contenido.valores) {
            html += renderValuesGrid(contenido.valores);
        }
        if (contenido.roles) {
            html += renderRolesGrid(contenido.roles);
        }
        if (contenido.comparacion) {
            html += renderComparisonTable(contenido.comparacion);
        }
        if (contenido.artefactos) {
            html += renderArtifactsGrid(contenido.artefactos);
        }
    }

    // Línea de tiempo
    if (contenido.linea_tiempo) {
        html += renderTimeline(contenido.linea_tiempo);
    }

    // Principios
    if (contenido.principios) {
        html += renderPrinciplesGrid(contenido.principios);
    }

    // Lecturas
    if (contenido.lecturas) {
        html += renderReadings(contenido.lecturas);
    }

    // Herramientas
    if (contenido.herramientas) {
        html += renderTools(contenido.herramientas);
    }

    // Métricas
    if (contenido.metricas) {
        html += renderMetrics(contenido.metricas);
    }

    return html;
}

// Renderizar evaluación
function renderEvaluation(evaluation, lessonId) {
    let html = `
        <div class="evaluation-section">
            <h3><i class="fas fa-tasks"></i> Evaluación</h3>
    `;

    switch (evaluation.tipo) {
        case 'quiz':
            html += renderQuiz(evaluation.preguntas, lessonId);
            break;
        case 'drag_drop':
            html += renderDragDrop(evaluation);
            break;
        case 'matching':
            html += renderMatching(evaluation);
            break;
        case 'scenario':
            html += renderScenario(evaluation);
            break;
        case 'quiz_final':
            html += renderQuiz(evaluation.preguntas, lessonId, true);
            break;
    }

    html += `
            <div class="completion-buttons">
                <button class="btn btn-primary" onclick="completeLesson(${lessonId})">
                    <i class="fas fa-check"></i> Completar Lección
                </button>
                ${lessonId < 6 ? `
                    <button class="btn btn-secondary" onclick="nextLesson()" disabled>
                        <i class="fas fa-arrow-right"></i> Siguiente Lección
                    </button>
                ` : `
                    <button class="btn btn-success" onclick="showWeeklyEvaluation()">
                        <i class="fas fa-graduation-cap"></i> Evaluación Semanal
                    </button>
                `}
            </div>
        </div>
    `;

    return html;
}

// Renderizar quiz
function renderQuiz(questions, lessonId, isFinal = false) {
    return `
        <div class="quiz-container" data-lesson="${lessonId}">
            ${questions.map((q, index) => `
                <div class="question" data-question="${index}">
                    <h4>${isFinal ? `${index + 1}. ` : ''}${q.pregunta}</h4>
                    <div class="options">
                        ${q.opciones.map((option, optIndex) => `
                            <label class="option">
                                <input type="radio" name="q${lessonId}_${index}" value="${optIndex}">
                                <span>${option}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="explanation" style="display: none;">
                        <p><strong>Explicación:</strong> ${q.explicacion}</p>
                    </div>
                </div>
            `).join('')}
            <button class="btn btn-primary" onclick="checkQuiz(${lessonId})">
                <i class="fas fa-check"></i> Verificar Respuestas
            </button>
        </div>
    `;
}

// Renderizar drag and drop
function renderDragDrop(evaluation) {
    return `
        <div class="drag-drop-container">
            <p class="instructions">${evaluation.instrucciones}</p>
            <div class="drag-items">
                <div class="items-column">
                    <h4>Elementos</h4>
                    ${evaluation.items.map((item, index) => `
                        <div class="draggable-item" draggable="true" data-match="${item.match}">
                            ${item.item}
                        </div>
                    `).join('')}
                    </div>
                <div class="targets-column">
                    <h4>Destinos</h4>
                    ${evaluation.items.map((item, index) => `
                        <div class="drop-target" data-answer="${item.match}">
                            ${item.match}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Renderizar valores
function renderValuesGrid(values) {
    return `
        <div class="values-grid">
            ${values.map(value => `
                <div class="value-card">
                    <h4>${value.valor}</h4>
                    <p class="value-description">${value.descripcion}</p>
                    <p class="value-explanation">${value.explicacion}</p>
                    <div class="value-example">
                        <strong>Ejemplo:</strong> ${value.ejemplo}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar roles
function renderRolesGrid(roles) {
    return `
        <div class="roles-grid">
            ${roles.map(role => `
                <div class="role-card">
                    <h3>${role.nombre}</h3>
                    <div class="role-content">
                        <div class="responsibilities">
                            <h4>Responsabilidades</h4>
                            <ul>
                                ${role.responsabilidades.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="characteristics">
                            <h4>Características</h4>
                            <ul>
                                ${role.caracteristicas.map(char => `<li>${char}</li>`).join('')}
                            </ul>
                        </div>
                        ${role.anti_patrones ? `
                            <div class="anti-patterns">
                                <h4>Anti-patrones</h4>
                                <ul>
                                    ${role.anti_patrones.map(anti => `<li>${anti}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar línea de tiempo
function renderTimeline(events) {
    return `
        <div class="timeline">
            ${events.map(event => `
                <div class="timeline-item">
                    <div class="timeline-date">${event.año}</div>
                    <div class="timeline-content">
                        <h4>${event.evento}</h4>
                        <p>${event.descripcion}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar principios
function renderPrinciplesGrid(principles) {
    return `
        <div class="principles-grid">
            ${principles.map(principle => `
                <div class="principle-card">
                    <h4>Principio ${principle.numero}: ${principle.principio}</h4>
                    <p>${principle.descripcion}</p>
                    <div class="principle-application">
                        <strong>Aplicación:</strong> ${principle.aplicacion}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar tabla comparativa
function renderComparisonTable(comparison) {
    return `
        <div class="comparison-table">
            <div class="comparison-header">
                <div class="waterfall-header">
                    <h3>${comparison.waterfall.nombre}</h3>
                </div>
                <div class="agile-header">
                    <h3>${comparison.agile.nombre}</h3>
                </div>
            </div>
            <div class="comparison-body">
                <div class="waterfall-column">
                    <h4>Características</h4>
                    <ul>${comparison.waterfall.caracteristicas.map(c => `<li>${c}</li>`).join('')}</ul>
                    <h4>Ventajas</h4>
                    <ul>${comparison.waterfall.ventajas.map(v => `<li>${v}</li>`).join('')}</ul>
                    <h4>Desventajas</h4>
                    <ul>${comparison.waterfall.desventajas.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>
                <div class="agile-column">
                    <h4>Características</h4>
                    <ul>${comparison.agile.caracteristicas.map(c => `<li>${c}</li>`).join('')}</ul>
                    <h4>Ventajas</h4>
                    <ul>${comparison.agile.ventajas.map(v => `<li>${v}</li>`).join('')}</ul>
                    <h4>Desventajas</h4>
                    <ul>${comparison.agile.desventajas.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>
            </div>
        </div>
    `;
}

// Renderizar lecturas
function renderReadings(readings) {
    return `
        <div class="readings-section">
            <h3><i class="fas fa-book-open"></i> Lecturas Complementarias</h3>
            ${readings.map(reading => `
                <div class="reading-item">
                    <div class="reading-info">
                        <h4>${reading.titulo}</h4>
                        <p>Tipo: ${reading.tipo} | Páginas: ${reading.paginas}</p>
                    </div>
                    <button class="btn btn-outline" onclick="openReading('${reading.url}')">
                        <i class="fas fa-download"></i> Descargar
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar herramientas
function renderTools(tools) {
    return `
        <div class="tools-section">
            <h3><i class="fas fa-tools"></i> Herramientas y Técnicas</h3>
            ${tools.map(category => `
                <div class="tool-category">
                    <h4>${category.categoria}</h4>
                    <div class="tools-grid">
                        ${category.herramientas.map(tool => `
                            <div class="tool-card">
                                <h5>${tool.nombre}</h5>
                                <p>${tool.descripcion}</p>
                                ${tool.formato ? `<p><strong>Formato:</strong> ${tool.formato}</p>` : ''}
                                ${tool.utilidad ? `<p><strong>Utilidad:</strong> ${tool.utilidad}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar métricas
function renderMetrics(metrics) {
    return `
        <div class="metrics-section">
            <h3><i class="fas fa-chart-line"></i> Métricas y KPIs</h3>
            ${metrics.map(category => `
                <div class="metric-category">
                    <h4>${category.categoria}</h4>
                    <div class="metrics-grid">
                        ${category.indicadores.map(metric => `
                            <div class="metric-card">
                                <h5>${metric.nombre}</h5>
                                <p>${metric.descripcion}</p>
                                ${metric.calculo ? `<p><strong>Cálculo:</strong> ${metric.calculo}</p>` : ''}
                                ${metric.utilidad ? `<p><strong>Utilidad:</strong> ${metric.utilidad}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Verificar si se puede acceder a una lección
function canAccessLesson(lessonId) {
    if (lessonId === 1) return true;
    return appState.completedLessons.includes(lessonId - 1);
}

// Completar lección
function completeLesson(lessonId) {
    if (appState.completedLessons.includes(lessonId)) {
        showNotification('Esta lección ya está completada', 'info');
        return;
    }

    // Verificar si se han completado las evaluaciones
    const quizContainer = document.querySelector(`.quiz-container[data-lesson="${lessonId}"]`);
    if (quizContainer && !quizContainer.classList.contains('completed')) {
        showNotification('Debes completar la evaluación primero', 'warning');
        return;
    }

    appState.completedLessons.push(lessonId);
    appState.userProgress.totalPoints += appState.lessonData[lessonId].points;

    saveUserProgress();
    updateUI();
    showNotification(`¡Lección ${lessonId} completada! +${appState.lessonData[lessonId].points} puntos`, 'success');

    // Actualizar botón de siguiente lección
    initializeLessonCompletionButtons();

    // Desbloquear siguiente lección
    if (lessonId < 6) {
        const nextLessonItem = document.querySelector(`[data-lesson="${lessonId + 1}"]`);
        if (nextLessonItem) {
            const statusIcon = nextLessonItem.querySelector('.lesson-status i');
            statusIcon.className = 'fas fa-lock-open';
        }
    }
}

// Siguiente lección
function nextLesson() {
    const nextLessonId = appState.currentLesson + 1;
    if (nextLessonId <= 6 && canAccessLesson(nextLessonId)) {
        loadLesson(nextLessonId);
    } else {
        showNotification('No se puede acceder a la siguiente lección', 'warning');
    }
}

// Verificar quiz
function checkQuiz(lessonId) {
    const quizContainer = document.querySelector(`.quiz-container[data-lesson="${lessonId}"]`);
    const questions = quizContainer.querySelectorAll('.question');
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input:checked');
        const explanation = question.querySelector('.explanation');

        if (selectedOption) {
            const lessonContent = appState.weekContent.lecciones.find(l => l.id === lessonId);
            const correctAnswer = lessonContent.evaluacion.preguntas[index].respuesta_correcta;

            if (parseInt(selectedOption.value) === correctAnswer) {
                correctAnswers++;
                selectedOption.parentElement.classList.add('correct');
            } else {
                selectedOption.parentElement.classList.add('incorrect');
                // Mostrar respuesta correcta
                const correctOption = question.querySelectorAll('input')[correctAnswer];
                correctOption.parentElement.classList.add('correct');
            }

            explanation.style.display = 'block';
        }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    quizContainer.classList.add('completed');

    showNotification(`Resultado: ${correctAnswers}/${totalQuestions} correctas (${score}%)`,
                   score >= 70 ? 'success' : 'warning');

    // Guardar puntaje del quiz
    appState.userProgress.quizScores.push({
        lessonId: lessonId,
        score: score,
        date: new Date().toISOString()
    });
}

// Actualizar UI
function updateUI() {
    // Actualizar barra de progreso
    const progressPercentage = (appState.completedLessons.length / 6) * 100;
    document.getElementById('weekProgress').style.width = `${progressPercentage}%`;
    document.querySelector('.progress-text').textContent = `${Math.round(progressPercentage)}% completado`;

    // Actualizar estadísticas
    document.getElementById('completedLessons').textContent = appState.completedLessons.length;
    document.getElementById('totalPoints').textContent = appState.userProgress.totalPoints;
    document.getElementById('timeSpent').textContent = `${Math.round(appState.userProgress.timeSpent / 60)}m`;

    // Actualizar estado de lecciones en sidebar
    document.querySelectorAll('.lesson-item').forEach(item => {
        const lessonId = parseInt(item.dataset.lesson);
        const statusIcon = item.querySelector('.lesson-status i');

        if (appState.completedLessons.includes(lessonId)) {
            statusIcon.className = 'fas fa-check-circle';
            item.classList.add('completed');
        } else if (canAccessLesson(lessonId)) {
            statusIcon.className = 'fas fa-lock-open';
        } else {
            statusIcon.className = 'fas fa-lock';
        }
    });
}

// Cargar progreso del usuario
function loadUserProgress() {
    const saved = localStorage.getItem('semana2-progress');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(appState, data);
        console.log('📊 Progreso cargado:', data);
    }
}

// Guardar progreso del usuario
function saveUserProgress() {
    const dataToSave = {
        currentLesson: appState.currentLesson,
        completedLessons: appState.completedLessons,
        userProgress: appState.userProgress
    };
    localStorage.setItem('semana2-progress', JSON.stringify(dataToSave));
    console.log('💾 Progreso guardado');
}

// Iniciar seguimiento de tiempo
function startProgressTracking() {
    setInterval(() => {
        appState.userProgress.timeSpent++;
        if (appState.userProgress.timeSpent % 60 === 0) {
            saveUserProgress();
            updateUI();
        }
    }, 1000); // Actualizar cada segundo
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Mostrar evaluación semanal
function showWeeklyEvaluation() {
    if (appState.completedLessons.length < 6) {
        showNotification('Debes completar todas las lecciones primero', 'warning');
        return;
    }

    showNotification('Evaluación semanal disponible próximamente', 'info');
}

// Manejar navegación
function handleNavigation(action) {
    switch (action) {
        case 'prev':
            if (appState.currentLesson > 1) {
                loadLesson(appState.currentLesson - 1);
            }
            break;
        case 'next':
            nextLesson();
            break;
        case 'resources':
            showResourcesModal();
            break;
    }
}

// Mostrar modal de recursos
function showResourcesModal() {
    const modal = document.getElementById('resourcesModal');
    const content = document.getElementById('resourcesContent');

    if (appState.weekContent?.recursos_adicionales) {
        const resources = appState.weekContent.recursos_adicionales;
        content.innerHTML = `
            <div class="resources-grid">
                <div class="resource-section">
                    <h4><i class="fas fa-video"></i> Videos</h4>
                    ${resources.videos.map(video => `
                        <div class="resource-item">
                            <h5>${video.titulo}</h5>
                            <p>Duración: ${video.duracion}</p>
                            <button class="btn btn-sm btn-outline">Ver video</button>
                        </div>
                    `).join('')}
                </div>

                <div class="resource-section">
                    <h4><i class="fas fa-book"></i> Lecturas</h4>
                    ${resources.lecturas.map(reading => `
                        <div class="resource-item">
                            <h5>${reading.titulo}</h5>
                            <p>Páginas: ${reading.paginas}</p>
                            <button class="btn btn-sm btn-outline">Descargar PDF</button>
                        </div>
                    `).join('')}
                </div>

                <div class="resource-section">
                    <h4><i class="fas fa-tools"></i> Herramientas</h4>
                    ${resources.herramientas.map(tool => `
                        <div class="resource-item">
                            <h5>${tool.nombre}</h5>
                            <p>${tool.descripcion}</p>
                            <a href="${tool.url}" target="_blank" class="btn btn-sm btn-outline">Visitar</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    modal.style.display = 'block';
}

// Cerrar modal de recursos
function closeResourcesModal() {
    document.getElementById('resourcesModal').style.display = 'none';
}

// Cerrar modal de evaluación
function closeEvaluationModal() {
    document.getElementById('evaluationModal').style.display = 'none';
}

// Abrir lectura
function openReading(url) {
    window.open(url, '_blank');
}

// Inicializar componentes específicos de lecciones
function initializeLessonComponents(lessonId, type) {
    if (type === 'interactivo') {
        // Inicializar drag and drop
        initializeDragAndDrop();
        // Inicializar matching
        initializeMatching();
    }

    // Inicializar botones de completión
    initializeLessonCompletionButtons();
}

// Inicializar drag and drop
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropTargets = document.querySelectorAll('.drop-target');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', e.target.dataset.match);
            e.target.classList.add('dragging');
        });

        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
            target.classList.add('drag-over');
        });

        target.addEventListener('dragleave', () => {
            target.classList.remove('drag-over');
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedData = e.dataTransfer.getData('text');
            const targetAnswer = target.dataset.answer;

            target.classList.remove('drag-over');

            if (draggedData === targetAnswer) {
                target.classList.add('correct');
                target.innerHTML += ` <i class="fas fa-check"></i>`;
                showNotification('¡Correcto!', 'success');
            } else {
                target.classList.add('incorrect');
                showNotification('Intenta nuevamente', 'warning');
            }
        });
    });
}

// Inicializar matching
function initializeMatching() {
    // Implementación de matching exercise
    console.log('🔄 Inicializando ejercicio de matching');
}

// Exportar funciones para uso global
window.loadLesson = loadLesson;
window.nextLesson = nextLesson;
window.completeLesson = completeLesson;
window.checkQuiz = checkQuiz;
window.showWeeklyEvaluation = showWeeklyEvaluation;
window.openReading = openReading;
window.closeResourcesModal = closeResourcesModal;
window.closeEvaluationModal = closeEvaluationModal;