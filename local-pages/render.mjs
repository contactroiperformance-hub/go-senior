import {
  effectivePublication,
  isPublicLocalPage,
  localPageRoute,
  publicNearbyLocations
} from "./schema.mjs";

const SERVICE_LABELS = Object.freeze({
  "monte-escalier": "Monte-escalier",
  "douche-senior": "Douche senior"
});

const SERVICE_GUIDES = Object.freeze({
  "monte-escalier": {
    national: "/monte-escalier/",
    price: "/guides/prix-monte-escalier/",
    priceLabel: "Voir le guide détaillé des prix",
    projectHeadingDepartment: "Types de monte-escalier",
    projectHeadingCity: "Configurations de projet à étudier"
  },
  "douche-senior": {
    national: "/douche-senior/",
    price: "/guides/prix-douche-senior/",
    priceLabel: "Voir le guide détaillé des prix",
    projectHeadingDepartment: "Transformations possibles",
    projectHeadingCity: "Votre installation actuelle et votre projet"
  }
});

const SERVICE_DETAIL_LABELS = Object.freeze({
  "monte-escalier": {
    stairLocation: "Escalier intérieur ou extérieur",
    stairShape: "Escalier droit, tournant ou à déterminer",
    levels: "Nombre de niveaux",
    turns: "Virages",
    landings: "Paliers",
    width: "Largeur disponible",
    obstacles: "Obstacles à prendre en compte",
    railType: "Type de rail",
    possibleTimelines: "Délais possibles",
    availableModels: "Modèles disponibles"
  },
  "douche-senior": {
    currentInstallation: "Installation actuelle",
    bathReplacement: "Baignoire à remplacer",
    showerSecuring: "Douche à sécuriser",
    bathroomReconfiguration: "Salle de bain à réagencer",
    receiverType: "Type de receveur",
    extraFlatShower: "Douche extra-plate",
    walkInShower: "Douche de plain-pied",
    seat: "Siège",
    grabBars: "Barres d’appui",
    plumbing: "Plomberie",
    waterproofing: "Étanchéité",
    coownership: "Copropriété"
  }
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function formatFrenchDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return value || "date non communiquée";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatEuro(value) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);
}

function departmentLocation(page) {
  return page.locationPhrase || `dans le ${page.departmentName}`;
}

function section(title, content, gap = 14, id = "") {
  if (!content) return "";
  const attr = id ? ` id="${escapeAttribute(id)}"` : "";
  return `<section${attr} style="display:flex;flex-direction:column;gap:${gap}px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(25px,2.8vw,31px);color:#1F2E27">${escapeHtml(title)}</h2>
      ${content}
    </section>`;
}

function heroShortcuts(page) {
  const dataLabel = page.pageLevel === "city" ? `Les repères de ${page.cityName}` : "Les données locales";
  const items = page.service === "douche-senior"
    ? [
        ["#budget", "Le budget", '<path d="M17 6.5A6 6 0 0 0 8 12a6 6 0 0 0 9 5.5M5 10.5h7M5 14h7"></path>'],
        ["#donnees", dataLabel, '<path d="M5 19V9m7 10V5m7 14v-7"></path>'],
        ["#faisabilite", "La faisabilité", '<path d="M4 20h4v-4h4v-4h4V8h4"></path>'],
        ["#pro", "Trouver un pro", '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>']
      ]
    : [
        ["#budget", "Le budget", '<path d="M17 6.5A6 6 0 0 0 8 12a6 6 0 0 0 9 5.5M5 10.5h7M5 14h7"></path>'],
        ["#aides", page.pageLevel === "city" ? "Les aides locales" : `Les aides ${departmentLocation(page)}`, '<path d="M4 13a8 8 0 0 1 16 0v6H4z"></path><path d="M9 19v-4h6v4"></path>'],
        ["#faisabilite", "Compatibilité", '<path d="M4 20h4v-4h4v-4h4V8h4"></path>'],
        ["#pro", "Trouver un pro", '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>']
      ];
  const route = localPageRoute(page);
  return `<div class="local-shortcuts"><div>${items.map(([href, label, path]) => `<a href="${escapeAttribute(`${route}${href}`)}">
      <span><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2E5B4C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></span>
      <strong>${escapeHtml(label)}</strong>
    </a>`).join("")}</div></div>`;
}

function breadcrumb(page) {
  const guides = SERVICE_GUIDES[page.service];
  const serviceLabel = SERVICE_LABELS[page.service];
  const items = [
    { label: "Accueil", href: "/" },
    { label: serviceLabel, href: guides.national }
  ];
  if (page.pageLevel === "department" || page.pageLevel === "city") {
    items.push({ label: "Départements", href: `/${page.service}/departements/` });
  }
  if (page.pageLevel === "city") {
    items.push({
      label: page.departmentName,
      href: `/${page.service}/${page.departmentSlug}/`
    });
  }
  items.push({
    label: page.pageLevel === "city" ? page.cityName : page.departmentName,
    href: localPageRoute(page),
    current: true
  });
  return `<nav aria-label="Fil d’Ariane" style="font-size:17px;color:#6B7A70;margin-bottom:20px">${items.map((item, index) => {
    const label = item.href
      ? `<a href="${escapeAttribute(item.href)}"${item.current ? ' aria-current="page"' : ""} style="color:#2E5B4C;text-decoration:none" style-hover="text-decoration:underline">${escapeHtml(item.label)}</a>`
      : `<span aria-current="page">${escapeHtml(item.label)}</span>`;
    return `${index ? ' <span aria-hidden="true">›</span> ' : ""}${label}`;
  }).join("")}</nav>`;
}

export function breadcrumbData(page) {
  const guides = SERVICE_GUIDES[page.service];
  const items = [
    { name: "Accueil", route: "/" },
    { name: SERVICE_LABELS[page.service], route: guides.national }
  ];
  if (page.pageLevel === "department" || page.pageLevel === "city") {
    items.push({ name: "Départements", route: `/${page.service}/departements/` });
  }
  if (page.pageLevel === "city") {
    items.push({
      name: page.departmentName,
      route: `/${page.service}/${page.departmentSlug}/`
    });
  }
  items.push({
    name: page.pageLevel === "city" ? page.cityName : page.departmentName,
    route: localPageRoute(page)
  });
  return items;
}

function blocProjet(page, title = "") {
  const city = page.pageLevel === "city" ? ` ville="${escapeAttribute(page.cityName)}"` : "";
  return `<dc-import name="BlocProjet"${city} projet="${escapeAttribute(page.cta.project)}" cp-exemple="${escapeAttribute(page.cta.postalCodeExample)}" title="${escapeAttribute(title)}" cta="${escapeAttribute(page.cta.buttonLabel || "Voir les solutions disponibles")}" reassurance="${escapeAttribute(page.cta.reassurance || "Demande gratuite et sans engagement.")}" valid-message="${escapeAttribute(page.cta.validPostalCodeMessage || "")}" coverage-status="${escapeAttribute(page.coverageStatus)}" hint-size="100%,340px"></dc-import>`;
}

function heroIntroduction(page) {
  if (page.service === "monte-escalier" && page.pageLevel === "department") {
    return "Quand monter les marches devient fatigant ou source d’inquiétude, un monte-escalier peut aider à retrouver l’accès à toutes les pièces et à continuer à vivre chez soi plus sereinement.";
  }
  return page.introduction;
}

