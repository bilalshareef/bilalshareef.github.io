(function() {

    'use strict';

    const textsArray = [
        'Technical Lead',
        'Software Architect',
        'Engineering Leader',
        'Software Consultant',
        'FOSS Lover'
    ];
    const themesArray = [
        'theme-red',
        'theme-green',
        'theme-blue',
        'theme-brown',
        'theme-purple',
        'theme-orange',
        'theme-indigo',
        'theme-cyan',
        'theme-teal',
        'theme-grey'
    ];
    const CONSENT_KEY = 'consent-analytics';

    const profileDescription = document.querySelector('.profile-description');
    const banner = document.getElementById('consent-banner');
    const consentStatus = document.getElementById('consent-status');

    let activeTextIndex = 0;
    let lastThemeIndex = 0;

    // gtag.js may be blocked or still loading, so every call is guarded.
    function sendToGtag(...args) {
        if (typeof window.gtag === 'function') {
            window.gtag(...args);
        }
    }

    function changeText() {
        profileDescription.textContent = textsArray[activeTextIndex];
        activeTextIndex = (activeTextIndex + 1) % textsArray.length;
    }

    function changeTheme() {
        let randomIndex = Math.floor(Math.random() * themesArray.length);

        // Nudge the index along so the same theme never repeats back to back.
        if (randomIndex === lastThemeIndex) {
            randomIndex = (randomIndex >= (themesArray.length - 1)) ? 0 : (randomIndex + 1);
        }
        document.body.className = themesArray[randomIndex];

        lastThemeIndex = randomIndex;
    }

    changeText();
    changeTheme();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let textTimer = null;
    let themeTimer = null;

    function applyMotionPreference() {
        if (reduceMotion.matches) {
            clearInterval(textTimer);
            clearInterval(themeTimer);
            textTimer = null;
            themeTimer = null;
        } else if (textTimer === null) {
            textTimer = setInterval(changeText, 2000);
            themeTimer = setInterval(changeTheme, 5000);
        }
    }

    applyMotionPreference();
    reduceMotion.addEventListener('change', applyMotionPreference);

    document.querySelector('.profile-image').addEventListener('click', () => {
        changeTheme();
        sendToGtag('event', 'theme_change', { theme: document.body.className });
    });

    document.querySelector('.resume-button-wrap a').addEventListener('click', () => {
        sendToGtag('event', 'resume_view', { file_name: 'resume.pdf' });
    });

    document.querySelectorAll('.social-icons-wrap a').forEach((link) => {
        link.addEventListener('click', () => {
            sendToGtag('event', 'social_click', {
                network: link.protocol === 'mailto:' ? 'email' : link.hostname,
                link_url: link.href
            });
        });
    });

    /* Consent Banner */

    // localStorage throws in some privacy modes, so every access is guarded.
    function readConsent() {
        try {
            return window.localStorage.getItem(CONSENT_KEY);
        } catch {
            return null;
        }
    }

    function storeConsent(value) {
        try {
            window.localStorage.setItem(CONSENT_KEY, value);
        } catch {}
    }

    function resolveConsent(value) {
        storeConsent(value);
        sendToGtag('consent', 'update', { 'analytics_storage': value });
        banner.hidden = true;
    }

    if (readConsent() === null) {
        banner.hidden = false;
    }

    document.getElementById('consent-accept').addEventListener('click', () => {
        resolveConsent('granted');
    });

    document.getElementById('consent-reject').addEventListener('click', () => {
        resolveConsent('denied');
    });

    document.getElementById('consent-reopen').addEventListener('click', () => {
        const current = readConsent();
        // Plain text rather than a pre-selected button, so neither choice is nudged.
        consentStatus.textContent = current === null
            ? ''
            : `Current setting: ${current === 'granted' ? 'Accepted' : 'Rejected'}`;
        consentStatus.hidden = current === null;

        banner.hidden = false;
        banner.focus();
    });

}());
