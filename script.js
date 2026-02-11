document.addEventListener('DOMContentLoaded', async () => {
    // --- DATOS DE LA APLICACIÓN ---
    let data = { candidates: [], proposals: [] };

    const TEMP_FILES = {
        "AHORA NACION - AN": "https://f.rpp-noticias.io/2026/02/09/ahoranacion_1837126.pdf",
        "ALIANZA ELECTORAL VENCEREMOS": "https://f.rpp-noticias.io/2026/02/09/alianza-electoral-venceremos_1837084.pdf",
        "ALIANZA PARA EL PROGRESO": "https://f.rpp-noticias.io/2026/02/09/alianza-para-el-progreso_1837086.pdf",
        "AVANZA PAIS - PARTIDO DE INTEGRACION SOCIAL": "https://f.rpp-noticias.io/2026/02/09/avanza-pais-partido-de-integracion-social_1837087.pdf",
        "FE EN EL PERU": "https://f.rpp-noticias.io/2026/02/09/fe-en-el-peru_1837088.pdf",
        "FUERZA POPULAR": "https://f.rpp-noticias.io/2026/02/09/fuerza-popular_1837089.pdf",
        "FUERZA Y LIBERTAD": "https://f.rpp-noticias.io/2026/02/09/fuerza-y-libertad_1837090.pdf",
        "JUNTOS POR EL PERU": "https://f.rpp-noticias.io/2026/02/09/juntos-por-el-peru_1837091.pdf",
        "LIBERTAD POPULAR": "https://f.rpp-noticias.io/2026/02/11/libertadpopular_1837580.pdf",
        "PARTIDO APRISTA PERUANO": "https://f.rpp-noticias.io/2026/02/09/partido-aprista-peruano_1837093.pdf",
        "PARTIDO CIVICO OBRAS": "https://f.rpp-noticias.io/2026/02/09/partido-civico-obras_1837094.pdf",
        "PARTIDO DE LOS TRABAJADORES Y EMPRENDEDORES PTE - PERU": "https://f.rpp-noticias.io/2026/02/09/partido-de-los-trabajadores-y-emprendedores-pte-peru_1837095.pdf",
        "PARTIDO DEL BUEN GOBIERNO": "https://f.rpp-noticias.io/2026/02/09/partido-del-buen-gobierno_1837096.pdf",
        "PARTIDO DEMOCRATA UNIDO PERU": "https://f.rpp-noticias.io/2026/02/09/partido-democrata-unido-peru_1837098.pdf",
        "PARTIDO DEMOCRATA VERDE": "https://f.rpp-noticias.io/2026/02/09/partido-democrata-verde_1837100.pdf",
        "PARTIDO DEMOCRATICO FEDERAL": "https://f.rpp-noticias.io/2026/02/09/partido-democratico-federal_1837121.pdf",
        "PARTIDO DEMOCRATICO SOMOS PERU": "https://f.rpp-noticias.io/2026/02/09/partido-democratico-somos-peru_1837101.pdf",
        "PARTIDO FRENTE DE LA ESPERANZA 2021": "https://f.rpp-noticias.io/2026/02/09/partido-frente-de-la-esperanza-2021_1837102.pdf",
        "PARTIDO MORADO": "https://f.rpp-noticias.io/2026/02/09/partido-morado_1837103.pdf",
        "PARTIDO PAIS PARA TODOS": "https://f.rpp-noticias.io/2026/02/09/partido-pais-para-todos_1837104.pdf",
        "PARTIDO PATRIOTICO DEL PERU": "https://f.rpp-noticias.io/2026/02/09/partido-patriotico-del-peru_1837105.pdf",
        "PARTIDO POLITICO COOPERACION POPULAR": "https://f.rpp-noticias.io/2026/02/09/partido-politico-cooperacion-popular_1837106.pdf",
        "PARTIDO POLITICO INTEGRIDAD DEMOCRATICA": "https://f.rpp-noticias.io/2026/02/09/partido-politico-integridad-democratica_1837107.pdf",
        "PARTIDO POLITICO NACIONAL PERU LIBRE": "https://f.rpp-noticias.io/2026/02/11/perulibre_1837578.pdf",
        "PARTIDO POLITICO PERU ACCION": "https://f.rpp-noticias.io/2026/02/11/peruaccion_1837584.pdf",
        "PARTIDO POLITICO PERU PRIMERO": "https://f.rpp-noticias.io/2026/02/09/partido-politico-peru-primero_1837110.pdf",
        "PARTIDO POLITICO PRIN": "https://f.rpp-noticias.io/2026/02/11/prin_1837577.pdf",
        "PARTIDO SICREO": "https://f.rpp-noticias.io/2026/02/11/sicreo_1837576.pdf",
        "PERU MODERNO": "https://f.rpp-noticias.io/2026/02/09/peru-moderno_1837113.pdf",
        "PODEMOS PERU": "https://f.rpp-noticias.io/2026/02/09/podemos-peru_1837114.pdf",
        "PRIMERO LA GENTE - COMUNIDAD, ECOLOGIA, LIBERTAD Y PROGRESO": "https://f.rpp-noticias.io/2026/02/11/primerolagente_1837583.pdf",
        "PROGRESEMOS": "https://f.rpp-noticias.io/2026/02/11/progresemos_1837579.pdf",
        "RENOVACION POPULAR": "https://f.rpp-noticias.io/2026/02/11/renovacionpopular_1837585.pdf",
        "SALVEMOS AL PERU": "https://f.rpp-noticias.io/2026/02/09/salvemos-al-peru_1837118.pdf",
        "UN CAMINO DIFERENTE": "https://f.rpp-noticias.io/2026/02/09/un-camino-diferente_1837119.pdf",
        "UNIDAD NACIONAL": "https://f.rpp-noticias.io/2026/02/09/unidad-nacional_1837120.pdf"
    }

    // Configuración para DATA
    const urlComparapropuestas = "https://s2.rpp-noticias.io/static/especial/comparapropuestas/";
    const urlPlanesGobierno = "https://eaudioplayer.radio-grpp.io/plan-de-gobierno/";
    const basePath = (() => {
        const h = window.location.hostname;
        return h.includes('dev') ? 'https://dev.s.rpp-noticias.io/static/especial/testdeafinidad/' :
            h.includes('pre') ? 'https://pre.s.rpp-noticias.io/static/especial/testdeafinidad/' :
                h.includes('rpp.pe') ? 'https://s2.rpp-noticias.io/static/especial/testdeafinidad/' : '';
    })();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let isPdfLoading = false;
    let currentRenderTask = null;

    const VALID_TOPICS = [
        "cultura-y-turismo", "derechos-e-igualdad", "educacion",
        "justicia-y-reformas", "medio-ambiente", "salud",
        "seguridad-ciudadana", "servicios-basicos", "tecnologia",
        "trabajo-y-economia", "transporte", "vivienda"
    ];

    const formatFilename = (text) => {
        return text
            .toString()
            .toUpperCase()
            .normalize('NFD')                 // Separa los acentos de las letras (ej. ó -> o + ´)
            .replace(/[\u0300-\u036f]/g, '')  // Elimina los acentos separados
            .trim()                           // Elimina espacios al inicio y final
    };

    const findCandidate = (partyId) => {
        return data.candidates.find(candidate => candidate.id == partyId);
    };

    // Función para cargar datos desde Google Sheets
    async function loadData(topicId) {
        data.candidates = [];
        data.proposals = [];
        // Cargar candidatos
        const candidatesResponse = await fetch(urlComparapropuestas + 'data/datajne_v2.json');
        if (!candidatesResponse.ok) throw new Error('Error al cargar candidatos');
        const candidatesJSON = await candidatesResponse.json();

        for (const id in candidatesJSON.candidatos) {
            data.candidates.push({
                id: formatFilename(candidatesJSON.candidatos[id].party),
                name: candidatesJSON.candidatos[id].name,
                party: candidatesJSON.candidatos[id].party,
                photo: urlComparapropuestas + candidatesJSON.candidatos[id].imgUrl,
                imgLogoUrl: urlComparapropuestas + candidatesJSON.candidatos[id].imgLogoUrl,
                pdfUrl: candidatesJSON.candidatos[id].pdfUrl,
                audioUrl: candidatesJSON.candidatos[id].audioUrl
            });
        }

        // Cargar propuestas
        const proposalsResponse = await fetch(`${basePath}data/proposals/${topicId}.json`);
        if (!proposalsResponse.ok) throw new Error('Error al cargar propuestas');
        const proposalsJSON = await proposalsResponse.json();


        data.proposals = proposalsJSON
            .sort(() => 0.5 - Math.random())
            .slice(0, 10)
            .map(row => {
                const stances = {};
                const sources = {};

                row.matches.forEach(match => {
                    const candidate = findCandidate(match.partido);

                    stances[match.partido] = 'agree';
                    sources[match.partido] = {
                        title: match.sustento || '',
                        party: match.partido,
                        imgLogoUrl: candidate?.imgLogoUrl || '',
                        url: candidate?.pdfUrl || '',
                        pages: match.paginas || '',
                        partyName: candidate?.party || ''
                    }
                });

                return {
                    id: row.id,
                    topic: row.topico,
                    text: row.phrase,
                    stances: stances,
                    sources: sources
                };
            });
    }

    // Función para mostrar error
    function showError(message) {
        const swipeArea = document.getElementById('swipe-area');
        swipeArea.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                <h2 style="color: #d32f2f; margin-bottom: 16px;">Error al cargar datos</h2>
                <p style="margin-bottom: 16px;">${message}</p>
                <p style="margin-bottom: 24px;">Por favor, verifica la conexión a internet y que las hojas de cálculo estén publicadas correctamente.</p>
                <button onclick="location.reload()" style="padding: 12px 24px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }

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
    const sourcesSidebar = document.getElementById('sources-sidebar');
    const sourcesSidebarOverlay = document.getElementById('sources-sidebar-overlay');
    const closeSourcesSidebarBtn = document.getElementById('close-sources-sidebar');
    const sourcesContent = document.getElementById('sources-content');
    const onboardingOverlay = document.getElementById('onboarding');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const tematicOverlay = document.getElementById('choosing-tematic');
    const pdfSidebar = document.getElementById('pdf-sidebar');
    const pdfContainer = document.getElementById('pdf-content');
    const closePdfSidebarBtn = document.getElementById('close-pdf-sidebar');

    // --- INICIALIZACIÓN ---
    async function init() {
        try {
            setupOnboarding();
            setupTematic();
            setupEventListeners();

            const urlParams = new URLSearchParams(window.location.search);
            const topicParam = urlParams.get('tematica');
            if (topicParam && VALID_TOPICS.includes(topicParam)) {
                tematicOverlay.classList.remove('visible');
                await loadTopic(topicParam);
            } else {
                if (topicParam) {
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.delete('tematica');
                    window.history.replaceState({}, '', newUrl);
                }
                if (localStorage.getItem('onboardingComplete') === 'true') {
                    tematicOverlay.classList.add('visible'); //
                }
                await loadTopic();
            }

        } catch (error) {
            console.error('Error en inicialización:', error);
            showError('No se pudieron cargar los datos desde las hojas de cálculo. ' + error.message);
        }
    }

    async function loadTopic(topicId = "cultura-y-turismo") {
        await loadData(topicId);
        if (progressText) {
            progressText.textContent = `0 / ${data.proposals.length}`;
        }
        createCards();
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
                <button class="card-source-link" aria-label="Ver fuente" title="Ver fuentes y referencias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
            `;
            cardStack.append(card);
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
            //agreeIndicator.style.opacity = 0;
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
            activeCard.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.02})`;
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
        // Reset overlays and indicator
        restoredCard.querySelector('.card-color-overlay.agree').style.opacity = 0;
        restoredCard.querySelector('.card-color-overlay.disagree').style.opacity = 0;
        const indicator = restoredCard.querySelector('.card-swipe-indicator');
        indicator.style.opacity = 0;
        indicator.classList.remove('agree', 'disagree', 'neutral');
        cardStack.prepend(restoredCard);

        // Re-asignar z-index y transformaciones a toda la pila
        Array.from(cardStack.children).forEach((card, index) => {
            card.style.zIndex = cardStack.children.length - index;
            card.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.02})`;
            card.classList.remove('dragging');
        });

        // Flash effect para indicar restauración
        restoredCard.classList.add('flash');
        setTimeout(() => restoredCard.classList.remove('flash'), 500);

        updateProgress();
        lastAnswer = null;
    }

    // --- GESTIÓN DE SIDEBAR, ONBOARDING Y TOOLTIP ---
    function setupSidebar() {
        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('visible');
            // Close sources sidebar if open
            sourcesSidebar.classList.remove('open');
            sourcesSidebarOverlay.classList.remove('visible');
        };
        openSidebarBtn.addEventListener('click', toggleSidebar);
        closeSidebarBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    function setupOnboarding() {
        if (localStorage.getItem('onboardingComplete') === 'true') {
            tematicOverlay.classList.add('visible');
            return;
        }
        tematicOverlay.classList.remove('visible');
        onboardingOverlay.classList.add('visible');

        const steps = document.querySelectorAll('.onboarding-step');
        let currentStep = 0;

        const endOnboarding = () => {
            onboardingOverlay.classList.remove('visible');
            tematicOverlay.classList.add('visible');
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

    function setupTematic() {
        const btnTematics = document.querySelectorAll('.tematic-button');
        btnTematics.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tematicId = btn.dataset.tematicId;

                const newUrl = new URL(window.location);
                newUrl.searchParams.set('tematica', tematicId);
                window.history.pushState({}, '', newUrl);

                tematicOverlay.classList.remove('visible');
                loadTopic(tematicId);
            })
        })
    }

    function handleSourceClick(e) {
        const sourceLink = e.target.closest('.card-source-link');
        if (sourceLink) {
            e.preventDefault();
            const card = sourceLink.closest('.card');
            const proposalId = parseInt(card.dataset.proposalId);
            const proposal = data.proposals.find(p => p.id == proposalId);
            if (proposal) {
                populateSourcesSidebar(proposal);
                openSourcesSidebar();

                sourcesListener();
            }
        }
    }

    function sourcesListener() {
        const pdfLinks = document.querySelectorAll('.js-open-pdf');
        pdfLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const proposalId = link.dataset.proposalId;
                const sourceId = link.dataset.sourceId;
                const proposal = data.proposals.find(p => p.id == proposalId);
                const source = proposal.sources[sourceId];
                const page = source.pages || "";
                let pdfUrl = TEMP_FILES[formatFilename(source.party)];
                if (page !== "") {
                    const firstPage = page.split(',')[0].trim();
                    pdfUrl += `#page=${firstPage}&view=FitH&toolbar=1`;
                }
                //if (isMobile) {
                //    window.open(pdfUrl, '_blank');
                //} else {
                    openPdfSidebar(pdfUrl);
                //}
            });
        });
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    async function openPdfSidebar(pdfUrl) {
        isPdfLoading = true; // Iniciamos la carga
        const container = document.getElementById('pdf-content');
        const pagesContainer = document.getElementById('pdf-pages-container');
        const cleanUrl = pdfUrl.split('#')[0];
        
        const pageMatch = pdfUrl.match(/#page=(\d+)/);
        const targetPage = pageMatch ? parseInt(pageMatch[1]) : 1;

        try {
            // --- MOSTRAR LOADER ---
            pagesContainer.innerHTML = `
                <div class="pdf-loader-container">
                    <div class="spiral-loader"></div>
                    <p class="loading-text">CARGANDO PLAN DE GOBIERNO...</p>
                </div>
            `;
            
            // Abrir el sidebar inmediatamente para que el usuario vea el loader
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('visible');
            pdfSidebar.classList.add('open');
            sourcesSidebarOverlay.classList.add('visible');

            const loadingTask = pdfjsLib.getDocument(cleanUrl);
            const pdf = await loadingTask.promise;
            
            // Limpiar el loader antes de renderizar las páginas
            pagesContainer.innerHTML = ''; 

            const outputScale = window.devicePixelRatio || 1;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                if (!isPdfLoading) {
                    console.log("Carga de PDF cancelada por el usuario");
                    return; 
                }

                const page = await pdf.getPage(pageNum);
                
                const pageWrapper = document.createElement('div');
                pageWrapper.id = `page-${pageNum}`;
                pageWrapper.className = 'pdf-page-wrapper';
                pageWrapper.style.marginBottom = '10px';

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                const viewport = page.getViewport({ 
                    scale: container.clientWidth / page.getViewport({ scale: 1 }).width 
                });

                canvas.width = Math.floor(viewport.width * outputScale);
                canvas.height = Math.floor(viewport.height * outputScale);
                canvas.style.width = Math.floor(viewport.width) + "px";
                canvas.style.height = Math.floor(viewport.height) + "px";

                const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

                pageWrapper.appendChild(canvas);
                pagesContainer.appendChild(pageWrapper);

                currentRenderTask = page.render({
                    canvasContext: context,
                    viewport: viewport,
                    transform: transform
                });

                try {
                    await currentRenderTask.promise;
                } catch (err) {
                    // Si la tarea fue cancelada, salimos del bucle
                    if (err.name === 'RenderingCancelledException') break;
                }

                // Liberar memoria de la página después de renderizar
                page.cleanup();

                // Hacer scroll a la página objetivo apenas se renderice la primera vez
                if (pageNum === targetPage) {
                    pageWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            // Limpieza final del documento al terminar el bucle
            pdf.destroy();

        } catch (error) {
            if (isPdfLoading) { // Solo mostrar error si no fue cancelado a propósito
                console.error("Error al renderizar PDF:", error);
                pagesContainer.innerHTML = `
                <div class="pdf-loader-container">
                    <p>No pudimos cargar el visor.</p>
                    <a href="${cleanUrl}" target="_blank" style="color:var(--accent-brand); margin-top:10px;">
                        Abrir PDF original ↗
                    </a>
                </div>`;
            }
        }
    }

    function populateSourcesSidebar(proposal) {
        sourcesContent.innerHTML = '';
        Object.entries(proposal.sources).forEach(([id, source]) => {
            if (source.title) {
                const sourceDiv = document.createElement('div');
                sourceDiv.className = 'source-item';
                sourceDiv.innerHTML = `
                    <div class="source-verification">
                        <img src="${source.imgLogoUrl}" alt="${source.party}" class="verification-logo">
                        <span class="divider">| ${source.partyName}</span>
                        <span class="check-icon">✓</span>
                    </div>
                    <p class="source-title">${source.title}</p>
                    <p class="source-date"></p>
                    <a 
                        href="${source.url}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="js-open-pdf"
                        data-proposal-id="${proposal.id}"
                        data-source-id="${id}"
                    >Leer PDF</a>
                `;
                sourcesContent.appendChild(sourceDiv);
            }
        });
    }

    function openSourcesSidebar() {
        // Close main sidebar if open
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
        sourcesSidebar.classList.add('open');
        sourcesSidebarOverlay.classList.add('visible');
    }

    function closeSourcesSidebar() {
        sourcesSidebar.classList.remove('open');
        sourcesSidebarOverlay.classList.remove('visible');
    }

    function closePdfSidebar() {
        isPdfLoading = false;
        
        // 1. Cancelar el renderizado actual si existe
        if (currentRenderTask) {
            currentRenderTask.cancel();
            currentRenderTask = null;
        }

        const pdfSidebar = document.getElementById('pdf-sidebar');
        const pagesContainer = document.getElementById('pdf-pages-container');
        
        pdfSidebar.classList.remove('open');
        
        // 2. Limpieza inmediata de los canvas para liberar memoria
        // En móviles, esperar 400ms puede ser demasiado tarde
        const canvases = pagesContainer.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.width = 1; // "Encoger" el canvas ayuda a liberar memoria RAM instantáneamente
            canvas.height = 1;
        });
        pagesContainer.innerHTML = ''; 
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

            for (const candidateId in proposal.stances) {
                const candidateStance = proposal.stances[candidateId];
                if (answer.choice === candidateStance) {
                    scores[candidateId]++;
                }
                else if (answer.choice === 'neutral') {
                    scores[candidateId] += 0.5;
                }
            }
        });

        const results = data.candidates
            .map(candidate => {
                const score = totalQuestions > 0 ? Math.round((scores[candidate.id] / totalQuestions) * 100) : 0;
                return { ...candidate, score };
            })
            .filter(candidate => candidate.score > 0);
        const response = results.sort((a, b) => b.score - a.score);
        return response
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
            item.setAttribute('data-candidate-id', result.id);
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

        // Add plan drawer handlers
        setupPlanDrawerHandlers();
    }

    function setupPlanDrawerHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.result-item')) {
                const button = e.target.closest('.result-item');
                const candidateId = button.dataset.candidateId;
                openPlanDrawer(candidateId);
            }
            if (e.target.closest('.c-drawer__close') || e.target.classList.contains('c-drawer-overlay')) {
                closePlanDrawer();
            }

            // Manejar cambio de vista en el drawer
            if (e.target.closest('.c-drawer__view-tab')) {
                const tab = e.target.closest('.c-drawer__view-tab');
                const view = tab.dataset.view;

                // No hacer nada si es el link de descarga
                if (tab.classList.contains('c-drawer__view-tab--link')) {
                    return;
                }

                // Actualizar tabs activos
                document.querySelectorAll('.c-drawer__view-tab').forEach(t => {
                    t.classList.remove('c-drawer__view-tab--active');
                });
                tab.classList.add('c-drawer__view-tab--active');

                // Mostrar/ocultar contenido
                document.querySelectorAll('.c-drawer__view-content').forEach(content => {
                    if (content.dataset.viewContent === view) {
                        content.classList.remove('c-drawer__view-content--hidden');
                        content.classList.add('c-drawer__view-content--active');
                    } else {
                        content.classList.add('c-drawer__view-content--hidden');
                        content.classList.remove('c-drawer__view-content--active');
                    }
                });
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.c-drawer--active')) {
                closePlanDrawer();
            }
        });
    }

    function renderPlanDrawer(candidate, planData) {
        const pdfUrl = `${candidate.pdfUrl}`;
        let summaryContent = '';

        // Verificar si hay síntesis en el candidato
        if (planData) {
            // Usar la síntesis del data.json con formato enriquecido
            const formattedSynthesis = planData
                .replace(/\\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^(Plan de gobierno[^<]+)/, '<h2 class="c-drawer__synthesis-title">$1</h2>')
                .replace(/(1\. Identidad e ideario político|2\. Visión estratégica y diagnóstico|3\. Reforma del estado y lucha anticorrupción|4\. Modelo económico y reactivación productiva|5\. Ejes sociales: salud, educación y seguridad|6\. Mecanismos de rendición de cuentas)/g, '<h3 class="c-drawer__synthesis-section">$1</h3>')
                .replace(/(Seguridad|Salud|Educación):/g, '<h4 class="c-drawer__synthesis-subsection">$1:</h4>');

            const cleanedSynthesis = formattedSynthesis
                .replace(/<p>\s*<\/p>/g, '') // Elimina <p></p> incluso si tienen espacios
                .replace(/<p><\/p>/g, '');


            summaryContent = `
                <div class="c-drawer__view-content c-drawer__view-content--active" data-view-content="synthesis">
                    <div class="c-drawer__summary c-drawer__summary--formatted">
                        ${cleanedSynthesis}
                    </div>
                    <div class="c-drawer__ai-disclaimer">
                        Síntesis generada con la IA de Google, basada en el plan oficial del JNE. <br />
                        Recuerda consultar siempre la fuente original.
                    </div>
                </div>
                <div class="c-drawer__view-content c-drawer__view-content--hidden" data-view-content="audio">
                    <div class="c-drawer__audio-player">
                        <div class="c-drawer__audio-icon">🎧</div>
                        <h4 class="c-drawer__audio-title">Escuchar síntesis</h4>
                        <!--p class="c-drawer__audio-description">Reproducción de audio no disponible en este momento.</p-->
                        <audio controls class="c-drawer__audio-element" style="width: 100%; margin-top: 16px;">
                            <source src="${candidate.audioUrl}" type="audio/mpeg">
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                    <div class="c-drawer__ai-disclaimer">
                        Audio generado por la IA de Google, basado en el plan oficial del JNE. <br />
                        Recuerda consultar siempre la fuente original.
                    </div>
                </div>
            `;
        } else {
            summaryContent = `
                <p class="c-drawer__summary">
                    Información detallada del plan de gobierno no disponible actualmente.
                    Puede descargar el documento completo para obtener toda la información.
                </p>
            `;
        }

        return `
            <div class="c-drawer__header">
                <div class="c-drawer__candidate-info">
                    <img class="c-drawer__candidate-logo" src="${basePath}${candidate.imgLogoUrl}" alt="${candidate.name}">
                    <div class="c-drawer__candidate-details">
                        <h3>${candidate.name}</h3>
                        <p>${candidate.party}</p>
                    </div>
                </div>
                <button class="c-drawer__close" aria-label="Cerrar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                    </svg>
                </button>
            </div>

            <div class="c-drawer__content">
                <div class="c-drawer__section">
                    ${summaryContent}
                </div>
            </div>

            <div class="c-drawer__footer">
                <div class="c-drawer__view-tabs">
                    <button class="c-drawer__view-tab c-drawer__view-tab--active" data-view="synthesis">
                        <img class="c-drawer__view-icon" src="https://s2.rpp-noticias.io/static/especial/comparapropuestas/images/Summarize.svg" alt="Leer" width="20" height="20">
                        <span class="c-drawer__view-text">Leer síntesis</span>
                    </button>
                    <button class="c-drawer__view-tab" data-view="audio">
                        <img class="c-drawer__view-icon" src="https://s2.rpp-noticias.io/static/especial/comparapropuestas/images/Audio.svg" alt="Audio" width="20" height="20">
                        <span class="c-drawer__view-text">Escuchar síntesis</span>
                    </button>
                    <a href="${pdfUrl}" target="_blank" class="c-drawer__view-tab c-drawer__view-tab--link">
                        <img class="c-drawer__view-icon" src="https://s2.rpp-noticias.io/static/especial/comparapropuestas/images/download.svg" alt="Descargar" width="20" height="20">
                        <span class="c-drawer__view-text">Plan Original</span>
                    </a>
                </div>
            </div>
        `;
    }

    function closePlanDrawer() {
        const audio = document.querySelector('.c-drawer__audio-element');
        if (audio) {
            audio.pause();
        }

        const overlay = document.querySelector('.c-drawer-overlay');
        const drawer = document.querySelector('.c-drawer');

        if (overlay && drawer) {
            overlay.classList.remove('c-drawer-overlay--active');
            drawer.classList.remove('c-drawer--active');

            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        }
    }

    async function openPlanDrawer(candidateId) {
        const candidate = findCandidate(candidateId);
        if (!candidate) return;

        // Crear overlay si no existe
        let overlay = document.querySelector('.c-drawer-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'c-drawer-overlay';
            document.body.appendChild(overlay);
        }
        // Crear drawer si no existe
        let drawer = document.querySelector('.c-drawer');
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.className = 'c-drawer';
            document.body.appendChild(drawer);
        }
        // Cargar datos del plan de gobierno
        const filenameParty = `${formatFilename(candidate.party)}.txt`;
        const response = await fetch(`${urlComparapropuestas}data/sintesis/${filenameParty}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const planData = await response.text();

        // Renderizar contenido del drawer
        drawer.innerHTML = renderPlanDrawer(candidate, planData);

        // Mostrar drawer
        setTimeout(() => {
            overlay.classList.add('c-drawer-overlay--active');
            drawer.classList.add('c-drawer--active');
        }, 10);

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    function onClickResultItem(event) {
        const candidateId = event.currentTarget.getAttribute('data-candidate-id');
        openPlanDrawer(candidateId);
    }

    function resetApp() {
        userAnswers = [];

        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('tematica');
        window.history.pushState({}, '', newUrl);

        if (cardPlaceholder) cardPlaceholder.style.display = 'block';
        resultsScreen.classList.remove('visible');
        tematicOverlay.classList.add('visible');
        updateProgress();

        cardStack.innerHTML = '';

        agreeBtn.disabled = false;
        disagreeBtn.disabled = false;
        neutralBtn.disabled = false;
        isProcessing = false;
    }

    function shareResults() {
        const shareText = "¡Descubre tu afinidad electoral! Te invito a hacer el test de Match Electoral y conocer tus afinidades políticas.";
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Match Electoral - Descubre tu Afinidad', text: shareText, url: shareUrl }).catch(console.error);
        } else {
            alert(`Invita a tus amigos:\n${shareText}\n${shareUrl}`);
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
        document.body.addEventListener('click', handleSourceClick);
        setupSidebar();
        closeSourcesSidebarBtn.addEventListener('click', closeSourcesSidebar);
        sourcesSidebarOverlay.addEventListener('click', () => {
            if (pdfSidebar.classList.contains('open')) {
                closePdfSidebar(); return;
            }
            closeSourcesSidebar();
        });
        closePdfSidebarBtn.addEventListener('click', closePdfSidebar);
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