function hero(page) {
  const heroText = heroIntroduction(page);
  const introduction = heroText
    ? `<p style="margin:0;font-size:20.5px;color:#41504A">${escapeHtml(heroText)}</p>`
    : "";
  const image = page.service === "monte-escalier"
    ? "/uploads/monte-escalier-en-situation.webp"
    : "/uploads/douche-plain-pied-siege-rabattable.webp";
  const imageAlt = page.service === "monte-escalier"
    ? "Une personne utilise un monte-escalier dans son logement"
    : "Douche adaptée avec siège et barres d’appui";
  const imageCaption = page.service === "monte-escalier"
    ? "Retrouver l’accès à toute sa maison, à son rythme."
    : "Rendre la toilette plus simple et plus sereine au quotidien.";
  return `<section class="local-hero" style="background:linear-gradient(180deg,#F3EFE4 0%,#FAF7F0 100%);border-bottom:1px solid #E5DFD2">
    <div style="max-width:1240px;margin:0 auto;padding:34px 24px 48px">
      ${breadcrumb(page)}
      <div class="local-hero-grid">
        <div style="display:flex;flex-direction:column;gap:16px;max-width:560px">
          <p style="margin:0;color:#B75831;font-weight:700;letter-spacing:.055em;text-transform:uppercase;font-size:14px">Bien vivre chez soi</p>
          <h1 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(29px,3.3vw,44px);line-height:1.12;letter-spacing:-0.015em;color:#1F2E27;text-wrap:balance">${escapeHtml(page.h1)}</h1>
          ${introduction}
          <div class="local-trust-pills" aria-label="Les engagements Go Senior">
            <span>✓ Demande gratuite</span><span>✓ Sans engagement</span><span>✓ Un seul interlocuteur</span>
          </div>
        </div>
        <figure class="local-hero-visual">
          <img src="${escapeAttribute(image)}" alt="${escapeAttribute(imageAlt)}" width="1340" height="560" loading="eager" fetchpriority="high" style="object-position:${page.service === "monte-escalier" ? "56% 30%" : "50% 50%"}">
          <figcaption>${escapeHtml(imageCaption)}</figcaption>
        </figure>
        ${blocProjet(page, page.cta.title)}
      </div>
    </div>
    ${heroShortcuts(page)}
  </section>`;
}

function afterRequestSection(page) {
  const object = page.service === "monte-escalier" ? "votre escalier" : "votre salle de bain";
  const cards = [
    ['<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5.5l3.5 2"></path>', "Un conseiller vous rappelle", `Un seul appel pour comprendre ${object} et votre situation. Vous choisissez ensuite de poursuivre ou non.`],
    ['<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>', "Un seul professionnel", "Votre demande est transmise à un unique professionnel indépendant intervenant dans votre secteur."],
    ['<path d="M12 3l7.5 3v5.5c0 4.4-3.1 8.2-7.5 9.5-4.4-1.3-7.5-5.1-7.5-9.5V6z"></path>', "Gratuit et sans engagement", "Vos coordonnées sont transmises à ce professionnel pour l’étude du projet. Vous restez libre d’arrêter à tout moment."]
  ];
  return `<section id="ensuite" data-local-after-request class="local-after-request" aria-label="Ce qui se passe après votre demande">
    <div class="local-after-request-heading"><h2>Ce qui se passe après votre demande</h2><span>Vous savez qui vous contacte, et pourquoi.</span></div>
    <div class="local-after-request-grid">${cards.map(([path, title, text]) => `<div>
      <span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E5B4C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></span>
      <p><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text)}</small></p>
    </div>`).join("")}</div>
  </section>`;
}

