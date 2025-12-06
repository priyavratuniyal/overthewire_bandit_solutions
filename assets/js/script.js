// === Configuration ===
const NOTES_FILE = 'content/Level_Notes.md';

// === State ===
let levels = [];
let currentLevelIndex = -1;
let unlockedLevels = new Set();
let pendingLevelIndex = -1;

function isMobileView() {
    const widthMatch = window.matchMedia('(max-width: 768px)').matches || window.innerWidth <= 768;
    const touchCapable = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const mobileAgent = /android|iphone|ipad|ipod|mobile/i.test(ua);
    return widthMatch || (touchCapable && mobileAgent);
}

window.closeLockOverlay = closeLockOverlay;

function closeLockOverlay() {
    const overlay = document.querySelector('.content-overlay');
    if (!overlay) return;
    overlay.remove();

    if (isMobileView()) {
        const fallbackIndex = getLastUnlockedIndex();
        if (fallbackIndex !== currentLevelIndex) {
            loadLevel(fallbackIndex);
        }
        return;
    }

    const targetIndex = currentLevelIndex > 0 ? currentLevelIndex - 1 : 0;
    if (targetIndex !== currentLevelIndex) {
        loadLevel(targetIndex);
    }
}

function getLastUnlockedIndex() {
    if (!levels.length) return 0;
    if (!unlockedLevels || unlockedLevels.size === 0) {
        return 0;
    }
    return Math.max(...unlockedLevels);
}

// === Parse Markdown into Levels ===
function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    const parsedLevels = [];
    let currentLevel = null;
    let currentContent = [];

    for (const line of lines) {
        if (line.startsWith('## Level')) {
            // Save previous level
            if (currentLevel) {
                currentLevel.content = currentContent.join('\n');
                parsedLevels.push(currentLevel);
            }
            
            // Start new level and format the title
            let title = line.replace('##', '').trim();
            // Replace ---> with styled arrow
            title = title.replace(/--->/g, '→');
            // Also replace other common arrow patterns
            title = title.replace(/-->/g, '→');
            title = title.replace(/->/g, '→');
            
            currentLevel = {
                title: title,
                id: title.toLowerCase().replace(/[^\w]+/g, '-'),
                content: ''
            };
            currentContent = [];
        } else if (currentLevel) {
            currentContent.push(line);
        }
    }

    // Save last level
    if (currentLevel) {
        currentLevel.content = currentContent.join('\n');
        parsedLevels.push(currentLevel);
    }

    return parsedLevels;
}

// === Generate TOC ===
function generateTOC(levels) {
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = '';

    levels.forEach((level, index) => {
        const item = document.createElement('div');
        item.className = 'toc-item';
        item.setAttribute('data-index', index);
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        
        // Check if level is locked (Level 0 is always unlocked)
        const isLocked = index > 0 && !unlockedLevels.has(index);
        if (isLocked) {
            item.classList.add('locked');
        }
        
        const title = document.createElement('div');
        title.className = 'toc-item-title';
        title.textContent = level.title;
        
        // Add lock icon for locked levels
        if (isLocked) {
            const lockIcon = document.createElement('span');
            lockIcon.className = 'lock-icon';
            lockIcon.textContent = '🔒';
            lockIcon.setAttribute('aria-label', 'Locked');
            title.appendChild(lockIcon);
        }
        
        item.appendChild(title);
        
        // Only add summary for unlocked levels
        if (!isLocked) {
            const summary = document.createElement('div');
            summary.className = 'toc-item-summary';
            // Extract first line as summary
            const firstLine = level.content.trim().split('\n')[0];
            summary.textContent = firstLine.substring(0, 60) + (firstLine.length > 60 ? '...' : '');
            item.appendChild(summary);
        }
        
        item.addEventListener('click', () => loadLevel(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') loadLevel(index);
        });
        
        tocList.appendChild(item);
    });
}

