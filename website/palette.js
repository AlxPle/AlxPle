(function () {
    const themes = [
        "nord",
        "light",
        "dark",
        "sunset",
        "mint",
        "violet",
        "solarized",
        "slate",
        "gray",
        "rose",
        "amber",
        "emerald",
        "sky",
        "indigo",
        "purple",
        "pink"
    ];
    const storageKey = "site-theme";
    const btnId = "palette-die";

    function currentTheme() {
        return document.documentElement.dataset.theme || "nord";
    }

    function safeSetStorage(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { }
    }

    function updateMetaThemeColor() {
        const meta = document.getElementById('meta-theme-color');
        if (!meta) return;
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '';
        meta.setAttribute('content', bg.trim() || '');
    }

    function applyTheme(t) {
        if (!t) return;
        document.documentElement.dataset.theme = t;
        safeSetStorage(storageKey, t);
        setLabel(t);
        updateMetaThemeColor();
    }

    function setLabel(t) {
        const label = document.getElementById('palette-label');
        if (!label) return;
        // Capitalize and show friendly name
        label.textContent = (t && t[0]) ? t[0].toUpperCase() + t.slice(1) : t;
    }

    function pickRandom() {
        if (themes.length === 0) return null;
        let choice = themes[Math.floor(Math.random() * themes.length)];
        // avoid same theme twice in a row when possible
        if (themes.length > 1) {
            let attempts = 0;
            while (choice === currentTheme() && attempts < 6) {
                choice = themes[Math.floor(Math.random() * themes.length)];
                attempts++;
            }
        }
        return choice;
    }

    function flashButton(btn) {
        if (!btn) return;
        btn.classList.remove('spinning');
        // force reflow to restart animation
        // eslint-disable-next-line no-unused-expressions
        void btn.offsetWidth;
        btn.classList.add('spinning');
        const onEnd = () => { btn.classList.remove('spinning'); btn.removeEventListener('animationend', onEnd); };
        btn.addEventListener('animationend', onEnd);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        // initialize theme from storage or system preference
        let stored = null;
        try { stored = localStorage.getItem(storageKey); } catch (e) { }
        if (stored && themes.includes(stored)) {
            applyTheme(stored);
        } else {
            applyTheme('nord');
        }

        btn.addEventListener('click', function () {
            const next = pickRandom();
            if (!next) return;
            applyTheme(next);
            setLabel(next);
            flashButton(btn);
            btn.setAttribute('aria-label', `Theme: ${next}`);
            btn.title = `Theme: ${next}`;
        });

        // allow keyboard activation
        btn.addEventListener('keyup', function (e) {
            if (e.key === 'Enter' || e.key === ' ') btn.click();
        });
    });
})();