function essentialsSection(page) {
  if (page.pageLevel !== "department") return "";
  if (page.service === "douche-senior") {
    const replacement = page.nationalPriceReference?.find((item) => /Remplacement d’une baignoire/i.test(item.label));
    const apartments = (page.housingData || []).find((item) => /Part des appartements/i.test(item.indicator));
    const age = (page.demographicData || []).find((item) => /65 ans ou plus/i.test(item.indicator));
    const cards = [
      ["Projet fréquent", "Baignoire → douche", "dépose, accès, parois et réseaux à contrôler"],
      ["Budget indicatif", replacement?.range || "Sur devis", "repère national, selon l’état de la pièce"],
      ["Repère logement", apartments?.displayValue || "Parc local", apartments ? "d’appartements dans le département" : "données disponibles selon le millésime"],
      ["Repère population", age?.displayValue || "Tout âge", age ? "de personnes âgées de 65 ans ou plus" : "usage évalué avec la personne"]
    ];
    return `<section data-local-essentials class="local-essentials" aria-labelledby="local-essentials-title">
      <div class="local-essentials-heading"><p>L’essentiel</p><h2 id="local-essentials-title">Le projet en un coup d’œil</h2></div>
      <div class="local-essentials-grid">${cards.map(([label, value, detail]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></div>`).join("")}</div>
    </section>`;
  }
  const straight = page.nationalPriceReference?.find((item) => item.productType === "Monte-escalier droit");
  const curved = page.nationalPriceReference?.find((item) => item.productType === "Monte-escalier tournant");
  const houses = (page.housingData || []).find((item) => /Part des maisons/i.test(item.indicator));
  const places = (page.localPlaces || []).slice(0, 2).join(" et ");
  const cards = [
    ["Budget indicatif", straight ? `${formatEuro(straight.amountMin)} – ${formatEuro(straight.amountMax)} €` : "Sur devis", "pour un modèle droit, pose comprise"],
    ["Escalier tournant", curved ? `${formatEuro(curved.amountMin)} – ${formatEuro(curved.amountMax)} €` : "Rail sur mesure", "selon les courbes, paliers et options"],
    ["Aides à vérifier", "MaPrimeAdapt’ · APA", "selon votre situation et avant les travaux"],
    ["Repère local", houses?.displayValue || "Tout le département", houses ? "de maisons dans le parc de logements" : places ? `secteurs de ${places}` : "couverture par code postal"]
  ];
  return `<section data-local-essentials class="local-essentials" aria-labelledby="local-essentials-title">
    <div class="local-essentials-heading">
      <p>L’essentiel</p>
      <h2 id="local-essentials-title">Votre projet en un coup d’œil</h2>
    </div>
    <div class="local-essentials-grid">${cards.map(([label, value, detail]) => `<div>
      <span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small>
    </div>`).join("")}</div>
  </section>`;
}

function dailyLifeSection(page) {
  if (page.pageLevel !== "department") return "";
  const firstPlace = page.localPlaces?.[0] || page.departmentName;
  if (page.service === "douche-senior") {
    return `<section data-local-daily-life class="local-daily-life">
      <div><p class="local-kicker">Les gestes avant le modèle</p><h2>Rendre la toilette plus simple au quotidien</h2><p>${escapeHtml(page.introduction)}</p></div>
      <ul>
        <li><span aria-hidden="true">01</span><div><strong>Réduire le franchissement</strong><p>La hauteur d’accès doit être compatible avec le plancher, la pente d’évacuation et la stabilité recherchée.</p></div></li>
        <li><span aria-hidden="true">02</span><div><strong>Placer les bons appuis</strong><p>Siège, barres et robinetterie se choisissent selon les gestes réels, pas comme une liste d’options automatique.</p></div></li>
        <li><span aria-hidden="true">03</span><div><strong>Protéger durablement la pièce</strong><p>À ${escapeHtml(firstPlace)} comme ailleurs dans le département, plomberie, ventilation et étanchéité doivent être vérifiées avant le devis final.</p></div></li>
      </ul>
    </section>`;
  }
  return `<section data-local-daily-life class="local-daily-life">
    <div>
      <p class="local-kicker">Votre quotidien d’abord</p>
      <h2>Continuer à profiter de toute sa maison</h2>
      <p>${escapeHtml(page.introduction)}</p>
    </div>
    <ul>
      <li><span aria-hidden="true">01</span><div><strong>Accéder aux pièces importantes</strong><p>Chambre, salle de bain ou sortie extérieure restent accessibles sans réorganiser toute la vie au rez-de-chaussée.</p></div></li>
      <li><span aria-hidden="true">02</span><div><strong>Retrouver de la sérénité</strong><p>Le projet cherche à réduire l’effort et l’appréhension associés aux marches, en tenant compte de la personne qui utilisera l’équipement.</p></div></li>
      <li><span aria-hidden="true">03</span><div><strong>Choisir une solution adaptée</strong><p>À ${escapeHtml(firstPlace)} comme ailleurs dans le département, les mesures du logement déterminent le rail et les options réellement utiles.</p></div></li>
    </ul>
  </section>`;
}

function editorialSection(page) {
  if (page.pageLevel !== "department") return "";
  const organizations = [...new Set((page.officialSources || []).map((source) => source.organization))]
    .slice(0, 3)
    .join(" · ");
  return `<aside data-local-editorial class="local-editorial" aria-label="Informations éditoriales">
    <div class="local-editorial-mark" aria-hidden="true">✓</div>
    <div><strong>Guide préparé par l’équipe éditoriale Go Senior</strong><span>Informations vérifiées et mises à jour le ${escapeHtml(formatFrenchDate(page.updatedAt || page.sourceCheckedAt))}.</span></div>
    <div><strong>Sources identifiées</strong><span>${escapeHtml(organizations || "INSEE · organismes publics")}</span></div>
    <a href="/methodologie-editoriale/">Notre méthode éditoriale ›</a>
  </aside>`;
}

function draftBanner(publication) {
  if (publication.status !== "draft") return "";
  const message = publication.ready
    ? "Version en validation manuelle — page non indexable et absente des sitemaps."
    : "Données locales incomplètes — page non indexable et absente des sitemaps. Les modules sans données vérifiées sont masqués.";
  return `<div data-local-draft-banner style="background:#5C4E22;padding:12px 24px;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:center">
    <span style="background:#E9B44C;color:#1F2E27;font-weight:700;font-size:14.5px;letter-spacing:0.06em;text-transform:uppercase;padding:4px 12px;border-radius:999px">Validation</span>
    <span style="font-size:16.5px;color:#F5EBD0;text-align:center">${escapeHtml(message)}</span>
  </div>`;
}

function scopeSection(page) {
  if (!page.geographicScope) return "";
  return section(
    "Périmètre de ce guide",
    `<p style="margin:0;color:#41504A">${escapeHtml(page.geographicScope)}</p>`
  );
}

function priceSection(page) {
  if (!page.nationalPriceReference?.length) return "";
  const place = page.pageLevel === "city"
    ? `à ${page.cityName}`
    : departmentLocation(page);
  const label = page.service === "douche-senior" ? "une douche senior" : "un monte-escalier";
  const guide = SERVICE_GUIDES[page.service];
  const rows = page.nationalPriceReference.map((item) => {
    const label = item.productType || item.label;
    const href = page.service === "douche-senior"
      ? /baignoire/i.test(label)
        ? "/projet/?projet=baignoire-douche"
        : /complète/i.test(label)
          ? "/projet/?projet=salle-de-bain"
          : "/projet/?projet=douche-senior"
      : page.projectOptions?.find((option) => option.title === label)?.href || "/projet/?projet=monte-escalier";
    const range = Number.isFinite(item.amountMin) && Number.isFinite(item.amountMax)
      ? `${formatEuro(item.amountMin)} – ${formatEuro(item.amountMax)} €`
      : item.range;
    return `
        <a href="${escapeAttribute(href)}" style="text-decoration:none;background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:16px 22px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between" style-hover="border-color:#2E5B4C;box-shadow:0 6px 18px rgba(34,50,43,0.10)">
          <span style="display:flex;flex:1 1 280px;flex-direction:column;gap:2px"><strong style="font-size:17.5px;font-weight:700;color:#1F2E27">${escapeHtml(label)} <span style="color:#B04E20">›</span></strong>${item.descriptor ? `<small style="font-size:15.5px;line-height:1.45;color:#6B7A70">${escapeHtml(item.descriptor)}</small>` : ""}</span>
          <span style="font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:21px;color:#2E5B4C">${escapeHtml(range)}</span>
        </a>`;
  }).join("");
  const note = page.service === "monte-escalier"
    ? "Ces montants sont des repères nationaux 2026, et non des prix moyens propres à ce département. Le coût précis dépend de la configuration du logement, du rail, des options, de la pose et des éventuels travaux complémentaires."
    : "Ces montants sont des repères nationaux, pas un devis ni un prix local. Le coût dépend de la configuration du logement et du projet.";
  const differences = page.service === "douche-senior"
    ? [
        ["L’évacuation existante", "Conserver l’emplacement et la pente coûte moins cher que reprendre une évacuation ou créer une réservation dans le plancher."],
        ["L’état de la plomberie", "Des réseaux à déplacer ou découverts en mauvais état modifient le chantier. Le devis doit indiquer les reprises incluses."],
        ["Les finitions retenues", "Paroi, siège, robinetterie, revêtements et accessoires doivent être chiffrés poste par poste."],
        ["Ce qui suit le chantier", "Étanchéité, remise en état, évacuation des gravats, nettoyage et garanties font partie du périmètre à comparer."]
      ]
    : [
        ["La forme de l’escalier", "Un rail droit est standard ; un tracé avec courbes, paliers ou changements de pente est fabriqué sur mesure."],
        ["Le circuit de vente", "Fabricant, revendeur, pose et service après-vente peuvent être regroupés ou facturés séparément."],
        ["Les options choisies", "Pivotement, rail escamotable, repose-pieds et équipements extérieurs doivent être distingués du modèle de base."],
        ["L’après-pose", "Garantie, entretien, dépannage et modalités de démontage peuvent expliquer une partie de l’écart entre deux offres."]
      ];
  const preciseObject = page.service === "douche-senior" ? "votre salle de bain" : "votre escalier";
  return section(
    `Quel budget prévoir pour ${label} ${place} ?`,
    `<dc-import name="EstimateurBudget" projet="${escapeAttribute(page.cta.project)}" service="${escapeAttribute(page.service)}" hint-size="100%,360px"></dc-import>
      <div data-local-price-block style="display:flex;flex-direction:column;gap:10px">${rows}
      </div>
      <p style="margin:0;color:#41504A">${escapeHtml(note)} <a href="${guide.price}">${guide.priceLabel}</a>.</p>
      <h3 style="margin:10px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:23px;color:#1F2E27">Pourquoi deux devis peuvent différer</h3>
      <div data-local-price-differences style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:14px">${differences.map(([title, text]) => `<div style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:20px 22px"><p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#1F2E27">${escapeHtml(title)}</p><p style="margin:0;font-size:16.5px;color:#41504A">${escapeHtml(text)}</p></div>`).join("")}</div>
      <div style="background:#F4E7D7;border-radius:16px;padding:22px 26px;display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between">
        <p style="margin:0;font-size:18px;color:#41504A;max-width:560px"><strong style="color:#1F2E27">Un chiffre précis pour ${escapeHtml(preciseObject)} ?</strong> Décrivez le projet en quelques questions : un conseiller vous rappelle et une seule entreprise étudie la demande.</p>
        <a href="/projet/?projet=${escapeAttribute(page.cta.project)}" style="text-decoration:none;background:#C05A2E;color:#FFFFFF;font-weight:700;font-size:18px;padding:15px 24px;border-radius:10px;white-space:nowrap" style-hover="background:#A84D24">Faire chiffrer mon projet</a>
      </div>`,
    16,
    "budget"
  );
}

function inseeCard(datum) {
  const computedValue = typeof datum.value === "number"
    ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(datum.value)
    : datum.value;
  const unit = datum.unit === "%" ? " %" : datum.unit ? ` ${datum.unit}` : "";
  const value = datum.displayValue || `${computedValue}${unit}`;
  return `<div data-local-insee-card style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:4px">
    <span style="font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:28px;color:#2E5B4C">${escapeHtml(value)}</span>
    <span style="font-size:16.5px;color:#41504A">${escapeHtml(datum.indicator)}</span>
    <span style="font-size:15.5px;color:#6B7A70">INSEE, ${escapeHtml(datum.vintage)}</span>
  </div>`;
}

function localDataSection(page) {
  const data = [...(page.demographicData || []), ...(page.housingData || [])];
  if (!data.length) return "";
  const place = page.pageLevel === "city" ? `${page.cityName} en quelques repères` : `${page.departmentName} : quelques repères`;
  const commentary = page.localHousingCommentary
    ? `<p style="margin:0;color:#41504A">${escapeHtml(page.localHousingCommentary)}</p>`
    : "";
  const methodology = page.inseeMethodology
    ? `<details style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:0 20px"><summary style="cursor:pointer;font-weight:600;font-size:17px;color:#2E5B4C;padding:15px 0">Voir la source et la méthodologie</summary><p style="margin:0;padding:0 0 16px;font-size:16.5px;color:#41504A">${escapeHtml(page.inseeMethodology)} Source : ${escapeHtml(page.demographicData?.[0]?.sourceTitle || "INSEE")}, consulté le ${escapeHtml(formatFrenchDate(page.sourceCheckedAt))}.</p></details>`
    : "";
  return section(
    place,
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px">
        ${data.map(inseeCard).join("")}
      </div>
      ${commentary}
      ${methodology}`,
    18,
    "donnees"
  );
}

function projectOptionsSection(page) {
  if (!page.projectOptions?.length) return "";
  const heading = page.pageLevel === "city"
    ? SERVICE_GUIDES[page.service].projectHeadingCity
    : SERVICE_GUIDES[page.service].projectHeadingDepartment;
  const cards = page.projectOptions.map((option) => `<a href="${escapeAttribute(option.href)}" class="local-project-card" style="text-decoration:none;background:#FFFFFF;border:1px solid #EADFC9;border-radius:16px;overflow:hidden;display:flex;flex-direction:column" style-hover="border-color:#2E5B4C;box-shadow:0 8px 22px rgba(34,50,43,0.12);transform:translateY(-2px)">
          ${option.image ? `<img src="${escapeAttribute(option.image)}" alt="${escapeAttribute(option.imageAlt || option.title)}" width="720" height="420" loading="lazy" decoding="async">` : ""}
          <span style="padding:20px 22px 22px;display:flex;flex:1;flex-direction:column;gap:8px">
            <strong style="font-size:19px;font-weight:700;color:#1F2E27">${escapeHtml(option.title)}</strong>
            <span style="font-size:16.5px;color:#41504A">${escapeHtml(option.description)}</span>
            <span style="margin-top:auto;font-weight:700;font-size:16.5px;color:#B04E20">Décrire ce projet ›</span>
          </span>
        </a>`).join("");
  const coownership = page.service === "douche-senior" && page.coownershipConsiderations
    ? `<div style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:14px;padding:18px 22px"><p style="margin:0;font-size:17px;color:#2C463B"><strong>En copropriété</strong> — ${escapeHtml(page.coownershipConsiderations)}</p></div>`
    : "";
  return section(
    heading,
    `<div data-local-project-options style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">${cards}</div>${coownership}`,
    18
  );
}

function displayDetailValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(" · ");
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && typeof value.label === "string") return value.label;
  return "";
}

function serviceSpecificSection(page) {
  const labels = SERVICE_DETAIL_LABELS[page.service] || {};
  const details = Object.entries(labels)
    .map(([field, label]) => ({
      label,
      value: displayDetailValue(page.serviceDetails?.[field])
    }))
    .filter((item) => item.value);
  if (!details.length) return "";
  const heading = page.service === "douche-senior"
    ? "Votre salle de bain est-elle transformable ?"
    : "Votre escalier est-il compatible ?";
  const constraints = page.service === "douche-senior"
    ? [
        ["L’évacuation", "La pente d’écoulement et la distance jusqu’à la canalisation déterminent le niveau du receveur."],
        ["Le plancher", "Une dalle, un étage ou un plancher bois n’offrent pas la même possibilité d’encastrement."],
        ["L’espace disponible", "L’entrée, l’assise, les appuis et un éventuel dégagement pour une aide humaine doivent rester praticables."],
        ["La copropriété", "Une colonne d’eau, une dalle ou une gaine commune se vérifie avant la signature du devis."]
      ]
    : [
        ["La largeur utile", "La largeur, le passage résiduel et la position de l’utilisateur sont mesurés sur place."],
        ["Le bas des marches", "Une porte ou un passage peut conduire à étudier un rail escamotable."],
        ["L’état des marches", "Le rail se fixe sur les marches ; leur support et leur régularité doivent être contrôlés."],
        ["La copropriété", "Un escalier ou un accès commun nécessite une vérification distincte d’un escalier privatif."]
      ];
  return section(
    heading,
    `<div data-local-feasibility style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(250px,100%),1fr));gap:14px">${constraints.map(([title, text]) => `<div style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:20px 22px"><p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#B04E20">${escapeHtml(title)}</p><p style="margin:0;font-size:16.5px;color:#41504A">${escapeHtml(text)}</p></div>`).join("")}</div>
    <h3 style="margin:6px 0 0;font-family:'Source Serif 4',Georgia,serif;font-size:23px;color:#1F2E27">Ce que le professionnel relève ensuite</h3>
    <div data-local-service-details="${escapeAttribute(page.service)}" class="local-service-checklist">${details.map((item) => `<div>
      <span aria-hidden="true">✓</span><p><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.value)}</small></p>
    </div>`).join("")}</div>
    <a href="/projet/?projet=${escapeAttribute(page.cta.project)}" style="align-self:flex-start;text-decoration:none;background:#C05A2E;color:#FFFFFF;font-weight:700;font-size:18px;padding:15px 24px;border-radius:10px" style-hover="background:#A84D24">Faire vérifier la faisabilité</a>`,
    18,
    "faisabilite"
  );
}

function localCostSection(page) {
  if (!page.localCostFactors?.length) return "";
  return section(
    "Facteurs locaux pouvant influencer le projet",
    `<ul style="margin:0;padding-left:24px;color:#41504A">${page.localCostFactors.map((factor) => `<li>${escapeHtml(factor)}</li>`).join("")}</ul>`
  );
}

function resourceCard(item) {
  const url = item.officialUrl || item.url;
  const title = item.programName || item.title;
  const organization = item.officialOrganization || item.organization;
  const checkedAt = item.sourceCheckedAt || item.checkedAt;
  return `<a href="${escapeAttribute(url)}" style="text-decoration:none;background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:4px" style-hover="border-color:#2E5B4C">
    <span style="font-weight:600;font-size:18px;color:#1F2E27">${escapeHtml(title)}</span>
    ${item.description ? `<span style="font-size:16.5px;color:#41504A">${escapeHtml(item.description)}</span>` : ""}
    <span style="font-size:16.5px;color:#6B7A70">${escapeHtml(organization)} · consulté le ${escapeHtml(formatFrenchDate(checkedAt))}</span>
  </a>`;
}

