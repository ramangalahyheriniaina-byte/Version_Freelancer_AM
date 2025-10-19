// =============================================
// VARIABLES GLOBALES ET INITIALISATION
// =============================================

// Variables pour la calculatrice classique
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;
let memory = 0;
let history = [];
let settings = {
    decimalPrecision: 2,
    thousandsSeparator: true,
    theme: 'auto'
};

// Variables pour la calculatrice scientifique
let scientificCurrentOperand = '0';
let scientificPreviousOperand = '';
let scientificOperation = null;
let scientificShouldResetScreen = false;
let angleUnit = 'DEG'; // DEG ou RAD

// Variables pour la calculatrice programmeur
let programmerCurrentOperand = '0';
let programmerPreviousOperand = '';
let programmerOperation = null;
let programmerShouldResetScreen = false;
let currentBase = 'DEC'; // HEX, DEC, OCT, BIN

// Variables pour la calculatrice financière
let financeCurrentOperand = '0';
let financePreviousOperand = '';
let financeOperation = null;
let financeShouldResetScreen = false;
let financeValues = {
    PV: 0,
    FV: 0,
    PMT: 0,
    N: 0,
    IY: 0
};

// État des panneaux
let isHistoryOpen = false;
let isSettingsOpen = false;

// Protection contre les clics multiples
let clickInProgress = false;

// Éléments DOM
const currentOperandElement = document.getElementById('currentOperand');
const formulaPreviewElement = document.getElementById('formulaPreview');
const memoryIndicator = document.getElementById('memoryIndicator');
const memoryValueElement = document.getElementById('memoryValue');
const settingsPanel = document.getElementById('settingsPanel');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

// Éléments pour la calculatrice scientifique
const scientificCurrentOperandElement = document.getElementById('scientificCurrentOperand');
const scientificFormulaPreviewElement = document.getElementById('scientificFormulaPreview');
const angleUnitBtn = document.getElementById('angleUnitBtn');

// Éléments pour la calculatrice programmeur
const programmerCurrentOperandElement = document.getElementById('programmerCurrentOperand');
const hexValueElement = document.getElementById('hexValue');
const decValueElement = document.getElementById('decValue');
const octValueElement = document.getElementById('octValue');
const binValueElement = document.getElementById('binValue');

// Éléments pour la calculatrice financière
const financeCurrentOperandElement = document.getElementById('financeCurrentOperand');
const pvValueElement = document.getElementById('pvValue');
const fvValueElement = document.getElementById('fvValue');
const pmtValueElement = document.getElementById('pmtValue');

// =============================================
// INITIALISATION CORRIGÉE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

function initializeCalculator() {
    try {
        loadSettings();
        updateDisplay();
        setupKeyboardSupport();
        setupTouchEvents();
        setupClickHandlers();
        setupScrollHandling();
        setupPanelEvents();
        
        // Gestion du menu hamburger
        document.getElementById('menuToggle').addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('show');
        });

        // Fermer le menu lorsqu'on clique sur un lien (mobile)
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    document.querySelector('nav ul').classList.remove('show');
                }
            });
        });

        // Réinitialiser le menu sur desktop
        window.addEventListener('resize', function() {
            const nav = document.querySelector('nav ul');
            if (window.innerWidth > 768) {
                nav.classList.remove('show');
            }
        });
        
        // Navigation entre les sections
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Fermer tous les panneaux lors de la navigation
                closeAllPanels();
                
                // Mettre à jour la navigation active
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const target = this.getAttribute('data-target');
                
                // Masquer toutes les sections
                document.getElementById('hero').classList.add('hidden');
                document.getElementById('features').classList.remove('active');
                document.getElementById('mainContent').classList.remove('active');
                
                // Afficher la section cible
                if (target === 'hero') {
                    document.getElementById('hero').classList.remove('hidden');
                } else if (target === 'features') {
                    document.getElementById('features').classList.add('active');
                } else if (target === 'mainContent') {
                    document.getElementById('mainContent').classList.add('active');
                }
            });
        });
        
        // Fonction pour démarrer le calcul
        document.getElementById('startCalc').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer tous les panneaux
            closeAllPanels();
            
            // Masquer la section héros
            document.getElementById('hero').classList.add('hidden');
            
            // Afficher le main-content
            document.getElementById('mainContent').classList.add('active');
            
            // Mettre à jour la navigation
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('[data-target="mainContent"]').classList.add('active');
            
            // Afficher l'indicateur de calculatrice
            const indicator = document.getElementById('calcIndicator');
            indicator.textContent = 'Calculatrice Classique sélectionnée';
            indicator.classList.add('active');
            
            // Masquer l'indicateur après 3 secondes
            setTimeout(() => {
                indicator.classList.remove('active');
            }, 3000);
        });
        
        // Gestion des onglets de calculatrice
        document.querySelectorAll('.calc-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Fermer tous les panneaux lors du changement d'onglet
                closeAllPanels();
                
                // Désactiver tous les onglets
                document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
                // Activer l'onglet sélectionné
                tab.classList.add('active');
                
                // Masquer tous les modes
                document.querySelectorAll('.calculator-mode').forEach(mode => {
                    mode.classList.remove('active');
                });
                
                // Afficher le mode sélectionné
                const modeId = tab.dataset.tab + 'Mode';
                document.getElementById(modeId).classList.add('active');
                
                // Afficher l'indicateur de type de calculatrice
                const indicator = document.getElementById('calcIndicator');
                let calcType = '';
                
                switch(tab.dataset.tab) {
                    case 'classic':
                        calcType = 'Classique';
                        break;
                    case 'scientific':
                        calcType = 'Scientifique';
                        break;
                    case 'programmer':
                        calcType = 'Programmeur';
                        break;
                    case 'finance':
                        calcType = 'Finance';
                        break;
                    case 'converter':
                        calcType = 'Convertisseurs';
                        break;
                }
                
                indicator.textContent = `Calculatrice ${calcType} sélectionnée`;
                indicator.classList.add('active');
                
                // Masquer l'indicateur après 3 secondes
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 3000);
            });
        });

        // Gestion des sous-onglets convertisseurs
        document.querySelectorAll('.converter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Désactiver tous les sous-onglets
                document.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
                // Activer le sous-onglet sélectionné
                tab.classList.add('active');
                
                // Masquer toutes les sections convertisseurs
                document.querySelectorAll('.converter-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Afficher la section sélectionnée
                const converterId = tab.dataset.converter + 'Converter';
                document.getElementById(converterId).classList.add('active');
            });
        });

        // Sauvegarde automatique des notes
        document.getElementById('notes').addEventListener('input', function() {
            try {
                localStorage.setItem('calculatorNotes', this.value);
            } catch (error) {
                console.error('Erreur sauvegarde notes:', error);
                showNotification('Erreur de sauvegarde des notes', 'error');
            }
        });

        // Chargement des notes sauvegardées
        const savedNotes = localStorage.getItem('calculatorNotes');
        if (savedNotes) {
            document.getElementById('notes').value = savedNotes;
        }

        console.log('✅ Calculatrice initialisée avec succès');
    } catch (error) {
        console.error('❌ Erreur initialisation calculatrice:', error);
        showNotification('Erreur d\'initialisation', 'error');
    }
}

