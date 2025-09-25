document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS DE LA APLICACIÓN ---
    const data = {
        candidates: [
            { id: 1, name: 'Candidato Alfa', party: 'Partido Progreso', photo: 'https://i.pravatar.cc/150?u=alfa' },
            { id: 2, name: 'Candidata Beta', party: 'Alianza Futuro', photo: 'https://i.pravatar.cc/150?u=beta' },
            { id: 3, name: 'Candidato Gamma', party: 'Unión Nacional', photo: 'https://i.pravatar.cc/150?u=gamma' },
            { id: 4, name: 'Candidata Delta', party: 'Renovación Cívica', photo: 'https://i.pravatar.cc/150?u=delta' }
        ],
        proposals: [
            { id: 'p1', topic: 'Economía', text: 'Aumentar el sueldo mínimo anualmente por decreto presidencial.', stances: { 1: 'agree', 2: 'disagree', 3: 'neutral', 4: 'agree' }, sourceTitle: 'Sueldo mínimo en Perú: ¿A cuánto asciende el salario actual?', sourceDate: '25/09/2025', sourceURL: 'https://rpp.pe/economia/economia/sueldo-minimo-en-peru-a-cuanto-asciende-el-salario-actual-noticia-1399123' },
            { id: 'p2', topic: 'Seguridad', text: 'Permitir que las Fuerzas Armadas patrullen las calles de forma permanente.', stances: { 1: 'agree', 2: 'agree', 3: 'disagree', 4: 'neutral' }, sourceTitle: 'Fuerzas Armadas en las calles: ¿Una medida necesaria?', sourceDate: '24/09/2025', sourceURL: 'https://rpp.pe/peru/actualidad/fuerzas-armadas-en-las-calles-una-medida-necesaria-o-un-riesgo-para-la-democracia-noticia-1402345' },
            { id: 'p3', topic: 'Medio Ambiente', text: 'Prohibir la minería a tajo abierto en cabeceras de cuenca.', stances: { 1: 'disagree', 2: 'neutral', 3: 'agree', 4: 'agree' }, sourceTitle: 'Conflictos mineros: La lucha por el agua y la tierra', sourceDate: '23/09/2025', sourceURL: 'https://rpp.pe/peru/medio-ambiente/conflictos-mineros-en-peru-la-lucha-por-el-agua-y-la-tierra-noticia-1389765' },
            { id: 'p4', topic: 'Educación', text: 'Implementar un sistema de vouchers para la educación básica.', stances: { 1: 'agree', 2: 'disagree', 3: 'disagree', 4: 'neutral' }, sourceTitle: 'Vouchers educativos: ¿Una alternativa para el Perú?', sourceDate: '22/09/2025', sourceURL: 'https://rpp.pe/peru/educacion/vouchers-educativos-una-alternativa-para-mejorar-la-calidad-de-la-educacion-en-el-peru-noticia-1411223' },
            { id: 'p5', topic: 'Salud', text: 'Unificar todos los sistemas de salud (EsSalud, MINSA, FFAA) en uno solo.', stances: { 1: 'neutral', 2: 'agree', 3: 'disagree', 4: 'agree' }, sourceTitle: 'Unificación del sistema de salud: Un desafío pendiente', sourceDate: '21/09/2025', sourceURL: 'https://rpp.pe/peru/salud/unificacion-del-sistema-de-salud-un-desafio-pendiente-para-el-peru-noticia-1398543' }
        ]
    };

    // --- ESTADO DE LA APLICACIÓN ---
    let userAnswers = [];
    let isDragging = false;
    let startPointX = 0;
    let offsetX = 0;
    let activeCard = null;

    // --- SELECTORES DEL DOM ---
    const swipeArea = document.getElementById('swipe-area');
    const cardStack = document.querySelector('.card-stack');
    const disagreeBtn = document.getElementById('disagree-button');
    const neutralBtn = document.getElementById('neutral-button');
    const agreeBtn = document.getElementById('agree-button');
    const resultsScreen = document.getElementById('results-screen');
    const restartBtn = document.getElementById('restart-button');
    const closeResultsBtn = document.getElementById('close-results-button');
    const shareResultsBtn = document.getElementById('share-results-button');
    const cardPlaceholder = document.querySelector('.card-placeholder');
    const reactionContainer = document.getElementById('reaction-container');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const openSidebarBtn = document.getElementById('open-sidebar-button');
    const closeSidebarBtn = document.getElementById('close-sidebar-button');
    const onboardingOverlay = document.getElementById('onboarding');

    // --- INICIALIZACIÓN ---
    function init() {
        createCards();
        setupEventListeners();
        setupOnboarding();
    }

    // --- RENDERIZADO Y GESTIÓN DE TARJETAS ---
    function createCards() {
        cardStack.innerHTML = '';
        // Insertar las tarjetas en orden normal (no reverse)
        data.proposals.forEach((proposal, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-color-overlay agree"></div>
                <div class="card-color-overlay disagree"></div>
                <div class="card-swipe-indicator card-indicator-agree">DE ACUERDO</div>
                <div class="card-swipe-indicator card-indicator-disagree">EN DESACUERDO</div>
                <p class="card-topic">${proposal.topic}</p>
                <h2 class="card-proposal">${proposal.text}</h2>
                <button class="card-source-link" aria-label="Ver fuente">
                    <img src="images/icon-source.svg" alt="Fuente" width="24" height="24">
                </button>
                <div class="card-source-tooltip">
                    <h4>Fuente de la Afirmación</h4>
                    <p class="tooltip-title">${proposal.sourceTitle}</p>
                    <p class="tooltip-date">${proposal.sourceDate}</p>
                    <a href="${proposal.sourceURL}" target="_blank" rel="noopener noreferrer">Leer en RPP.pe</a>
                </div>
            `;
            // Usar prepend para que la primera propuesta quede arriba
            cardStack.prepend(card);
        });

        // Asignar z-index: la primera (arriba) tiene el mayor z-index
        Array.from(cardStack.children).forEach((card, index) => {
            card.style.zIndex = cardStack.children.length - index;
            card.style.transform = `translateY(${index * -4}px) scale(${1 - index * 0.02})`;
        });
    }
    
    // --- LÓGICA DE INTERACCIÓN (SWIPE) - REFACTORIZADA ---
    function onPointerDown(e) {
        // Ahora la tarjeta activa es la primera
        const targetCard = cardStack.firstElementChild;
        if (!targetCard || isDragging) return;
        // Solo procede si el click/touch fue en la tarjeta o en sus elementos hijos
        if (!targetCard.contains(e.target)) return;
        
        isDragging = true;
        activeCard = targetCard;
        activeCard.classList.add('dragging');
        startPointX = e.pageX || e.touches[0].pageX;

        // Añade los event listeners para el movimiento y liberación
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('mouseup', onPointerUp, { once: true });
        document.addEventListener('touchend', onPointerUp, { once: true });
    }

    function onPointerMove(e) {
        if (!isDragging || !activeCard) return;
        e.preventDefault();
        
        const currentX = e.pageX || e.touches[0].pageX;
        offsetX = currentX - startPointX;
        
        // Limita el movimiento horizontal
        const maxOffset = window.innerWidth * 0.8;
        offsetX = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
        
        activeCard.style.transform = `translate(${offsetX}px, 0) rotate(${offsetX * 0.05}deg)`;

        const agreeOverlay = activeCard.querySelector('.card-color-overlay.agree');
        const disagreeOverlay = activeCard.querySelector('.card-color-overlay.disagree');
        const agreeIndicator = activeCard.querySelector('.card-indicator-agree');
        const disagreeIndicator = activeCard.querySelector('.card-indicator-disagree');
        
        const opacity = Math.min(Math.abs(offsetX) / (activeCard.offsetWidth / 2.5), 1);
        
        if (offsetX > 0) {
            agreeIndicator.style.opacity = opacity;
            agreeOverlay.style.opacity = opacity * 0.5;
            disagreeIndicator.style.opacity = 0;
            disagreeOverlay.style.opacity = 0;
        } else {
            disagreeIndicator.style.opacity = opacity;
            disagreeOverlay.style.opacity = opacity * 0.5;
            agreeIndicator.style.opacity = 0;
            agreeOverlay.style.opacity = 0;
        }
    }

    function onPointerUp() {
        if (!isDragging || !activeCard) return;

        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('touchmove', onPointerMove);
        
        const decisionMade = Math.abs(offsetX) > activeCard.offsetWidth / 3;
        
        if (decisionMade) {
            processChoice(offsetX > 0 ? 'agree' : 'disagree', activeCard);
        } else {
            activeCard.classList.remove('dragging');
            const index = Array.from(cardStack.children).indexOf(activeCard);
            const originalIndex = cardStack.children.length - 1 - index;
            activeCard.style.transform = `translateY(${originalIndex * -4}px) scale(${1 - originalIndex * 0.02})`;
            activeCard.querySelector('.card-color-overlay.agree').style.opacity = 0;
            activeCard.querySelector('.card-color-overlay.disagree').style.opacity = 0;
            activeCard.querySelector('.card-indicator-agree').style.opacity = 0;
            activeCard.querySelector('.card-indicator-disagree').style.opacity = 0;
        }
        
        isDragging = false;
        offsetX = 0;
        activeCard = null;
    }

    // --- LÓGICA DE PROCESAMIENTO DE ELECCIÓN ---
    function processChoice(choice, card) {
        // Usar la primera tarjeta como activa
        const cardToProcess = card || cardStack.firstElementChild;
        if (!cardToProcess) return;

        // El índice correcto es la cantidad de respuestas dadas
        const proposalIndex = userAnswers.length;
        const proposal = data.proposals[proposalIndex];
        userAnswers.push({ proposalId: proposal.id, choice });

        const flyoutX = (choice === 'agree' ? 1 : -1) * window.innerWidth;
        const rotation = (choice === 'agree' ? 15 : -15);
        cardToProcess.classList.remove('dragging');
        cardToProcess.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        cardToProcess.style.transform = `translate(${flyoutX}px, 0) rotate(${rotation}deg)`;
        cardToProcess.style.opacity = '0';
        triggerReactionAnimation(choice, choice === 'agree' ? agreeBtn : (choice === 'disagree' ? disagreeBtn : neutralBtn));
        cardToProcess.addEventListener('transitionend', () => {
            cardToProcess.remove();
            if (cardStack.children.length === 0) {
                setTimeout(showResults, 100);
            }
        }, { once: true });
    }

    // --- GESTIÓN DE SIDEBAR, ONBOARDING Y TOOLTIP ---
    function setupSidebar() {
        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('visible');
        };
        openSidebarBtn.addEventListener('click', toggleSidebar);
        closeSidebarBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    function setupOnboarding() {
        if (localStorage.getItem('onboardingComplete') === 'true') return;
        onboardingOverlay.classList.add('visible');
        
        const steps = document.querySelectorAll('.onboarding-step');
        let currentStep = 0;

        onboardingOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('next')) {
                steps[currentStep].classList.remove('active');
                currentStep++;
                steps[currentStep].classList.add('active');
            }
            if (e.target.classList.contains('finish')) {
                onboardingOverlay.classList.remove('visible');
                localStorage.setItem('onboardingComplete', 'true');
            }
        });
    }

    function handleTooltip(e) {
        const sourceLink = e.target.closest('.card-source-link');
        if (sourceLink) {
            e.preventDefault();
            const tooltip = sourceLink.nextElementSibling;
            if (tooltip) {
                document.querySelectorAll('.card-source-tooltip.visible').forEach(tt => {
                    if (tt !== tooltip) tt.classList.remove('visible');
                });
                tooltip.classList.toggle('visible');
            }
        } else if (!e.target.closest('.card-source-tooltip')) {
            document.querySelectorAll('.card-source-tooltip.visible').forEach(tt => tt.classList.remove('visible'));
        }
    }

    // --- OTRAS FUNCIONES ---
    function triggerReactionAnimation(type, sourceButton) {
        const bubble = document.createElement('div');
        bubble.className = `reaction-bubble ${type}`;
        bubble.innerHTML = sourceButton.innerHTML;
        const rect = sourceButton.getBoundingClientRect();
        const startLeft = rect.left + rect.width / 2 - reactionContainer.getBoundingClientRect().left;
        const endLeft = startLeft + (Math.random() - 0.5) * 100;
        bubble.style.setProperty('--start-left', `${startLeft}px`);
        bubble.style.setProperty('--end-left', `${endLeft}px`);
        reactionContainer.appendChild(bubble);
        bubble.addEventListener('animationend', () => bubble.remove());
    }

    function showResults() {
        // Oculta recirculación y placeholder
        document.getElementById('recirculacion').style.display = 'none';
        cardPlaceholder.style.display = 'none';
        displayResults();
    }

    function displayResults() {
        const results = calculateResults();
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <div class="candidate-header">
                    <img src="${result.photo}" alt="Foto de ${result.name}" class="candidate-photo-results">
                    <div class="candidate-name-party">
                        <span class="name">${result.name}</span>
                        <span class="party">${result.party}</span>
                    </div>
                    <span class="result-score">${result.score}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-inner"></div>
                </div>
            `;
            resultsList.appendChild(item);
            setTimeout(() => {
                const progressBarInner = item.querySelector('.progress-bar-inner');
                if (progressBarInner) progressBarInner.style.width = `${result.score}%`;
            }, 300);
        });
        resultsScreen.classList.add('visible');
    }

    // Unificar el listener de cerrar resultados
    closeResultsBtn.onclick = () => {
        resultsScreen.classList.remove('visible');
        document.getElementById('recirculacion').style.display = 'block';
    };

    // Botón para volver a realizar el test desde recirculación
    const recTestBtn = document.getElementById('rec-test-btn');
    if (recTestBtn) {
        recTestBtn.onclick = () => {
            document.getElementById('recirculacion').style.display = 'none';
            resetApp();
        };
    }

    function resetApp() {
        userAnswers = [];
        cardPlaceholder.style.display = 'none';
        resultsScreen.classList.remove('visible');
        document.getElementById('recirculacion').style.display = 'none';
        createCards();
    }

    function shareResults() {
        const shareText = "¡Descubre tu afinidad electoral! Hice el test de Match Electoral y estos son mis resultados. ¡Haz el tuyo!";
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Mis Resultados del Match Electoral', text: shareText, url: shareUrl }).catch(console.error);
        } else {
            alert(`Comparte tus resultados:\n${shareText}\n${shareUrl}`);
        }
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        agreeBtn.addEventListener('click', () => processChoice('agree'));
        disagreeBtn.addEventListener('click', () => processChoice('disagree'));
        neutralBtn.addEventListener('click', () => processChoice('neutral'));
        restartBtn.addEventListener('click', resetApp);
        shareResultsBtn.addEventListener('click', shareResults);
        // Evento delegado para el swipe en el contenedor
        swipeArea.addEventListener('mousedown', onPointerDown);
        swipeArea.addEventListener('touchstart', onPointerDown, { passive: true });
        document.body.addEventListener('click', handleTooltip);
        setupSidebar();
    }

    // Iniciar la aplicación
    init();
});