function resourcesSection(page) {
  if (page.service === "douche-senior") return "";
  const aids = page.localAssistancePrograms || [];
  const national = aids.filter((item) => String(item.programType || "").startsWith("aide_nationale"));
  const local = [
    ...aids.filter((item) => !String(item.programType || "").startsWith("aide_nationale")),
    ...(page.usefulLocalContacts || [])
  ];
  if (!national.length && !local.length) return "";
  const group = (title, items) => items.length
    ? `<div style="display:flex;flex-direction:column;gap:12px"><h3 style="margin:0;font-size:21px;color:#1F2E27">${escapeHtml(title)}</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${items.map(resourceCard).join("")}</div></div>`
    : "";
  return section(
    page.departmentName === "Nord" ? "Aides et ressources utiles dans le Nord" : "Aides locales et contacts utiles",
    `${group("Aides nationales", national)}${group(`Dispositifs et contacts ${departmentLocation(page)}`, local)}`,
    18,
    "aides"
  );
}

function familyProjectSection(page) {
  const middle = page.service === "douche-senior"
    ? ["Le chantier se prépare", "La durée d’indisponibilité de la salle de bain et une solution temporaire se discutent dès la visite."]
    : ["La visite se prépare", "Les dimensions, les habitudes et les contraintes d’accès peuvent être relevées avec vous."];
  return `<section data-local-family-project aria-label="Vous cherchez pour un proche" style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:22px;padding:clamp(24px,3.2vw,38px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:28px;align-items:center">
    <div style="display:flex;flex-direction:column;gap:12px">
      <span style="color:#B04E20;font-weight:700;font-size:14px;letter-spacing:0.09em;text-transform:uppercase">Vous cherchez pour un parent</span>
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(23px,2.6vw,29px);line-height:1.2;color:#1F2E27">Organiser le projet à distance, sans forcer la décision</h2>
      <p style="margin:0;font-size:18px;color:#41504A">Vous pouvez décrire le logement concerné et rester l’interlocuteur si votre parent le préfère. La visite et le devis se préparent ensuite à son rythme.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:12px;align-items:flex-start"><span style="color:#2E5B4C;font-weight:700;font-size:19px">·</span><p style="margin:0;font-size:17px;color:#41504A"><strong style="color:#1F2E27">Vous restez l’interlocuteur.</strong> Les échanges passent par vous si cela facilite le projet.</p></div>
      <div style="display:flex;gap:12px;align-items:flex-start"><span style="color:#2E5B4C;font-weight:700;font-size:19px">·</span><p style="margin:0;font-size:17px;color:#41504A"><strong style="color:#1F2E27">${escapeHtml(middle[0])}.</strong> ${escapeHtml(middle[1])}</p></div>
      <div style="display:flex;gap:12px;align-items:flex-start"><span style="color:#2E5B4C;font-weight:700;font-size:19px">·</span><p style="margin:0;font-size:17px;color:#41504A"><strong style="color:#1F2E27">La décision reste libre.</strong> Une demande d’information n’oblige ni à recevoir une visite ni à signer un devis.</p></div>
      <a href="/projet/?projet=${escapeAttribute(page.cta.project)}&amp;pour=un-proche" style="align-self:flex-start;text-decoration:none;background:#C05A2E;color:#FFFFFF;font-weight:700;font-size:18px;padding:15px 24px;border-radius:10px" style-hover="background:#A84D24">Faire la demande pour un proche</a>
    </div>
  </section>`;
}

function coverageSection(page) {
  if (page.coverageStatus === "nationwide" && page.service === "monte-escalier") {
    return section(
      page.pageLevel === "department"
        ? `Des professionnels interviennent ${departmentLocation(page)}`
        : `Des professionnels interviennent à ${page.cityName}`,
      `<div data-coverage="nationwide" data-routing="${escapeAttribute(page.routingStatus)}" style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:14px;padding:18px 22px">
        <p style="margin:0;font-size:17.5px;color:#2C463B">Go Senior couvre l’ensemble des codes postaux du département ${escapeHtml(page.departmentName)} pour les projets de monte-escalier. Indiquez votre code postal et décrivez votre escalier afin que votre demande puisse être orientée vers un professionnel indépendant intervenant dans votre secteur.</p>
      </div>`,
      14,
      "pro"
    );
  }
  const place = page.pageLevel === "city" ? `à ${page.cityName}` : departmentLocation(page);
  return section(
    `Vérifier l’intervention ${place}`,
    `<div data-coverage="configurable" data-routing="${escapeAttribute(page.routingStatus)}" style="background:#FCF6E8;border:1px solid #E6D8AE;border-radius:14px;padding:18px 22px">
      <p style="margin:0;font-size:17.5px;color:#5C4E22">Indiquez le code postal du chantier et décrivez l’installation actuelle. Go Senior vérifie ensuite si un professionnel indépendant prenant en charge ce type de transformation intervient dans votre secteur.</p>
    </div>`,
    14,
    "pro"
  );
}

function processSection(page) {
  const steps = page.service === "monte-escalier"
    ? [
        ["Décrivez votre projet", "Indiquez la configuration de votre escalier, votre besoin et votre code postal. La demande est gratuite et sans engagement."],
        ["Nous identifions le professionnel de votre secteur", "À partir du code postal et du projet sélectionné, Go Senior identifie le professionnel indépendant intervenant dans votre zone."],
        ["Échangez sur votre projet", "Le professionnel peut vous recontacter pour préciser le besoin, étudier la configuration et préparer un devis personnalisé. Vous restez libre de poursuivre ou non."]
      ]
    : [
        ["Décrivez votre projet", "Indiquez votre logement, le projet recherché et votre code postal — gratuit et sans engagement."],
        ["Nous vérifions le secteur", "Go Senior vérifie si un professionnel indépendant prenant en charge ce type de travaux intervient dans votre zone."],
        ["Échangez sur votre projet", "Lorsqu’une solution est disponible, un professionnel peut vous recontacter pour préciser le besoin et préparer un devis personnalisé. Vous restez libre à chaque étape."]
      ];
  const exclusive = page.leadDistributionMode === "exclusive"
    ? `<p style="margin:0;font-size:16.5px;color:#6B7A70">Mise en relation un à un : votre demande est transmise à un seul professionnel intervenant dans votre secteur.</p>`
    : "";
  return `<section data-local-process class="local-process">
    <div class="local-process-visual"><img src="/uploads/visite-conseil-domicile-autonomie.webp" alt="Échange autour d’un projet d’adaptation du logement" width="800" height="600" loading="lazy"></div>
    <div class="local-process-copy">
      <p class="local-kicker">À votre rythme</p>
      <h2>Un accompagnement simple, du premier échange au devis</h2>
      <p>Vous gardez la main à chaque étape. Go Senior recueille votre besoin et facilite la mise en relation ; le professionnel indépendant étudie ensuite la faisabilité et le devis.</p>
      <div class="local-process-steps">${steps.map((step, index) => `<div>
        <span>${index + 1}</span><div><h3>${escapeHtml(step[0])}</h3><p>${escapeHtml(step[1])}</p></div>
      </div>`).join("")}</div>
      ${exclusive}
    </div>
  </section>`;
}

function faqSection(page) {
  if (!page.faq?.length) return "";
  const place = page.pageLevel === "city" ? ` à ${page.cityName}` : ` ${departmentLocation(page)}`;
  const items = page.faq.map((item) => `<details data-local-faq style-hover="border-color:#2E5B4C;background:#FDFCF9" style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:0 22px">
        <summary style="cursor:pointer;font-weight:700;font-size:19px;color:#1F2E27;padding:17px 0;list-style:none;display:flex;justify-content:space-between;gap:12px">${escapeHtml(item.question)}<span style="color:#B04E20" aria-hidden="true">+</span></summary>
        <p style="margin:0;padding:0 0 17px;font-size:18px;color:#41504A">${escapeHtml(item.answer)}</p>
      </details>`).join("");
  return section(
    `Questions fréquentes${place}`,
    `<div style="display:flex;flex-direction:column;gap:10px">${items}</div>`,
    16
  );
}