// === Load Level ===
function loadLevel(index) {
    if (index < 0 || index >= levels.length) return;
    
    currentLevelIndex = index;
    const level = levels[index];
    const isLocked = index > 0 && !unlockedLevels.has(index);
    
    // Update active state
    document.querySelectorAll('.toc-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Render content with marked.js
    const contentDiv = document.getElementById('content');
    const html = marked.parse(level.content);
    
    // Wrap in level container
    contentDiv.innerHTML = `
        <div class="level-content ${isLocked ? 'content-locked' : ''}">
            <h1>${level.title}</h1>
            <div class="level-meta">
                <span class="level-badge">OverTheWire</span>
                ${unlockedLevels.has(index) ? '<span class="level-badge" style="border-color: #34c759; color: #34c759;">Completed</span>' : ''}
            </div>
            ${html}
        </div>
        ${isLocked ? `
            <div class="content-overlay">
                <div class="unlock-prompt">
                    <button class="overlay-close" onclick="closeLockOverlay()" aria-label="Close locked banner">×</button>
                    <div class="unlock-icon">🔒</div>
                    <h2>Level Locked</h2>
                    <p>This level is locked. Please confirm you've attempted the previous level to view this content.</p>
                    <button class="unlock-btn" onclick="showConsentModal(${index})">Unlock Level</button>
                </div>
            </div>
        ` : ''}
    `;
    
    // Add copy buttons to code blocks if unlocked
    if (!isLocked) {
        addCopyButtons();
        // Scroll to top of content only if unlocked
        contentDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // For locked content, disable scrolling on main content
        const mainContent = document.querySelector('.main-content');
        mainContent.style.overflow = 'hidden';
        // Re-enable on unlock
        setTimeout(() => {
            mainContent.style.overflow = 'auto';
        }, 100);
    }
}

// === Consent Modal ===
// Make this function global so it can be called from onclick
window.showConsentModal = showConsentModal;

function showConsentModal(index) {
    pendingLevelIndex = index;
    const level = levels[index];
    const prevLevel = index > 0 ? levels[index - 1] : null;
    const mobileView = isMobileView();
    
    const modal = document.getElementById('consent-modal');
    const message = document.getElementById('consent-message');
    const input = document.getElementById('consent-input');
    
    // Extract level numbers for the placeholder
    const currentLevelNum = extractLevelNumber(level.title);
    const prevLevelNum = prevLevel ? extractLevelNumber(prevLevel.title) : null;
    
    if (prevLevel) {
        message.innerHTML = `To view contents of this level, please confirm you've attempted <strong>${prevLevel.title}</strong>.`;
        
        // Dynamic placeholder based on actual levels
        if (prevLevelNum !== null && currentLevelNum !== null) {
            input.placeholder = mobileView
                ? `I have cleared level ${prevLevelNum}`
                : `I have cleared level ${prevLevelNum} and want to see level ${currentLevelNum}`;
        } else {
            input.placeholder = mobileView
                ? `I have cleared the previous level`
                : `I have cleared the previous level and want to see this level`;
        }
    } else {
        message.textContent = `To view contents of this level, please confirm you've attempted the previous level.`;
        input.placeholder = mobileView
            ? `I have cleared the previous level`
            : `I have cleared the previous level and want to see this level`;
    }
    
    input.value = '';
    input.focus();
    
    modal.classList.add('active');
}

// Extract level number from title like "Level 0 → Level 1"
function extractLevelNumber(title) {
    // Try to extract the last number from patterns like "Level X → Level Y"
    const match = title.match(/Level\s+(\d+)\s*→\s*Level\s+(\d+)/i);
    if (match) {
        return match[2]; // Return the target level number
    }
    
    // Fallback: try to get any number from "Level X"
    const simpleMatch = title.match(/Level\s+(\d+)/i);
    if (simpleMatch) {
        return simpleMatch[1];
    }
    
    return null;
}

function hideConsentModal() {
    const modal = document.getElementById('consent-modal');
    modal.classList.remove('active');
    pendingLevelIndex = -1;
}

// === Add Copy Buttons ===
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.level-content pre');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        button.addEventListener('click', async () => {
            const code = block.querySelector('code');
            if (!code) return;
            
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.textContent = 'Copied';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
        
        block.style.position = 'relative';
        block.appendChild(button);
    });
}

// === Keyboard Navigation ===
document.addEventListener('keydown', (e) => {
    // Don't interfere if user is typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentLevelIndex < levels.length - 1) {
            loadLevel(currentLevelIndex + 1);
        }
    } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentLevelIndex > 0) {
            loadLevel(currentLevelIndex - 1);
        }
    }
});

// === Modal ===
const aboutLink = document.getElementById('about-link');
const aboutModal = document.getElementById('about-modal');
const modalClose = document.getElementById('modal-close');

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.classList.add('active');
});

modalClose.addEventListener('click', () => {
    aboutModal.classList.remove('active');
});

aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
    }
});

// === Consent Modal Handlers ===
const consentModal = document.getElementById('consent-modal');
const consentInput = document.getElementById('consent-input');
const consentConfirm = document.getElementById('consent-confirm');
const consentCancel = document.getElementById('consent-cancel');

// Validate consent input
consentInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase().trim();
    
    // We need to validate against the actual pending level
    if (pendingLevelIndex < 0) {
        consentConfirm.disabled = true;
        return;
    }
    
    const level = levels[pendingLevelIndex];
    const prevLevel = pendingLevelIndex > 0 ? levels[pendingLevelIndex - 1] : null;
    const mobileView = isMobileView();
    
    if (!prevLevel) {
        consentConfirm.disabled = true;
        return;
    }
    
    // Extract the actual level numbers we expect
    const currentLevelNum = extractLevelNumber(level.title);
    const prevLevelNum = extractLevelNumber(prevLevel.title);
    
    if (currentLevelNum === null || prevLevelNum === null) {
        // Fallback to basic validation if we can't extract numbers
        const hasCleared = value.includes('cleared') || value.includes('clear');
        const hasLevel = value.includes('level');
        const hasWant = value.includes('want');
        const hasSee = value.includes('see');
        if (mobileView) {
            consentConfirm.disabled = !(hasCleared && hasLevel);
        } else {
            consentConfirm.disabled = !(hasCleared && hasLevel && hasWant && hasSee);
        }
        return;
    }
    
    // Strict validation: must contain the correct level numbers
    const hasCleared = value.includes('cleared') || value.includes('clear');
    const hasWant = value.includes('want');
    const hasSee = value.includes('see');

    // Check if the input contains the correct level numbers
    const hasPrevLevel = value.includes(`level ${prevLevelNum}`);
    const hasCurrentLevel = value.includes(`level ${currentLevelNum}`);

    let isValid;
    if (mobileView) {
        isValid = hasCleared && hasPrevLevel;
    } else {
        isValid = hasCleared && hasWant && hasSee && hasPrevLevel && hasCurrentLevel;
    }

    consentConfirm.disabled = !isValid;
});