// =============================================
// CORRECTION DES ÉVÉNEMENTS TACTILES
// =============================================

function setupTouchEvents() {
    try {
        // Sélectionner tous les boutons interactifs
        const interactiveElements = document.querySelectorAll(
            '.calc-btn, .demo-btn, .converter-btn, .header-btn, .tool-item, .calc-tab, .converter-tab'
        );
        
        interactiveElements.forEach(element => {
            // Supprimer les écouteurs existants pour éviter les doublons
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('touchcancel', handleTouchCancel);
            
            // Ajouter les nouveaux écouteurs
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchend', handleTouchEnd, { passive: true });
            element.addEventListener('touchcancel', handleTouchCancel, { passive: true });
            
            // Événements souris pour la compatibilité
            element.addEventListener('mousedown', handleMouseDown);
            element.addEventListener('mouseup', handleMouseUp);
            element.addEventListener('mouseleave', handleMouseLeave);
        });
        
        // Empêcher le comportement par défaut du toucher sur le document
        document.addEventListener('touchmove', function(e) {
            // Autoriser le défilement normal
        }, { passive: true });
        
        document.addEventListener('touchstart', function(e) {
            // Ne rien faire - laisser les boutons gérer leurs propres événements
        }, { passive: true });
        
    } catch (error) {
        console.error('Erreur configuration événements tactiles:', error);
    }
}

// Gestionnaires d'événements séparés pour une meilleure gestion
function handleTouchStart(e) {
    if (clickInProgress) {
        e.preventDefault();
        return;
    }
    
    // Ne pas empêcher le comportement par défaut - laisser le navigateur gérer
    this.classList.add('active');
    
    // Marquer le début d'une interaction
    this.setAttribute('data-touch-start', Date.now());
}

function handleTouchEnd(e) {
    const touchStart = parseInt(this.getAttribute('data-touch-start') || '0');
    const touchDuration = Date.now() - touchStart;
    
    this.classList.remove('active');
    this.removeAttribute('data-touch-start');
    
    // Vérifier si c'est un vrai clic (pas un défilement) et que la durée est raisonnable
    if (!this.disabled && touchDuration < 500 && !clickInProgress) {
        clickInProgress = true;
        
        // Petit délai pour s'assurer que ce n'est pas un défilement
        setTimeout(() => {
            if (!this.disabled) {
                // Déclencher le clic seulement si l'élément est toujours sous le doigt/curseur
                const rect = this.getBoundingClientRect();
                const isStillOver = (
                    e.changedTouches && 
                    e.changedTouches[0].clientX >= rect.left &&
                    e.changedTouches[0].clientX <= rect.right &&
                    e.changedTouches[0].clientY >= rect.top &&
                    e.changedTouches[0].clientY <= rect.bottom
                );
                
                if (isStillOver || !e.changedTouches) {
                    this.click();
                }
            }
            clickInProgress = false;
        }, 50);
    }
}

function handleTouchCancel(e) {
    this.classList.remove('active');
    this.removeAttribute('data-touch-start');
}

function handleMouseDown() {
    if (clickInProgress) return;
    this.classList.add('active');
}

function handleMouseUp() {
    this.classList.remove('active');
}

function handleMouseLeave() {
    this.classList.remove('active');
}

// =============================================
// GESTION AMÉLIORÉE DES CLICS
// =============================================

function setupClickHandlers() {
    try {
        // Désactiver temporairement les clics multiples
        document.addEventListener('click', function(e) {
            if (clickInProgress) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            clickInProgress = true;
            setTimeout(() => {
                clickInProgress = false;
            }, 300);
        }, true);
        
    } catch (error) {
        console.error('Erreur configuration gestion clics:', error);
    }
}

// =============================================
// GESTION DU DÉFILEMENT SUR MOBILE
// =============================================

function setupScrollHandling() {
    let scrollTimer;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        isScrolling = true;
        
        // Pendant le défilement, désactiver temporairement les états actifs
        document.querySelectorAll('.active').forEach(element => {
            if (element.classList.contains('calc-btn') || 
                element.classList.contains('demo-btn') ||
                element.classList.contains('converter-btn') ||
                element.classList.contains('tool-item')) {
                element.classList.remove('active');
            }
        });
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });
    
    // Empêcher les clics pendant le défilement
    document.addEventListener('touchstart', function(e) {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });
}

// =============================================
// GESTION DES PANNEAUX CORRIGÉE
// =============================================

function setupPanelEvents() {
    try {
        // Bouton paramètres - GESTION CORRIGÉE
        document.getElementById('settingsBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSettings();
        });
        
        // Boutons historique - GESTION UNIFIÉE ET CORRIGÉE
        const historyButtons = [
            'historyBtn',
            'scientificHistoryBtn', 
            'programmerHistoryBtn',
            'financeHistoryBtn'
        ];

        historyButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleHistory();
                });
            }
        });
        
        // Fermer les panneaux en cliquant en dehors
        document.addEventListener('click', function(event) {
            const isSettingsButton = event.target.closest('#settingsBtn') || 
                                    event.target.closest('.fa-cog');
            const isHistoryButton = event.target.closest('[id$="HistoryBtn"]') || 
                                   event.target.closest('.fa-history') || 
                                   event.target.closest('.fa-times');
            const isSettingsPanel = event.target.closest('.settings-panel');
            const isHistoryPanel = event.target.closest('.history-panel');
            
            // Fermer les paramètres si on clique ailleurs
            if (!isSettingsButton && !isSettingsPanel && isSettingsOpen) {
                closeSettings();
            }
            
            // Fermer l'historique si on clique ailleurs
            if (!isHistoryButton && !isHistoryPanel && isHistoryOpen) {
                closeHistory();
            }
        });
        
        // Empêcher la fermeture quand on clique dans les panneaux
        settingsPanel.addEventListener('click', function(event) {
            event.stopPropagation();
        });
        
        historyPanel.addEventListener('click', function(event) {
            event.stopPropagation();
        });
        
        // Appliquer les paramètres
        document.getElementById('decimalPrecision').addEventListener('change', function() {
            settings.decimalPrecision = parseInt(this.value);
            saveSettings();
            updateAllDisplays();
        });
        
        document.getElementById('thousandsSeparator').addEventListener('change', function() {
            settings.thousandsSeparator = this.checked;
            saveSettings();
            updateAllDisplays();
        });
        
        document.getElementById('themeSelector').addEventListener('change', function() {
            settings.theme = this.value;
            saveSettings();
            applyTheme();
        });
    } catch (error) {
        console.error('Erreur configuration panneaux:', error);
    }
}

function toggleSettings() {
    try {
        if (isSettingsOpen) {
            closeSettings();
        } else {
            // Fermer l'historique si ouvert
            if (isHistoryOpen) {
                closeHistory();
            }
            openSettings();
        }
    } catch (error) {
        console.error('Erreur toggle settings:', error);
    }
}

function openSettings() {
    settingsPanel.classList.add('active');
    isSettingsOpen = true;
}

function closeSettings() {
    settingsPanel.classList.remove('active');
    isSettingsOpen = false;
}