function nearbySection(page, allPages) {
  const nearby = publicNearbyLocations(page, allPages);
  if (!nearby.length) return "";
  const links = nearby.map((item) => `<a href="${escapeAttribute(localPageRoute(item))}" style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:999px;padding:9px 18px;text-decoration:none;font-weight:600">${escapeHtml(item.cityName || item.departmentName)}</a>`).join("");
  const heading = page.pageLevel === "department"
    ? "Autres départements"
    : "Villes voisines";
  return section(
    heading,
    `<div data-local-nearby style="display:flex;flex-wrap:wrap;gap:12px">${links}</div>`
  );
}

function cityGuidesSection(page, allPages) {
  if (page.pageLevel !== "department") return "";
  const configuredIds = (page.cityLocations || []).map((item) => typeof item === "string" ? item : item.id);
  const cityIds = new Set(configuredIds);
  const candidates = allPages.filter((item) => item.service === page.service
    && item.pageLevel === "city"
    && item.departmentSlug === page.departmentSlug
    && isPublicLocalPage(item));
  const cities = (configuredIds.length
    ? candidates.filter((item) => cityIds.has(item.id))
    : candidates
  ).sort((left, right) => {
    if (!configuredIds.length) {
      const leftIndex = (page.localPlaces || []).indexOf(left.cityName);
      const rightIndex = (page.localPlaces || []).indexOf(right.cityName);
      if (leftIndex >= 0 || rightIndex >= 0) {
        if (leftIndex < 0) return 1;
        if (rightIndex < 0) return -1;
        return leftIndex - rightIndex;
      }
      return left.cityName.localeCompare(right.cityName, "fr");
    }
    return configuredIds.indexOf(left.id) - configuredIds.indexOf(right.id);
  });
  if (!cities.length) return "";
  const shower = page.service === "douche-senior";
  const links = cities.map((city) => `<a href="${escapeAttribute(localPageRoute(city))}" style="display:flex;align-items:center;justify-content:space-between;gap:14px;background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:16px 18px;text-decoration:none;font-weight:700;color:#1F2E27" style-hover="border-color:#2E5B4C;box-shadow:0 6px 18px rgba(34,50,43,.08)">
      <span>${escapeHtml(city.cityName)}</span><span style="color:#B04E20" aria-hidden="true">›</span>
    </a>`).join("");
  return section(
    `Guides ${shower ? "douche senior" : "monte-escalier"} dans les principales villes de ${page.departmentName}`,
    `<p style="margin:0;color:#41504A">${shower
      ? "Retrouvez des repères communaux sur la population, les logements et les points à vérifier avant de transformer une salle de bain."
      : "Retrouvez des repères communaux sur la population, les logements et les mesures à prévoir avant de choisir un rail et un équipement."}</p>
      <div data-local-city-guides style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));gap:12px">${links}</div>`,
    16
  );
}

function sourcesSection(page) {
  if (!page.officialSources?.length) return "";
  const sources = page.officialSources.map((source) => {
    const title = source.exactTitle || source.title;
    const claims = Array.isArray(source.supportedClaims) ? source.supportedClaims.join(" · ") : source.supports;
    const year = source.dataYear || source.dataDate;
    const url = source.officialUrl || source.url;
    const published = source.publishedAt
      ? ` · publié le ${formatFrenchDate(source.publishedAt)}`
      : "";
    const extraLinks = (source.additionalOfficialUrls || []).map((extraUrl, index) => `<a href="${escapeAttribute(extraUrl)}" style="font-size:16px;color:#2E5B4C">Source officielle complémentaire ${index + 1}</a>`).join("");
    return `<div style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:4px">
      <a href="${escapeAttribute(url)}" style="text-decoration:none;font-weight:600;font-size:18px;color:#1F2E27">${escapeHtml(source.organization)} — ${escapeHtml(title)}</a>
      <span style="font-size:16.5px;color:#41504A">${escapeHtml(claims)} · données ${escapeHtml(year)}${escapeHtml(published)}</span>
      <span style="font-size:16.5px;color:#6B7A70">Consulté le ${escapeHtml(formatFrenchDate(source.checkedAt))}</span>
      ${extraLinks}
    </div>`;
  }).join("");
  return section(
    "Sources officielles",
    `<div data-local-sources style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${sources}</div>`
  );
}

function finalCta(page) {
  const place = page.pageLevel === "city" ? ` à ${page.cityName}` : ` ${departmentLocation(page)}`;
  const conclusion = page.conclusion
    ? `<p style="margin:0;font-size:18.5px;color:#C6D7CB">${escapeHtml(page.conclusion)}</p>`
    : `<p style="margin:0;font-size:18.5px;color:#C6D7CB">Indiquez votre code postal pour vérifier les possibilités dans votre secteur.</p>`;
  return `<section style="background:#1F4237;border-radius:20px;padding:clamp(28px,4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:32px;align-items:center">
    <div style="display:flex;flex-direction:column;gap:10px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(24px,2.8vw,30px);color:#FFFFFF">${escapeHtml(page.cta.title || `Votre projet${place}`)}</h2>
      ${conclusion}
    </div>
    ${blocProjet(page)}
  </section>`;
}

function templateBody(page, allPages) {
  const publication = effectivePublication(page);
  return `${draftBanner(publication)}
  ${hero(page)}
  <div style="max-width:1200px;margin:0 auto;padding:56px 24px 88px;display:flex;flex-direction:column;gap:56px">
    ${afterRequestSection(page)}
    ${essentialsSection(page)}
    ${dailyLifeSection(page)}
    ${editorialSection(page)}
    ${scopeSection(page)}
    ${priceSection(page)}
    ${localDataSection(page)}
    ${projectOptionsSection(page)}
    ${serviceSpecificSection(page)}
    ${localCostSection(page)}
    ${resourcesSection(page)}
    ${familyProjectSection(page)}
    ${coverageSection(page)}
    ${processSection(page)}
    ${cityGuidesSection(page, allPages)}
    ${faqSection(page)}
    ${nearbySection(page, allPages)}
    ${sourcesSection(page)}
    ${finalCta(page)}
  </div>`;
}

function renderDocument(page, allPages, template) {
  const active = page.service;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeAttribute(page.metaDescription)}">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&amp;display=swap" rel="stylesheet">
