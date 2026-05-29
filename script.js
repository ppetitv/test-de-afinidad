document.addEventListener('DOMContentLoaded', async () => {
    // --- DATOS DE LA APLICACIÓN ---
    let data = { candidates: [], proposals: [] };

    // Configuración para DATA
    // const visorPdf = "https://felicidad.com.pe/testdeafinidad/visorpdf?url=";
    const urlComparapropuestas = "https://s2.rpp-noticias.io/static/especial/comparapropuestas/";
    const basePath = (() => {
        const h = window.location.hostname;
        return h.includes('dev') ? 'https://dev.s.rpp-noticias.io/static/especial/testdeafinidad/' :
            h.includes('pre') ? 'https://pre.s.rpp-noticias.io/static/especial/testdeafinidad/' :
                h.includes('rpp.pe') ? 'https://s2.rpp-noticias.io/static/especial/testdeafinidad/' : '';
    })();
    const pdfDomain = (pdfUrl) => {
        const h = window.location.hostname;
        const isProduction = h.includes('rpp.pe') && !h.includes('pre') && !h.includes('dev');
        if (!isProduction) {
            return pdfUrl.replace("https://f.rpp-noticias.io/", "https://f.radio-grpp.io/");
        }
        return pdfUrl;
    };
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let isPdfLoading = false;
    let currentRenderTask = null;

    function convertToSlug(text) {
        return text
            .toString()                     // Asegura que sea un string
            .normalize('NFD')               // Descompone los caracteres acentuados (á -> a + ´)
            .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos/diacríticos sobrantes
            .toLowerCase()                  // Convierte todo a minúsculas
            .trim()                         // Elimina espacios al inicio y al final
            .replace(/\s+/g, '-')           // Reemplaza uno o más espacios por un guion
            .replace(/[^\w\-]+/g, '')       // Elimina cualquier carácter que no sea letra, número o guion
            .replace(/\-\-+/g, '-');        // Reemplaza múltiples guiones seguidos por uno solo
    }

    const VALID_TOPICS = [
        "cultura-y-turismo", "derechos-e-igualdad", "educacion",
        "justicia-y-reformas", "medio-ambiente", "salud",
        "seguridad-ciudadana", "servicios-basicos", "tecnologia",
        "trabajo-y-economia", "transporte", "vivienda"
    ];

    const TOPIC_NOTES = {
        "cultura-y-turismo": "",
        "derechos-e-igualdad": "",
        "educacion": "",
        "justicia-y-reformas": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-2026-propuestas-de-sinesio-lopez-y-vladimiro-huaroc-sobre-reforma-del-estado-noticia-1689934",
                titulo: "Sinesio López y Vladimiro Huaroc se enfrentaron en el debate técnico: esto dijeron sobre reforma del Estado",
                imagen: "https://f.rpp-noticias.io/2026/05/24/495849_1870954.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/juntos-por-el-peru-propone-autonomia-de-los-organismos-de-control-para-reducir-la-corrupcion-es-viable-noticia-1689968",
                titulo: "Juntos por el Perú propone autonomía de los organismos de control para reducir la corrupción: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/151115_1870997.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/fuerza-popular-propone-un-centro-de-gobierno-estrategico-como-reforma-del-estado-es-viable-noticia-1689970",
                titulo: "Fuerza Popular propone un centro de gobierno estratégico como reforma del estado: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/082608_1871007.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            }
        ],
        "medio-ambiente": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-estas-son-las-propuestas-de-fuerza-popular-y-juntos-por-el-peru-para-el-sector-agricultura-y-medio-ambiente-noticia-1689923",
                titulo: "Debate técnico: estas son las propuestas de Fuerza Popular y Juntos por el Perú para el sector agricultura y medio ambiente",
                imagen: "https://f.rpp-noticias.io/2026/05/24/575657_1870956.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/fuerza-popular-propone-ejecutar-megaproyectos-de-irrigacion-agraria-que-estan-abandonados-es-viable-noticia-1689979",
                titulo: "Fuerza Popular propone ejecutar megaproyectos de irrigación agraria 'que están abandonados': ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/050805_1871022.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/juntos-por-el-peru-propone-derogar-la-ley-antiforestal-en-un-eventual-gobierno-es-viable-noticia-1689980",
                titulo: "Juntos por el Perú propone derogar la ley antiforestal en un eventual gobierno: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/571157_1871039.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            }
        ],
        "salud": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-conoce-las-propuestas-de-fuerza-popular-y-juntos-por-el-peru-para-impulsar-el-deporte-noticia-1689937",
                titulo: "Debate técnico: ¿cuáles son las propuestas de Fuerza Popular y Juntos por el Perú para la juventud y el deporte?",
                imagen: "https://f.rpp-noticias.io/2026/05/24/465946_1870957.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-estas-fueron-las-propuestas-de-fuerza-popular-y-juntos-por-el-peru-en-el-tema-de-salud-noticia-1689939",
                titulo: "Debate técnico: estas fueron las propuestas de Fuerza Popular y Juntos por el Perú en el tema de salud",
                imagen: "https://f.rpp-noticias.io/2026/05/24/412641_1870962.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/fuerza-popular-propone-fortalecer-la-telemedicina-con-brigadas-de-salud-para-combatir-la-anemia-en-regiones-es-viable-noticia-1689964",
                titulo: "Fuerza Popular propone fortalecer la telemedicina con “brigadas de salud” para combatir la anemia en regiones: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/240624_1870996.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/juntos-por-el-peru-propone-incrementar-la-inversion-en-salud-y-fortalecer-el-primer-nivel-de-atencion-es-viable-noticia-1689973",
                titulo: "Juntos por el Perú propone incrementar la inversión en salud y fortalecer el primer nivel de atención: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/262626_1871008.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            }
        ],
        "seguridad-ciudadana": "",
        "servicios-basicos": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-2026-propuestas-de-infraestructura-de-neuhaus-y-guerra-garcia-noticia-1689938",
                titulo: "Obras paralizadas, agua potable y transporte: ¿qué plantearon Neuhaus y Guerra García en el debate técnico sobre infraestructura?",
                imagen: "https://f.rpp-noticias.io/2026/05/24/373237_1870960.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/fuerza-popular-propone-reactivar-mas-de-2-200-obras-paralizadas-en-el-pais-es-viable-noticia-1689963",
                titulo: "Fuerza Popular propone reactivar más de 2 200 obras paralizadas en el país: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/283028_1871017.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            }
        ],
        "tecnologia": "",
        "trabajo-y-economia": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-fuerza-popular-y-juntos-por-el-peru-presentaron-sus-propuestas-en-materia-de-economia-y-generacion-de-empleo-noticia-1689924",
                titulo: "Debate técnico: las estrategias de Juntos por el Perú y Fuerza Popular para impulsar el crecimiento económico y la generación de empleo",
                imagen: "https://f.rpp-noticias.io/2026/05/24/031103_1870961.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/pedro-francke-defiende-equilibrio-fiscal-e-inversion-privada-en-segunda-vuelta-noticia-1689940",
                titulo: "Pedro Francke reconoce que ideas sobre inversión privada y equilibrio fiscal se trabajaron con equipo para la segunda vuelta",
                imagen: "https://f.rpp-noticias.io/2026/05/24/atsapp-video-2026-05-24-at-104129-pm-1870963mp4_1870964.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/luis-carranza-del-equipo-tecnico-de-fuerza-popular-nuestra-presion-tributaria-no-es-tan-baja-noticia-1689942",
                titulo: "Luis Carranza, del equipo técnico de Fuerza Popular: 'Nuestra presión tributaria no es tan baja'",
                imagen: "https://f.rpp-noticias.io/2026/05/24/214721_1870965.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            },
            {
                url: "https://rpp.pe/politica/elecciones/juntos-por-el-peru-propone-programa-mi-primera-chamba-con-bonos-para-100-mil-jovenes-es-viable-noticia-1689975",
                titulo: "Juntos por el Perú propone programa 'Mi primera chamba' con bonos para 100 mil jóvenes: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/233623_1871019.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/economia/economia/que-tan-viable-son-las-propuestas-de-juntos-por-el-peru-y-fuerza-popular-en-materia-economica-y-tributaria-noticia-1689959",
                titulo: "¿Qué tan viables son las propuestas de Juntos por el Perú y Fuerza Popular en materia económica y tributaria?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/202220_1871002.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/economia/economia/fuerza-popular-propone-otorgar-nuevos-incentivos-tributarios-a-empresas-noticia-1689976",
                titulo: "Fuerza Popular propone otorgar nuevos incentivos tributarios a empresas",
                imagen: "https://f.rpp-noticias.io/2026/05/25/105210_1871020.jpg?imgdimension=look",
                party: ["FUERZA POPULAR"]
            }
        ],
        "transporte": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-2026-propuestas-de-infraestructura-de-neuhaus-y-guerra-garcia-noticia-1689938",
                titulo: "Obras paralizadas, agua potable y transporte: ¿qué plantearon Neuhaus y Guerra García en el debate técnico sobre infraestructura?",
                imagen: "https://f.rpp-noticias.io/2026/05/24/373237_1870960.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            },
            {
                url: "https://rpp.pe/economia/economia/juntos-por-el-peru-propone-pavimentar-y-mejorar-50-000-km-de-caminos-rurales-es-viable-noticia-1689966",
                titulo: "Juntos por el Perú propone pavimentar y mejorar 50 000 km de caminos rurales: ¿es viable?",
                imagen: "https://f.rpp-noticias.io/2026/05/25/552155_1871001.jpg?imgdimension=look",
                party: ["JUNTOS POR EL PERU"]
            }
        ],
        "vivienda": [
            {
                url: "https://rpp.pe/politica/elecciones/debate-tecnico-2026-propuestas-de-infraestructura-de-neuhaus-y-guerra-garcia-noticia-1689938",
                titulo: "Obras paralizadas, agua potable y transporte: ¿qué plantearon Neuhaus y Guerra García en el debate técnico sobre infraestructura?",
                imagen: "https://f.rpp-noticias.io/2026/05/24/373237_1870960.jpg?imgdimension=look",
                party: ["FUERZA POPULAR", "JUNTOS POR EL PERU"]
            }
        ]
    }

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
        const candidatesResponse = await fetch(urlComparapropuestas + 'data/datajne_v4.json');
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
                pdfUrl2: candidatesJSON.candidatos[id].pdfUrl2,
                audioUrl: candidatesJSON.candidatos[id].audioUrl
            });
        }

        // Cargar propuestas
        const proposalsResponse = await fetch(`${basePath}data/proposals-v1/${topicId}.json`);
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

                    const page = match.paginas || "";
                    let pdfUrl = candidate?.pdfUrl2 || '';
                    if (page !== "") {
                        const firstPage = page.split(',')[0].trim();
                        pdfUrl += `#page=${firstPage}`;
                    }

                    stances[match.partido] = 'agree';
                    sources[match.partido] = {
                        title: match.sustento || '',
                        party: match.partido,
                        imgLogoUrl: candidate?.imgLogoUrl || '',
                        url: pdfUrl || '',
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
                <span class="card-source-text">Ver fuentes y referencias</span>
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

        window.marfeel = window.marfeel || { cmd: [] };
        window.marfeel.cmd.push(['compass', function (compass) {
            compass.trackConversion(choice + ' - test de afinidad');
        }]);

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

                window.marfeel = window.marfeel || { cmd: [] };
                window.marfeel.cmd.push(['compass', function (compass) {
                    compass.trackConversion('click tematica - test de afinidad');
                }]);
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
        const isAndroid = /Android/i.test(navigator.userAgent);

        pdfLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const proposalId = link.dataset.proposalId;
                const sourceId = link.dataset.sourceId;
                const proposal = data.proposals.find(p => p.id == proposalId);
                const source = proposal.sources[sourceId];

                // URL Base limpia
                let rawUrl = source.url;
                if (isMobile) {
                    if (isAndroid) {
                        openPdfSidebar(rawUrl);
                    } else {
                        //openPdfSidebar(rawUrl);
                        window.open(rawUrl + '&view=FitH&toolbar=1', '_blank');
                    }
                } else {
                    //openPdfSidebar(rawUrl);
                    openPdfVisor(rawUrl + '&view=FitH&toolbar=1');
                }
            });
        });
    }

    // For web
    function openPdfVisor(pdfUrl) {
        const pdfPagesContainer = document.getElementById('pdf-pages-container');
        pdfPagesContainer.innerHTML = '';
        // 2. Usamos IFRAME en lugar de EMBED
        // iframe suele comportarse mejor con el historial y parámetros en Chrome/Edge
        const iframe = document.createElement('iframe');

        // Aseguramos que la URL permita caché o recarga correcta
        iframe.src = pdfUrl;
        iframe.title = "Visor de Plan de Gobierno";
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';

        // 3. Inyectamos
        pdfPagesContainer.appendChild(iframe);

        // 4. Abrimos el sidebar
        pdfSidebar.classList.add('open');
        if (sourcesSidebarOverlay) {
            sourcesSidebarOverlay.classList.add('visible');
        }
    }

    // For Mobile
    pdfjsLib.GlobalWorkerOptions.workerSrc = basePath + 'pdf-worker.min.js';
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

            const loadingTask = pdfjsLib.getDocument(pdfDomain(cleanUrl));
            const pdf = await loadingTask.promise;

            // Limpiar el loader antes de renderizar las páginas
            pagesContainer.innerHTML = '';

            const outputScale = window.devicePixelRatio || 1;

            const rangeBuffer = 3;
            let startPage = Math.max(1, targetPage - rangeBuffer);
            let endPage = Math.min(pdf.numPages, targetPage + rangeBuffer);

            if (startPage > 1) {
                const infoDiv = document.createElement('div');
                infoDiv.style.paddingBottom = "10px";
                infoDiv.style.color = "#ccc";
                infoDiv.style.textAlign = "center";
                infoDiv.innerText = `Páginas 1 a ${startPage - 1} omitidas`;
                pagesContainer.appendChild(infoDiv);
            }

            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                if (!isPdfLoading) {
                    console.log("Carga de PDF cancelada por el usuario");
                    return;
                }

                const page = await pdf.getPage(pageNum);

                const pageWrapper = document.createElement('div');
                pageWrapper.id = `page-${pageNum}`;
                pageWrapper.className = 'pdf-page-wrapper';
                pageWrapper.style.marginBottom = '10px';

                // Añadimos número de página visualmente
                const pageNumberLabel = document.createElement('div');
                pageNumberLabel.style.textAlign = "right";
                pageNumberLabel.style.padding = "6px 10px";
                pageNumberLabel.style.fontSize = "10px";
                pageNumberLabel.style.color = "#666";
                pageNumberLabel.innerText = `Pág. ${pageNum}`;
                pageWrapper.appendChild(pageNumberLabel);

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

            if (endPage < pdf.numPages) {
                const infoDiv = document.createElement('div');
                infoDiv.style.paddingBottom = "10px";
                infoDiv.style.color = "#ccc";
                infoDiv.style.textAlign = "center";
                infoDiv.innerText = `Páginas restantes (${endPage + 1} - ${pdf.numPages}) omitidas`;
                pagesContainer.appendChild(infoDiv);
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

        const entries = Object.entries(proposal.sources);
        for (let i = entries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
        }

        entries.forEach(([id, source]) => {
            if (source.title) {
                const sourceDiv = document.createElement('div');
                sourceDiv.className = 'source-item';
                sourceDiv.innerHTML = `
                    <div class="source-verification">
                        <img src="${source.imgLogoUrl}" alt="${source.party}" class="verification-logo">
                        <span class="divider">| ${source.partyName}</span>
                        <span class="check-icon">✓</span>
                    </div>
                    <p class="source-title">
                        ${source.title.replace(/\.$/, '')}
                        ${source.pages ? ` 
                            <a 
                                href="${source.url}" 
                                target="_blank"
                                rel="noopener noreferrer"
                            >Pg. ${source.pages}</a>.` : ''}
                    </p>
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

        const recommendedGrid = document.querySelector('.sources-recommended-grid');
        const recommendedContainer = document.querySelector('.sources-recommended');
        if (recommendedGrid && recommendedContainer) {
            recommendedGrid.innerHTML = '';
            const topicId = convertToSlug(proposal.topic);
            let recommendedItems = [];

            if (TOPIC_NOTES[topicId] && Array.isArray(TOPIC_NOTES[topicId])) {
                const partiesInProposal = entries.map(([id, source]) => convertToSlug(source.partyName));
                recommendedItems = TOPIC_NOTES[topicId].filter(note => {
                    if (!note.party || !Array.isArray(note.party)) return false;
                    return note.party.some(party => partiesInProposal.includes(convertToSlug(party)));
                });
            }

            if (recommendedItems.length > 0) {
                recommendedContainer.style.display = 'block';
                recommendedItems.forEach(item => {
                    const recHtml = `
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="src-rec-card">
                            <div class="src-rec-card-content">
                                <span class="src-rec-category">Elecciones</span>
                                <h4 class="src-rec-headline">${item.titulo}</h4>
                            </div>
                            <img src="${item.imagen}" alt="Imagen noticia" class="src-rec-image">
                        </a>
                    `;
                    recommendedGrid.insertAdjacentHTML('beforeend', recHtml);
                });
            } else {
                recommendedContainer.style.display = 'none';
            }
        }
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
                    <img class="c-drawer__candidate-logo" src="${candidate.imgLogoUrl}" alt="${candidate.name}">
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

        window.marfeel = window.marfeel || { cmd: [] };
        window.marfeel.cmd.push(['compass', function (compass) {
            compass.trackConversion('repetir test - test de afinidad');
        }]);
    }

    function shareResults() {
        const shareText = "¡Descubre tu afinidad electoral! Te invito a hacer el test de Afinidad Electoral y conocer tus afinidades políticas.";
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'Afinidad Electoral - Descubre tu Afinidad', text: shareText, url: shareUrl }).catch(console.error);
        } else {
            alert(`Invita a tus amigos:\n${shareText}\n${shareUrl}`);
        }

        window.marfeel = window.marfeel || { cmd: [] };
        window.marfeel.cmd.push(['compass', function (compass) {
            compass.trackConversion('compartir test - test de afinidad');
        }]);
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