function toggleHistory() {
    try {
        if (isHistoryOpen) {
            closeHistory();
        } else {
            // Fermer les paramètres si ouvert
            if (isSettingsOpen) {
                closeSettings();
            }
            openHistory();
        }
    } catch (error) {
        console.error('Erreur toggle history:', error);
    }
}

function openHistory() {
    historyPanel.classList.add('active');
    isHistoryOpen = true;
    updateHistoryButtonsIcons();
    updateHistoryPanel();
}

function closeHistory() {
    historyPanel.classList.remove('active');
    isHistoryOpen = false;
    resetHistoryButtonsIcons();
}

function closeAllPanels() {
    closeSettings();
    closeHistory();
}

function updateHistoryButtonsIcons() {
    const historyBtns = document.querySelectorAll('[id$="HistoryBtn"]');
    historyBtns.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.title = 'Fermer l\'historique';
    });
}

function resetHistoryButtonsIcons() {
    const historyBtns = document.querySelectorAll('[id$="HistoryBtn"]');
    historyBtns.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-history"></i>';
        btn.title = 'Ouvrir l\'historique';
    });
}

// =============================================
// FONCTIONS COMMUNES AVEC GESTION D'ERREURS
// =============================================

function formatNumber(number) {
    try {
        if (number === 'Erreur' || number === 'Infinity' || number === '-Infinity') return 'Erreur';
        
        let num = parseFloat(number);
        if (isNaN(num)) return '0';
        
        // Appliquer la précision décimale
        num = parseFloat(num.toFixed(settings.decimalPrecision));
        
        // Formater avec séparateur de milliers si activé
        if (settings.thousandsSeparator) {
            return num.toLocaleString('fr-FR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: settings.decimalPrecision
            });
        } else {
            return num.toString();
        }
    } catch (error) {
        console.error('Erreur formatNumber:', error);
        return 'Erreur';
    }
}

function addToHistory(expression, result) {
    try {
        history.unshift({ expression, result });
        if (history.length > 10) {
            history.pop();
        }
        updateHistoryPanel();
    } catch (error) {
        console.error('Erreur addToHistory:', error);
    }
}

