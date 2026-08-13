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

function section(title, content, gap = 14) {
  if (!content) return "";
  return `<section style="display:flex;flex-direction:column;gap:${gap}px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:clamp(25px,2.8vw,31px);color:#1F2E27">${escapeHtml(title)}</h2>
      ${content}
    </section>`;
}

function breadcrumb(page) {
  const guides = SERVICE_GUIDES[page.service];
  const serviceLabel = SERVICE_LABELS[page.service];
  const items = [
    { label: "Accueil", href: "/" },
    { label: serviceLabel, href: guides.national }
  ];
  if (page.service === "monte-escalier") {
    items.push({ label: "Départements", href: "/monte-escalier/departements/" });
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
  if (page.service === "monte-escalier") {
    items.push({ name: "Départements", route: "/monte-escalier/departements/" });
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
          <img src="${escapeAttribute(image)}" alt="${escapeAttribute(imageAlt)}" width="800" height="600" loading="eager" fetchpriority="high">
          <figcaption>${escapeHtml(imageCaption)}</figcaption>
        </figure>
        ${blocProjet(page, page.cta.title)}
      </div>
    </div>
  </section>`;
}

function essentialsSection(page) {
  if (page.service !== "monte-escalier" || page.pageLevel !== "department") return "";
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
  if (page.service !== "monte-escalier" || page.pageLevel !== "department") return "";
  const firstPlace = page.localPlaces?.[0] || page.departmentName;
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
    const range = Number.isFinite(item.amountMin) && Number.isFinite(item.amountMax)
      ? `${formatEuro(item.amountMin)} – ${formatEuro(item.amountMax)} €`
      : item.range;
    return `
        <div style="background:#FFFFFF;border:1px solid #EADFC9;border-radius:14px;padding:16px 22px;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between">
          <span style="display:flex;flex:1 1 280px;flex-direction:column;gap:2px"><strong style="font-size:17.5px;font-weight:700;color:#1F2E27">${escapeHtml(label)}</strong>${item.descriptor ? `<small style="font-size:15.5px;line-height:1.45;color:#6B7A70">${escapeHtml(item.descriptor)}</small>` : ""}</span>
          <span style="font-family:'Source Serif 4',Georgia,serif;font-weight:700;font-size:21px;color:#2E5B4C">${escapeHtml(range)}</span>
        </div>`;
  }).join("");
  const note = page.service === "monte-escalier"
    ? "Ces montants sont des repères nationaux 2026, et non des prix moyens propres à ce département. Le coût précis dépend de la configuration du logement, du rail, des options, de la pose et des éventuels travaux complémentaires."
    : "Ces montants sont des repères nationaux, pas un devis ni un prix local. Le coût dépend de la configuration du logement et du projet.";
  return section(
    `Quel budget prévoir pour ${label} ${place} ?`,
    `<div data-local-price-block style="display:flex;flex-direction:column;gap:10px">${rows}
      </div>
      <p style="margin:0;color:#41504A">${escapeHtml(note)} <a href="${guide.price}">${guide.priceLabel}</a>.</p>`
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
    18
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
  const heading = "Ce que le professionnel étudie avec vous";
  return section(
    heading,
    `<div data-local-service-details="${escapeAttribute(page.service)}" class="local-service-checklist">${details.map((item) => `<div>
      <span aria-hidden="true">✓</span><p><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.value)}</small></p>
    </div>`).join("")}</div>`,
    18
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
    18
  );
}

function coverageSection(page) {
  if (page.coverageStatus === "nationwide" && page.service === "monte-escalier") {
    return section(
      page.pageLevel === "department"
        ? `Des professionnels interviennent ${departmentLocation(page)}`
        : `Des professionnels interviennent à ${page.cityName}`,
      `<div data-coverage="nationwide" data-routing="${escapeAttribute(page.routingStatus)}" style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:14px;padding:18px 22px">
        <p style="margin:0;font-size:17.5px;color:#2C463B">Go Senior couvre l’ensemble des codes postaux du département ${escapeHtml(page.departmentName)} pour les projets de monte-escalier. Indiquez votre code postal et décrivez votre escalier afin que votre demande puisse être orientée vers un professionnel indépendant intervenant dans votre secteur.</p>
      </div>`
    );
  }
  const place = page.pageLevel === "city" ? `à ${page.cityName}` : departmentLocation(page);
  return section(
    `Professionnels intervenant ${place}`,
    `<div data-coverage="configurable" data-routing="${escapeAttribute(page.routingStatus)}" style="background:#FCF6E8;border:1px solid #E6D8AE;border-radius:14px;padding:18px 22px">
      <p style="margin:0;font-size:17.5px;color:#5C4E22">Indiquez votre code postal pour que votre demande soit orientée selon la configuration de ce service.</p>
    </div>`
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
    ${coverageSection(page)}
    ${processSection(page)}
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
html,body{overflow-x:hidden;max-width:100%}
img{max-width:100%;height:auto}
[id]{scroll-margin-top:94px}
.local-hero-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(250px,.7fr) minmax(350px,.92fr);gap:24px;align-items:center}
.local-hero-grid>*{min-width:0}.local-hero-grid>dc-import{min-width:0;max-width:100%}
.local-hero-visual{position:relative;margin:0;min-height:370px;border-radius:22px;overflow:hidden;box-shadow:0 16px 38px rgba(34,50,43,.15)}
.local-hero-visual img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.local-hero-visual figcaption{position:absolute;left:14px;right:14px;bottom:14px;padding:10px 13px;border-radius:10px;background:rgba(31,66,55,.9);color:#fff;font-size:14.5px;line-height:1.35}
.local-trust-pills{display:flex;flex-wrap:wrap;gap:8px}
.local-trust-pills span{padding:7px 10px;border-radius:999px;background:#fff;border:1px solid #DDD4C5;color:#2E5B4C;font-size:14.5px;font-weight:600}
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
@media(max-width:1180px){.local-hero-grid{grid-template-columns:minmax(0,1fr) minmax(280px,.72fr)}.local-hero-grid>dc-import{grid-column:1/-1}.local-essentials{grid-template-columns:1fr}.local-essentials-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1060px){.gsh-desk{display:none !important}.gsh-mob{display:flex !important}.gsh-bar{display:flex !important}body{padding-bottom:76px}.local-editorial{grid-template-columns:auto 1fr}.local-editorial>a{grid-column:2}.local-process{grid-template-columns:1fr}.local-process-visual{min-height:340px}}
@media(max-width:820px){.local-hero-grid{grid-template-columns:minmax(0,1fr)}.local-daily-life{grid-template-columns:1fr}.local-hero-grid>dc-import{grid-column:auto}.local-hero-grid>figure{order:1}.local-hero-visual{min-height:280px}.local-essentials{padding:22px}.local-essentials-grid{grid-template-columns:1fr}.local-service-checklist{grid-template-columns:1fr}.local-service-checklist>div:nth-child(2){border-top:1px solid rgba(183,88,49,.18)}.local-process-visual{min-height:280px}}
@media(max-width:520px){.local-editorial{grid-template-columns:1fr}.local-editorial>a{grid-column:auto}.local-hero-visual{min-height:240px}.local-project-card>img{height:175px}.local-daily-life{padding:24px}.local-daily-life li{grid-template-columns:38px 1fr}.local-daily-life li>span{width:36px;height:36px}.local-process-copy{padding:25px 22px}}
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

export function renderDepartmentDirectory(allPages) {
  const departments = allPages
    .filter((page) => page.service === "monte-escalier" && page.pageLevel === "department")
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
          <span style="display:flex;flex-direction:column;gap:3px"><strong style="font-size:20px;color:#1F2E27">${escapeHtml(page.departmentName)}</strong><span style="font-size:16px;color:#6B7A70">Prix, aides et données locales</span></span>
          <span aria-label="Département ${escapeAttribute(page.departmentCode)}" style="width:42px;height:42px;border-radius:50%;background:#EBF1E8;color:#2E5B4C;font-weight:700;display:flex;align-items:center;justify-content:center">${escapeHtml(page.departmentCode)}</span>
        </a>`).join("")}
      </div>
    </section>`).join("");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Trouvez les guides Go Senior consacrés au monte-escalier par département : prix, aides, données INSEE et ressources officielles locales.">
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
<title>Monte-escalier par département : prix et aides | Go Senior</title>
</helmet>
<dc-import name="Header" active="monte-escalier" hint-size="100%,78px"></dc-import>
<main>
  <section style="background:linear-gradient(180deg,#F3EFE4 0%,#FAF7F0 100%);border-bottom:1px solid #E5DFD2">
    <div style="max-width:1200px;margin:0 auto;padding:40px 24px 52px;display:flex;flex-direction:column;gap:18px">
      <nav aria-label="Fil d’Ariane" style="font-size:17px;color:#6B7A70"><a href="/" style="text-decoration:none">Accueil</a> <span aria-hidden="true">›</span> <a href="/monte-escalier/" style="text-decoration:none">Monte-escalier</a> <span aria-hidden="true">›</span> <a href="/monte-escalier/departements/" aria-current="page" style="text-decoration:none">Départements</a></nav>
      <p style="margin:0;color:#C05A2E;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:15px">Guides locaux vérifiés</p>
      <h1 style="margin:0;max-width:850px;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,4.5vw,52px);line-height:1.12;color:#1F2E27">Le monte-escalier dans votre département</h1>
      <p style="margin:0;max-width:820px;font-size:20px;color:#41504A">Chaque guide réunit des repères de prix nationaux, des données INSEE 2023, les aides et contacts officiels du département, puis un accès direct à l’étude de votre projet.</p>
    </div>
  </section>
  <div style="max-width:1200px;margin:0 auto;padding:56px 24px 88px;display:flex;flex-direction:column;gap:54px">
    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Des prix comparables</h2><p style="margin:0;color:#41504A">Les mêmes quatre fourchettes nationales sont distinguées des facteurs propres au logement.</p></div>
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Un contexte réellement local</h2><p style="margin:0;color:#41504A">Population, âge du parc et type de logement proviennent des dossiers complets INSEE.</p></div>
      <div style="background:#FFFFFF;border:1px solid #E5DFD2;border-radius:14px;padding:22px"><h2 style="margin:0 0 8px;font-size:21px;color:#1F2E27">Des ressources officielles</h2><p style="margin:0;color:#41504A">Aides et contacts sont publiés avec leur organisme, leur lien et leur date de vérification.</p></div>
    </section>
    ${groups || `<p>Aucun guide départemental n’est encore publié.</p>`}
    <section style="background:#EBF1E8;border:1px solid #D7E2D2;border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:8px">
      <h2 style="margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:27px;color:#1F2E27">Une couverture nationale contrôlée</h2>
      <p style="margin:0;color:#41504A">Les 101 départements disposent d’un guide. Chaque page n’apparaît ici qu’après validation de ses sources, de ses données, de sa profondeur éditoriale et de sa différence avec les autres contenus locaux.</p>
    </section>
  </div>
</main>
<dc-import name="Footer" hint-size="100%,520px"></dc-import>
</x-dc>
</body>
</html>`;
}
