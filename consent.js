(() => {
  "use strict";

  const STORAGE_KEY = "gs-consent";
  const CONSENT_VERSION = 2;
  const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;
  const CLARITY_ID = "xu36kqlw73";
  const DEFAULT_PREFERENCES = {
    experience: false,
    mesure: false,
    marketing: false
  };

  let preferences = { ...DEFAULT_PREFERENCES };
  let banner = null;

  function googleConsent(command, values) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", command, values);
  }

  function consentValues(values) {
    return {
      ad_storage: values.marketing ? "granted" : "denied",
      analytics_storage: values.mesure ? "granted" : "denied",
      ad_user_data: values.marketing ? "granted" : "denied",
      ad_personalization: values.marketing ? "granted" : "denied",
      functionality_storage: values.experience ? "granted" : "denied",
      personalization_storage: values.experience ? "granted" : "denied",
      security_storage: "granted"
    };
  }

  function readConsent() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (
        !stored
        || stored.version !== CONSENT_VERSION
        || typeof stored.date !== "string"
        || Date.now() - Date.parse(stored.date) > CONSENT_DURATION_MS
      ) {
        return null;
      }
      return {
        experience: stored.experience === true,
        mesure: stored.mesure === true,
        marketing: stored.marketing === true
      };
    } catch {
      return null;
    }
  }

  function saveConsent(values) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        date: new Date().toISOString(),
        necessaires: true,
        ...values
      }));
    } catch {
      // Consent still applies to the current page when storage is unavailable.
    }
  }

  function loadClarity() {
    if (document.querySelector(`script[data-clarity-id="${CLARITY_ID}"]`)) return;
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const script = document.createElement("script");
    script.async = true;
    script.dataset.clarityId = CLARITY_ID;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  function applyConsent(values) {
    googleConsent("update", consentValues(values));
    if (values.mesure) loadClarity();
  }

  function closeBanner(values) {
    preferences = { ...values };
    saveConsent(preferences);
    applyConsent(preferences);
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  function switchMarkup(key, name, description, locked = false) {
    const active = locked || preferences[key];
    return `
      <div style="border:1px solid #E5DFD2;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <span style="font-weight:600;font-size:16px;color:#1F2E27">${name}</span>
          <button type="button" data-consent-switch="${key}" role="switch" aria-checked="${active}" aria-label="${active ? "Désactiver" : "Activer"} ${name}" ${locked ? "disabled" : ""} style="width:52px;height:30px;border-radius:999px;border:none;cursor:${locked ? "not-allowed" : "pointer"};position:relative;flex-shrink:0;transition:background 0.2s;background:${active ? "#2E5B4C" : "#C9C2B2"};${locked ? "opacity:0.55" : ""}">
            <span style="position:absolute;top:3px;left:${active ? "25px" : "3px"};width:24px;height:24px;border-radius:50%;background:#FFFFFF;transition:left 0.2s;display:block"></span>
          </button>
        </div>
        <p style="margin:0;font-size:14.5px;color:#6B7A70">${description}</p>
        <span data-consent-state="${key}" data-name="${name}" style="font-size:13.5px;font-weight:600;color:${locked ? "#6B7A70" : active ? "#2E5B4C" : "#A8442A"}">${locked ? "Toujours actifs" : active ? "Activé" : "Désactivé"}</span>
      </div>`;
  }

  function updateSwitch(key) {
    const button = banner.querySelector(`[data-consent-switch="${key}"]`);
    const state = banner.querySelector(`[data-consent-state="${key}"]`);
    const dot = button.querySelector("span");
    const active = preferences[key];
    button.setAttribute("aria-checked", String(active));
    button.setAttribute("aria-label", `${active ? "Désactiver" : "Activer"} ${state.dataset.name || ""}`.trim());
    button.style.background = active ? "#2E5B4C" : "#C9C2B2";
    dot.style.left = active ? "25px" : "3px";
    state.textContent = active ? "Activé" : "Désactivé";
    state.style.color = active ? "#2E5B4C" : "#A8442A";
  }

  function renderBanner() {
    if (banner) return;

    banner = document.createElement("div");
    banner.id = "go-senior-cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", "Gestion des cookies");
    banner.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#FFFFFF;border-top:1px solid #E5DFD2;box-shadow:0 -10px 34px rgba(34,50,43,0.14);font-family:'Libre Franklin',system-ui,sans-serif;color:#22322B;max-height:90vh;overflow:auto";
    banner.innerHTML = `
      <div style="max-width:1200px;margin:0 auto;padding:22px 24px;display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;gap:14px;align-items:flex-start">
          <svg width="34" height="34" viewBox="0 0 36 36" style="flex-shrink:0;margin-top:2px" aria-hidden="true"><rect width="36" height="36" rx="10" fill="#2E5B4C"></rect><path d="M11 26 V17.5 a7 7 0 0 1 14 0 V26" fill="none" stroke="#FAF7F0" stroke-width="3.2" stroke-linecap="round"></path></svg>
          <div style="display:flex;flex-direction:column;gap:6px">
            <p style="margin:0;font-weight:600;font-size:18px;color:#1F2E27">Le respect de votre vie privée est notre priorité</p>
            <p style="margin:0;font-size:16px;color:#41504A;max-width:860px">Nous utilisons des cookies pour assurer le fonctionnement du site et, avec votre accord, pour mesurer son audience et améliorer votre expérience. Vous pouvez accepter, refuser ou personnaliser ces usages, et changer d’avis à tout moment. <a href="/politique-cookies/" style="color:#2E5B4C">Politique cookies</a> · <a href="/politique-de-confidentialite/" style="color:#2E5B4C">Politique de confidentialité</a></p>
          </div>
        </div>
        <div data-consent-panel hidden style="grid-template-columns:repeat(auto-fit,minmax(min(250px,100%),1fr));gap:12px;border-top:1px solid #E5DFD2;padding-top:16px">
          ${switchMarkup("necessaires", "Strictement nécessaires", "Fonctionnement du site, sécurité et distribution du trafic (Cloudflare, hébergement). Exemptés de consentement.", true)}
          ${switchMarkup("experience", "Amélioration de l’expérience", "Affichage de contenus externes et confort de navigation (polices, vidéos intégrées).")}
          ${switchMarkup("mesure", "Mesure d’audience", "Statistiques anonymisées de fréquentation et d’usage (Google Analytics, Microsoft Clarity).")}
          ${switchMarkup("marketing", "Marketing", "Mesure de l’efficacité de nos campagnes. Aucune revente de données.")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <button type="button" data-consent-action="accept" style="min-height:54px;padding:12px 26px;background:#2E5B4C;color:#FFFFFF;border:none;border-radius:10px;font-family:'Libre Franklin',system-ui,sans-serif;font-weight:600;font-size:16.5px;cursor:pointer">Tout accepter</button>
          <button type="button" data-consent-action="reject" style="min-height:54px;padding:12px 26px;background:#FFFFFF;color:#22322B;border:1.5px solid #C9C2B2;border-radius:10px;font-family:'Libre Franklin',system-ui,sans-serif;font-weight:600;font-size:16.5px;cursor:pointer">Tout refuser</button>
          <button type="button" data-consent-action="save" hidden style="min-height:54px;padding:12px 26px;background:#FFFFFF;color:#2E5B4C;border:2px solid #2E5B4C;border-radius:10px;font-family:'Libre Franklin',system-ui,sans-serif;font-weight:600;font-size:16.5px;cursor:pointer">Valider mes choix</button>
          <button type="button" data-consent-action="customize" style="min-height:54px;padding:12px 0;background:none;color:#2E5B4C;border:none;font-family:'Libre Franklin',system-ui,sans-serif;font-weight:600;font-size:16.5px;cursor:pointer;text-decoration:underline;text-underline-offset:3px">Personnaliser</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    banner.querySelector('[data-consent-action="accept"]').addEventListener("click", () => {
      closeBanner({ experience: true, mesure: true, marketing: true });
    });
    banner.querySelector('[data-consent-action="reject"]').addEventListener("click", () => {
      closeBanner({ ...DEFAULT_PREFERENCES });
    });
    banner.querySelector('[data-consent-action="save"]').addEventListener("click", () => {
      closeBanner(preferences);
    });
    banner.querySelector('[data-consent-action="customize"]').addEventListener("click", () => {
      const panel = banner.querySelector("[data-consent-panel]");
      panel.hidden = false;
      panel.style.display = "grid";
      banner.querySelector('[data-consent-action="save"]').hidden = false;
      banner.querySelector('[data-consent-action="customize"]').hidden = true;
    });
    banner.querySelectorAll("[data-consent-switch]").forEach((button) => {
      if (button.disabled) return;
      button.addEventListener("click", () => {
        const key = button.dataset.consentSwitch;
        preferences[key] = !preferences[key];
        updateSwitch(key);
      });
    });
  }

  function openBanner() {
    const stored = readConsent();
    preferences = stored ? { ...stored } : { ...DEFAULT_PREFERENCES };
    renderBanner();
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href="#gestion-cookies"],[data-cookie-settings]');
    if (!link) return;
    event.preventDefault();
    openBanner();
  });

  const stored = readConsent();
  if (stored) {
    preferences = stored;
    applyConsent(stored);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBanner, { once: true });
  } else {
    renderBanner();
  }

  window.GoSeniorConsent = { open: openBanner };
})();
