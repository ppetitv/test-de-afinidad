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
    let isProcessing = false;
    let startPointX = 0;
    let offsetX = 0;
    let activeCard = null;
    let lastMove = { x: 0, time: 0 };
    let velocity = 0;
    let lastAnswer = null;
    let undoTimeout = null;

    // --- SELECTORES DEL DOM ---
    const swipeArea = document.getElementById('swipe-area');
    const cardStack = document.querySelector('.card-stack');
    const disagreeBtn = document.getElementById('disagree-button');
    const neutralBtn = document.getElementById('neutral-button');
    const agreeBtn = document.getElementById('agree-button');
    const undoBtn = document.getElementById('undo-button');
    const resultsScreen = document.getElementById('results-screen');
    const restartBtn = document.getElementById('restart-button');
    const shareResultsBtn = document.getElementById('share-results-button');
    const cardPlaceholder = document.querySelector('.card-placeholder');
    const reactionContainer = document.getElementById('reaction-container');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const openSidebarBtn = document.getElementById('open-sidebar-button');
    const closeSidebarBtn = document.getElementById('close-sidebar-button');
    const onboardingOverlay = document.getElementById('onboarding');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // --- INICIALIZACIÓN ---
    function init() {
        if (progressText) {
            progressText.textContent = `0 / ${data.proposals.length}`;
        }
        createCards();
        setupEventListeners();
        setupOnboarding();
    }

    // --- RENDERIZADO Y GESTIÓN DE TARJETAS ---
    function createCards() {
        if (cardPlaceholder) cardPlaceholder.style.display = 'none';
        cardStack.innerHTML = '';
        data.proposals.forEach((proposal, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.proposalId = proposal.id;
            card.setAttribute('role', 'group');
            card.setAttribute('aria-label', `Tarjeta de propuesta sobre ${proposal.topic}: ${proposal.text}`);
            card.setAttribute('aria-roledescription', 'Tarjeta deslizable');

            card.innerHTML = `
                <div class="card-color-overlay agree"></div>
                <div class="card-color-overlay disagree"></div>
                <div class="card-swipe-indicator"></div>
                <p class="card-topic">${proposal.topic}</p>
                <h2 class="card-proposal">${proposal.text}</h2>
                <button class="card-source-link" aria-label="Ver fuente">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
                <div class="card-source-tooltip">
                    <h4>Fuente de la Afirmación</h4>
                    <p class="tooltip-title">${proposal.sourceTitle}</p>
                    <p class="tooltip-date">${proposal.sourceDate}</p>
                    <a href="${proposal.sourceURL}" target="_blank" rel="noopener noreferrer">Leer en RPP.pe</a>
                </div>
            `;
            cardStack.prepend(card);
        });

        Array.from(cardStack.children).forEach((card, index) => {
            card.style.zIndex = cardStack.children.length - index;
            card.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.02})`;
        });
    }
    
    // --- LÓGICA DE INTERACCIÓN (SWIPE) CON MOMENTUM ---
    function onPointerDown(e) {
        if (e.target.closest('.card-source-link')) return;
        const targetCard = cardStack.firstElementChild;
        if (!targetCard || isDragging) return;
        if (!targetCard.contains(e.target)) return;
        
        isDragging = true;
        activeCard = targetCard;
        activeCard.classList.add('dragging');
        startPointX = e.pageX || e.touches[0].pageX;
        velocity = 0;
        lastMove = { x: startPointX, time: Date.now() };

        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('mouseup', onPointerUp, { once: true });
        document.addEventListener('touchend', onPointerUp, { once: true });
    }

    function onPointerMove(e) {
        if (!isDragging || !activeCard) return;
        e.preventDefault();
        
        const currentX = e.pageX || e.touches[0].pageX;
        const currentTime = Date.now();
        const deltaTime = currentTime - lastMove.time;
        const deltaX = currentX - lastMove.x;

        if (deltaTime > 0) velocity = deltaX / deltaTime;
        lastMove = { x: currentX, time: currentTime };

        offsetX = currentX - startPointX;
        const maxOffset = window.innerWidth * 0.8;
        offsetX = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
        activeCard.style.transform = `translate(${offsetX}px, 0) rotate(${offsetX * 0.05}deg)`;

        const opacity = Math.min(Math.abs(offsetX) / (activeCard.offsetWidth / 4), 1);
        const agreeOverlay = activeCard.querySelector('.card-color-overlay.agree');
        const disagreeOverlay = activeCard.querySelector('.card-color-overlay.disagree');
        const indicator = activeCard.querySelector('.card-swipe-indicator');

        indicator.classList.remove('agree', 'disagree', 'neutral');

        if (offsetX > 0) {
            indicator.classList.add('agree');
            indicator.textContent = 'DE ACUERDO';
            indicator.style.opacity = opacity;
            agreeOverlay.style.opacity = opacity * 0.5;
            disagreeOverlay.style.opacity = 0;
        } else if (offsetX < 0) {
            indicator.classList.add('disagree');
            indicator.textContent = 'EN DESACUERDO';
            indicator.style.opacity = opacity;
            disagreeOverlay.style.opacity = opacity * 0.5;
            agreeIndicator.style.opacity = 0;
            agreeOverlay.style.opacity = 0;
        } else {
            indicator.style.opacity = 0;
            agreeOverlay.style.opacity = 0;
            disagreeOverlay.style.opacity = 0;
        }
    }

    function onPointerUp() {
        if (!isDragging || !activeCard) return;

        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('touchmove', onPointerMove);
        
        const distanceThreshold = activeCard.offsetWidth / 4;
        const velocityThreshold = 0.4;
        const flick = Math.abs(velocity) > velocityThreshold;
        const distanceMet = Math.abs(offsetX) > distanceThreshold;

        if (flick || distanceMet) {
            const direction = flick ? (velocity > 0 ? 'agree' : 'disagree') : (offsetX > 0 ? 'agree' : 'disagree');
            processChoice(direction, activeCard);
        } else {
            activeCard.classList.remove('dragging');
            const index = Array.from(cardStack.children).indexOf(activeCard);
            const originalIndex = cardStack.children.length - 1 - index;
            activeCard.style.transform = `translateY(${originalIndex * -10}px) scale(${1 - originalIndex * 0.02})`;
            activeCard.querySelector('.card-color-overlay.agree').style.opacity = 0;
            activeCard.querySelector('.card-color-overlay.disagree').style.opacity = 0;
            activeCard.querySelector('.card-swipe-indicator').style.opacity = 0;
        }
        
        isDragging = false;
        offsetX = 0;
        activeCard = null;
        velocity = 0;
    }

    function updateProgress() {
        const progressPercentage = (userAnswers.length / data.proposals.length) * 100;
        const progressContainer = document.querySelector('.progress-container');
        if (progressBar) progressBar.style.width = `${progressPercentage}%`;
        if (progressContainer) progressContainer.setAttribute('aria-valuenow', progressPercentage);
        if (progressText) progressText.textContent = `${userAnswers.length} / ${data.proposals.length}`;
    }

    // --- LÓGICA DE PROCESAMIENTO DE ELECCIÓN ---
    function processChoice(choice, card) {
        if (isProcessing) return;
        const cardToProcess = card || cardStack.firstElementChild;
        if (!cardToProcess) return;

        isProcessing = true;
        agreeBtn.disabled = true;
        disagreeBtn.disabled = true;
        neutralBtn.disabled = true;

        // Highlight the button
        let button;
        if (choice === 'agree') button = agreeBtn;
        else if (choice === 'disagree') button = disagreeBtn;
        else button = neutralBtn;
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);

        // Show indicator
        const indicator = cardToProcess.querySelector('.card-swipe-indicator');
        indicator.classList.remove('agree', 'disagree', 'neutral');
        if (choice === 'agree') {
            indicator.classList.add('agree');
            indicator.textContent = 'DE ACUERDO';
        } else if (choice === 'disagree') {
            indicator.classList.add('disagree');
            indicator.textContent = 'EN DESACUERDO';
        } else {
            indicator.classList.add('neutral');
            indicator.textContent = 'NEUTRAL';
        }
        indicator.style.opacity = 1;

        if (navigator.vibrate) navigator.vibrate(50);

        // Guardar estado para posible deshacer
        const proposalId = data.proposals[userAnswers.length].id;
        lastAnswer = { card: cardToProcess.cloneNode(true), answer: { proposalId, choice } };
        userAnswers.push(lastAnswer.answer);
        
        updateProgress();
        showUndoButton();

        const flyoutX = (choice === 'agree' ? 1 : -1) * window.innerWidth;
        const rotation = (choice === 'agree' ? 15 : -15);
        cardToProcess.classList.remove('dragging');
        cardToProcess.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        cardToProcess.style.transform = `translate(${flyoutX}px, 0) rotate(${rotation}deg)`;
        cardToProcess.style.opacity = '0';
        triggerReactionAnimation(choice, choice === 'agree' ? agreeBtn : (choice === 'disagree' ? disagreeBtn : neutralBtn));
        cardToProcess.addEventListener('transitionend', () => {
            cardToProcess.remove();
            // Update z-index and transforms for remaining cards
            Array.from(cardStack.children).forEach((card, index) => {
                card.style.zIndex = cardStack.children.length - index;
                card.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.02})`;
            });
            if (cardStack.children.length === 0) {
                setTimeout(showResults, 100);
            } else {
                agreeBtn.disabled = false;
                disagreeBtn.disabled = false;
                neutralBtn.disabled = false;
            }
            isProcessing = false;
        }, { once: true });
    }

    function showUndoButton() {
        if (undoTimeout) clearTimeout(undoTimeout);
        undoBtn.classList.add('visible');
        undoTimeout = setTimeout(() => {
            undoBtn.classList.remove('visible');
        }, 4000); // Ocultar después de 4 segundos
    }

    function undoLastChoice() {
        if (!lastAnswer) return;

        undoBtn.classList.remove('visible');
        if (undoTimeout) clearTimeout(undoTimeout);

        userAnswers.pop();
        
        const restoredCard = lastAnswer.card;
        restoredCard.style.transition = 'none';
        restoredCard.style.opacity = 1;
        restoredCard.style.transform = 'translate(0,0) rotate(0)';
        cardStack.prepend(restoredCard);
        
        // Re-asignar z-index y transformaciones a toda la pila
        Array.from(cardStack.children).forEach((card, index) => {
            card.style.zIndex = cardStack.children.length - index;
            card.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.02})`;
            card.classList.remove('dragging');
        });

        updateProgress();
        lastAnswer = null;
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

        const endOnboarding = () => {
            onboardingOverlay.classList.remove('visible');
            localStorage.setItem('onboardingComplete', 'true');
        };

        onboardingOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('next')) {
                steps[currentStep].classList.remove('active');
                currentStep++;
                steps[currentStep].classList.add('active');
            }
            if (e.target.classList.contains('finish') || e.target.classList.contains('skip')) {
                endOnboarding();
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
        const numBubbles = 5; // Multiple bubbles
        for (let i = 0; i < numBubbles; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = `reaction-bubble ${type}`;
                bubble.innerHTML = sourceButton.innerHTML;
                const rect = sourceButton.getBoundingClientRect();
                const startLeft = rect.left + rect.width / 2 - reactionContainer.getBoundingClientRect().left + (Math.random() - 0.5) * 20;
                const endLeft = startLeft + (Math.random() - 0.5) * 150;
                bubble.style.setProperty('--start-left', `${startLeft}px`);
                bubble.style.setProperty('--end-left', `${endLeft}px`);
                reactionContainer.appendChild(bubble);
                bubble.addEventListener('animationend', () => bubble.remove());
            }, i * 50); // Staggered creation
        }
    }

    function showResults() {
        if (cardPlaceholder) cardPlaceholder.style.display = 'none';
        resultsScreen.classList.add('visible');
        displayResults();

        // Hide scroll indicator on first scroll
        const resultsContent = document.querySelector('.results-content');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (resultsContent && scrollIndicator) {
            resultsContent.addEventListener('scroll', () => {
                scrollIndicator.style.opacity = '0';
            }, { once: true });
        }
    }

    function calculateResults() {
        const scores = {};
        data.candidates.forEach(c => scores[c.id] = 0);
        const totalQuestions = userAnswers.length;

        userAnswers.forEach(answer => {
            const proposal = data.proposals.find(p => p.id === answer.proposalId);
            if (!proposal) return;

            data.candidates.forEach(candidate => {
                const candidateStance = proposal.stances[candidate.id];
                if (answer.choice === candidateStance) {
                    scores[candidate.id]++;
                }
                else if (answer.choice === 'neutral') {
                    scores[candidate.id] += 0.5;
                }
            });
        });

        const results = data.candidates.map(candidate => {
            const score = totalQuestions > 0 ? Math.round((scores[candidate.id] / totalQuestions) * 100) : 0;
            return { ...candidate, score };
        });

        return results.sort((a, b) => b.score - a.score);
    }

    function animateNumber(element, target, duration = 1000) {
        let current = 0;
        const increment = target / (duration / 20);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '%';
        }, 20);
    }

    function displayResults() {
        const results = calculateResults();
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <img src="${result.photo}" alt="Foto de ${result.name}" class="candidate-photo-results" loading="lazy">
                <div class="candidate-name-party">
                    <span class="name">${result.name}</span>
                    <span class="party">${result.party}</span>
                </div>
                <div class="result-score">0%</div>
                <div class="result-bar-container">
                    <div class="result-bar"></div>
                </div>
            `;
            resultsList.appendChild(item);
            // Animate with delay
            const scoreElement = item.querySelector('.result-score');
            const bar = item.querySelector('.result-bar');
            setTimeout(() => {
                animateNumber(scoreElement, result.score);
                bar.style.width = `${result.score}%`;
            }, index * 200);
        });
    }

    function resetApp() {
        userAnswers = [];
        if (cardPlaceholder) cardPlaceholder.style.display = 'block';
        resultsScreen.classList.remove('visible');
        updateProgress();
        setTimeout(createCards, 50);
        agreeBtn.disabled = false;
        disagreeBtn.disabled = false;
        neutralBtn.disabled = false;
        isProcessing = false;
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
        undoBtn.addEventListener('click', undoLastChoice);
        swipeArea.addEventListener('mousedown', onPointerDown);
        swipeArea.addEventListener('touchstart', onPointerDown, { passive: true });
        document.body.addEventListener('click', handleTooltip);
        setupSidebar();
    }

    // Iniciar la aplicación
    init();

    // --- NAVEGACIÓN POR TECLADO PARA ACCESIBILIDAD ---
    document.addEventListener('keydown', (event) => {
        if (resultsScreen.classList.contains('visible') || onboardingOverlay.classList.contains('visible')) {
            return;
        }

        if (event.key === ' ') {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowRight':
                agreeBtn.click();
                break;
            case 'ArrowLeft':
                disagreeBtn.click();
                break;
            case ' ':
                neutralBtn.click();
                break;
        }
    });
});