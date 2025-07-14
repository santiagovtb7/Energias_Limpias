// Variables globales
let energyChart = null;
const API_BASE = '';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
async function initializeApp() {
    try {
        // Configurar navegación
        setupNavigation();
        
        // Configurar scroll animations
        setupScrollAnimations();
        
        // Cargar datos y crear visualizaciones
        await loadAndDisplayData();
        
        // Configurar formulario de contacto
        setupContactForm();
        
        // Configurar scroll suave
        setupSmoothScroll();
        
        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        // Mostrar datos estáticos en caso de error
        showFallbackData();
    }
}

// Configuración de navegación móvil
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Configurar animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.stat-card, .project-card, .region-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Cargar y mostrar datos desde la API
async function loadAndDisplayData() {
    try {
        const [statisticsData, projectsData, regionsData] = await Promise.all([
            fetchData('/api/statistics'),
            fetchData('/api/projects'),
            fetchData('/api/regions')
        ]);

        if (statisticsData) {
            createEnergyChart(statisticsData);
            updateStatisticsCards(statisticsData);
        }

        if (projectsData) {
            displayProjects(projectsData);
        }

        if (regionsData) {
            displayRegions(regionsData);
        }

    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// Función auxiliar para hacer peticiones a la API
async function fetchData(endpoint) {
    try {
        const response = await fetch(API_BASE + endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

// Crear gráfico de energía
function createEnergyChart(data) {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (energyChart) {
        energyChart.destroy();
    }

    const chartData = {
        labels: ['Hidroeléctrica', 'Térmica', 'Solar', 'Eólica'],
        datasets: [{
            data: [
                data.hydroelectric.percentage,
                data.thermal.percentage,
                data.solar.percentage,
                data.wind.percentage
            ],
            backgroundColor: [
                data.hydroelectric.color,
                data.thermal.color,
                data.solar.color,
                data.wind.color
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    energyChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            family: 'Poppins',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Poppins',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Poppins',
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500
            }
        }
    });
}

// Actualizar tarjetas de estadísticas
function updateStatisticsCards(data) {
    const cards = {
        hydro: data.hydroelectric,
        solar: data.solar,
        wind: data.wind,
        thermal: data.thermal
    };

    Object.keys(cards).forEach(type => {
        const card = document.querySelector(`.stat-card.${type}`);
        if (card) {
            const percentage = card.querySelector('.percentage');
            const capacity = card.querySelector('.capacity');
            
            if (percentage) percentage.textContent = cards[type].percentage + '%';
            if (capacity) capacity.textContent = cards[type].capacity;
        }
    });
}

// Mostrar proyectos
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Crear tarjeta de proyecto
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    
    const statusClass = project.status.toLowerCase().includes('operativo') ? 'status-operativo' : 'status-construccion';
    
    card.innerHTML = `
        <div class="project-header">
            <span class="project-type">${project.type}</span>
            <h3>${project.name}</h3>
            <div class="project-capacity">${project.capacity}</div>
        </div>
        <div class="project-body">
            <div class="project-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${project.location}</span>
            </div>
            <span class="project-status ${statusClass}">${project.status}</span>
            <p class="project-description">${project.description}</p>
        </div>
    `;

    return card;
}

// Mostrar regiones
function displayRegions(regions) {
    const regionsGrid = document.getElementById('regionsGrid');
    if (!regionsGrid) return;

    regionsGrid.innerHTML = '';

    regions.forEach(region => {
        const regionCard = createRegionCard(region);
        regionsGrid.appendChild(regionCard);
    });
}

// Crear tarjeta de región
function createRegionCard(region) {
    const card = document.createElement('div');
    card.className = 'region-card fade-in';
    
    card.innerHTML = `
        <h3>${region.name}</h3>
        <p class="region-potential">${region.potential}</p>
        <div class="region-projects">${region.projects}</div>
        <p class="region-highlight">${region.highlight}</p>
    `;

    return card;
}

// Configurar formulario de contacto
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        // Validar campos
        if (!name || !email || !message) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        // Simular envío (en un proyecto real, aquí harías la petición al servidor)
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            this.reset();
            showNotification('¡Mensaje enviado exitosamente!', 'success');
        }, 2000);
    });
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : ''}
        ${type === 'error' ? 'background: #ef4444;' : ''}
        ${type === 'info' ? 'background: #3b82f6;' : ''}
    `;

    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
    `;

    document.body.appendChild(notification);

    // Auto eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Configurar scroll suave
function setupSmoothScroll() {
    // Agregar estilos de animación para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Función para scroll a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Compensar altura del navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mostrar datos estáticos en caso de error
function showFallbackData() {
    // Datos estáticos como fallback
    const fallbackStatistics = {
        hydroelectric: { percentage: 68, capacity: "17,500 MW", color: "#2563eb" },
        thermal: { percentage: 29, capacity: "7,400 MW", color: "#dc2626" },
        solar: { percentage: 1.5, capacity: "400 MW", color: "#f59e0b" },
        wind: { percentage: 1.5, capacity: "380 MW", color: "#10b981" }
    };

    const fallbackProjects = [
        {
            name: "Parque Eólico Guajira I",
            type: "Eólica",
            capacity: "20 MW",
            location: "La Guajira",
            status: "Operativo",
            description: "Primer parque eólico comercial de Colombia"
        },
        {
            name: "Granja Solar El Paso",
            type: "Solar",
            capacity: "86.2 MW",
            location: "Cesar",
            status: "Operativo",
            description: "Una de las granjas solares más grandes del país"
        }
    ];

    const fallbackRegions = [
        {
            name: "Costa Caribe",
            potential: "Excelente para energía solar y eólica",
            projects: 15,
            highlight: "Alta radiación solar y vientos constantes"
        },
        {
            name: "Región Andina",
            potential: "Ideal para hidroeléctrica y solar",
            projects: 32,
            highlight: "Recursos hídricos abundantes"
        }
    ];

    // Mostrar datos estáticos
    createEnergyChart(fallbackStatistics);
    updateStatisticsCards(fallbackStatistics);
    displayProjects(fallbackProjects);
    displayRegions(fallbackRegions);

    console.log('Datos estáticos cargados como fallback');
}

// Función para actualizar contador animado
function animateCounter(element, targetValue, duration = 2000) {
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;

    const updateCounter = () => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue;
        } else {
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// Funciones auxiliares para eventos del DOM
window.scrollToSection = scrollToSection;

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('Error global capturado:', event.error);
});

// Registro de service worker (opcional para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Comentado por ahora, se puede implementar más tarde
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registrado con éxito:', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registro falló:', registrationError);
        //     });
    });
}