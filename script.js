// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

// Array con todos los capítulos COMPLETOS
const chapters = [
    'capitulo1',
    'capitulo2', 
    'capitulo3',
    'capitulo4',
    'capitulo5',
    'paradigma-centripeto',
    'estructura-basica'
];

// Detectar tema preferido del sistema
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Cargar tema guardado
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = detectSystemTheme();
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton(theme);
}

// Guardar tema
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// Actualizar botón de tema
function updateThemeButton(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (theme === 'dark') {
        themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
        themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
}

// Alternar tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    saveTheme(newTheme);
    updateThemeButton(newTheme);
    
    // Añadir efecto de transición
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// ============================================
// NAVEGACIÓN Y SCROLL
// ============================================

// Controlar botón de ir arriba
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Actualizar barra de progreso
function setupProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = (window.pageYOffset / documentHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Navegación flotante
function setupFloatingNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // Alternar visibilidad del menú
    navToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'none' ? 'block' : 'none';
        navToggle.innerHTML = navLinks.style.display === 'none' ? 
            '<i class="fas fa-bars"></i>' : 
            '<i class="fas fa-times"></i>';
    });
    
    // Actualizar navegación activa
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Función para navegar entre capítulos
function navigateChapter(direction) {
    const currentHash = window.location.hash.substring(1);
    let currentIndex = chapters.indexOf(currentHash);
    
    // Si no hay hash o no está en la lista, empieza en el primero
    if (currentIndex === -1) {
        currentIndex = 0;
    }
    
    // Calcular nuevo índice
    let newIndex;
    if (direction === 'next') {
        newIndex = currentIndex < chapters.length - 1 ? currentIndex + 1 : 0;
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : chapters.length - 1;
    }
    
    // Navegar al nuevo capítulo
    const targetChapter = chapters[newIndex];
    const targetElement = document.getElementById(targetChapter);
    
    if (targetElement) {
        // Smooth scroll
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Actualizar URL sin recargar
        window.history.pushState({}, '', `#${targetChapter}`);
        
        // Actualizar información del capítulo
        updateChapterInfo(newIndex);
    }
}

// Actualizar información del capítulo actual
function updateChapterInfo(chapterIndex) {
    const chapterInfo = document.getElementById('chapter-info');
    if (chapterInfo) {
        const chapterNumber = chapterIndex + 1;
        const totalChapters = chapters.length;
        chapterInfo.textContent = `Capítulo ${chapterNumber} de ${totalChapters}`;
    }
}

// Detectar capítulo actual durante el scroll
function detectCurrentChapter() {
    let currentChapterIndex = 0;
    let maxVisibleArea = 0;
    
    chapters.forEach((chapterId, index) => {
        const element = document.getElementById(chapterId);
        if (element) {
            const rect = element.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            
            if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
                maxVisibleArea = visibleHeight;
                currentChapterIndex = index;
            }
        }
    });
    
    updateChapterInfo(currentChapterIndex);
}

// Inicializar navegación entre capítulos
function setupChapterNavigation() {
    // Configurar botones
    document.querySelectorAll('.nav-btn.next').forEach(btn => {
        btn.addEventListener('click', () => navigateChapter('next'));
    });
    
    document.querySelectorAll('.nav-btn.prev').forEach(btn => {
        btn.addEventListener('click', () => navigateChapter('prev'));
    });
    
    // Detectar capítulo actual al cargar
    window.addEventListener('load', () => {
        detectCurrentChapter();
    });
    
    // Detectar capítulo actual al hacer scroll
    window.addEventListener('scroll', () => {
        detectCurrentChapter();
    });
    
    // Detectar cambios en el hash de la URL
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        const index = chapters.indexOf(hash);
        if (index !== -1) {
            updateChapterInfo(index);
        }
    });
}

// ============================================
// ESTADÍSTICAS Y MÉTRICAS
// ============================================

// Contar palabras del contenido
function countWords() {
    const mainContent = document.querySelector('main');
    const text = mainContent.innerText || mainContent.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    
    // Formatear número con separadores de miles
    return wordCount.toLocaleString('es-ES');
}

// Calcular tiempo de lectura
function calculateReadTime() {
    const wordCount = parseInt(countWords().replace(/\./g, ''));
    const wordsPerMinute = 200; // Velocidad promedio de lectura
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    return `${minutes} min`;
}