<style>
html,body{overflow-x:hidden;max-width:100%}html{scroll-padding-top:96px}
img{max-width:100%;height:auto}
[id]{scroll-margin-top:94px}
.local-hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(350px,.9fr);gap:28px;align-items:center}
.local-hero-grid>*{min-width:0}.local-hero-grid>dc-import{min-width:0;max-width:100%}
.local-hero-visual{position:relative;margin:0;grid-column:1/-1;order:2;aspect-ratio:1340/560;border-radius:22px;overflow:hidden;box-shadow:0 16px 38px rgba(34,50,43,.15)}
.local-hero-visual img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.local-hero-visual figcaption{position:absolute;left:14px;right:14px;bottom:14px;padding:10px 13px;border-radius:10px;background:rgba(31,66,55,.9);color:#fff;font-size:14.5px;line-height:1.35}
.local-trust-pills{display:flex;flex-wrap:wrap;gap:8px}
.local-trust-pills span{padding:7px 10px;border-radius:999px;background:#fff;border:1px solid #DDD4C5;color:#2E5B4C;font-size:14.5px;font-weight:600}
.local-shortcuts{background:#FFFFFF;border-top:1px solid #E5DFD2;border-bottom:1px solid #E5DFD2}.local-shortcuts>div{max-width:1120px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}.local-shortcuts a{display:flex;align-items:center;justify-content:center;gap:10px;min-height:74px;padding:10px 16px;text-decoration:none;color:#1F2E27;border-left:1px solid #ECE5D9}.local-shortcuts a:last-child{border-right:1px solid #ECE5D9}.local-shortcuts a>span{width:36px;height:36px;border-radius:50%;background:#EBF1E8;display:flex;align-items:center;justify-content:center}.local-shortcuts strong{font-size:15.5px}
.local-after-request{padding:clamp(25px,3.5vw,38px);border-radius:20px;background:#FFFFFF;border:1px solid #E5DFD2;box-shadow:0 10px 26px rgba(34,50,43,.07);display:flex;flex-direction:column;gap:24px}.local-after-request-heading{display:flex;align-items:baseline;justify-content:space-between;gap:18px;flex-wrap:wrap}.local-after-request-heading h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(25px,2.8vw,31px);line-height:1.2;color:#1F2E27}.local-after-request-heading>span{color:#6B7A70;font-size:16px}.local-after-request-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#E5DFD2;border:1px solid #E5DFD2;border-radius:15px;overflow:hidden}.local-after-request-grid>div{background:#FAF7F0;padding:20px;display:grid;grid-template-columns:42px 1fr;gap:12px}.local-after-request-grid>div>span{width:40px;height:40px;border-radius:50%;background:#EBF1E8;display:flex;align-items:center;justify-content:center}.local-after-request-grid p{margin:0;display:flex;flex-direction:column;gap:4px}.local-after-request-grid strong{font-size:17px;color:#1F2E27}.local-after-request-grid small{font-size:15px;line-height:1.45;color:#5D6B64}
.local-project-card{transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
.local-project-card>img{width:100%;height:190px;object-fit:cover;display:block}
.local-service-checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;padding:clamp(24px,3vw,34px);background:#F7E7DC;border:1px solid #E8CDBB;border-radius:18px}
.local-service-checklist>div{display:grid;grid-template-columns:30px 1fr;gap:10px;padding:14px 0;border-top:1px solid rgba(183,88,49,.18)}
.local-service-checklist>div:nth-child(-n+2){border-top:0}
.local-service-checklist>div>span{width:25px;height:25px;margin-top:2px;border-radius:50%;background:#C05A2E;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
.local-service-checklist p{margin:0;display:flex;flex-direction:column;gap:2px}.local-service-checklist strong{font-size:17px;color:#1F2E27}.local-service-checklist small{font-size:15.5px;line-height:1.45;color:#5D5A54}
.local-essentials{display:grid;grid-template-columns:minmax(190px,.7fr) minmax(0,2.3fr);gap:24px;padding:28px;border-radius:20px;background:#1F4237;color:#fff;box-shadow:0 12px 30px rgba(31,66,55,.12)}
.local-essentials-heading{display:flex;flex-direction:column;gap:6px;justify-content:center}
.local-essentials-heading p,.local-kicker{margin:0;color:#D98A5D;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:14px}
.local-essentials-heading h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:28px;line-height:1.18;color:#fff}
.local-essentials-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.18);border-radius:14px;overflow:hidden}
.local-essentials-grid>div{padding:17px;background:#285044;display:flex;flex-direction:column;gap:3px}
.local-essentials-grid span{font-size:13.5px;color:#C6D7CB;text-transform:uppercase;letter-spacing:.04em}
.local-essentials-grid strong{font-family:'Source Serif 4',Georgia,serif;font-size:22px;color:#fff}
.local-essentials-grid small{font-size:14.5px;color:#DCE7DF;line-height:1.4}
.local-daily-life{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:36px;padding:clamp(26px,4vw,44px);border-radius:20px;background:#F0E7D9;border:1px solid #E1D2BD}
.local-daily-life h2,.local-process h2{margin:7px 0 12px;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(27px,3vw,34px);line-height:1.15;color:#1F2E27}
.local-daily-life>div>p:last-child,.local-process-copy>p{margin:0;color:#41504A}
.local-daily-life ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px}
.local-daily-life li{display:grid;grid-template-columns:46px 1fr;gap:14px;align-items:start}
.local-daily-life li>span{width:42px;height:42px;border-radius:50%;background:#C0643D;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
.local-daily-life li strong{display:block;color:#1F2E27;font-size:18px}
.local-daily-life li p{margin:2px 0 0;color:#41504A;font-size:16.5px}
.local-editorial{display:grid;grid-template-columns:auto minmax(230px,1.3fr) minmax(180px,.8fr) auto;gap:16px;align-items:center;padding:18px 22px;background:#fff;border:1px solid #E5DFD2;border-radius:16px}
.local-editorial-mark{width:44px;height:44px;border-radius:50%;background:#EBF1E8;color:#2E5B4C;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center}
.local-editorial>div:not(.local-editorial-mark){display:flex;flex-direction:column;gap:2px}
.local-editorial strong{font-size:16.5px;color:#1F2E27}.local-editorial span{font-size:14.5px;color:#6B7A70}.local-editorial a{font-size:15.5px;font-weight:600;text-decoration:none}
.local-process{display:grid;grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr);border-radius:22px;overflow:hidden;background:#fff;border:1px solid #EADFC9;box-shadow:0 12px 30px rgba(34,50,43,.08)}
.local-process-visual{min-height:520px}.local-process-visual img{width:100%;height:100%;object-fit:cover}
.local-process-copy{padding:clamp(28px,4vw,46px);display:flex;flex-direction:column;justify-content:center;gap:10px}
.local-process-steps{display:flex;flex-direction:column;margin-top:12px}
.local-process-steps>div{display:grid;grid-template-columns:38px 1fr;gap:13px;padding:14px 0;border-top:1px solid #E8E1D5}
.local-process-steps>div>span{width:34px;height:34px;border-radius:50%;background:#C05A2E;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px}
.local-process-steps h3{margin:0;font-size:18px;color:#1F2E27}.local-process-steps p{margin:3px 0 0;color:#41504A;font-size:16px}
.gsh-desk{display:flex}.gsh-mob{display:none}.gsh-bar{display:none}
@media(max-width:1180px){.local-essentials{grid-template-columns:1fr}.local-essentials-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1060px){.gsh-desk{display:none !important}.gsh-mob{display:flex !important}.gsh-bar{display:flex !important}body{padding-bottom:76px}.local-editorial{grid-template-columns:auto 1fr}.local-editorial>a{grid-column:2}.local-process{grid-template-columns:1fr}.local-process-visual{min-height:340px}}
@media(max-width:820px){.local-hero-grid{grid-template-columns:minmax(0,1fr)}.local-daily-life{grid-template-columns:1fr}.local-hero-visual{grid-column:auto;aspect-ratio:4/3;max-height:340px}.local-shortcuts>div{grid-template-columns:repeat(2,minmax(0,1fr));padding:0}.local-shortcuts a:nth-child(odd){border-left:0}.local-shortcuts a:nth-child(-n+2){border-bottom:1px solid #ECE5D9}.local-after-request-grid{grid-template-columns:1fr}.local-essentials{padding:22px}.local-essentials-grid{grid-template-columns:1fr}.local-service-checklist{grid-template-columns:1fr}.local-service-checklist>div:nth-child(2){border-top:1px solid rgba(183,88,49,.18)}.local-process-visual{min-height:280px}}
@media(max-width:520px){.local-editorial{grid-template-columns:1fr}.local-editorial>a{grid-column:auto}.local-shortcuts strong{font-size:14px}.local-project-card>img{height:175px}.local-daily-life{padding:24px}.local-daily-life li{grid-template-columns:38px 1fr}.local-daily-life li>span{width:36px;height:36px}.local-process-copy{padding:25px 22px}}
body{margin:0;background:#FAF7F0;font-family:'Libre Franklin',system-ui,sans-serif;color:#22322B;font-size:19.5px;line-height:1.65}
a{color:#2E5B4C}a:hover{color:#1F4237}
:focus-visible{outline:3px solid #C05A2E;outline-offset:2px;border-radius:4px}
details summary::-webkit-details-marker{display:none}
</style>
<title>${escapeHtml(page.seoTitle)}</title>
</helmet>
<dc-import name="Header" active="${escapeAttribute(active)}" hint-size="100%,78px"></dc-import>
<main data-local-page="${escapeAttribute(page.id)}" data-local-template="${escapeAttribute(template)}">
  ${templateBody(page, allPages)}
</main>
<dc-import name="Footer" hint-size="100%,520px"></dc-import>
</x-dc>
</body>
</html>`;
}

export function renderMonteEscalierDepartment(page, allPages) {
  return renderDocument(page, allPages, "monte-escalier-department");
}

export function renderMonteEscalierCity(page, allPages) {
  return renderDocument(page, allPages, "monte-escalier-city");
}

export function renderDoucheSeniorDepartment(page, allPages) {
  return renderDocument(page, allPages, "douche-senior-department");
}

export function renderDoucheSeniorCity(page, allPages) {
  return renderDocument(page, allPages, "douche-senior-city");
}

const TEMPLATES = Object.freeze({
  "monte-escalier-department": renderMonteEscalierDepartment,
  "monte-escalier-city": renderMonteEscalierCity,
  "douche-senior-department": renderDoucheSeniorDepartment,
  "douche-senior-city": renderDoucheSeniorCity
});

export function renderLocalPage(page, allPages) {
  const key = `${page.service}-${page.pageLevel}`;
  const template = TEMPLATES[key];
  if (!template) throw new Error(`Template local inconnu: ${key}`);
  return template(page, allPages);
}

export function renderDepartmentDirectory(allPages, service = "monte-escalier") {
  const shower = service === "douche-senior";
  const serviceLabel = shower ? "Douche senior" : "Monte-escalier";
  const route = `/${service}/departements/`;
  const cardSubtitle = shower ? "Prix, travaux et données logement" : "Prix, aides et données locales";
  const departments = allPages
    .filter((page) => page.service === service && page.pageLevel === "department")
    .filter(isPublicLocalPage)
    .sort((a, b) => a.departmentName.localeCompare(b.departmentName, "fr"));
  const regions = new Map();
  for (const page of departments) {
    const entries = regions.get(page.regionName) || [];
    entries.push(page);
    regions.set(page.regionName, entries);
  }
  const groups = [...regions.entries()].map(([region, pages]) => `<section style="display:flex;flex-direction:column;gap:18px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(25px,3vw,32px);color:#1F2E27">${escapeHtml(region)}</h2>
      <div data-department-directory style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
        ${pages.map((page) => `<a href="${escapeAttribute(localPageRoute(page))}" style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px;text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:16px" style-hover="border-color:#2E5B4C;transform:translateY(-1px)">
          <span style="display:flex;flex-direction:column;gap:3px"><strong style="font-size:20px;color:#1F2E27">${escapeHtml(page.departmentName)}</strong><span style="font-size:16px;color:#6B7A70">${escapeHtml(cardSubtitle)}</span></span>
          <span aria-label="Département ${escapeAttribute(page.departmentCode)}" style="width:42px;height:42px;border-radius:50%;background:#EBF1E8;color:#2E5B4C;font-weight:700;display:flex;align-items:center;justify-content:center">${escapeHtml(page.departmentCode)}</span>
        </a>`).join("")}
      </div>
    </section>`).join("");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeAttribute(shower ? "Trouvez les guides Go Senior consacrés à la douche senior par département : prix, contraintes techniques, données logement et préparation du devis." : "Trouvez les guides Go Senior consacrés au monte-escalier par département : prix, aides, données INSEE et ressources officielles locales.")}">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&amp;display=swap" rel="stylesheet">
<style>
html,body{overflow-x:hidden;max-width:100%}body{margin:0;background:#FAF7F0;font-family:'Libre Franklin',system-ui,sans-serif;color:#22322B;font-size:19px;line-height:1.65}a{color:#2E5B4C}:focus-visible{outline:3px solid #C05A2E;outline-offset:2px;border-radius:4px}
</style>
<title>${escapeHtml(shower ? "Douche senior par département : prix et travaux | Go Senior" : "Monte-escalier par département : prix et aides | Go Senior")}</title>
</helmet>
<dc-import name="Header" active="${escapeAttribute(service)}" hint-size="100%,78px"></dc-import>
<main>
  <section style="background:linear-gradient(180deg,#F3EFE4 0%,#FAF7F0 100%);border-bottom:1px solid #E5DFD2">
    <div style="max-width:1200px;margin:0 auto;padding:40px 24px 52px;display:flex;flex-direction:column;gap:18px">
      <nav aria-label="Fil d’Ariane" style="font-size:17px;color:#6B7A70"><a href="/" style="text-decoration:none">Accueil</a> <span aria-hidden="true">›</span> <a href="/${escapeAttribute(service)}/" style="text-decoration:none">${escapeHtml(serviceLabel)}</a> <span aria-hidden="true">›</span> <a href="${escapeAttribute(route)}" aria-current="page" style="text-decoration:none">Départements</a></nav>
      <p style="margin:0;color:#C05A2E;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:15px">Guides locaux vérifiés</p>
      <h1 style="margin:0;max-width:850px;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,4.5vw,52px);line-height:1.12;color:#1F2E27">${escapeHtml(shower ? "La douche senior dans votre département" : "Le monte-escalier dans votre département")}</h1>
      <p style="margin:0;max-width:820px;font-size:20px;color:#41504A">${escapeHtml(shower ? "Chaque guide met en regard les prix nationaux, les données locales sur les logements et les contraintes concrètes à vérifier avant de remplacer une baignoire ou de sécuriser une douche." : "Chaque guide réunit des repères de prix nationaux, des données INSEE 2023, les aides et contacts officiels du département, puis un accès direct à l’étude de votre projet.")}</p>
    </div>
  </section>
  <div style="max-width:1200px;margin:0 auto;padding:56px 24px 88px;display:flex;flex-direction:column;gap:54px">
    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Des prix comparables</h2><p style="margin:0;color:#41504A">${escapeHtml(shower ? "Cinq niveaux de travaux sont séparés des contraintes propres à chaque salle de bain." : "Les mêmes quatre fourchettes nationales sont distinguées des facteurs propres au logement.")}</p></div>
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Un contexte réellement local</h2><p style="margin:0;color:#41504A">${escapeHtml(shower ? "Maisons, appartements et structure par âge proviennent des dossiers complets INSEE." : "Population, âge du parc et type de logement proviennent des dossiers complets INSEE.")}</p></div>
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Une étude concrète</h2><p style="margin:0;color:#41504A">${escapeHtml(shower ? "Sol, évacuation, étanchéité, appuis et copropriété sont traités avant le devis." : "Les ressources officielles sont publiées avec leur organisme, leur lien et leur date de vérification.")}</p></div>
    </section>
    ${groups || `<p>Aucun guide départemental n’est encore publié.</p>`}
    <section style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:8px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:27px;color:#1F2E27">101 guides contrôlés</h2>
      <p style="margin:0;color:#41504A">Les 101 départements disposent d’un guide. Chaque page n’apparaît ici qu’après validation de ses sources, de ses données, de sa profondeur éditoriale et de sa différence avec les autres contenus locaux.</p>
    </section>
  </div>
</main>
<dc-import name="Footer" hint-size="100%,520px"></dc-import>
</x-dc>
</body>
</html>`;
}