function updateHistoryPanel() {
    try {
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <span class="history-expression">${item.expression}</span>
                <span class="history-result">${formatNumber(item.result)}</span>
            `;
            li.addEventListener('click', () => {
                try {
                    // Récupérer le mode actif pour savoir quelle calculatrice utiliser
                    const activeMode = document.querySelector('.calculator-mode.active');
                    if (activeMode) {
                        const modeId = activeMode.id;
                        switch(modeId) {
                            case 'classicMode':
                                currentOperand = item.result.toString();
                                shouldResetScreen = true;
                                updateDisplay();
                                break;
                            case 'scientificMode':
                                scientificCurrentOperand = item.result.toString();
                                scientificShouldResetScreen = true;
                                scientificUpdateDisplay();
                                break;
                            case 'programmerMode':
                                programmerCurrentOperand = item.result.toString(getBaseValue(currentBase)).toUpperCase();
                                programmerShouldResetScreen = true;
                                programmerUpdateDisplay();
                                updateBaseValues();
                                break;
                            case 'financeMode':
                                financeCurrentOperand = item.result.toString();
                                financeShouldResetScreen = true;
                                financeUpdateDisplay();
                                break;
                            default:
                                currentOperand = item.result.toString();
                                shouldResetScreen = true;
                                updateDisplay();
                        }
                    } else {
                        // Fallback vers la calculatrice classique
                        currentOperand = item.result.toString();
                        shouldResetScreen = true;
                        updateDisplay();
                    }
                    
                    // Fermer le panneau d'historique après sélection
                    closeHistory();
                } catch (error) {
                    console.error('Erreur sélection historique:', error);
                    showNotification('Erreur de chargement', 'error');
                }
            });
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur updateHistoryPanel:', error);
    }
}

function clearHistory() {
    try {
        history = [];
        updateHistoryPanel();
        showNotification('Historique effacé', 'success');
    } catch (error) {
        console.error('Erreur clearHistory:', error);
        showNotification('Erreur d\'effacement', 'error');
    }
}

function updateAllDisplays() {
    updateDisplay();
    scientificUpdateDisplay();
    programmerUpdateDisplay();
    financeUpdateDisplay();
    updateBaseValues();
}

// =============================================
// GESTION DES ERREURS ET NOTIFICATIONS
// =============================================

function showNotification(message, type = 'info') {
    try {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        // Couleurs selon le type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    } catch (error) {
        console.error('Erreur notification:', error);
    }
}

// =============================================
// SUPPORT CLAVIER AVEC GESTION D'ERREURS
// =============================================

function setupKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        try {
            // Ne prévenir le comportement par défaut que pour les touches que nous gérons
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                 '+', '-', '*', '/', '.', 'Enter', '=', 'Escape', 'Backspace'].includes(event.key)) {
                event.preventDefault();
            }
            
            // Chiffres
            if (event.key >= '0' && event.key <= '9') {
                appendNumber(event.key);
            }
            
            // Opérateurs
            switch(event.key) {
                case '+':
                    appendOperator('+');
                    break;
                case '-':
                    appendOperator('-');
                    break;
                case '*':
                    appendOperator('*');
                    break;
                case '/':
                    appendOperator('/');
                    break;
                case '.':
                    appendDecimal();
                    break;
                case 'Enter':
                case '=':
                    calculate();
                    break;
                case 'Escape':
                    clearAll();
                    break;
                case 'Backspace':
                    backspace();
                    break;
                case '%':
                    calculatePercent();
                    break;
            }
        } catch (error) {
            console.error('Erreur clavier:', error);
        }
    });
}

// =============================================
// PARAMÈTRES AVEC GESTION D'ERREURS
// =============================================

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('calculatorSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            
            // Appliquer les paramètres aux éléments UI
            document.getElementById('decimalPrecision').value = settings.decimalPrecision;
            document.getElementById('thousandsSeparator').checked = settings.thousandsSeparator;
            document.getElementById('themeSelector').value = settings.theme;
            
            applyTheme();
        }
    } catch (error) {
        console.error('Erreur chargement paramètres:', error);
        // Paramètres par défaut en cas d'erreur
        settings = {
            decimalPrecision: 2,
            thousandsSeparator: true,
            theme: 'auto'
        };
    }
}

function saveSettings() {
    try {
        localStorage.setItem('calculatorSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Erreur sauvegarde paramètres:', error);
        showNotification('Erreur de sauvegarde', 'error');
    }
}

function applyTheme() {
    try {
        if (settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.style.setProperty('--light', '#121212');
            document.documentElement.style.setProperty('--light-gray', '#1e1e1e');
            document.documentElement.style.setProperty('--card-bg', '#1e1e1e');
            document.documentElement.style.setProperty('--text', '#e0e0e0');
            document.documentElement.style.setProperty('--text-light', '#a0a0a0');
            document.documentElement.style.setProperty('--dark', '#2d2d2d');
            document.documentElement.style.setProperty('--darker', '#121212');
            document.documentElement.style.setProperty('--shadow', '0 10px 30px rgba(0, 0, 0, 0.3)');
            document.documentElement.style.setProperty('--shadow-hover', '0 15px 40px rgba(0, 0, 0, 0.4)');
        } else {
            // Réinitialiser aux valeurs par défaut
            document.documentElement.style.setProperty('--light', '#f8f9fa');
            document.documentElement.style.setProperty('--light-gray', '#e9ecef');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text', '#212529');
            document.documentElement.style.setProperty('--text-light', '#6c757d');
            document.documentElement.style.setProperty('--dark', '#1d3557');
            document.documentElement.style.setProperty('--darker', '#14213d');
            document.documentElement.style.setProperty('--shadow', '0 10px 30px rgba(0, 0, 0, 0.08)');
            document.documentElement.style.setProperty('--shadow-hover', '0 15px 40px rgba(0, 0, 0, 0.12)');
        }
    } catch (error) {
        console.error('Erreur application thème:', error);
    }
}

// =============================================
// CALCULATRICE CLASSIQUE (COMPLÈTE)
// =============================================

function appendNumber(number) {
    try {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        if (currentOperand === '0' || currentOperand === 'Erreur') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur appendNumber:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function appendDecimal() {
    try {
        if (shouldResetScreen) {
            currentOperand = '0';
            shouldResetScreen = false;
        }
        
        if (currentOperand === 'Erreur') {
            currentOperand = '0.';
        } else if (!currentOperand.includes('.')) {
            currentOperand += '.';
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur appendDecimal:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function appendOperator(op) {
    try {
        if (operation !== null && !shouldResetScreen) {
            calculate();
        }
        
        previousOperand = currentOperand;
        operation = op;
        shouldResetScreen = true;
        
        updateFormulaPreview();
    } catch (error) {
        console.error('Erreur appendOperator:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function calculate() {
    try {
        if (operation === null || shouldResetScreen) return;
        
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) {
            currentOperand = 'Erreur';
            updateDisplay();
            return;
        }
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    currentOperand = 'Erreur';
                    updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Ajouter à l'historique
        addToHistory(`${formatNumber(prev)} ${operation} ${formatNumber(current)} = ${formatNumber(computation)}`, computation);
        
        currentOperand = computation.toString();
        operation = null;
        previousOperand = '';
        shouldResetScreen = true;
        
        updateDisplay();
        updateFormulaPreview();
    } catch (error) {
        console.error('Erreur calculate:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
    updateFormulaPreview();
}

function clearEntry() {
    currentOperand = '0';
    shouldResetScreen = false;
    updateDisplay();
}

function backspace() {
    try {
        if (currentOperand === 'Erreur') {
            clearAll();
            return;
        }
        
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur backspace:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function toggleSign() {
    try {
        if (currentOperand === 'Erreur') return;
        
        if (currentOperand.startsWith('-')) {
            currentOperand = currentOperand.slice(1);
        } else {
            currentOperand = '-' + currentOperand;
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur toggleSign:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

// Fonctions spéciales
function calculatePercent() {
    try {
        if (currentOperand === 'Erreur') return;
        
        const value = parseFloat(currentOperand);
        if (isNaN(value)) return;
        
        currentOperand = (value / 100).toString();
        updateDisplay();
    } catch (error) {
        console.error('Erreur calculatePercent:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function calculateSquareRoot() {
    try {
        if (currentOperand === 'Erreur') return;
        
        const value = parseFloat(currentOperand);
        if (isNaN(value) || value < 0) {
            currentOperand = 'Erreur';
        } else {
            currentOperand = Math.sqrt(value).toString();
            addToHistory(`√${formatNumber(value)} = ${formatNumber(parseFloat(currentOperand))}`, parseFloat(currentOperand));
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur calculateSquareRoot:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

function calculateReciprocal() {
    try {
        if (currentOperand === 'Erreur') return;
        
        const value = parseFloat(currentOperand);
        if (isNaN(value) || value === 0) {
            currentOperand = 'Erreur';
        } else {
            currentOperand = (1 / value).toString();
            addToHistory(`1/${formatNumber(value)} = ${formatNumber(parseFloat(currentOperand))}`, parseFloat(currentOperand));
        }
        
        updateDisplay();
    } catch (error) {
        console.error('Erreur calculateReciprocal:', error);
        currentOperand = 'Erreur';
        updateDisplay();
    }
}

// Fonctions mémoire
function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
}

function memoryRecall() {
    currentOperand = memory.toString();
    shouldResetScreen = true;
    updateDisplay();
}

function memoryAdd() {
    try {
        const value = parseFloat(currentOperand);
        if (!isNaN(value)) {
            memory += value;
            updateMemoryIndicator();
        }
    } catch (error) {
        console.error('Erreur memoryAdd:', error);
    }
}

function memorySubtract() {
    try {
        const value = parseFloat(currentOperand);
        if (!isNaN(value)) {
            memory -= value;
            updateMemoryIndicator();
        }
    } catch (error) {
        console.error('Erreur memorySubtract:', error);
    }
}

function memoryStore() {
    try {
        const value = parseFloat(currentOperand);
        if (!isNaN(value)) {
            memory = value;
            updateMemoryIndicator();
        }
    } catch (error) {
        console.error('Erreur memoryStore:', error);
    }
}

function updateMemoryIndicator() {
    if (memory !== 0) {
        memoryIndicator.classList.remove('hidden');
        memoryValueElement.textContent = formatNumber(memory);
    } else {
        memoryIndicator.classList.add('hidden');
    }
}

// Affichage
function updateDisplay() {
    try {
        if (currentOperandElement) {
            currentOperandElement.textContent = formatNumber(currentOperand);
        }
    } catch (error) {
        console.error('Erreur updateDisplay:', error);
        if (currentOperandElement) {
            currentOperandElement.textContent = 'Erreur';
        }
    }
}

function updateFormulaPreview() {
    try {
        if (formulaPreviewElement) {
            if (operation !== null && previousOperand !== '') {
                formulaPreviewElement.textContent = `${formatNumber(previousOperand)} ${operation}`;
            } else {
                formulaPreviewElement.textContent = '';
            }
        }
    } catch (error) {
        console.error('Erreur updateFormulaPreview:', error);
        if (formulaPreviewElement) {
            formulaPreviewElement.textContent = '';
        }
    }
}

// =============================================
// CALCULATRICE SCIENTIFIQUE (COMPLÈTE)
// =============================================

function scientificAppendNumber(number) {
    try {
        if (scientificShouldResetScreen) {
            scientificCurrentOperand = '';
            scientificShouldResetScreen = false;
        }
        
        if (scientificCurrentOperand === '0' || scientificCurrentOperand === 'Erreur') {
            scientificCurrentOperand = number;
        } else {
            scientificCurrentOperand += number;
        }
        
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificAppendNumber:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificAppendDecimal() {
    try {
        if (scientificShouldResetScreen) {
            scientificCurrentOperand = '0';
            scientificShouldResetScreen = false;
        }
        
        if (scientificCurrentOperand === 'Erreur') {
            scientificCurrentOperand = '0.';
        } else if (!scientificCurrentOperand.includes('.')) {
            scientificCurrentOperand += '.';
        }
        
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificAppendDecimal:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificAppendOperator(op) {
    try {
        if (scientificOperation !== null && !scientificShouldResetScreen) {
            scientificCalculate();
        }
        
        scientificPreviousOperand = scientificCurrentOperand;
        scientificOperation = op;
        scientificShouldResetScreen = true;
        
        scientificUpdateFormulaPreview();
    } catch (error) {
        console.error('Erreur scientificAppendOperator:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificCalculate() {
    try {
        if (scientificOperation === null || scientificShouldResetScreen) return;
        
        let computation;
        const prev = parseFloat(scientificPreviousOperand);
        const current = parseFloat(scientificCurrentOperand);
        
        if (isNaN(prev) || isNaN(current)) {
            scientificCurrentOperand = 'Erreur';
            scientificUpdateDisplay();
            return;
        }
        
        switch (scientificOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    scientificCurrentOperand = 'Erreur';
                    scientificUpdateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Ajouter à l'historique
        addToHistory(`${formatNumber(prev)} ${scientificOperation} ${formatNumber(current)} = ${formatNumber(computation)}`, computation);
        
        scientificCurrentOperand = computation.toString();
        scientificOperation = null;
        scientificPreviousOperand = '';
        scientificShouldResetScreen = true;
        
        scientificUpdateDisplay();
        scientificUpdateFormulaPreview();
    } catch (error) {
        console.error('Erreur scientificCalculate:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificClearAll() {
    scientificCurrentOperand = '0';
    scientificPreviousOperand = '';
    scientificOperation = null;
    scientificShouldResetScreen = false;
    scientificUpdateDisplay();
    scientificUpdateFormulaPreview();
}

function scientificClearEntry() {
    scientificCurrentOperand = '0';
    scientificShouldResetScreen = false;
    scientificUpdateDisplay();
}

function scientificBackspace() {
    try {
        if (scientificCurrentOperand === 'Erreur') {
            scientificClearAll();
            return;
        }
        
        if (scientificCurrentOperand.length === 1 || (scientificCurrentOperand.length === 2 && scientificCurrentOperand.startsWith('-'))) {
            scientificCurrentOperand = '0';
        } else {
            scientificCurrentOperand = scientificCurrentOperand.slice(0, -1);
        }
        
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificBackspace:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificToggleSign() {
    try {
        if (scientificCurrentOperand === 'Erreur') return;
        
        if (scientificCurrentOperand.startsWith('-')) {
            scientificCurrentOperand = scientificCurrentOperand.slice(1);
        } else {
            scientificCurrentOperand = '-' + scientificCurrentOperand;
        }
        
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificToggleSign:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificFunction(func) {
    try {
        const value = parseFloat(scientificCurrentOperand);
        if (isNaN(value) && func !== '(' && func !== ')') {
            scientificCurrentOperand = 'Erreur';
            scientificUpdateDisplay();
            return;
        }
        
        let result;
        let radiansValue = angleUnit === 'DEG' ? value * Math.PI / 180 : value;
        
        switch(func) {
            case 'sin':
                result = Math.sin(radiansValue);
                break;
            case 'cos':
                result = Math.cos(radiansValue);
                break;
            case 'tan':
                result = Math.tan(radiansValue);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'x²':
                result = Math.pow(value, 2);
                break;
            case 'x³':
                result = Math.pow(value, 3);
                break;
            case 'xʸ':
                scientificPreviousOperand = scientificCurrentOperand;
                scientificOperation = '^';
                scientificShouldResetScreen = true;
                scientificUpdateFormulaPreview();
                return;
            case '√':
                result = Math.sqrt(value);
                break;
            case '∛':
                result = Math.cbrt(value);
                break;
            case '10ˣ':
                result = Math.pow(10, value);
                break;
            case 'eˣ':
                result = Math.exp(value);
                break;
            case '!':
                result = factorial(value);
                break;
            case '(':
                scientificCurrentOperand += '(';
                scientificShouldResetScreen = false;
                break;
            case ')':
                scientificCurrentOperand += ')';
                scientificShouldResetScreen = false;
                break;
            case '%':
                result = value / 100;
                break;
            default:
                return;
        }
        
        if (func !== '(' && func !== ')') {
            scientificCurrentOperand = result.toString();
            scientificShouldResetScreen = true;
            // Ajouter à l'historique pour les fonctions spéciales
            if (['sin', 'cos', 'tan', 'log', 'ln', 'x²', 'x³', '√', '∛', '10ˣ', 'eˣ', '!'].includes(func)) {
                addToHistory(`${func}(${formatNumber(value)}) = ${formatNumber(result)}`, result);
            }
        }
        
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificFunction:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function scientificConstant(constant) {
    try {
        switch(constant) {
            case 'π':
                scientificCurrentOperand = Math.PI.toString();
                break;
            case 'e':
                scientificCurrentOperand = Math.E.toString();
                break;
        }
        scientificShouldResetScreen = true;
        scientificUpdateDisplay();
    } catch (error) {
        console.error('Erreur scientificConstant:', error);
        scientificCurrentOperand = 'Erreur';
        scientificUpdateDisplay();
    }
}

function toggleAngleUnit() {
    angleUnit = angleUnit === 'DEG' ? 'RAD' : 'DEG';
    if (angleUnitBtn) {
        angleUnitBtn.textContent = angleUnit;
    }
    showNotification(`Unité d'angle: ${angleUnit}`, 'info');
}

function factorial(n) {
    try {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity; // Limite pour éviter les overflow
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    } catch (error) {
        console.error('Erreur factorial:', error);
        return NaN;
    }
}

function scientificUpdateDisplay() {
    try {
        if (scientificCurrentOperandElement) {
            scientificCurrentOperandElement.textContent = formatNumber(scientificCurrentOperand);
        }
    } catch (error) {
        console.error('Erreur scientificUpdateDisplay:', error);
        if (scientificCurrentOperandElement) {
            scientificCurrentOperandElement.textContent = 'Erreur';
        }
    }
}

function scientificUpdateFormulaPreview() {
    try {
        if (scientificFormulaPreviewElement) {
            if (scientificOperation !== null && scientificPreviousOperand !== '') {
                scientificFormulaPreviewElement.textContent = `${formatNumber(scientificPreviousOperand)} ${scientificOperation}`;
            } else {
                scientificFormulaPreviewElement.textContent = '';
            }
        }
    } catch (error) {
        console.error('Erreur scientificUpdateFormulaPreview:', error);
        if (scientificFormulaPreviewElement) {
            scientificFormulaPreviewElement.textContent = '';
        }
    }
}

// =============================================
// CALCULATRICE PROGRAMMEUR (COMPLÈTE)
// =============================================

function programmerAppendNumber(number) {
    try {
        if (programmerShouldResetScreen) {
            programmerCurrentOperand = '';
            programmerShouldResetScreen = false;
        }
        
        // Vérifier si le chiffre est valide pour la base actuelle
        if (!isValidForBase(number, currentBase)) {
            return;
        }
        
        if (programmerCurrentOperand === '0' || programmerCurrentOperand === 'Erreur') {
            programmerCurrentOperand = number;
        } else {
            programmerCurrentOperand += number;
        }
        
        programmerUpdateDisplay();
        updateBaseValues();
    } catch (error) {
        console.error('Erreur programmerAppendNumber:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function isValidForBase(number, base) {
    const validChars = {
        'BIN': ['0', '1'],
        'OCT': ['0', '1', '2', '3', '4', '5', '6', '7'],
        'DEC': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'HEX': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    };
    
    return validChars[base].includes(number.toUpperCase());
}

function programmerAppendOperator(op) {
    try {
        if (programmerOperation !== null && !programmerShouldResetScreen) {
            programmerCalculate();
        }
        
        programmerPreviousOperand = programmerCurrentOperand;
        programmerOperation = op;
        programmerShouldResetScreen = true;
        
        programmerUpdateDisplay();
    } catch (error) {
        console.error('Erreur programmerAppendOperator:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function programmerCalculate() {
    try {
        if (programmerOperation === null || programmerShouldResetScreen) return;
        
        let computation;
        const prev = parseInt(programmerPreviousOperand, getBaseValue(currentBase));
        const current = parseInt(programmerCurrentOperand, getBaseValue(currentBase));
        
        if (isNaN(prev) || isNaN(current)) {
            programmerCurrentOperand = 'Erreur';
            programmerUpdateDisplay();
            return;
        }
        
        switch (programmerOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    programmerCurrentOperand = 'Erreur';
                    programmerUpdateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '&':
                computation = prev & current;
                break;
            case '|':
                computation = prev | current;
                break;
            case '^':
                computation = prev ^ current;
                break;
            case '<<':
                computation = prev << current;
                break;
            case '>>':
                computation = prev >> current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        // Ajouter à l'historique
        const prevFormatted = prev.toString(getBaseValue(currentBase)).toUpperCase();
        const currentFormatted = current.toString(getBaseValue(currentBase)).toUpperCase();
        const resultFormatted = computation.toString(getBaseValue(currentBase)).toUpperCase();
        addToHistory(`${prevFormatted} ${programmerOperation} ${currentFormatted} = ${resultFormatted}`, computation);
        
        programmerCurrentOperand = computation.toString(getBaseValue(currentBase)).toUpperCase();
        programmerOperation = null;
        programmerPreviousOperand = '';
        programmerShouldResetScreen = true;
        
        programmerUpdateDisplay();
        updateBaseValues();
    } catch (error) {
        console.error('Erreur programmerCalculate:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function programmerFunction(func) {
    try {
        const value = parseInt(programmerCurrentOperand, getBaseValue(currentBase));
        if (isNaN(value)) {
            programmerCurrentOperand = 'Erreur';
            programmerUpdateDisplay();
            return;
        }
        
        let result;
        
        switch(func) {
            case 'AND':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '&';
                programmerShouldResetScreen = true;
                return;
            case 'OR':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '|';
                programmerShouldResetScreen = true;
                return;
            case 'XOR':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '^';
                programmerShouldResetScreen = true;
                return;
            case 'NOT':
                result = ~value;
                break;
            case '<<':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '<<';
                programmerShouldResetScreen = true;
                return;
            case '>>':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '>>';
                programmerShouldResetScreen = true;
                return;
            case 'MOD':
                programmerPreviousOperand = programmerCurrentOperand;
                programmerOperation = '%';
                programmerShouldResetScreen = true;
                return;
            case 'ROL':
                result = (value << 1) | (value >>> 31);
                break;
            case 'ROR':
                result = (value >>> 1) | (value << 31);
                break;
            case '~':
                result = ~value;
                break;
            default:
                return;
        }
        
        programmerCurrentOperand = result.toString(getBaseValue(currentBase)).toUpperCase();
        programmerShouldResetScreen = true;
        
        // Ajouter à l'historique pour les fonctions unaires
        if (['NOT', 'ROL', 'ROR', '~'].includes(func)) {
            const valueFormatted = value.toString(getBaseValue(currentBase)).toUpperCase();
            const resultFormatted = result.toString(getBaseValue(currentBase)).toUpperCase();
            addToHistory(`${func}(${valueFormatted}) = ${resultFormatted}`, result);
        }
        
        programmerUpdateDisplay();
        updateBaseValues();
    } catch (error) {
        console.error('Erreur programmerFunction:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function programmerClearAll() {
    programmerCurrentOperand = '0';
    programmerPreviousOperand = '';
    programmerOperation = null;
    programmerShouldResetScreen = false;
    programmerUpdateDisplay();
    updateBaseValues();
}

function programmerClearEntry() {
    programmerCurrentOperand = '0';
    programmerShouldResetScreen = false;
    programmerUpdateDisplay();
    updateBaseValues();
}

function programmerBackspace() {
    try {
        if (programmerCurrentOperand === 'Erreur') {
            programmerClearAll();
            return;
        }
        
        if (programmerCurrentOperand.length === 1) {
            programmerCurrentOperand = '0';
        } else {
            programmerCurrentOperand = programmerCurrentOperand.slice(0, -1);
        }
        
        programmerUpdateDisplay();
        updateBaseValues();
    } catch (error) {
        console.error('Erreur programmerBackspace:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function programmerToggleSign() {
    try {
        if (programmerCurrentOperand === 'Erreur') return;
        
        const value = parseInt(programmerCurrentOperand, getBaseValue(currentBase));
        programmerCurrentOperand = (-value).toString(getBaseValue(currentBase)).toUpperCase();
        programmerUpdateDisplay();
        updateBaseValues();
    } catch (error) {
        console.error('Erreur programmerToggleSign:', error);
        programmerCurrentOperand = 'Erreur';
        programmerUpdateDisplay();
    }
}

function setBase(base) {
    try {
        currentBase = base;
        // Convertir la valeur actuelle vers la nouvelle base
        const value = parseInt(programmerCurrentOperand, getBaseValue(currentBase));
        if (!isNaN(value)) {
            programmerCurrentOperand = value.toString(getBaseValue(base)).toUpperCase();
        }
        programmerUpdateDisplay();
        updateBaseValues();
        showNotification(`Base: ${base}`, 'info');
    } catch (error) {
        console.error('Erreur setBase:', error);
        showNotification('Erreur changement de base', 'error');
    }
}

function getBaseValue(base) {
    switch(base) {
        case 'BIN': return 2;
        case 'OCT': return 8;
        case 'DEC': return 10;
        case 'HEX': return 16;
        default: return 10;
    }
}

function updateBaseValues() {
    try {
        const value = parseInt(programmerCurrentOperand, getBaseValue(currentBase));
        if (isNaN(value)) {
            if (hexValueElement) hexValueElement.textContent = '0';
            if (decValueElement) decValueElement.textContent = '0';
            if (octValueElement) octValueElement.textContent = '0';
            if (binValueElement) binValueElement.textContent = '0';
            return;
        }
        
        if (hexValueElement) hexValueElement.textContent = value.toString(16).toUpperCase();
        if (decValueElement) decValueElement.textContent = value.toString(10);
        if (octValueElement) octValueElement.textContent = value.toString(8);
        if (binValueElement) binValueElement.textContent = value.toString(2);
    } catch (error) {
        console.error('Erreur updateBaseValues:', error);
        if (hexValueElement) hexValueElement.textContent = 'Erreur';
        if (decValueElement) decValueElement.textContent = 'Erreur';
        if (octValueElement) octValueElement.textContent = 'Erreur';
        if (binValueElement) binValueElement.textContent = 'Erreur';
    }
}

function programmerUpdateDisplay() {
    try {
        if (programmerCurrentOperandElement) {
            programmerCurrentOperandElement.textContent = programmerCurrentOperand;
        }
    } catch (error) {
        console.error('Erreur programmerUpdateDisplay:', error);
        if (programmerCurrentOperandElement) {
            programmerCurrentOperandElement.textContent = 'Erreur';
        }
    }
}

// =============================================
// CALCULATRICE FINANCIÈRE (COMPLÈTE)
// =============================================

function financeAppendNumber(number) {
    try {
        if (financeShouldResetScreen) {
            financeCurrentOperand = '';
            financeShouldResetScreen = false;
        }
        
        if (financeCurrentOperand === '0' || financeCurrentOperand === 'Erreur') {
            financeCurrentOperand = number;
        } else {
            financeCurrentOperand += number;
        }
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeAppendNumber:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeAppendDecimal() {
    try {
        if (financeShouldResetScreen) {
            financeCurrentOperand = '0';
            financeShouldResetScreen = false;
        }
        
        if (financeCurrentOperand === 'Erreur') {
            financeCurrentOperand = '0.';
        } else if (!financeCurrentOperand.includes('.')) {
            financeCurrentOperand += '.';
        }
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeAppendDecimal:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeAppendOperator(op) {
    try {
        if (financeOperation !== null && !financeShouldResetScreen) {
            financeCalculate();
        }
        
        financePreviousOperand = financeCurrentOperand;
        financeOperation = op;
        financeShouldResetScreen = true;
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeAppendOperator:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeCalculate() {
    try {
        if (financeOperation === null || financeShouldResetScreen) return;
        
        let computation;
        const prev = parseFloat(financePreviousOperand);
        const current = parseFloat(financeCurrentOperand);
        
        if (isNaN(prev) || isNaN(current)) {
            financeCurrentOperand = 'Erreur';
            financeUpdateDisplay();
            return;
        }
        
        switch (financeOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    financeCurrentOperand = 'Erreur';
                    financeUpdateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Ajouter à l'historique
        addToHistory(`${formatNumber(prev)} ${financeOperation} ${formatNumber(current)} = ${formatNumber(computation)}`, computation);
        
        financeCurrentOperand = computation.toString();
        financeOperation = null;
        financePreviousOperand = '';
        financeShouldResetScreen = true;
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeCalculate:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeFunction(func) {
    try {
        const value = parseFloat(financeCurrentOperand);
        if (isNaN(value)) {
            financeCurrentOperand = 'Erreur';
            financeUpdateDisplay();
            return;
        }
        
        let result;
        
        switch(func) {
            case 'PV':
                financeValues.PV = value;
                if (pvValueElement) pvValueElement.textContent = formatNumber(value);
                showNotification('Valeur présente définie', 'success');
                break;
            case 'FV':
                financeValues.FV = value;
                if (fvValueElement) fvValueElement.textContent = formatNumber(value);
                showNotification('Valeur future définie', 'success');
                break;
            case 'PMT':
                financeValues.PMT = value;
                if (pmtValueElement) pmtValueElement.textContent = formatNumber(value);
                showNotification('Paiement défini', 'success');
                break;
            case 'N':
                financeValues.N = value;
                showNotification('Nombre de périodes défini', 'success');
                break;
            case 'I/Y':
                financeValues.IY = value;
                showNotification('Taux d\'intérêt défini', 'success');
                break;
            case 'IRR':
                // Calcul simplifié du taux de rendement interne
                result = value * 0.1; // Approximation
                break;
            case 'NPV':
                // Valeur actuelle nette simplifiée
                result = value / (1 + (financeValues.IY / 100));
                break;
            case 'AMORT':
                // Calcul d'amortissement simplifié
                result = financeValues.PV / financeValues.N;
                break;
            case '%T':
                // Pourcentage du total
                result = (value / financeValues.PV) * 100;
                break;
            case 'Δ%':
                // Variation en pourcentage
                result = ((value - financeValues.PV) / financeValues.PV) * 100;
                break;
            case 'Σ':
                // Somme
                result = financeValues.PV + financeValues.FV + financeValues.PMT;
                break;
            case 'COST':
                // Coût
                result = financeValues.PV;
                break;
            case 'SELL':
                // Prix de vente
                result = financeValues.PV * 1.2; // Marge de 20%
                break;
            case 'MARGIN':
                // Marge
                result = ((financeValues.FV - financeValues.PV) / financeValues.FV) * 100;
                break;
            case 'DAYS':
                // Calcul de jours entre dates (simplifié)
                result = value * 30; // Approximation
                break;
            case 'DB':
                // Amortissement dégressif
                result = financeValues.PV * (financeValues.IY / 100);
                break;
            case 'SLN':
                // Amortissement linéaire
                result = (financeValues.PV - financeValues.FV) / financeValues.N;
                break;
            case 'SYD':
                // Amortissement dégressif sur somme des digits
                const sumOfYears = (financeValues.N * (financeValues.N + 1)) / 2;
                result = (financeValues.PV - financeValues.FV) * (financeValues.N / sumOfYears);
                break;
            case '%':
                result = value / 100;
                break;
            default:
                return;
        }
        
        if (func !== 'PV' && func !== 'FV' && func !== 'PMT' && func !== 'N' && func !== 'I/Y') {
            financeCurrentOperand = result.toString();
            financeShouldResetScreen = true;
            
            // Ajouter à l'historique pour les fonctions financières
            addToHistory(`${func}(${formatNumber(value)}) = ${formatNumber(result)}`, result);
        }
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeFunction:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeClearAll() {
    financeCurrentOperand = '0';
    financePreviousOperand = '';
    financeOperation = null;
    financeShouldResetScreen = false;
    financeValues = { PV: 0, FV: 0, PMT: 0, N: 0, IY: 0 };
    if (pvValueElement) pvValueElement.textContent = '0';
    if (fvValueElement) fvValueElement.textContent = '0';
    if (pmtValueElement) pmtValueElement.textContent = '0';
    financeUpdateDisplay();
    showNotification('Calculatrice financière réinitialisée', 'info');
}

function financeClearEntry() {
    financeCurrentOperand = '0';
    financeShouldResetScreen = false;
    financeUpdateDisplay();
}

function financeBackspace() {
    try {
        if (financeCurrentOperand === 'Erreur') {
            financeClearAll();
            return;
        }
        
        if (financeCurrentOperand.length === 1 || (financeCurrentOperand.length === 2 && financeCurrentOperand.startsWith('-'))) {
            financeCurrentOperand = '0';
        } else {
            financeCurrentOperand = financeCurrentOperand.slice(0, -1);
        }
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeBackspace:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeToggleSign() {
    try {
        if (financeCurrentOperand === 'Erreur') return;
        
        if (financeCurrentOperand.startsWith('-')) {
            financeCurrentOperand = financeCurrentOperand.slice(1);
        } else {
            financeCurrentOperand = '-' + financeCurrentOperand;
        }
        
        financeUpdateDisplay();
    } catch (error) {
        console.error('Erreur financeToggleSign:', error);
        financeCurrentOperand = 'Erreur';
        financeUpdateDisplay();
    }
}

function financeUpdateDisplay() {
    try {
        if (financeCurrentOperandElement) {
            financeCurrentOperandElement.textContent = formatNumber(financeCurrentOperand);
        }
    } catch (error) {
        console.error('Erreur financeUpdateDisplay:', error);
        if (financeCurrentOperandElement) {
            financeCurrentOperandElement.textContent = 'Erreur';
        }
    }
}

// =============================================
// FONCTIONS DES CONVERTISSEURS ET OUTILS
// =============================================

function showCalculator() {
    // Afficher la section calculatrice
    document.getElementById('mainContent').classList.add('active');
    document.getElementById('features').classList.remove('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-target="mainContent"]').classList.add('active');
}

function showConverter() {
    // Afficher l'onglet convertisseur
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="converter"]').classList.add('active');
    document.querySelectorAll('.calculator-mode').forEach(m => m.classList.remove('active'));
    document.getElementById('converterMode').classList.add('active');
}

function showDeveloperTools() {
    // Afficher l'onglet convertisseur avec les outils développeur
    showConverter();
    document.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-converter="developer"]').classList.add('active');
    document.querySelectorAll('.converter-section').forEach(s => s.classList.remove('active'));
    document.getElementById('developerConverter').classList.add('active');
}

function showNotes() {
    // Afficher la section notes
    document.getElementById('mainContent').classList.add('active');
    document.getElementById('features').classList.remove('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-target="mainContent"]').classList.add('active');
}

function convertUnits() {
    try {
        const value = parseFloat(document.getElementById('unit-value').value);
        const fromUnit = document.getElementById('unit-from').value;
        const toUnit = document.getElementById('unit-to').value;
        
        if (isNaN(value)) {
            showNotification('Veuillez entrer une valeur valide', 'error');
            return;
        }
        
        // Facteurs de conversion (simplifiés)
        const conversionFactors = {
            m: 1,
            km: 0.001,
            ft: 3.28084,
            in: 39.3701,
            cm: 100
        };
        
        const result = value * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
        document.getElementById('unit-result').value = formatNumber(result);
        
        addToHistory(`Conversion: ${value} ${fromUnit} = ${formatNumber(result)} ${toUnit}`, result);
        
    } catch (error) {
        console.error('Erreur conversion unités:', error);
        showNotification('Erreur de conversion', 'error');
    }
}

function convertCurrency() {
    try {
        const amount = parseFloat(document.getElementById('currency-amount').value);
        const fromCurrency = document.getElementById('currency-from').value;
        const toCurrency = document.getElementById('currency-to').value;
        
        if (isNaN(amount)) {
            showNotification('Veuillez entrer un montant valide', 'error');
            return;
        }
        
        // Taux de change fictifs (en conditions réelles, utiliser une API)
        const exchangeRates = {
            USD: { EUR: 0.85, GBP: 0.73, JPY: 110.5, CAD: 1.25 },
            EUR: { USD: 1.18, GBP: 0.86, JPY: 130.0, CAD: 1.47 },
            GBP: { USD: 1.37, EUR: 1.16, JPY: 151.0, CAD: 1.71 },
            JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.011 },
            CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 90.9 }
        };
        
        let result;
        if (fromCurrency === toCurrency) {
            result = amount;
        } else {
            result = amount * exchangeRates[fromCurrency][toCurrency];
        }
        
        document.getElementById('currency-result').value = formatNumber(result);
        
        addToHistory(`Conversion: ${amount} ${fromCurrency} = ${formatNumber(result)} ${toCurrency}`, result);
        
    } catch (error) {
        console.error('Erreur conversion devise:', error);
        showNotification('Erreur de conversion', 'error');
    }
}

function generateHash(type) {
    try {
        const input = prompt(`Entrez le texte à hasher en ${type}:`);
        if (!input) return;
        
        let hash;
        switch(type) {
            case 'MD5':
                // Simulation de hash MD5 (en production, utiliser une bibliothèque)
                hash = 'md5_' + btoa(input).substring(0, 10);
                break;
            case 'SHA1':
                // Simulation de hash SHA1
                hash = 'sha1_' + btoa(input).substring(0, 15);
                break;
        }
        
        showNotification(`Hash ${type} généré: ${hash}`, 'success');
        addToHistory(`Hash ${type}("${input}")`, hash);
        
    } catch (error) {
        console.error('Erreur génération hash:', error);
        showNotification('Erreur de génération', 'error');
    }
}

function formatJSON() {
    try {
        const input = prompt('Collez votre JSON à formater:');
        if (!input) return;
        
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        
        alert('JSON formaté:\n\n' + formatted);
        addToHistory('JSON formaté', 'Succès');
        
    } catch (error) {
        console.error('Erreur formatage JSON:', error);
        showNotification('JSON invalide', 'error');
    }
}

function base64Encode() {
    try {
        const input = prompt('Entrez le texte à encoder en Base64:');
        if (!input) return;
        
        const encoded = btoa(input);
        alert('Base64 encodé:\n\n' + encoded);
        addToHistory('Base64 encode', 'Succès');
        
    } catch (error) {
        console.error('Erreur encodage Base64:', error);
        showNotification('Erreur d\'encodage', 'error');
    }
}

function saveCalculation() {
    try {
        const data = {
            history: history,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('calculatorBackup', JSON.stringify(data));
        showNotification('Calculs sauvegardés avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
        showNotification('Erreur de sauvegarde', 'error');
    }
}

function loadCalculation() {
    try {
        const saved = localStorage.getItem('calculatorBackup');
        if (!saved) {
            showNotification('Aucune sauvegarde trouvée', 'warning');
            return;
        }
        
        const data = JSON.parse(saved);
        history = data.history || [];
        document.getElementById('notes').value = data.notes || '';
        
        updateHistoryPanel();
        showNotification('Calculs chargés avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur chargement:', error);
        showNotification('Erreur de chargement', 'error');
    }
}

function printCalculation() {
    try {
        window.print();
    } catch (error) {
        console.error('Erreur impression:', error);
        showNotification('Erreur d\'impression', 'error');
    }
}

// =============================================
// INITIALISATION FINALE
// =============================================

// Réinitialiser toutes les calculatrices au chargement
function resetAllCalculators() {
    // Calculatrice classique
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    
    // Calculatrice scientifique
    scientificCurrentOperand = '0';
    scientificPreviousOperand = '';
    scientificOperation = null;
    scientificShouldResetScreen = false;
    angleUnit = 'DEG';
    
    // Calculatrice programmeur
    programmerCurrentOperand = '0';
    programmerPreviousOperand = '';
    programmerOperation = null;
    programmerShouldResetScreen = false;
    currentBase = 'DEC';
    
    // Calculatrice financière
    financeCurrentOperand = '0';
    financePreviousOperand = '';
    financeOperation = null;
    financeShouldResetScreen = false;
    
    // Mettre à jour tous les affichages
    updateDisplay();
    scientificUpdateDisplay();
    programmerUpdateDisplay();
    financeUpdateDisplay();
    updateBaseValues();
}

// Appeler l'initialisation finale
setTimeout(() => {
    resetAllCalculators();
    console.log('✅ Toutes les calculatrices sont initialisées et prêtes pour mobile');
}, 100);

console.log('✅ JavaScript calculatrice chargé avec toutes les corrections');