// Actualizar estadísticas
function updateStatistics() {
    // Contador de palabras
    const wordCountElement = document.getElementById('word-count');
    if (wordCountElement) {
        wordCountElement.textContent = `${countWords()} palabras`;
    }
    
    // Tiempo de lectura
    const readTimeElement = document.getElementById('read-time');
    if (readTimeElement) {
        readTimeElement.textContent = calculateReadTime();
    }
    
    // Contador de visitas (simulado)
    const viewCountElement = document.getElementById('view-count');
    if (viewCountElement) {
        let views = localStorage.getItem('pageViews') || 0;
        views = parseInt(views) + 1;
        localStorage.setItem('pageViews', views);
        viewCountElement.textContent = `Visitas: ${views}`;
    }
}

// ============================================
// FECHAS Y ACTUALIZACIONES
// ============================================

// Actualizar fechas
function updateDates() {
    const now = new Date();
    
    // Fecha actual en formato legible
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const currentDate = now.toLocaleDateString('es-ES', options);
    
    // Año actual
    const currentYear = now.getFullYear();
    
    // Actualizar elementos
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = currentDate;
    }
    
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    
    const footerYearElement = document.getElementById('footer-year');
    if (footerYearElement) {
        footerYearElement.textContent = currentYear;
    }
}

// ============================================
// INTERACTIVIDAD AVANZADA
// ============================================

// Exportar a PDF
function setupPDFExport() {
    const pdfBtn = document.getElementById('pdf-btn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Función de exportación a PDF en desarrollo. Por ahora, puedes usar la función de impresión de tu navegador.');
        });
    }
}

// Imprimir documento
function setupPrint() {
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }
}

// Generar cita APA
function setupCitation() {
    const citeBtn = document.getElementById('cite-btn');
    if (citeBtn) {
        citeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const title = document.title;
            const url = window.location.href;
            const date = new Date().toLocaleDateString('es-ES');
            
            const citation = `Arquitectura de Computadores: Evolución y Paradigmas Emergentes. (${date}). Recuperado de ${url}`;
            
            // Copiar al portapapeles
            navigator.clipboard.writeText(citation).then(() => {
                alert('Cita copiada al portapapeles:\n\n' + citation);
            }).catch(err => {
                console.error('Error al copiar: ', err);
                prompt('Copia manualmente esta cita:', citation);
            });
        });
    }
}

// Efectos de aparición
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos importantes
    document.querySelectorAll('.section, .card, .component-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// INICIALIZACIÓN COMPLETA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Arquitectura de Computadores...');
    
    // 1. Configurar tema
    loadTheme();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // 2. Configurar navegación y scroll
    setupScrollTop();
    setupProgressBar();
    setupFloatingNav();
    setupChapterNavigation();
    
    // 3. Actualizar estadísticas
    updateStatistics();
    
    // 4. Actualizar fechas
    updateDates();
    
    // 5. Configurar interactividad
    setupPDFExport();
    setupPrint();
    setupCitation();
    setupAnimations();
    
    // 6. Efectos especiales
    document.querySelectorAll('.card, .component-card, .concept-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 7. Mejorar accesibilidad
    document.querySelectorAll('[tabindex]').forEach(el => {
        el.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
    
    // 8. Inicializar navegación por teclado
    document.addEventListener('keydown', (e) => {
        // Flecha izquierda: capítulo anterior
        if (e.key === 'ArrowLeft') {
            navigateChapter('prev');
        }
        // Flecha derecha: capítulo siguiente
        if (e.key === 'ArrowRight') {
            navigateChapter('next');
        }
    });
    
    console.log('✅ Sistema inicializado correctamente con 7 capítulos completos');
});

// ============================================
// MANEJO DE ERRORES
// ============================================

window.addEventListener('error', (event) => {
    console.error('❌ Error en la aplicación:', event.error);
});

// Soporte para navegadores antiguos
if (!window.localStorage) {
    console.warn('⚠️ Este navegador no soporta localStorage. Algunas características pueden no funcionar.');
}

// Detectar conexión
window.addEventListener('online', () => {
    console.log('🌐 Conectado a internet');
});

window.addEventListener('offline', () => {
    console.warn('⚠️ Sin conexión a internet');
});