// Handle consent confirmation
consentConfirm.addEventListener('click', () => {
    if (pendingLevelIndex >= 0) {
        const levelToLoad = pendingLevelIndex;
        
        unlockedLevels.add(levelToLoad);
        saveUnlockedLevels();
        
        // Update TOC to remove locked state
        updateTOCLockState(levelToLoad);
        
        // Re-enable scrolling
        const mainContent = document.querySelector('.main-content');
        mainContent.style.overflow = 'auto';
        
        hideConsentModal();
        loadLevel(levelToLoad);
    }
});

// Update TOC lock state for a specific level
function updateTOCLockState(index) {
    const tocItems = document.querySelectorAll('.toc-item');
    if (tocItems[index]) {
        tocItems[index].classList.remove('locked');
        const lockIcon = tocItems[index].querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.remove();
        }
        
        // Add summary now that it's unlocked
        const level = levels[index];
        if (level) {
            const summary = document.createElement('div');
            summary.className = 'toc-item-summary';
            const firstLine = level.content.trim().split('\n')[0];
            summary.textContent = firstLine.substring(0, 60) + (firstLine.length > 60 ? '...' : '');
            tocItems[index].appendChild(summary);
        }
    }
}

// Handle consent cancellation
consentCancel.addEventListener('click', () => {
    hideConsentModal();
});

consentModal.addEventListener('click', (e) => {
    if (e.target === consentModal) {
        hideConsentModal();
    }
});

// Allow Enter key to confirm
consentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !consentConfirm.disabled) {
        consentConfirm.click();
    } else if (e.key === 'Escape') {
        hideConsentModal();
    }
});

// === Local Storage for Unlocked Levels ===
function saveUnlockedLevels() {
    localStorage.setItem('bandit_unlocked_levels', JSON.stringify([...unlockedLevels]));
}

function loadUnlockedLevels() {
    const stored = localStorage.getItem('bandit_unlocked_levels');
    if (stored) {
        try {
            const arr = JSON.parse(stored);
            unlockedLevels = new Set(arr);
        } catch (e) {
            console.error('Failed to load unlocked levels:', e);
        }
    }
}

// === Sidebar Toggle (Mobile) ===
const toggleBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.addEventListener('click', () => {
        if (!isMobileView()) return;
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        toggleBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
    });

    window.addEventListener('resize', () => {
        if (!isMobileView()) {
            sidebar.classList.remove('collapsed');
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    });
}

// === Initialize ===
async function init() {
    // Load previously unlocked levels from localStorage
    loadUnlockedLevels();
    
    try {
        const response = await fetch(NOTES_FILE);
        if (!response.ok) throw new Error('Failed to load notes');
        
        const markdown = await response.text();
        levels = parseMarkdown(markdown);
        
        generateTOC(levels);
        
        // Load first level by default (Level 0 is always unlocked)
        if (levels.length > 0) {
            loadLevel(0);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        document.getElementById('content').innerHTML = `
            <div class="welcome">
                <h2>error loading notes</h2>
                <p class="muted">Could not load Level_Notes.md. Please ensure the file exists in the same directory.</p>
            </div>
        `;
        document.getElementById('toc-list').innerHTML = `
            <div class="loading" style="color: var(--accent-red);">failed to load levels</div>
        `;
    }
}

// === Configure marked.js ===
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
}

// Show about modal for first-time visitors
function showAboutForFirstVisit() {
    const hasVisited = localStorage.getItem('bandit_has_visited');
    if (!hasVisited) {
        setTimeout(() => {
            aboutModal.classList.add('active');
            localStorage.setItem('bandit_has_visited', 'true');
        }, 2000);
    }
}

// === Theme Toggle ===
const themeToggle = document.getElementById('theme-toggle');

function getPreferredTheme() {
    const stored = localStorage.getItem('bandit_theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bandit_theme', theme);
    themeToggle.checked = theme === 'dark';
}

function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
}

themeToggle.addEventListener('change', () => {
    const next = themeToggle.checked ? 'dark' : 'light';
    setTheme(next);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('bandit_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Start
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    init();
    showAboutForFirstVisit();
});
