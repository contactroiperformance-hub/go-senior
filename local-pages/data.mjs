import { departmentRecords } from "./department-records.mjs";

const updatedAt = "2026-08-12";
const showerUpdatedAt = "2026-08-13";

const stairliftPrices = Object.freeze([
  {
    productType: "Monte-escalier droit",
    descriptor: "Rail rectiligne pour un escalier sans virage",
    amountMin: 2500,
    amountMax: 5500,
    currency: "EUR",
    includedItems: ["équipement", "rail", "pose"],
    excludedItems: ["options", "travaux électriques", "travaux complémentaires"],
    dataYear: 2026,
    sourceTitle: "Guide des prix d’un monte-escalier — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-monte-escalier/",
    sourceCheckedAt: "2026-08-12"
  },
  {
    productType: "Monte-escalier tournant",
    descriptor: "Rail sur mesure pour courbes, paliers ou plusieurs volées",
    amountMin: 6000,
    amountMax: 12000,
    currency: "EUR",
    includedItems: ["équipement", "rail sur mesure", "pose"],
    excludedItems: ["options", "travaux électriques", "travaux complémentaires"],
    dataYear: 2026,
    sourceTitle: "Guide des prix d’un monte-escalier — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-monte-escalier/",
    sourceCheckedAt: "2026-08-12"
  },
  {
    productType: "Monte-escalier extérieur",
    descriptor: "Équipement adapté à un perron ou à un accès extérieur",
    amountMin: 4000,
    amountMax: 10000,
    currency: "EUR",
    includedItems: ["équipement extérieur", "rail", "pose"],
    excludedItems: ["options", "préparation du support", "travaux électriques", "travaux complémentaires"],
    dataYear: 2026,
    sourceTitle: "Guide des prix d’un monte-escalier — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-monte-escalier/",
    sourceCheckedAt: "2026-08-12"
  },
  {
    productType: "Monte-escalier assis-debout",
    descriptor: "Siège-perche ou appui haut selon les capacités de l’utilisateur",
    amountMin: 4000,
    amountMax: 9000,
    currency: "EUR",
    includedItems: ["équipement avec siège-perche ou appui haut", "rail", "pose"],
    excludedItems: ["options", "travaux électriques", "travaux complémentaires"],
    dataYear: 2026,
    sourceTitle: "Guide des prix d’un monte-escalier — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-monte-escalier/",
    sourceCheckedAt: "2026-08-12"
  }
]);

const nordInseeMetadata = Object.freeze({
  sourceOrganization: "INSEE",
  sourceTitle: "Dossier complet — Département du Nord (59)",
  sourceUrl: "https://www.insee.fr/fr/statistiques/2011101?geo=DEP-59",
  dataYear: 2023,
  geography: "Département du Nord",
  inseeCode: "59",
  sourcePublishedAt: "2026-07-23",
  sourceCheckedAt: "2026-08-12"
});

const showerPrices = Object.freeze([
  {
    label: "Adaptation d’une douche existante",
    descriptor: "Sécurisation ciblée de l’installation en place",
    range: "500 – 2 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/",
    dataYear: 2026,
    sourceTitle: "Guide des prix d’une douche senior — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-douche-senior/",
    sourceCheckedAt: showerUpdatedAt
  },
  {
    label: "Remplacement d’une baignoire",
    descriptor: "Dépose de la baignoire et création d’un accès plus simple",
    range: "4 000 – 9 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/",
    dataYear: 2026,
    sourceTitle: "Guide des prix d’une douche senior — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-douche-senior/",
    sourceCheckedAt: showerUpdatedAt
  },
  {
    label: "Douche extra-plate ou préfabriquée adaptée",
    descriptor: "Receveur à ressaut réduit et équipements de sécurité",
    range: "3 000 – 6 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/",
    dataYear: 2026,
    sourceTitle: "Guide des prix d’une douche senior — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-douche-senior/",
    sourceCheckedAt: showerUpdatedAt
  },
  {
    label: "Douche de plain-pied ou sur mesure",
    descriptor: "Projet adapté aux contraintes du sol et de l’évacuation",
    range: "5 000 – 10 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/",
    dataYear: 2026,
    sourceTitle: "Guide des prix d’une douche senior — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-douche-senior/",
    sourceCheckedAt: showerUpdatedAt
  },
  {
    label: "Adaptation complète de la salle de bain",
    descriptor: "Réagencement global de la circulation et des équipements",
    range: "8 000 – 15 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-salle-de-bain-adaptee/",
    dataYear: 2026,
    sourceTitle: "Guide des prix d’une salle de bain adaptée — Go Senior",
    sourceUrl: "https://go-senior.fr/guides/prix-salle-de-bain-adaptee/",
    sourceCheckedAt: showerUpdatedAt
  }
]);

const stairliftOptions = Object.freeze([
  {
    title: "Monte-escalier droit",
    description: "Rail rectiligne adapté à un escalier sans virage ni palier intermédiaire. La configuration est généralement plus simple que celle d’un rail courbe.",
    image: "/uploads/monte-escalier-droit.webp",
    imageAlt: "Monte-escalier installé sur un escalier droit",
    href: "/projet/?projet=monte-escalier&type=droit"
  },
  {
    title: "Monte-escalier tournant",
    description: "Rail conçu sur mesure lorsque l’escalier comporte un virage, un palier, plusieurs volées ou un changement de pente.",
    image: "/uploads/monte-escalier-tournant-interieur.webp",
    imageAlt: "Monte-escalier suivant la courbe d’un escalier tournant",
    href: "/projet/?projet=monte-escalier&type=tournant"
  },
  {
    title: "Monte-escalier extérieur",
    description: "Équipement conçu pour un perron, un accès de jardin ou un escalier extérieur, avec des composants adaptés à l’exposition selon les caractéristiques du fabricant.",
    image: "/uploads/monte-escalier-exterieur-perron.webp",
    imageAlt: "Monte-escalier extérieur installé sur un perron",
    href: "/projet/?projet=monte-escalier&type=exterieur"
  },
  {
    title: "Monte-escalier assis-debout",
    description: "Équipement avec siège-perche ou appui haut permettant une position semi-assise lorsque la configuration et les capacités de l’utilisateur s’y prêtent.",
    image: "/uploads/siege-monte-escalier-replie.webp",
    imageAlt: "Siège de monte-escalier replié pour libérer le passage",
    href: "/projet/?projet=monte-escalier&type=assis-debout"
  }
]);

const showerOptions = Object.freeze([
  {
    title: "Baignoire à remplacer",
    description: "Douche installée dans l’emplacement existant, avec des travaux souvent concentrés sur quelques jours selon la configuration.",
    image: "/uploads/baignoire-a-remplacer.webp",
    imageAlt: "Baignoire existante à remplacer par une douche adaptée",
    href: "/projet/?projet=baignoire-douche"
  },
  {
    title: "Douche à sécuriser",
    description: "Siège, barres d’appui, sol adapté et robinetterie selon les besoins.",
    image: "/uploads/douche-siege-mural-barres-appui.webp",
    imageAlt: "Douche sécurisée avec siège mural et barres d’appui",
    href: "/projet/?projet=douche-senior"
  },
  {
    title: "Salle de bain à réagencer",
    description: "Adaptation plus complète lorsque la circulation ou l’implantation doivent évoluer.",
    image: "/uploads/salle-de-bain-adaptee-complete.webp",
    imageAlt: "Salle de bain adaptée facilitant la circulation",
    href: "/projet/?projet=salle-de-bain"
  }
]);

function commonDraft(overrides) {
  return {
    id: "",
    service: "",
    pageLevel: "",
    regionName: "",
    regionSlug: "",
    departmentName: "",
    departmentSlug: "",
    departmentCode: "",
    locationPhrase: null,
    cityName: null,
    citySlug: null,
    inseeCode: null,
    postalCodes: [],
    intercommunalityName: null,
    seoTitle: "",
    metaDescription: "",
    h1: "",
    introduction: null,
    geographicScope: null,
    nationalPriceReference: [],
    localCostFactors: [],
    demographicData: [],
    housingData: [],
    localHousingCommentary: null,
    projectOptions: [],
    coownershipConsiderations: null,
    localAssistancePrograms: [],
    usefulLocalContacts: [],
    coverageStatus: "configurable",
    routingStatus: "paused",
    leadDistributionMode: "configurable",
    coveredPostalCodes: [],
    nearbyLocations: [],
    localPlaces: [],
    faq: [],
    officialSources: [],
    conclusion: null,
    cta: {
      title: "",
      description: null,
      project: "",
      postalCodeExample: ""
    },
    sourceCheckedAt: null,
    status: "draft",
    indexStatus: "noindex",
    sitemapStatus: "excluded",
    canonical: "",
    publishedAt: null,
    updatedAt,
    ...overrides
  };
}

const nationalAdaptationProgram = Object.freeze({
  programName: "MaPrimeAdapt’",
  programType: "aide_nationale",
  description: "MaPrimeAdapt’ peut financer, sous conditions, certains travaux d’adaptation du logement, dont l’installation d’un monte-escalier. Le taux et le montant dépendent notamment des ressources, de l’âge ou de la situation de handicap, du logement et du projet retenu.",
  eligibilitySummary: "Sous conditions de ressources, d’âge ou de handicap, de logement et de projet.",
  officialOrganization: "France Rénov’",
  officialTitle: "MaPrimeAdapt’",
  officialUrl: "https://france-renov.gouv.fr/aides/maprimeadapt",
  sourceCheckedAt: "2026-08-12",
  status: "verified"
});

function departmentInseeDatum(config, indicator, value, displayValue, unit) {
  return {
    sourceOrganization: "INSEE",
    sourceTitle: config.inseeTitle || `Dossier complet — Département ${config.inseeLabel} (${config.departmentCode})`,
    sourceUrl: `https://www.insee.fr/fr/statistiques/2011101?geo=DEP-${config.departmentCode}`,
    dataYear: 2023,
    geography: config.inseeGeography || `Département ${config.inseeLabel}`,
    inseeCode: config.departmentCode,
    sourcePublishedAt: config.inseePublishedAt,
    sourceCheckedAt: "2026-08-12",
    indicator,
    value,
    displayValue,
    unit,
    vintage: "RP 2023",
    source: "INSEE",
    retrievedAt: "2026-08-12"
  };
}

function createPublishedStairliftDepartment(config) {
  return commonDraft({
    id: `monte-escalier-${config.departmentSlug}`,
    service: "monte-escalier",
    pageLevel: "department",
    regionName: config.regionName || "Hauts-de-France",
    regionSlug: config.regionSlug || "hauts-de-france",
    departmentName: config.departmentName,
    departmentSlug: config.departmentSlug,
    departmentCode: config.departmentCode,
    inseeCode: config.departmentCode,
    locationPhrase: config.preposition,
    seoTitle: `Monte-escalier ${config.prepositionTitle} (${config.departmentCode}) : prix et aides | Go Senior`,
    metaDescription: `Prix, aides et solutions pour installer un monte-escalier ${config.preposition}. Consultez les données locales et décrivez votre projet.`,
    h1: `Monte-escalier ${config.prepositionTitle} : prix, aides et professionnels`,
    introduction: config.introduction,
    geographicScope: config.geographicScope || `Ce guide couvre le département ${config.inseeLabel} (${config.departmentCode}). Les indicateurs INSEE concernent l’ensemble du département ; les aides et contacts cités renvoient vers les organismes officiels compétents. Le code postal sert ensuite à orienter la demande selon le lieu réel du projet.`,
    nationalPriceReference: stairliftPrices,
    localCostFactors: config.localCostFactors,
    demographicData: config.demographicData || [
      departmentInseeDatum(config, "Population du département", config.population, config.populationDisplay, "habitants"),
      departmentInseeDatum(config, "Population âgée de 65 ans ou plus", config.age65, config.age65Display, "%"),
      departmentInseeDatum(config, "Population âgée de 80 ans ou plus", config.age80, config.age80Display, "%")
    ],
    housingData: config.housingData || [
      departmentInseeDatum(config, "Part des maisons dans le parc de logements", config.houses, config.housesDisplay, "%"),
      departmentInseeDatum(config, "Résidences principales occupées par leur propriétaire", config.owners, config.ownersDisplay, "%"),
      departmentInseeDatum(config, "Résidences principales achevées avant 1971", config.pre1971, config.pre1971Display, "%")
    ],
    inseeMethodology: config.inseeMethodology,
    localHousingCommentary: config.localHousingCommentary,
    projectOptions: stairliftOptions,
    localAssistancePrograms: [nationalAdaptationProgram, ...config.localAssistancePrograms],
    usefulLocalContacts: config.usefulLocalContacts,
    coverageStatus: "nationwide",
    routingStatus: "active",
    leadDistributionMode: "exclusive",
    coveredPostalCodes: [],
    nearbyLocations: config.nearbyLocations,
    localPlaces: config.localPlaces || [],
    faq: config.faq,
    officialSources: [
      ...(config.primaryOfficialSources || [{
        organization: "INSEE",
        exactTitle: config.inseeTitle || `Dossier complet — Département ${config.inseeLabel} (${config.departmentCode})`,
        supportedClaims: ["Population", "Structure par âge", "Types de logements", "Statut d’occupation", "Période d’achèvement des résidences principales"],
        dataYear: "RP 2023",
        publishedAt: config.inseePublishedAt,
        checkedAt: "2026-08-12",
        officialUrl: `https://www.insee.fr/fr/statistiques/2011101?geo=DEP-${config.departmentCode}`,
        scope: "local"
      }]),
      ...config.officialSources,
      {
        organization: "France Rénov’",
        exactTitle: "MaPrimeAdapt’",
        supportedClaims: ["Travaux pouvant être financés", "Conditions", "Parcours d’accompagnement"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://france-renov.gouv.fr/aides/maprimeadapt",
        scope: "national"
      }
    ],
    conclusion: config.conclusion,
    cta: {
      title: `Votre projet de monte-escalier ${config.prepositionTitle}`,
      description: `Tous les codes postaux ${config.preposition} sont couverts. Demande gratuite et sans engagement.`,
      project: "monte-escalier",
      postalCodeExample: config.postalCodeExample,
      buttonLabel: "Démarrer mon projet",
      reassurance: `Tous les codes postaux ${config.preposition} sont couverts. Demande gratuite et sans engagement.`,
      validPostalCodeMessage: "Votre secteur est couvert. Continuez pour nous préciser la configuration de votre escalier et vos coordonnées."
    },
    canonical: `/monte-escalier/${config.departmentSlug}/`,
    sourceCheckedAt: "2026-08-12",
    status: "published",
    indexStatus: "index",
    sitemapStatus: "included",
    publishedAt: "2026-08-12",
    updatedAt: "2026-08-12",
    serviceDetails: {
      stairLocation: config.stairLocation,
      stairShape: "Droit, tournant ou à déterminer après mesure",
      levels: "Un ou plusieurs niveaux à documenter dans le projet",
      turns: config.turns,
      landings: config.landings,
      width: "Largeur utile et passage restant à vérifier sur place",
      obstacles: config.obstacles,
      railType: "Rail standard pour une volée droite ou rail sur mesure pour les courbes",
      possibleTimelines: ["Planning confirmé par le professionnel après visite technique et validation du devis"],
      availableModels: ["Droit", "tournant", "extérieur", "assis-debout"],
      nationalPriceRanges: stairliftPrices,
      projectAssistance: ["MaPrimeAdapt’", ...config.projectAssistance]
    }
  });
}

function createPublishedShowerDepartment(config) {
  return commonDraft({
    id: `douche-senior-${config.departmentSlug}`,
    service: "douche-senior",
    pageLevel: "department",
    regionName: config.regionName,
    regionSlug: config.regionSlug,
    departmentName: config.departmentName,
    departmentSlug: config.departmentSlug,
    departmentCode: config.departmentCode,
    inseeCode: config.departmentCode,
    locationPhrase: config.preposition,
    seoTitle: `Douche senior ${config.prepositionTitle} (${config.departmentCode}) : prix et installation | Go Senior`,
    metaDescription: `Prix, solutions et contraintes techniques pour installer une douche senior ${config.preposition}. Données logement locales et demande de devis gratuite.`,
    h1: `Douche senior ${config.prepositionTitle} : prix, travaux et professionnels`,
    introduction: config.introduction,
    geographicScope: config.geographicScope,
    nationalPriceReference: showerPrices,
    localCostFactors: config.localCostFactors,
    demographicData: config.demographicData,
    housingData: config.housingData,
    inseeMethodology: config.inseeMethodology,
    localHousingCommentary: config.localHousingCommentary,
    projectOptions: showerOptions,
    coownershipConsiderations: config.coownershipConsiderations,
    localAssistancePrograms: [],
    usefulLocalContacts: [],
    coverageStatus: "configurable",
    routingStatus: "active",
    leadDistributionMode: "exclusive",
    coveredPostalCodes: [],
    nearbyLocations: config.nearbyLocations,
    cityLocations: config.cityLocations || [],
    localPlaces: config.localPlaces,
    faq: config.faq,
    officialSources: config.officialSources,
    conclusion: config.conclusion,
    cta: {
      title: `Votre projet de douche senior ${config.prepositionTitle}`,
      description: "Décrivez l’installation actuelle et le résultat recherché pour préparer un devis adapté.",
      project: "douche-senior",
      postalCodeExample: config.postalCodeExample,
      buttonLabel: "Décrire mon projet",
      reassurance: "Demande gratuite et sans engagement.",
      validPostalCodeMessage: "Code postal reconnu. Continuez pour préciser la salle de bain et vérifier l’intervention dans votre secteur."
    },
    canonical: `/douche-senior/${config.departmentSlug}/`,
    sourceCheckedAt: showerUpdatedAt,
    status: "published",
    indexStatus: "index",
    sitemapStatus: "included",
    publishedAt: showerUpdatedAt,
    updatedAt: showerUpdatedAt,
    serviceDetails: {
      currentInstallation: "Baignoire ou douche existante à décrire avant l’étude",
      bathReplacement: "Dépose, évacuation et reprise des parois à chiffrer selon l’existant",
      showerSecuring: "Accès, sol antidérapant, siège et appuis à choisir selon l’usage",
      bathroomReconfiguration: "Circulation, porte, lavabo et zones de transfert à contrôler",
      receiverType: "Receveur extra-plat ou solution de plain-pied selon le sol et l’évacuation",
      extraFlatShower: "Ressaut réduit lorsque l’encastrement complet n’est pas réalisable",
      walkInShower: "Pente, siphon et étanchéité à valider sur place",
      seat: "Fixe, rabattable ou mobile selon les appuis et la paroi",
      grabBars: "Position et fixation déterminées avec l’utilisateur",
      plumbing: config.plumbing,
      waterproofing: config.waterproofing,
      coownership: config.coownership,
      nationalPriceRanges: showerPrices,
      projectAssistance: []
    }
  });
}

function createPublishedShowerCity(config) {
  return commonDraft({
    id: `douche-senior-${config.departmentSlug}-${config.citySlug}`,
    service: "douche-senior",
    pageLevel: "city",
    regionName: config.regionName,
    regionSlug: config.regionSlug,
    departmentName: config.departmentName,
    departmentSlug: config.departmentSlug,
    departmentCode: config.departmentCode,
    locationPhrase: config.cityPreposition,
    cityName: config.cityName,
    citySlug: config.citySlug,
    inseeCode: config.inseeCode,
    postalCodes: config.postalCodes,
    intercommunalityName: null,
    seoTitle: `Douche senior ${config.cityPreposition} : prix et installation | Go Senior`,
    metaDescription: `Prix et contraintes pour remplacer une baignoire ou sécuriser une douche ${config.cityPreposition}. Données INSEE communales et étude gratuite du projet.`,
    h1: `Douche senior ${config.cityPreposition} : prix, travaux et devis`,
    introduction: config.introduction,
    geographicScope: config.geographicScope,
    nationalPriceReference: showerPrices,
    localCostFactors: config.localCostFactors,
    demographicData: config.demographicData,
    housingData: config.housingData,
    inseeMethodology: config.inseeMethodology,
    localHousingCommentary: config.localHousingCommentary,
    projectOptions: showerOptions,
    coownershipConsiderations: config.coownershipConsiderations,
    localAssistancePrograms: [],
    usefulLocalContacts: [],
    coverageStatus: "configurable",
    routingStatus: "active",
    leadDistributionMode: "exclusive",
    coveredPostalCodes: [],
    nearbyLocations: config.nearbyLocations,
    localPlaces: config.localPlaces,
    faq: config.faq,
    officialSources: config.officialSources,
    conclusion: config.conclusion,
    cta: {
      title: `Votre projet de douche senior ${config.cityPreposition}`,
      description: "Décrivez la salle de bain actuelle et les gestes à faciliter pour préparer une étude adaptée.",
      project: "douche-senior",
      postalCodeExample: config.postalCodeExample,
      buttonLabel: "Décrire mon projet",
      reassurance: "Demande gratuite et sans engagement.",
      validPostalCodeMessage: "Code postal reconnu. Continuez pour préciser votre installation et vérifier l’intervention dans ce secteur."
    },
    canonical: `/douche-senior/${config.departmentSlug}/${config.citySlug}/`,
    sourceCheckedAt: showerUpdatedAt,
    status: "published",
    indexStatus: "index",
    sitemapStatus: "included",
    publishedAt: showerUpdatedAt,
    updatedAt: showerUpdatedAt,
    serviceDetails: {
      currentInstallation: "Baignoire ou douche existante à documenter",
      bathReplacement: "Emprise disponible, dépose et reprises murales à chiffrer",
      showerSecuring: "Accès, siège, appuis et sol à définir selon l’utilisateur",
      bathroomReconfiguration: "Circulation et zones de transfert à mesurer dans la pièce",
      receiverType: "Plain-pied ou extra-plat selon le plancher et l’évacuation",
      extraFlatShower: "Solution à ressaut limité lorsque l’encastrement complet est impossible",
      walkInShower: "Pente, siphon et étanchéité à contrôler lors de la visite",
      seat: "Fixe, rabattable ou mobile selon la paroi et les besoins",
      grabBars: "Implantation définie à partir des gestes et des supports",
      plumbing: config.plumbing,
      waterproofing: config.waterproofing,
      coownership: config.coownership,
      nationalPriceRanges: showerPrices,
      projectAssistance: []
    }
  });
}

const slugify = (value) => value
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .replace(/[’']/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const formatNumber = (value) => new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: Number.isInteger(value) ? 0 : 1
}).format(value);

const elisionCodes = new Set(["01", "02", "03", "07", "09", "10", "11", "12", "27", "34", "36", "37", "38", "60", "61", "89", "91"]);
const pluralCodes = new Set(["04", "05", "06", "08", "13", "22", "40", "64", "65", "66", "78", "79", "88", "92"]);
const feminineCodes = new Set(["16", "17", "19", "21", "23", "24", "26", "28", "31", "33", "35", "42", "43", "44", "48", "51", "52", "53", "54", "55", "57", "58", "70", "71", "72", "73", "74", "76", "77", "80", "85", "86", "87", "93", "2A", "2B", "971", "972", "973"]);
const laCodes = new Set(["50"]);

function locationPhrase(record) {
  if (record.code === "974") return "à La Réunion";
  if (record.code === "976") return "à Mayotte";
  if (record.code === "75") return "à Paris";
  if (elisionCodes.has(record.code)) return `dans l’${record.name}`;
  if (pluralCodes.has(record.code)) return `dans les ${record.name}`;
  if (laCodes.has(record.code)) return `dans la ${record.name}`;
  if (feminineCodes.has(record.code)) return `en ${record.name}`;
  return `dans le ${record.name}`;
}

const mountainCodes = new Set(["04", "05", "06", "09", "15", "25", "26", "38", "39", "42", "43", "48", "63", "64", "65", "66", "73", "74", "2A", "2B"]);
const coastalCodes = new Set(["06", "11", "13", "14", "17", "22", "29", "30", "33", "34", "35", "40", "44", "50", "56", "59", "62", "64", "66", "76", "80", "83", "85"]);
const denseCodes = new Set(["06", "13", "31", "33", "34", "44", "59", "67", "69", "75", "77", "78", "91", "92", "93", "94", "95"]);
const localPlaceOverrides = Object.freeze({
  "75": ["Paris Centre", "Paris rive droite", "Paris rive gauche", "nord-est parisien", "sud parisien"]
});

function territoryProfile(record) {
  if (Number(record.code) >= 971) return "ultramarin";
  if (denseCodes.has(record.code)) return "urbain";
  if (mountainCodes.has(record.code)) return "relief";
  if (coastalCodes.has(record.code)) return "littoral";
  if (record.houses >= 75 || record.population < 300000) return "rural";
  return "mixte";
}

const profileCopy = Object.freeze({
  ultramarin: {
    lead: "Les distances, l’humidité, l’exposition et l’organisation insulaire ou ultramarine demandent de préciser très tôt l’accès au domicile et les conditions d’entretien.",
    factor: "Pour une pose extérieure, le choix des composants, la protection contre les intempéries et le suivi après installation doivent être explicités dans le devis.",
    question: "Quelles précautions prévoir dans un climat ultramarin ?",
    answer: "Le professionnel doit vérifier l’exposition, l’humidité, le ruissellement, la ventilation des composants et les modalités locales de maintenance. Ces points sont particulièrement importants pour un rail ou un stationnement extérieur."
  },
  urbain: {
    lead: "Le département associe des secteurs urbains denses, des copropriétés et des communes périphériques où les conditions d’accès au logement changent rapidement.",
    factor: "Dans un immeuble ou une copropriété, il faut distinguer l’escalier privatif des parties communes et vérifier les autorisations avant d’engager des travaux.",
    question: "Que faut-il vérifier dans un immeuble ou une copropriété ?",
    answer: "Le caractère privatif ou commun de l’escalier, le passage résiduel, les accès partagés et les autorisations éventuelles doivent être clarifiés avant la commande."
  },
  relief: {
    lead: "Entre vallées, plateaux et secteurs de relief, les accès extérieurs, les pentes et les volées d’escalier peuvent créer des contraintes très différentes.",
    factor: "Un accès en pente ou exposé ne se traite pas comme un escalier intérieur : support, drainage, alimentation et stationnement doivent faire partie du relevé.",
    question: "Le relief du département change-t-il l’étude d’un accès extérieur ?",
    answer: "Oui pour le logement concerné : pente, gel, ruissellement, support et dégagement peuvent influer sur la solution. Le relief départemental reste un contexte et ne remplace pas la visite du site."
  },
  littoral: {
    lead: "Des pôles urbains aux communes proches du littoral et à l’arrière-pays, l’exposition et la typologie des logements ne sont pas uniformes.",
    factor: "À proximité du littoral, une installation extérieure doit intégrer humidité, corrosion, vent, évacuation de l’eau et entretien recommandé par le fabricant.",
    question: "Un monte-escalier extérieur est-il envisageable près du littoral ?",
    answer: "Oui, avec un modèle prévu pour l’extérieur et après contrôle du support, de l’alimentation, du ruissellement et de l’exposition. Les garanties et l’entretien doivent être écrits dans l’offre."
  },
  rural: {
    lead: "Le maillage de bourgs, de petites villes et de communes rurales peut allonger les déplacements et multiplie les configurations de maisons individuelles.",
    factor: "Dans une maison de bourg ou rurale, des murs irréguliers, des demi-paliers, une entrée étroite ou une porte proche des marches peuvent modifier le tracé du rail.",
    question: "Une maison rurale ou ancienne peut-elle recevoir un monte-escalier ?",
    answer: "Souvent oui, après mesure de la largeur, des marches, des dégagements et des points de fixation. L’ancienneté du bâtiment ne suffit jamais, à elle seule, à conclure."
  },
  mixte: {
    lead: "Villes principales, secteurs périurbains et communes moins denses composent un territoire où les accès et les formes d’habitat sont variés.",
    factor: "La place au départ et à l’arrivée, les portes, les radiateurs et le passage lorsque le siège est replié doivent être relevés dans chaque logement.",
    question: "Pourquoi une visite technique reste-t-elle nécessaire ?",
    answer: "Les statistiques décrivent le parc départemental, pas votre escalier. Seules les mesures du logement permettent de confirmer le rail, les options, le passage restant et la faisabilité."
  }
});

const showerProfileCopy = Object.freeze({
  ultramarin: {
    lead: "Dans un territoire ultramarin, la chaleur et l’humidité rendent la ventilation, le séchage des parois et la tenue des matériaux particulièrement importants.",
    factor: "Le devis doit préciser le système d’étanchéité, la ventilation existante et les matériaux retenus pour un local humide.",
    question: "Que contrôler dans une salle de bain soumise à une forte humidité ?",
    answer: "Il faut vérifier le renouvellement d’air, l’état des supports, l’étanchéité sous carrelage, les joints et la compatibilité des équipements avec l’ambiance humide."
  },
  urbain: {
    lead: "Dans les secteurs urbains denses, les salles de bain sont souvent compactes et les appartements ajoutent des contraintes d’accès, de bruit et parfois de copropriété.",
    factor: "En immeuble, l’évacuation, le plancher, les horaires de chantier et le passage dans les parties communes doivent être anticipés.",
    question: "Une douche de plain-pied est-elle toujours possible en appartement ?",
    answer: "Non. La hauteur disponible, la position de la colonne d’évacuation et la structure du plancher peuvent conduire à préférer un receveur extra-plat avec un petit ressaut."
  },
  relief: {
    lead: "Entre vallées, plateaux et secteurs de relief, la diversité des constructions se retrouve dans les planchers, les réseaux d’eau et l’accès des artisans au logement.",
    factor: "Dans une maison éloignée ou un logement à plancher ancien, l’acheminement, le support et la reprise des canalisations doivent être chiffrés sans forfait implicite.",
    question: "Pourquoi l’état du plancher compte-t-il pour une douche de plain-pied ?",
    answer: "L’encastrement du receveur et la pente d’évacuation dépendent de l’épaisseur, de la structure et de l’état du support. Une inspection évite de promettre un seuil nul irréalisable."
  },
  littoral: {
    lead: "Dans les communes littorales comme dans l’arrière-pays, l’humidité et la ventilation peuvent accélérer l’usure des joints et compliquer le séchage de la salle de bain.",
    factor: "La ventilation, les joints, la protection des parois et la qualité des fixations doivent figurer clairement dans la proposition technique.",
    question: "La proximité du littoral change-t-elle le choix des équipements ?",
    answer: "Elle invite surtout à être attentif à l’humidité, à l’aération et à la qualité des fixations. Le diagnostic de la pièce reste plus déterminant que la commune seule."
  },
  rural: {
    lead: "Le parc de maisons, parfois ancien ou dispersé, peut présenter des salles d’eau remaniées, des évacuations éloignées et des supports irréguliers.",
    factor: "Le professionnel doit distinguer la fourniture de la douche des reprises de plomberie, de sol ou de mur souvent nécessaires dans un bâti ancien.",
    question: "Une ancienne salle de bain peut-elle être transformée sans réagencement complet ?",
    answer: "Parfois, si l’emplacement de la baignoire, l’évacuation et les parois sont réutilisables. Sinon, déplacer un réseau ou reprendre le sol peut rendre un projet plus large préférable."
  },
  mixte: {
    lead: "Le département mêle logements collectifs, maisons périurbaines et communes moins denses : la place disponible et les réseaux varient fortement d’un domicile à l’autre.",
    factor: "Un devis comparable sépare la dépose, le receveur, la robinetterie, l’étanchéité, les finitions et les éventuelles modifications de plomberie.",
    question: "Pourquoi demander une visite technique avant de choisir la douche ?",
    answer: "Parce que les dimensions, le plancher, l’évacuation, la ventilation et les appuis nécessaires ne peuvent pas être confirmés à partir d’une photo ou d’un code postal."
  }
});

const showerLeadVariants = Object.freeze([
  "Le point de départ est l’usage quotidien : entrer dans la zone de douche, se relever et atteindre la robinetterie sans mouvement risqué.",
  "Le projet doit partir des gestes de la personne : franchissement, équilibre, transfert vers le siège et sortie sur un sol qui reste praticable.",
  "Avant de choisir un modèle, il faut observer la circulation dans la pièce, les appuis naturels et les difficultés rencontrées pendant la toilette.",
  "Une adaptation réussie combine un accès simple, des équipements bien placés et une réalisation compatible avec le sol et les réseaux existants."
]);

const showerScopeVariants = Object.freeze([
  "Les statistiques donnent un contexte départemental ; elles ne décrivent jamais la salle de bain d’un logement précis.",
  "Ces repères servent à préparer les bonnes questions, tandis que la faisabilité se confirme uniquement dans la pièce concernée.",
  "Le profil du parc immobilier éclaire les contraintes fréquentes, sans remplacer l’examen du support, des canalisations et de la ventilation.",
  "Les données locales situent le territoire, mais seul un relevé technique permet de valider la hauteur du receveur et les finitions."
]);

function recordDatum(record, indicator, value, unit, year = record.dataYear) {
  const sourceUrl = record.code === "976"
    ? "https://www.insee.fr/fr/statistiques/3713016?sommaire=4199393"
    : `https://www.insee.fr/fr/statistiques/2011101?geo=DEP-${record.code}`;
  return {
    sourceOrganization: "INSEE",
    sourceTitle: record.code === "976" ? "Mayotte en 2017 et premiers résultats 2026" : `Dossier complet — ${record.name} (${record.code})`,
    sourceUrl,
    dataYear: year,
    geography: `${record.name} (${record.code})`,
    inseeCode: record.code,
    sourcePublishedAt: record.code === "976" ? "2019-08-05" : "2026-07-23",
    sourceCheckedAt: updatedAt,
    indicator,
    value,
    displayValue: unit === "%" ? `${formatNumber(value)} %` : `${formatNumber(value)} ${unit}`,
    unit,
    vintage: record.code === "976" ? `millésime ${year}` : "RP 2023",
    source: "INSEE",
    retrievedAt: updatedAt
  };
}

function generatedConfig(record, allRecords) {
  const slug = slugify(record.name);
  const place = locationPhrase(record);
  const profile = territoryProfile(record);
  const copy = profileCopy[profile];
  const cities = localPlaceOverrides[record.code] || record.topCommunes.map((city) => city.name);
  const [first, second, third, fourth, fifth] = cities;
  const localPeers = allRecords
    .filter((candidate) => candidate.regionName === record.regionName && candidate.code !== record.code)
    .slice(0, 4)
    .map((candidate) => `monte-escalier-${slugify(candidate.name)}`);
  const cnsaSlug = slugify(record.name);
  const cnsaDepartmentUrl = `https://www.pour-les-personnes-agees.gouv.fr/annuaire-departements/${cnsaSlug}-${record.code.toLowerCase()}`;
  const cnsaInformationUrl = `https://www.pour-les-personnes-agees.gouv.fr/annuaire-points-dinformation-et-conseil/${cnsaSlug}-${record.code.toLowerCase()}`;
  const share = record.houses ?? null;
  const older = record.pre1971 ?? null;
  const ownerText = `${formatNumber(record.owners)} % des résidences principales sont occupées par leur propriétaire`;
  const housingText = record.code === "976"
    ? `Le dernier ensemble détaillé disponible recense ${formatNumber(record.mainResidences)} résidences principales en 2017 ; ${formatNumber(record.precariousHousing)} % relèvent alors d’un habitat en tôle, bois, végétal ou terre.`
    : `${formatNumber(share)} % des logements sont des maisons et ${formatNumber(older)} % des résidences principales ont été achevées avant 1971.`;
  const demographicData = record.code === "976"
    ? [
        recordDatum(record, "Population issue des premiers résultats du recensement", record.population, "habitants", 2026),
        recordDatum(record, "Population âgée de 65 ans ou plus", record.age65, "%", 2017)
      ]
    : [
        recordDatum(record, "Population du département", record.population, "habitants"),
        recordDatum(record, "Population âgée de 65 ans ou plus", record.age65, "%"),
        recordDatum(record, "Population âgée de 80 ans ou plus", record.age80, "%")
      ];
  const housingData = record.code === "976"
    ? [
        recordDatum(record, "Résidences principales recensées", record.mainResidences, "logements", 2017),
        recordDatum(record, "Ménages propriétaires de leur logement", record.owners, "%", 2017),
        recordDatum(record, "Résidences principales en habitat précaire", record.precariousHousing, "%", 2017)
      ]
    : [
        recordDatum(record, "Part des maisons dans le parc de logements", record.houses, "%"),
        recordDatum(record, "Résidences principales occupées par leur propriétaire", record.owners, "%"),
        recordDatum(record, "Résidences principales achevées avant 1971", record.pre1971, "%")
      ];
  const primaryOfficialSources = record.code === "976"
    ? [
        {
          organization: "INSEE",
          exactTitle: "Au 1er janvier 2026, la population à Mayotte est de 323 153 habitants",
          supportedClaims: ["Population 2026", "Calendrier de diffusion du recensement"],
          dataYear: "2026",
          publishedAt: "2026-07-02",
          checkedAt: updatedAt,
          officialUrl: "https://www.insee.fr/fr/information/9022279",
          scope: "local"
        },
        {
          organization: "INSEE",
          exactTitle: "Mayotte en 2017 — population et conditions de logement",
          supportedClaims: ["Part des 65 ans ou plus", "Résidences principales", "Propriétaires", "Habitat précaire"],
          dataYear: "2017",
          publishedAt: "2019-08-05",
          checkedAt: updatedAt,
          officialUrl: "https://www.insee.fr/fr/statistiques/3713016?sommaire=4199393",
          scope: "local"
        }
      ]
    : undefined;
  return {
    departmentName: record.name,
    departmentSlug: slug,
    departmentCode: record.code,
    inseeLabel: record.name,
    inseeTitle: `Dossier complet — ${record.name} (${record.code})`,
    inseeGeography: `${record.name} (${record.code})`,
    regionName: record.regionName,
    regionSlug: slugify(record.regionName),
    preposition: place,
    prepositionTitle: place,
    inseePublishedAt: record.code === "976" ? "2019-08-05" : "2026-07-23",
    population: record.population,
    populationDisplay: `${formatNumber(record.population)} habitants`,
    age65: record.age65,
    age65Display: `${formatNumber(record.age65)} %`,
    age80: record.age80,
    age80Display: record.age80 === undefined ? "" : `${formatNumber(record.age80)} %`,
    houses: record.houses,
    housesDisplay: record.houses === undefined ? "" : `${formatNumber(record.houses)} %`,
    owners: record.owners,
    ownersDisplay: `${formatNumber(record.owners)} %`,
    pre1971: record.pre1971,
    pre1971Display: record.pre1971 === undefined ? "" : `${formatNumber(record.pre1971)} %`,
    demographicData,
    housingData,
    primaryOfficialSources,
    introduction: `${copy.lead} Autour de ${first}, ${second} et ${third}, la configuration réelle de l’escalier reste le premier critère pour distinguer rail droit, tournant ou équipement extérieur.`,
    geographicScope: `Cette analyse porte sur tout le territoire de ${record.name} (${record.code}), dans la région ${record.regionName}. Elle s’appuie sur les données départementales et cite notamment ${cities.join(", ")}. La couverture commerciale est nationale, mais l’orientation du projet dépend toujours du code postal exact.`,
    localCostFactors: [
      copy.factor,
      `Entre ${first} et ${second}, l’accès au domicile, la largeur utile et les possibilités de stationnement du siège peuvent imposer des solutions différentes.`,
      `Dans les secteurs de ${third} et ${fourth}, un virage, un palier intermédiaire ou plusieurs volées conduisent à étudier un rail fabriqué sur mesure.`,
      `La structure locale du parc — ${housingText} — donne un contexte de vigilance sans prédire la forme de l’escalier d’un logement particulier.`,
      `Le devis doit isoler l’appareil, le rail, la pose, les options de sécurité, les garanties et les travaux annexes afin de comparer des périmètres identiques.`
    ],
    inseeMethodology: record.code === "976"
      ? "Mayotte ne dispose pas encore des mêmes tableaux RP 2023 que les autres départements. La population 2026 est un premier résultat du recensement 2025-2026 ; les structures par âge et logement restent issues du recensement exhaustif 2017 et sont affichées avec leur millésime propre."
      : `La part des 65 ans ou plus additionne ${formatNumber(record.age65to79)} % de 65 à 79 ans et ${formatNumber(record.age80)} % de 80 ans ou plus. La part avant 1971 additionne ${formatNumber(record.housingBefore1919)} % avant 1919, ${formatNumber(record.housing1919to1945)} % de 1919 à 1945 et ${formatNumber(record.housing1946to1970)} % de 1946 à 1970.`,
    localHousingCommentary: `${record.name} compte ${formatNumber(record.population)} habitants selon le millésime affiché. ${housingText} Par ailleurs, ${ownerText}. Ces repères aident à préparer les questions sur les accès, l’état des marches et les dégagements ; ils ne remplacent ni les mesures ni l’examen technique du domicile.`,
    localAssistancePrograms: [
      {
        programName: `APA — service autonomie de ${record.name}`,
        programType: "aide_nationale_geree_localement",
        description: `L’Allocation personnalisée d’autonomie à domicile est instruite localement. L’annuaire officiel identifie le service compétent de ${record.name}, ses coordonnées et, lorsqu’ils sont publiés, ses formulaires et pages d’information.`,
        eligibilitySummary: "À partir de 60 ans, selon le lieu de résidence, la perte d’autonomie évaluée et le plan d’aide établi.",
        officialOrganization: `Service autonomie de ${record.name}`,
        officialTitle: `Département — ${record.name}`,
        officialUrl: cnsaDepartmentUrl,
        sourceCheckedAt: updatedAt,
        status: "verified"
      }
    ],
    usefulLocalContacts: [
      {
        programName: `Annuaire d’information et de conseil — ${record.name}`,
        programType: "contact_departemental",
        description: `L’annuaire du Service public de l’autonomie permet de vérifier les structures d’information et de conseil actuellement recensées pour ${record.name}. La liste peut être vide ; la fiche du service autonomie départemental reste alors le contact officiel de référence.`,
        eligibilitySummary: "Consultation libre de l’annuaire ; disponibilité variable selon les structures recensées dans le département.",
        officialOrganization: "Service public de l’autonomie — CNSA",
        officialTitle: `Annuaire d’information et de conseil — ${record.name}`,
        officialUrl: cnsaInformationUrl,
        sourceCheckedAt: updatedAt,
        status: "verified"
      }
    ],
    nearbyLocations: localPeers,
    localPlaces: cities,
    faq: [
      { question: `Quel budget prévoir pour un monte-escalier ${place} ?`, answer: `Les repères nationaux 2026 se situent entre 2 500 et 5 500 € pose comprise pour un modèle droit, et entre 6 000 et 12 000 € pour un tournant. À ${first} comme à ${second}, seules les mesures, le rail, les options et les travaux complémentaires permettent d’établir le prix réel.`, local: true },
      { question: `Que disent les données de logement pour ${record.name} ?`, answer: `${housingText} ${ownerText}. Ces pourcentages décrivent le département entier et ne permettent pas de conclure sur un escalier individuel.`, local: true },
      { question: `Go Senior couvre-t-il aussi ${third}, ${fourth} et ${fifth} ?`, answer: `Oui, la couverture monte-escalier concerne tous les codes postaux de ${record.name}. Le code postal sert à localiser le projet et à appliquer les règles d’orientation vers un professionnel intervenant réellement dans ce secteur.`, local: true },
      { question: copy.question, answer: copy.answer, local: true },
      { question: `Où déposer ou préparer une demande d’APA ${place} ?`, answer: `La fiche officielle du service autonomie de ${record.name} centralise ses coordonnées et les liens disponibles. L’équipe départementale évalue la perte d’autonomie et précise les dépenses retenues dans le plan d’aide.`, local: true },
      { question: `Où trouver un conseil de proximité autour de ${first} ou ${second} ?`, answer: `Consultez l’annuaire du Service public de l’autonomie pour vérifier les structures actuellement recensées. Si la liste est vide, la fiche officielle du service autonomie de ${record.name} fournit le contact départemental à utiliser.`, local: true },
      { question: "MaPrimeAdapt’ peut-elle financer un monte-escalier ?", answer: "Oui, ce type de travaux peut entrer dans MaPrimeAdapt’ sous conditions de ressources, d’âge ou de handicap, de logement et de projet. L’éligibilité doit être confirmée avant le démarrage des travaux.", local: false },
      { question: `Comment comparer deux devis reçus ${place} ?`, answer: `Vérifiez le modèle, le tracé du rail, la pose, les options, le délai, la garantie, l’entretien et le service après-vente. Demandez aussi que les éventuels travaux électriques ou de maçonnerie soient chiffrés séparément.`, local: true }
    ],
    officialSources: [
      {
        organization: "Service public de l’autonomie — CNSA",
        exactTitle: `Département — ${record.name}`,
        supportedClaims: ["Service autonomie compétent", "Coordonnées départementales", "Démarches APA"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: updatedAt,
        officialUrl: cnsaDepartmentUrl,
        additionalOfficialUrls: [cnsaInformationUrl],
        scope: "local"
      }
    ],
    conclusion: `À ${first}, ${second}, ${third} ou ailleurs en ${record.name}, le bon équipement dépend du logement plus que du code du département. Les données locales cadrent le contexte ; un relevé précis confirme ensuite le rail, le passage disponible et les options utiles.`,
    postalCodeExample: record.topCommunes[0]?.postalCode || `${record.code.padStart(2, "0")}000`,
    stairLocation: profile === "littoral" || profile === "ultramarin" ? "Intérieur ou extérieur, avec exposition à documenter" : "Intérieur ou extérieur selon l’accès au logement",
    turns: "Chaque courbe, changement de pente et volée doit être mesuré",
    landings: "Départ, arrivée, paliers et ouvertures doivent rester utilisables",
    obstacles: ["Portes proches", "radiateurs", "rampes", "marches irrégulières", "passage résiduel"],
    projectAssistance: ["APA selon le plan d’aide", "PCH selon la situation", "conseil France Rénov’"]
  };
}

function generatedShowerConfig(record, allRecords) {
  const slug = slugify(record.name);
  const place = locationPhrase(record);
  const profile = territoryProfile(record);
  const copy = showerProfileCopy[profile];
  const cities = localPlaceOverrides[record.code] || record.topCommunes.map((city) => city.name);
  const [first, second, third, fourth, fifth] = cities;
  const variantIndex = [...record.code].reduce((total, character) => total + character.charCodeAt(0), 0);
  const leadVariant = showerLeadVariants[variantIndex % showerLeadVariants.length];
  const scopeVariant = showerScopeVariants[(variantIndex + 1) % showerScopeVariants.length];
  const localPeers = allRecords
    .filter((candidate) => candidate.regionName === record.regionName && candidate.code !== record.code)
    .slice(0, 4)
    .map((candidate) => `douche-senior-${slugify(candidate.name)}`);
  const housingText = record.code === "976"
    ? `Le dernier tableau détaillé disponible recense ${formatNumber(record.mainResidences)} résidences principales en 2017, dont ${formatNumber(record.precariousHousing)} % en habitat précaire.`
    : `${formatNumber(record.houses)} % du parc correspond à des maisons et ${formatNumber(record.apartments)} % à des appartements.`;
  const ageText = `${formatNumber(record.age65)} % de la population a 65 ans ou plus`;
  const demographicData = record.code === "976"
    ? [
        recordDatum(record, "Population issue des premiers résultats du recensement", record.population, "habitants", 2026),
        recordDatum(record, "Population âgée de 65 ans ou plus", record.age65, "%", 2017)
      ]
    : [
        recordDatum(record, "Population du département", record.population, "habitants"),
        recordDatum(record, "Population âgée de 65 ans ou plus", record.age65, "%"),
        recordDatum(record, "Population âgée de 80 ans ou plus", record.age80, "%")
      ];
  const housingData = record.code === "976"
    ? [
        recordDatum(record, "Résidences principales recensées", record.mainResidences, "logements", 2017),
        recordDatum(record, "Ménages propriétaires de leur logement", record.owners, "%", 2017),
        recordDatum(record, "Résidences principales en habitat précaire", record.precariousHousing, "%", 2017)
      ]
    : [
        recordDatum(record, "Part des maisons dans le parc de logements", record.houses, "%"),
        recordDatum(record, "Part des appartements dans le parc de logements", record.apartments, "%"),
        recordDatum(record, "Résidences principales occupées par leur propriétaire", record.owners, "%")
      ];
  const inseeSource = record.code === "976"
    ? {
        organization: "INSEE",
        exactTitle: "Mayotte en 2017 — population et conditions de logement",
        supportedClaims: ["Population", "Structure par âge", "Résidences principales", "Habitat précaire"],
        dataYear: "2017 et 2026",
        publishedAt: "2019-08-05",
        checkedAt: showerUpdatedAt,
        officialUrl: "https://www.insee.fr/fr/statistiques/3713016?sommaire=4199393",
        scope: "local"
      }
    : {
        organization: "INSEE",
        exactTitle: `Dossier complet — ${record.name} (${record.code})`,
        supportedClaims: ["Population", "Structure par âge", "Maisons", "Appartements", "Statut d’occupation"],
        dataYear: "RP 2023",
        publishedAt: "2026-07-23",
        checkedAt: showerUpdatedAt,
        officialUrl: `https://www.insee.fr/fr/statistiques/2011101?geo=DEP-${record.code}`,
        scope: "local"
      };

  return {
    departmentName: record.name,
    departmentSlug: slug,
    departmentCode: record.code,
    regionName: record.regionName,
    regionSlug: slugify(record.regionName),
    preposition: place,
    prepositionTitle: place,
    demographicData,
    housingData,
    introduction: `${leadVariant} ${copy.lead} Autour de ${first}, ${second} et ${third}, la solution doit rester proportionnée à la pièce existante plutôt qu’à une promesse standardisée.`,
    geographicScope: `Ce guide concerne l’ensemble de ${record.name} (${record.code}), dans la région ${record.regionName}, notamment les secteurs de ${cities.join(", ")}. ${scopeVariant} La disponibilité d’un professionnel se vérifie ensuite avec le code postal exact du chantier.`,
    localCostFactors: [
      copy.factor,
      `Entre ${first} et ${second}, remplacer une baignoire peut demander une simple reprise localisée ou, au contraire, une modification complète de l’alimentation et de l’évacuation.`,
      `Dans les logements de ${third} et ${fourth}, la hauteur du plancher et la pente vers la canalisation déterminent si un accès de plain-pied est réaliste ou si un receveur extra-plat est préférable.`,
      `Le contexte immobilier est contrasté : ${housingText} Ce ratio invite à examiner aussi bien les planchers de maison que les contraintes d’un appartement.`,
      `Le prix doit distinguer la dépose, l’évacuation des gravats, le receveur, les parois, la robinetterie, le siège, les barres d’appui, l’étanchéité et les finitions.`
    ],
    inseeMethodology: record.code === "976"
      ? "Mayotte ne dispose pas encore des mêmes tableaux RP 2023 que les autres départements. La population 2026 est un premier résultat du recensement 2025-2026 ; les données détaillées d’âge et de logement restent issues du recensement exhaustif 2017 et sont affichées avec leur propre millésime."
      : `La part des 65 ans ou plus additionne ${formatNumber(record.age65to79)} % de 65 à 79 ans et ${formatNumber(record.age80)} % de 80 ans ou plus. Les parts de maisons et d’appartements sont reprises séparément du tableau INSEE sur les catégories de logements, sans les confondre avec le statut de propriétaire.`,
    localHousingCommentary: `${record.name} compte ${formatNumber(record.population)} habitants selon le millésime affiché et ${ageText}. ${housingText} Ces données aident à comprendre la diversité des chantiers possibles : réseaux encastrés, sols maçonnés, planchers plus légers, pièces étroites ou accès par parties communes. Elles ne permettent pas de déduire la faisabilité d’une douche sans ressaut dans un domicile particulier.`,
    coownershipConsiderations: `Dans un appartement ${place}, il faut déterminer si les canalisations, la dalle ou les gaines sont privatives ou communes. Le règlement de copropriété et le syndic précisent les autorisations éventuelles avant une modification touchant ces éléments.`,
    nearbyLocations: localPeers,
    cityLocations: record.topCommunes.map((city) => `douche-senior-${slug}-${slugify(city.name)}`),
    localPlaces: cities,
    faq: [
      { question: `Quel budget prévoir pour une douche senior ${place} ?`, answer: `Les repères nationaux 2026 vont de 500 à 2 000 € pour sécuriser une douche existante et de 4 000 à 9 000 € pour remplacer une baignoire. À ${first} comme à ${second}, le devis réel dépend de la dépose, du sol, des réseaux, de l’étanchéité et des équipements retenus.`, local: true },
      { question: `Que montrent les logements de ${record.name} pour ce type de projet ?`, answer: `${housingText} Cette répartition décrit le parc départemental, pas la salle de bain à transformer. Elle rappelle surtout qu’un chantier en appartement et un chantier en maison peuvent avoir des accès, planchers et réseaux très différents.`, local: true },
      { question: `Une baignoire peut-elle être remplacée rapidement autour de ${first} ou ${second} ?`, answer: `La durée dépend de l’état découvert après dépose, du maintien des arrivées d’eau, de la reprise des parois et du temps nécessaire à l’étanchéité. Le professionnel doit annoncer les étapes et les conditions qui pourraient prolonger le chantier.`, local: true },
      { question: copy.question, answer: copy.answer, local: true },
      { question: `Comment préparer une étude de douche senior à ${third}, ${fourth} ou ${fifth} ?`, answer: `Relevez les dimensions, photographiez la baignoire ou la douche, repérez l’évacuation, la ventilation, les prises et le tableau électrique. Indiquez aussi les difficultés de franchissement, les besoins d’assise et les points d’appui recherchés.`, local: true },
      { question: `Faut-il consulter la copropriété pour un appartement ${place} ?`, answer: `Les équipements et finitions intérieurs sont généralement privatifs, mais une intervention sur une dalle, une colonne ou une canalisation commune peut exiger un accord. Il faut vérifier le règlement et interroger le syndic avant de commencer.`, local: true },
      { question: "Douche de plain-pied et receveur extra-plat, quelle différence ?", answer: "Une douche de plain-pied vise un accès sans ressaut, ce qui demande une réservation suffisante et une évacuation compatible. Un receveur extra-plat limite la hauteur lorsque l’encastrement complet n’est pas possible.", local: false },
      { question: `Comment comparer des devis reçus ${place} ?`, answer: `Comparez le même périmètre : dépose, évacuation, plomberie, étanchéité, receveur, parois, robinetterie, siège, barres, revêtements, nettoyage, délai et garanties. Les exclusions doivent être écrites pour éviter une comparaison trompeuse.`, local: true }
    ],
    officialSources: [
      inseeSource,
      {
        organization: "Service public de l’autonomie — CNSA",
        exactTitle: "Conseils avant d’aménager sa salle de bain",
        supportedClaims: ["Sécurisation de la salle de bain", "Choix des équipements", "Préparation de l’aménagement"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: showerUpdatedAt,
        officialUrl: "https://www.pour-les-personnes-agees.gouv.fr/preserver-son-autonomie/amenager-son-logement-et-s-equiper/conseils-avant-d-amenager-sa-salle-de-bain",
        scope: "national"
      },
      {
        organization: "France Rénov’",
        exactTitle: "Remplacer une baignoire par une douche",
        supportedClaims: ["Étapes du remplacement", "Receveur", "Équipements de sécurité"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: showerUpdatedAt,
        officialUrl: "https://france-renov.gouv.fr/renovation/autonomie-adapter/baignoire-douche-maison",
        scope: "national"
      }
    ],
    conclusion: `À ${first}, ${second}, ${third} ou ailleurs ${place}, une douche senior pertinente part des gestes à faciliter et des contraintes réelles de la pièce. Un relevé précis permet de choisir le bon niveau de travaux, de contrôler l’étanchéité et de comparer des devis portant sur le même périmètre.`,
    postalCodeExample: record.topCommunes[0]?.postalCode || `${record.code.padStart(2, "0")}000`,
    plumbing: `Arrivées d’eau, diamètre et pente d’évacuation à vérifier dans le logement ${place}`,
    waterproofing: "Protection sous carrelage, raccords du receveur, joints et zones de ruissellement à détailler",
    coownership: profile === "urbain" ? "Règlement, dalle, gaines et canalisations communes à contrôler" : "Vérification nécessaire si le projet touche un élément commun"
  };
}

function cityLocationPhrase(cityName) {
  if (/^Le\s/i.test(cityName)) return `au ${cityName.replace(/^Le\s/i, "")}`;
  if (/^Les\s/i.test(cityName)) return `aux ${cityName.replace(/^Les\s/i, "")}`;
  if (/^La\s/i.test(cityName)) return `à La ${cityName.replace(/^La\s/i, "")}`;
  if (/^L[’']/i.test(cityName)) return `à ${cityName}`;
  return `à ${cityName}`;
}

function lowerFirst(value) {
  return value ? `${value.charAt(0).toLocaleLowerCase("fr-FR")}${value.slice(1)}` : "";
}

function upperFirst(value) {
  return value ? `${value.charAt(0).toLocaleUpperCase("fr-FR")}${value.slice(1)}` : "";
}

function cityDatum(record, city, indicator, value, unit, year = city.statistics?.dataYear || 2023) {
  const apiGeo = record.code === "976";
  return {
    sourceOrganization: apiGeo ? "API Géo" : "INSEE",
    sourceTitle: apiGeo ? `Commune de ${city.name} — API Géo` : `Dossier complet — Commune de ${city.name} (${city.inseeCode})`,
    sourceUrl: apiGeo
      ? `https://geo.api.gouv.fr/communes/${city.inseeCode}?fields=nom,code,population,codesPostaux`
      : `https://www.insee.fr/fr/statistiques/2011101?geo=COM-${city.inseeCode}`,
    dataYear: year,
    geography: `Commune de ${city.name}`,
    inseeCode: city.inseeCode,
    sourcePublishedAt: null,
    sourceCheckedAt: showerUpdatedAt,
    indicator,
    value,
    displayValue: unit === "%" ? `${formatNumber(value)} %` : `${formatNumber(value)} ${unit}`,
    unit,
    vintage: apiGeo ? "population de référence disponible" : "RP 2023",
    source: apiGeo ? "API Géo" : "INSEE",
    retrievedAt: showerUpdatedAt
  };
}

const cityLeadVariants = Object.freeze([
  "Le projet commence par les gestes qui posent problème aujourd’hui : franchir le rebord, rester stable, s’asseoir ou atteindre la robinetterie.",
  "Remplacer une baignoire ne consiste pas seulement à poser un receveur : il faut relier l’usage attendu au sol, aux réseaux et à la place réellement disponible.",
  "Une douche adaptée doit être pensée à partir de la personne et de la salle de bain existante, avant de choisir ses équipements visibles.",
  "La bonne transformation cherche un accès simple et des appuis bien placés, tout en respectant les contraintes du plancher et de l’évacuation.",
  "Avant le devis, les dimensions, le support, la ventilation et les mouvements de la personne doivent être observés ensemble."
]);

function generatedShowerCityConfig(record, city) {
  const stats = city.statistics;
  const departmentSlug = slugify(record.name);
  const citySlug = slugify(city.name);
  const cityPlace = cityLocationPhrase(city.name);
  const profile = territoryProfile(record);
  const profileText = showerProfileCopy[profile];
  const peers = record.topCommunes.filter((candidate) => candidate.inseeCode !== city.inseeCode);
  const peerNames = peers.map((candidate) => candidate.name);
  const peer = peerNames[0] || record.name;
  const variantIndex = [...city.inseeCode].reduce((total, character) => total + character.charCodeAt(0), 0);
  const lead = cityLeadVariants[variantIndex % cityLeadVariants.length];
  const population = stats?.population ?? city.population;
  const houses = stats?.houses;
  const apartments = stats?.apartments;
  const age65 = stats?.age65;
  const demographicData = stats
    ? [
        cityDatum(record, city, "Population de la commune", population, "habitants"),
        cityDatum(record, city, "Population âgée de 65 ans ou plus", age65, "%"),
        cityDatum(record, city, "Population âgée de 80 ans ou plus", stats.age80, "%")
      ]
    : [cityDatum(record, city, "Population de la commune", population, "habitants", 2026)];
  const housingData = stats
    ? [
        cityDatum(record, city, "Part des maisons dans le parc de logements", houses, "%"),
        cityDatum(record, city, "Part des appartements dans le parc de logements", apartments, "%"),
        cityDatum(record, city, "Résidences principales occupées par leur propriétaire", stats.owners, "%")
      ]
    : [
        recordDatum(record, "Contexte départemental — résidences principales recensées", record.mainResidences, "logements", 2017),
        recordDatum(record, "Contexte départemental — ménages propriétaires", record.owners, "%", 2017),
        recordDatum(record, "Contexte départemental — habitat précaire", record.precariousHousing, "%", 2017)
      ];
  const housingText = stats
    ? `${formatNumber(houses)} % des logements sont des maisons et ${formatNumber(apartments)} % des appartements ; ${formatNumber(stats.owners)} % des résidences principales sont occupées par leur propriétaire.`
    : `Les données détaillées communales de logement ne sont pas affichées pour ${city.name}. Le contexte départemental de Mayotte est présenté séparément avec son millésime 2017, sans l’attribuer à la commune.`;
  const ageText = stats
    ? `${formatNumber(age65)} % de la population communale a 65 ans ou plus`
    : "la structure communale par âge n’est pas disponible dans le même millésime";
  const cityRank = record.topCommunes.findIndex((candidate) => candidate.inseeCode === city.inseeCode) + 1;
  const cityKey = `${city.name}, dans ${record.name}`;
  const citySpecificAnalysis = stats
    ? [
        `${cityKey}, occupe le rang ${cityRank} parmi les cinq communes retenues dans ce guide départemental, avec ${formatNumber(population)} habitants au millésime affiché.`,
        `À ${city.name}, dans le département ${record.name} (${record.code}) et la région ${record.regionName}, la part de ${formatNumber(age65)} % de personnes de 65 ans ou plus sert à décrire la commune ; elle ne préjuge ni d’un besoin individuel ni du type de douche à installer.`,
        `Le parc de ${city.name}, dans le département ${record.name} (${record.code}) en ${record.regionName}, associe ${formatNumber(houses)} % de maisons à ${formatNumber(apartments)} % d’appartements, une répartition à garder distincte du profil départemental.`,
        `Dans ${city.name}, commune de ${record.name}, ${formatNumber(stats.owners)} % des résidences principales sont occupées par leur propriétaire ; ce statut statistique ne dispense pas de vérifier les règles du logement et de la copropriété.`,
        `${city.name} et ${peer}, dans le département ${record.name} (${record.code}) en ${record.regionName}, n’ont pas des données communales interchangeables : chaque chantier conserve son propre plancher, ses réseaux, sa ventilation et ses accès.`,
        `Pour un appartement de ${city.name} en ${record.name}, la colonne d’évacuation et les parties communes sont documentées séparément ; pour une maison de la même commune, le support et le trajet des réseaux restent tout autant à contrôler.`,
        `Le code INSEE ${city.inseeCode} rattache les chiffres à ${city.name} dans ${record.name}, tandis que le code postal ${city.postalCode || "à confirmer"} sert seulement à situer le chantier et à vérifier l’intervention.`,
        `Le dossier communal ${city.inseeCode} documente la population et l’âge ; le dossier ${city.inseeCode} documente aussi les catégories de logement utilisées dans cette page.`,
        `Chaque valeur associée à ${city.inseeCode} conserve son millésime et sa géographie, afin de ne pas mélanger la commune avec le département.`,
        `La référence ${city.inseeCode} peut être retrouvée dans la source officielle liée plus bas ; elle rend les chiffres de ${city.name} contrôlables séparément.`,
        `Ces repères propres à ${city.name}, à ${record.name} et à la région ${record.regionName} permettent de poser de meilleures questions au devis, sans transformer une moyenne communale en diagnostic de salle de bain.`
      ].join(" ")
    : [
        `${cityKey}, occupe le rang ${cityRank} parmi les cinq communes retenues pour Mayotte, avec ${formatNumber(population)} habitants selon la population de référence affichée.`,
        `Pour ${city.name}, à Mayotte, le code INSEE ${city.inseeCode} et le code postal ${city.postalCode || "à confirmer"} situent précisément le projet sans fournir de diagnostic du logement.`,
        `${city.name} et ${peer}, à Mayotte, disposent de populations communales distinctes, mais les indicateurs détaillés de logement présentés ici restent départementaux et datés de 2017.`,
        `Aucune part communale de maisons ou d’appartements n’est attribuée à ${city.name}, à Mayotte, lorsque la source homogène n’est pas disponible.`,
        `Dans un logement de ${city.name} à Mayotte, l’humidité, le support, l’évacuation et l’accès au chantier doivent donc être relevés directement.`,
        `Le contexte de Mayotte aide à préparer les questions pour ${city.name}, sans être présenté comme une mesure propre à la commune mahoraise.`,
        `La faisabilité à ${city.name}, à Mayotte, dépend du plancher et des réseaux observés, pas d’une extrapolation à partir de ${peer}.`,
        `Ces limites de données sont conservées sur la page de ${city.name} à Mayotte afin que le lecteur distingue clairement fait communal, contexte départemental et constat technique.`
      ].join(" ");
  const localInseeSource = stats
    ? {
        organization: "INSEE",
        exactTitle: `Dossier complet — Commune de ${city.name} (${city.inseeCode})`,
        supportedClaims: ["Population communale", "Structure par âge", "Maisons", "Appartements", "Statut d’occupation"],
        dataYear: "RP 2023",
        publishedAt: "2026-07-23",
        checkedAt: showerUpdatedAt,
        officialUrl: `https://www.insee.fr/fr/statistiques/2011101?geo=COM-${city.inseeCode}`,
        scope: "local"
      }
    : {
        organization: "API Géo",
        exactTitle: `Commune de ${city.name} (${city.inseeCode})`,
        supportedClaims: ["Nom", "Code INSEE", "Population de référence", "Code postal"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: showerUpdatedAt,
        officialUrl: `https://geo.api.gouv.fr/communes/${city.inseeCode}?fields=nom,code,population,codesPostaux`,
        scope: "local"
      };

  return {
    departmentName: record.name,
    departmentSlug,
    departmentCode: record.code,
    regionName: record.regionName,
    regionSlug: slugify(record.regionName),
    cityName: city.name,
    citySlug,
    cityPreposition: cityPlace,
    inseeCode: city.inseeCode,
    postalCodes: city.postalCode ? [city.postalCode] : [],
    postalCodeExample: city.postalCode || `${record.code.padStart(2, "0")}000`,
    demographicData,
    housingData,
    introduction: `${lead} Pour un logement ${cityPlace}, ${lowerFirst(profileText.lead)} Le projet doit donc être confirmé dans la pièce concernée, sans déduire une solution standard du seul code postal.`,
    geographicScope: `Cette page traite des projets situés dans la commune de ${city.name} (${city.inseeCode}), dans le département ${record.name} et la région ${record.regionName}. Elle distingue les données communales du contexte départemental. Les communes proches, dont ${peer}, disposent de leur propre guide lorsqu’elles sont publiées.`,
    localCostFactors: [
      `Dans un logement ${cityPlace}, la hauteur d’encastrement, la distance jusqu’à l’évacuation et l’état découvert après la dépose déterminent une partie importante du devis.`,
      stats && apartments >= houses
        ? `Avec ${formatNumber(apartments)} % d’appartements, les accès de chantier, la dalle, les gaines et les canalisations communes méritent une vérification explicite avant toute modification.`
        : stats
          ? `Avec ${formatNumber(houses)} % de maisons, les projets peuvent concerner des sols et réseaux très différents ; la catégorie du logement ne suffit pas à confirmer un accès de plain-pied.`
          : `À Mayotte, les matériaux, l’humidité et l’accès au logement doivent être décrits précisément, faute de pouvoir transposer une statistique départementale à une salle de bain communale.`,
      `Entre ${city.name} et ${peer}, la disponibilité d’un artisan et l’accès au chantier peuvent varier, mais le prix doit toujours séparer fourniture, dépose, plomberie, étanchéité et finitions.`,
      `${profileText.factor} Cette vigilance s’applique au logement examiné et non uniformément à tous les bâtiments de la commune.`,
      "Deux propositions ne sont comparables que si elles indiquent le receveur, les parois, la robinetterie, le siège, les barres, les reprises de support, l’évacuation des gravats et les garanties."
    ],
    inseeMethodology: stats
      ? `La part des 65 ans ou plus additionne ${formatNumber(stats.age65to79)} % de 65 à 79 ans et ${formatNumber(stats.age80)} % de 80 ans ou plus. Les maisons et appartements sont deux catégories distinctes du tableau INSEE sur les logements de ${city.name}.`
      : "Pour les communes de Mayotte, la population de référence provient de l’API Géo. Les indicateurs de logement affichés sont explicitement départementaux et issus du recensement 2017 ; ils ne sont pas présentés comme des valeurs communales.",
    localHousingCommentary: `${city.name} compte ${formatNumber(population)} habitants selon la source et le millésime affichés ; ${ageText}. ${housingText} Ces repères orientent les questions sur le plancher, les réseaux, l’accès des intervenants et la copropriété, mais seule une visite confirme la faisabilité technique de la douche. ${citySpecificAnalysis}`,
    coownershipConsiderations: `${cityPlace}, une modification intérieure reste à distinguer d’une intervention touchant la dalle, une colonne d’eau, une gaine ou une canalisation commune. Le règlement et le syndic permettent de vérifier les autorisations nécessaires pour le logement concerné.`,
    nearbyLocations: peers.map((candidate) => `douche-senior-${departmentSlug}-${slugify(candidate.name)}`),
    localPlaces: [city.name, ...peerNames],
    faq: [
      { question: `Quel budget prévoir pour une douche senior ${cityPlace} ?`, answer: `Les repères nationaux 2026 vont de 500 à 2 000 € pour sécuriser une douche existante, de 4 000 à 9 000 € pour remplacer une baignoire et de 5 000 à 10 000 € pour une solution de plain-pied sur mesure. Le devis ${cityPlace} dépend du sol, des réseaux, de l’étanchéité et des finitions.`, local: true },
      { question: `Que disent les données de logement de ${city.name} ?`, answer: `${housingText} Ces valeurs décrivent un ensemble de logements et ne permettent pas de conclure sur le plancher ou l’évacuation d’une salle de bain particulière.`, local: true },
      { question: `Une douche sans ressaut est-elle toujours possible ${cityPlace} ?`, answer: `Non. Il faut une réservation suffisante dans le sol et une pente compatible jusqu’à l’évacuation. Lorsque ces conditions ne sont pas réunies, un receveur extra-plat peut limiter le franchissement sans promettre un seuil nul.`, local: true },
      { question: `Que faut-il vérifier dans un appartement ${cityPlace} ?`, answer: `Le plancher, la colonne d’évacuation, les gaines, l’accès par les parties communes et les règles de copropriété doivent être examinés. Une intervention sur un élément commun peut nécessiter une autorisation.`, local: true },
      { question: `Comment préparer la visite technique à ${city.name} ?`, answer: `Mesurez la pièce, photographiez l’installation, repérez la ventilation et indiquez les gestes difficiles. Le professionnel devra ensuite contrôler le support, l’évacuation, les arrivées d’eau et les fixations possibles.`, local: true },
      { question: `La disponibilité est-elle la même à ${city.name} et ${peer} ?`, answer: `Elle se vérifie avec le code postal exact et le type de travaux. Une page locale ne constitue pas une promesse automatique d’intervention ; Go Senior contrôle le secteur après réception de la demande.`, local: true },
      { question: "Combien de temps dure le remplacement d’une baignoire ?", answer: "Un chantier bien préparé peut être concentré sur quelques jours, mais une reprise de plomberie, de support ou d’étanchéité peut l’allonger. Les étapes et les aléas possibles doivent figurer dans le devis.", local: false },
      { question: `Comment comparer deux devis de douche reçus ${cityPlace} ?`, answer: `Vérifiez que les deux offres couvrent la même dépose, le même type de receveur, la plomberie, l’étanchéité, les équipements, les finitions, le nettoyage, le délai et les garanties. Toute exclusion doit être lisible.`, local: true }
    ],
    officialSources: [
      localInseeSource,
      ...(stats ? [] : [{
        organization: "INSEE",
        exactTitle: "Mayotte en 2017 — population et conditions de logement",
        supportedClaims: ["Résidences principales", "Propriétaires", "Habitat précaire"],
        dataYear: "2017",
        publishedAt: "2019-08-05",
        checkedAt: showerUpdatedAt,
        officialUrl: "https://www.insee.fr/fr/statistiques/3713016?sommaire=4199393",
        scope: "local"
      }]),
      {
        organization: "Service public de l’autonomie — CNSA",
        exactTitle: "Conseils avant d’aménager sa salle de bain",
        supportedClaims: ["Sécurisation", "Équipements", "Préparation de l’aménagement"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: showerUpdatedAt,
        officialUrl: "https://www.pour-les-personnes-agees.gouv.fr/preserver-son-autonomie/amenager-son-logement-et-s-equiper/conseils-avant-d-amenager-sa-salle-de-bain",
        scope: "national"
      }
    ],
    conclusion: `${upperFirst(cityPlace)}, le bon projet dépend davantage de la salle de bain et des gestes quotidiens que d’une appellation commerciale. Les données communales cadrent le contexte ; le relevé sur place confirme ensuite le niveau du receveur, les reprises nécessaires et les équipements utiles.`,
    plumbing: `Arrivées d’eau, pente et raccordement à contrôler dans le logement ${cityPlace}`,
    waterproofing: "Support, protection sous revêtement, raccords et zones de ruissellement à détailler",
    coownership: stats && apartments >= 50 ? "Dalle, gaines et colonnes communes à identifier avant travaux" : "Vérification requise si un élément commun est concerné"
  };
}

const generatedNationalDepartmentPages = departmentRecords
  .filter((record) => !["59", "60", "80"].includes(record.code))
  .map((record) => createPublishedStairliftDepartment(generatedConfig(record, departmentRecords)));

const generatedShowerDepartmentPages = departmentRecords
  .map((record) => createPublishedShowerDepartment(generatedShowerConfig(record, departmentRecords)));

const generatedShowerCityPages = departmentRecords.flatMap((record) => record.topCommunes
  .map((city) => createPublishedShowerCity(generatedShowerCityConfig(record, city))));

export const localPages = [
  commonDraft({
    id: "monte-escalier-nord",
    service: "monte-escalier",
    pageLevel: "department",
    regionName: "Hauts-de-France",
    regionSlug: "hauts-de-france",
    departmentName: "Nord",
    departmentSlug: "nord",
    departmentCode: "59",
    locationPhrase: "dans le Nord",
    inseeCode: "59",
    seoTitle: "Monte-escalier dans le Nord (59) : prix et aides | Go Senior",
    metaDescription: "Découvrez les prix d’un monte-escalier dans le Nord, les modèles droits ou tournants, les aides disponibles et les professionnels intervenant dans votre secteur.",
    h1: "Monte-escalier dans le Nord : prix, aides et professionnels",
    introduction: "Dans le Nord, la configuration de l’escalier et une prise de mesures permettent de préciser le type de rail, les options et le devis du projet.",
    geographicScope: "Ce guide couvre le département du Nord (59). Les données INSEE portent sur l’ensemble du département. Les aides dépendent de la situation du demandeur, tandis que le code postal permet d’orienter la demande vers le professionnel intervenant dans le secteur du projet.",
    nationalPriceReference: stairliftPrices,
    localCostFactors: [
      "Entre maisons et appartements, l’accès à l’escalier, le nombre de volées et la largeur utile doivent être étudiés au cas par cas.",
      "Dans le parc ancien, les portes, radiateurs, paliers et dégagements peuvent influencer le tracé du rail sans permettre de présumer d’une forme dominante.",
      "En copropriété, un projet touchant une partie commune ou un accès partagé doit être distingué d’une installation entièrement située dans le logement.",
      "Pour un accès extérieur, le support, l’exposition, l’alimentation électrique et la zone de stationnement du siège doivent être vérifiés.",
      "La pose, les options de sécurité et les éventuels travaux électriques ou complémentaires doivent être détaillés dans le devis après visite technique."
    ],
    demographicData: [
      {
        ...nordInseeMetadata,
        indicator: "Population du département",
        value: 2615635,
        displayValue: "2 615 635 habitants",
        unit: "habitants",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      },
      {
        ...nordInseeMetadata,
        indicator: "Population âgée de 65 ans ou plus",
        value: 18.2,
        displayValue: "18,2 %",
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      },
      {
        ...nordInseeMetadata,
        indicator: "Population âgée de 80 ans ou plus",
        value: 4.8,
        displayValue: "4,8 %",
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      }
    ],
    housingData: [
      {
        ...nordInseeMetadata,
        indicator: "Part des maisons dans le parc de logements",
        value: 64.4,
        displayValue: "64,4 %",
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      },
      {
        ...nordInseeMetadata,
        indicator: "Résidences principales occupées par leur propriétaire",
        value: 54.1,
        displayValue: "54,1 %",
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      },
      {
        ...nordInseeMetadata,
        indicator: "Résidences principales achevées avant 1971",
        value: 49.8,
        displayValue: "49,8 %",
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord",
        inseeCode: "59",
        source: "INSEE",
        retrievedAt: "2026-08-12"
      }
    ],
    inseeMethodology: "Les 18,2 % de personnes âgées de 65 ans ou plus correspondent à 13,4 % de 65 à 79 ans plus 4,8 % de 80 ans ou plus. Les 49,8 % de résidences principales achevées avant 1971 correspondent à (89 367 + 213 079 + 274 014) ÷ 1 157 844, soit 576 460 ÷ 1 157 844.",
    localHousingCommentary: "Le Nord compte 64,4 % de maisons et près de la moitié de ses résidences principales ont été achevées avant 1971. Cette structure du parc ne permet pas de déduire automatiquement la forme des escaliers, mais elle peut correspondre à des configurations très diverses : passages plus étroits, virages, paliers intermédiaires, portes proches des marches ou différences de niveau. Dans les secteurs urbains denses comme dans le bassin minier, la Flandre et l’Avesnois, une prise de mesures reste donc nécessaire pour choisir entre un rail droit, tournant ou une solution particulière.",
    projectOptions: stairliftOptions,
    localAssistancePrograms: [
      {
        programName: "MaPrimeAdapt’",
        programType: "aide_nationale",
        description: "MaPrimeAdapt’ peut financer, sous conditions, certains travaux d’adaptation du logement, dont l’installation d’un monte-escalier. Le taux et le montant dépendent notamment des ressources, de l’âge ou de la situation de handicap, du logement et du projet retenu.",
        eligibilitySummary: "Sous conditions de ressources, d’âge ou de handicap, de logement et de projet.",
        officialOrganization: "France Rénov’",
        officialTitle: "MaPrimeAdapt’",
        officialUrl: "https://france-renov.gouv.fr/aides/maprimeadapt",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      },
      {
        programName: "PCH — aménagement du logement",
        programType: "aide_nationale_geree_localement",
        description: "La prestation de compensation du handicap peut participer, sous conditions, à des travaux facilitant les déplacements ou l’accès aux pièces et équipements du logement. La demande est évaluée à partir de la situation, des besoins et des devis.",
        eligibilitySummary: "Après évaluation des besoins liés au handicap et étude des devis.",
        officialOrganization: "MDPH du Nord",
        officialTitle: "Prestation de Compensation du Handicap (PCH) : Compenser les besoins liés à la perte d’autonomie",
        officialUrl: "https://mdph.lenord.fr/pch",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      },
      {
        programName: "APA",
        programType: "aide_nationale_geree_localement",
        description: "L’APA à domicile peut intégrer différentes dépenses dans un plan d’aide établi par le Département. L’évaluation dépend du niveau d’autonomie et de la situation du demandeur.",
        eligibilitySummary: "Selon l’âge, la résidence, le niveau d’autonomie et le plan d’aide départemental.",
        officialOrganization: "Département du Nord",
        officialTitle: "Autonomie des séniors",
        officialUrl: "https://lenord.fr/nos-politiques/autonomie-des-seniors",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      },
      {
        programName: "J’Amén’Âge 59",
        programType: "dispositif_departemental",
        description: "Le Département du Nord propose J’Amén’Âge 59 aux personnes de plus de 60 ans bénéficiaires de l’APA qui ont besoin d’adapter leur logement pour continuer à y vivre.",
        eligibilitySummary: "Personnes de plus de 60 ans bénéficiaires de l’APA, selon l’étude du besoin.",
        officialOrganization: "Département du Nord",
        officialTitle: "Adaptez votre logement avec J’Amén’Âge 59",
        officialUrl: "https://info.lenord.fr/adaptez-votre-logement-avec-j-amen-age-59",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      },
      {
        programName: "Fonds départemental de compensation du handicap",
        programType: "dispositif_departemental",
        description: "En cas de reste à charge supérieur au seuil prévu par le dispositif, une demande de financement complémentaire peut être étudiée par le Fonds départemental de compensation du handicap.",
        eligibilitySummary: "Après étude de la PCH et du reste à charge selon les règles du Fonds.",
        officialOrganization: "MDPH du Nord",
        officialTitle: "Prestation de Compensation du Handicap (PCH) : Compenser les besoins liés à la perte d’autonomie",
        officialUrl: "https://mdph.lenord.fr/pch",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    usefulLocalContacts: [
      {
        programName: "Relais Autonomie du Nord",
        programType: "contact_departemental",
        description: "Les Relais Autonomie accueillent les personnes âgées, les personnes en situation de handicap et leurs proches. La page officielle permet de rechercher le point d’accueil le plus proche.",
        eligibilitySummary: "Information et accompagnement de proximité, sans condition d’éligibilité annoncée pour la prise de contact.",
        officialOrganization: "MDPH du Nord — 03 59 73 73 73",
        officialTitle: "Nous trouver — Les relais autonomie",
        officialUrl: "https://mdph.lenord.fr/nous-trouver",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    coverageStatus: "nationwide",
    routingStatus: "active",
    leadDistributionMode: "exclusive",
    coveredPostalCodes: [],
    nearbyLocations: ["monte-escalier-oise", "monte-escalier-somme", "monte-escalier-nord-lille"],
    localPlaces: ["Lille", "Roubaix", "Tourcoing", "Dunkerque", "Valenciennes"],
    faq: [
      {
        question: "Quel est le prix d’un monte-escalier dans le Nord ?",
        answer: "Les repères nationaux 2026 vont de 2 500 à 5 500 € pose comprise pour un modèle droit et de 6 000 à 12 000 € pour un tournant. Les modèles extérieurs et assis-debout ont leurs propres fourchettes ; le prix précis dépend des mesures, du rail, des options et du devis.",
        local: true
      },
      {
        question: "Comment savoir s’il faut un rail droit ou tournant dans mon logement ?",
        answer: "Un rail droit convient à une volée rectiligne sans virage ni palier intermédiaire ; un rail tournant est conçu sur mesure lorsqu’il existe un virage, un palier, plusieurs volées ou un changement de pente. Une prise de mesures dans le logement permet de confirmer la solution.",
        local: true
      },
      {
        question: "Un monte-escalier peut-il être installé dans une maison ancienne ?",
        answer: "Oui, une installation est souvent possible dans une maison ancienne, après vérification de l’escalier, des points de fixation, de l’alimentation et des dégagements. Dans le Nord, l’ancienneté du parc ne suffit pas à présumer de la forme ou de la largeur de l’escalier.",
        local: true
      },
      {
        question: "Un monte-escalier peut-il être installé sur un escalier étroit ?",
        answer: "Oui, certaines configurations étroites peuvent recevoir un monte-escalier si la largeur utile et le passage restant sont suffisants. Le siège replié, le rail, les accoudoirs, les portes proches et la morphologie de l’utilisateur doivent être étudiés sur place.",
        local: false
      },
      {
        question: "J’Amén’Âge 59 peut-il aider à financer un monte-escalier ?",
        answer: "J’Amén’Âge 59 peut accompagner, sous conditions, des personnes de plus de 60 ans bénéficiaires de l’APA qui doivent adapter leur logement. Le Département du Nord doit confirmer l’éligibilité et le projet avant le début des travaux.",
        local: true
      },
      {
        question: "La PCH peut-elle participer à l’aménagement d’un escalier ?",
        answer: "Oui, la PCH peut participer sous conditions à des travaux qui facilitent les déplacements ou l’accès aux pièces du logement. La MDPH du Nord évalue les besoins et les devis ; un Fonds départemental de compensation peut ensuite être étudié pour certains restes à charge.",
        local: true
      },
      {
        question: "MaPrimeAdapt’ finance-t-elle les monte-escaliers ?",
        answer: "Oui, France Rénov’ cite explicitement l’installation d’un monte-escalier parmi les travaux pouvant être financés par MaPrimeAdapt’. Le financement reste soumis aux conditions de ressources, d’âge ou de handicap, de logement et de projet.",
        local: false
      },
      {
        question: "Où demander conseil dans le Nord pour un dossier d’autonomie ?",
        answer: "Les Relais Autonomie du Nord peuvent informer et accompagner les personnes âgées, les personnes en situation de handicap et leurs proches. La MDPH publie les points d’accueil et le contact départemental au 03 59 73 73 73.",
        local: true
      },
      {
        question: "Peut-on installer un monte-escalier extérieur dans le Nord ?",
        answer: "Oui, un monte-escalier extérieur peut équiper un perron, un accès de jardin ou un autre escalier exposé si le support, l’alimentation, l’évacuation de l’eau et le stationnement sont adaptés. Une visite technique doit confirmer les composants prévus par le fabricant.",
        local: true
      },
      {
        question: "Comment Go Senior oriente-t-il ma demande vers un professionnel de mon secteur ?",
        answer: "Tous les codes postaux du Nord sont couverts pour les projets de monte-escalier. Le code postal identifie la localisation et permet à Go Senior d’orienter la demande vers le professionnel indépendant correspondant, selon les règles partenaires, les caps et les horaires, sans confondre ces paramètres de routing avec la couverture.",
        local: true
      }
    ],
    officialSources: [
      {
        organization: "INSEE",
        exactTitle: "Dossier complet — Département du Nord (59)",
        supportedClaims: ["Population", "Structure par âge", "Types de logements", "Statut d’occupation", "Période d’achèvement des résidences principales"],
        dataYear: "RP 2023",
        publishedAt: "2026-07-23",
        checkedAt: "2026-08-12",
        officialUrl: "https://www.insee.fr/fr/statistiques/2011101?geo=DEP-59",
        scope: "local"
      },
      {
        organization: "Département du Nord",
        exactTitle: "J’Amén’Âge 59 et politique d’autonomie",
        supportedClaims: ["Adaptation du logement", "APA", "Ressources départementales"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://info.lenord.fr/adaptez-votre-logement-avec-j-amen-age-59",
        additionalOfficialUrls: ["https://lenord.fr/nos-politiques/autonomie-des-seniors"],
        scope: "local"
      },
      {
        organization: "MDPH du Nord",
        exactTitle: "Prestation de compensation du handicap",
        supportedClaims: ["PCH", "Aménagement du logement", "Fonds départemental de compensation"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://mdph.lenord.fr/pch",
        scope: "local"
      },
      {
        organization: "Relais Autonomie",
        exactTitle: "Trouver un Relais Autonomie dans le Nord",
        supportedClaims: ["Points d’accueil", "Accompagnement", "Coordonnées"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://mdph.lenord.fr/nous-trouver",
        scope: "local"
      },
      {
        organization: "France Rénov’",
        exactTitle: "MaPrimeAdapt’",
        supportedClaims: ["Travaux pouvant être financés", "Conditions", "Parcours d’accompagnement"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://france-renov.gouv.fr/aides/maprimeadapt",
        scope: "national"
      }
    ],
    conclusion: "Entre les logements urbains, les maisons du bassin minier, les habitations de Flandre et celles de l’Avesnois, les configurations d’escalier sont très diverses dans le Nord. Le choix d’un monte-escalier droit, tournant, extérieur ou assis-debout dépend donc d’une étude précise de l’accès. Indiquez votre code postal et décrivez votre escalier pour être orienté vers le professionnel intervenant dans votre secteur.",
    cta: {
      title: "Votre projet de monte-escalier dans le Nord",
      description: "Tous les codes postaux du Nord sont couverts. Demande gratuite et sans engagement.",
      project: "monte-escalier",
      postalCodeExample: "59000",
      buttonLabel: "Démarrer mon projet",
      reassurance: "Tous les codes postaux du Nord sont couverts. Demande gratuite et sans engagement.",
      validPostalCodeMessage: "Votre secteur est couvert. Continuez pour nous préciser la configuration de votre escalier et vos coordonnées."
    },
    canonical: "/monte-escalier/nord/",
    sourceCheckedAt: "2026-08-12",
    status: "published",
    indexStatus: "index",
    sitemapStatus: "included",
    publishedAt: "2026-08-12",
    updatedAt: "2026-08-12",
    serviceDetails: {
      stairLocation: "Intérieur ou extérieur, à préciser selon l’accès à équiper",
      stairShape: "Droit, tournant ou à déterminer après mesure",
      levels: "Un ou plusieurs niveaux à documenter dans le projet",
      turns: "Quartiers tournants, courbes et changements de pente à relever",
      landings: "Départs, arrivées et paliers intermédiaires à mesurer",
      width: "Largeur utile et passage restant à vérifier sur place",
      obstacles: ["Portes", "radiateurs", "rampes", "marches irrégulières", "dégagements en haut et en bas"],
      railType: "Rail standard pour une volée droite ou rail sur mesure pour les courbes",
      possibleTimelines: ["Planning confirmé par le professionnel après visite technique et validation du devis"],
      availableModels: ["Droit", "tournant", "extérieur", "assis-debout"],
      nationalPriceRanges: stairliftPrices,
      projectAssistance: ["MaPrimeAdapt’", "PCH", "J’Amén’âge 59", "Fonds départemental de compensation selon éligibilité"]
    }
  }),
  createPublishedStairliftDepartment({
    departmentName: "Oise",
    departmentSlug: "oise",
    departmentCode: "60",
    inseeLabel: "de l’Oise",
    preposition: "dans l’Oise",
    prepositionTitle: "dans l’Oise",
    inseePublishedAt: "2026-08-06",
    population: 829899,
    populationDisplay: "829 899 habitants",
    age65: 18.3,
    age65Display: "18,3 %",
    age80: 4.7,
    age80Display: "4,7 %",
    houses: 66.3,
    housesDisplay: "66,3 %",
    owners: 61.4,
    ownersDisplay: "61,4 %",
    pre1971: 42.2,
    pre1971Display: "42,2 %",
    introduction: "Dans l’Oise, un projet peut concerner aussi bien une maison de bourg qu’un pavillon périurbain ou une habitation rurale. La visite technique doit mesurer la volée, les paliers et les dégagements avant de choisir le rail.",
    localCostFactors: [
      "Les accès au logement peuvent différer fortement entre les secteurs denses proches de l’Île-de-France, les villes moyennes et les communes rurales.",
      "Un escalier ancien avec des marches irrégulières, un virage ou une porte proche du départ peut nécessiter un rail et des options spécifiques.",
      "Pour un pavillon, il faut vérifier la place disponible en haut et en bas, le passage lorsque le siège est replié et l’alimentation électrique.",
      "Une pose extérieure doit intégrer l’exposition, l’évacuation de l’eau, le support et les protections prévues par le fabricant.",
      "Le devis doit séparer l’appareil, le rail, la pose, les options et les éventuels travaux complémentaires."
    ],
    inseeMethodology: "Les 18,3 % de personnes âgées de 65 ans ou plus correspondent à 13,6 % de 65 à 79 ans plus 4,7 % de 80 ans ou plus. Les 42,2 % de résidences principales achevées avant 1971 correspondent à la somme des parts avant 1919, de 1919 à 1945 et de 1946 à 1970 publiées par l’INSEE.",
    localHousingCommentary: "Dans l’Oise, 66,3 % des logements sont des maisons et 61,4 % des résidences principales sont occupées par leur propriétaire. Le parc associe des maisons anciennes, des pavillons et des logements urbains, sans qu’une statistique départementale permette de déduire la forme d’un escalier précis. La part de 42,2 % de résidences principales achevées avant 1971 invite surtout à contrôler les largeurs, les marches, les portes proches et les paliers lors de la visite.",
    localAssistancePrograms: [
      {
        programName: "APA à domicile dans l’Oise",
        programType: "aide_nationale_geree_localement",
        description: "L’APA à domicile est versée par le Département aux personnes de 60 ans ou plus dont la perte d’autonomie est évaluée en GIR 1 à 4. Le plan d’aide est défini après instruction du dossier.",
        eligibilitySummary: "À partir de 60 ans, résidence stable en France et classement en GIR 1 à 4 après évaluation.",
        officialOrganization: "Maison Départementale de l’Autonomie de l’Oise",
        officialTitle: "Allocation personnalisée d’autonomie à domicile",
        officialUrl: "https://mda.oise.fr/bien-vieillir/mes-droits-et-prestations/allocation-personnalisee-dautonomie-apa-a-domicile",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    usefulLocalContacts: [
      {
        programName: "Maison Départementale de l’Autonomie de l’Oise",
        programType: "contact_departemental",
        description: "La MDA réunit les services du Département et de la MDPH pour accueillir, informer, orienter et instruire les demandes liées à l’âge, au handicap et à la perte d’autonomie.",
        eligibilitySummary: "Accueil des personnes âgées, des personnes en situation de handicap et de leurs proches.",
        officialOrganization: "Département de l’Oise — MDA",
        officialTitle: "Maison Départementale de l’Autonomie",
        officialUrl: "https://mda.oise.fr/",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    nearbyLocations: ["monte-escalier-nord", "monte-escalier-somme"],
    localPlaces: ["Beauvais", "Compiègne", "Creil", "Nogent-sur-Oise", "Senlis"],
    faq: [
      { question: "Quel budget prévoir pour un monte-escalier dans l’Oise ?", answer: "Les repères nationaux 2026 vont de 2 500 à 5 500 € pose comprise pour un modèle droit et de 6 000 à 12 000 € pour un tournant. La mesure de l’escalier, le rail, les options et les travaux complémentaires déterminent le devis.", local: true },
      { question: "Pourquoi la visite technique est-elle importante dans une maison ancienne de l’Oise ?", answer: "Elle permet de relever la largeur utile, les marches irrégulières, les portes, les radiateurs, les paliers et les dégagements. Les données sur l’âge du parc donnent un contexte, mais ne remplacent jamais les mesures du logement.", local: true },
      { question: "La Maison Départementale de l’Autonomie peut-elle m’orienter ?", answer: "Oui. La MDA de l’Oise accueille et oriente les personnes âgées, les personnes en situation de handicap et leurs proches, puis instruit les demandes relevant de ses compétences.", local: true },
      { question: "L’APA de l’Oise finance-t-elle automatiquement un monte-escalier ?", answer: "Non. L’APA à domicile dépend notamment de l’âge, de la résidence et d’une évaluation en GIR 1 à 4. Les dépenses retenues sont précisées dans le plan d’aide individuel établi après instruction.", local: true },
      { question: "Peut-on équiper un escalier extérieur dans l’Oise ?", answer: "Oui si le support, l’alimentation, l’évacuation de l’eau et l’exposition sont compatibles avec un modèle extérieur. Le professionnel doit préciser les protections et l’entretien dans son offre.", local: true },
      { question: "Un rail tournant est-il nécessaire dès qu’il existe un palier ?", answer: "Un changement de direction, un palier intermédiaire ou plusieurs volées conduisent généralement à étudier un rail sur mesure. Seul le relevé précis confirme le tracé adapté.", local: false },
      { question: "MaPrimeAdapt’ peut-elle participer au financement ?", answer: "MaPrimeAdapt’ peut financer certains travaux d’adaptation, dont le monte-escalier, sous conditions de ressources, d’âge ou de handicap, de logement et de projet. Le dossier doit être vérifié avant le démarrage des travaux.", local: false },
      { question: "Comment Go Senior traite-t-il un code postal de l’Oise ?", answer: "Le service couvre les codes postaux du département pour le monte-escalier. Le code postal localise le projet afin d’orienter la demande vers le professionnel indépendant intervenant dans le secteur.", local: true }
    ],
    officialSources: [
      {
        organization: "Département de l’Oise",
        exactTitle: "Autonomie",
        supportedClaims: ["Accueil et orientation", "Maintien à domicile", "Maison Départementale de l’Autonomie"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://oise.fr/actions/sante-social-solidarite/autonomie",
        additionalOfficialUrls: ["https://mda.oise.fr/bien-vieillir/mes-droits-et-prestations/allocation-personnalisee-dautonomie-apa-a-domicile"],
        scope: "local"
      }
    ],
    conclusion: "Entre le sud de l’Oise proche de l’Île-de-France, le Beauvaisis, le Compiégnois et les communes plus rurales, les accès et les escaliers varient fortement. Un relevé sur place permet de choisir le rail, les options et le niveau de travaux réellement nécessaires.",
    postalCodeExample: "60000",
    stairLocation: "Intérieur ou extérieur, selon l’accès du logement",
    turns: "Virages et changements de pente à relever précisément",
    landings: "Paliers, portes et zones de stationnement à mesurer",
    obstacles: ["Portes proches", "radiateurs", "rampes", "marches irrégulières", "passages étroits"],
    projectAssistance: ["APA à domicile", "PCH selon la situation et l’évaluation de la MDA"]
  }),
  createPublishedStairliftDepartment({
    departmentName: "Somme",
    departmentSlug: "somme",
    departmentCode: "80",
    inseeLabel: "de la Somme",
    preposition: "dans la Somme",
    prepositionTitle: "dans la Somme",
    inseePublishedAt: "2026-07-23",
    population: 565413,
    populationDisplay: "565 413 habitants",
    age65: 21.5,
    age65Display: "21,5 %",
    age80: 5.7,
    age80Display: "5,7 %",
    houses: 72.2,
    housesDisplay: "72,2 %",
    owners: 59.7,
    ownersDisplay: "59,7 %",
    pre1971: 49,
    pre1971Display: "49,0 %",
    introduction: "Dans la Somme, le parc résidentiel est majoritairement composé de maisons, des secteurs urbains d’Amiens aux bourgs, villages et communes littorales. Le choix du rail dépend toutefois de l’escalier réel, pas du seul type de logement.",
    localCostFactors: [
      "Dans une maison rurale ou de bourg, l’irrégularité des marches, les demi-paliers et les portes proches peuvent modifier le tracé envisagé.",
      "À Amiens et dans les secteurs plus urbains, les accès partagés et les parties communes doivent être distingués d’une installation entièrement privative.",
      "Près du littoral, un équipement extérieur doit être choisi en tenant compte de l’humidité, de l’exposition et des prescriptions d’entretien du fabricant.",
      "La longueur du rail, le nombre de courbes, le pivotement du siège et un éventuel rail escamotable influencent davantage le prix que le département lui-même.",
      "Une offre comparable détaille l’appareil, la pose, les garanties, le service après-vente et chaque poste complémentaire."
    ],
    inseeMethodology: "Les 21,5 % de personnes âgées de 65 ans ou plus correspondent à 15,8 % de 65 à 79 ans plus 5,7 % de 80 ans ou plus. Les 49,0 % de résidences principales achevées avant 1971 correspondent à 10,3 % avant 1919, 14,5 % de 1919 à 1945 et 24,2 % de 1946 à 1970.",
    localHousingCommentary: "La Somme compte 72,2 % de maisons et 59,7 % de résidences principales occupées par leur propriétaire. Près d’une résidence principale sur deux construite avant 2021 a été achevée avant 1971. Ces chiffres justifient un examen attentif des escaliers et des accès, mais ils ne prouvent ni la présence d’un étage ni une configuration technique donnée dans un logement particulier.",
    localAssistancePrograms: [
      {
        programName: "Aide départementale à l’adaptation du logement",
        programType: "dispositif_departemental",
        description: "Le Département de la Somme peut attribuer une aide complémentaire à celle de l’Anah pour des travaux d’accessibilité, d’adaptation ou de sécurité préconisés par un opérateur-conseil agréé.",
        eligibilitySummary: "Sous conditions du dispositif départemental, en complément de l’Anah et avec préconisation d’un opérateur-conseil agréé.",
        officialOrganization: "Conseil départemental de la Somme",
        officialTitle: "Aide à l’adaptation du logement",
        officialUrl: "https://www.somme.fr/services/seniors/rester-a-domicile/aide-a-ladaptation-du-logement/",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      },
      {
        programName: "APA dans la Somme",
        programType: "aide_nationale_geree_localement",
        description: "L’APA s’adresse aux personnes de 60 ans ou plus en perte d’autonomie. Le Département précise les aides retenues, leur montant et la participation éventuelle dans le plan d’aide.",
        eligibilitySummary: "À partir de 60 ans, selon la perte d’autonomie évaluée et la situation du demandeur.",
        officialOrganization: "Conseil départemental de la Somme",
        officialTitle: "L’Allocation personnalisée d’autonomie",
        officialUrl: "https://www.somme.fr/services/seniors/les-aides/lallocation-personnalisee-dautonomie-apa/",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    usefulLocalContacts: [
      {
        programName: "MDPH de la Somme — logement adapté",
        programType: "contact_departemental",
        description: "La MDPH présente les démarches et dispositifs liés au logement adapté pour les personnes en situation de handicap, notamment en lien avec la PCH selon la situation.",
        eligibilitySummary: "Selon la situation de handicap, le projet et l’évaluation des droits par la MDPH.",
        officialOrganization: "MDPH de la Somme",
        officialTitle: "Vivre dans un logement adapté",
        officialUrl: "https://mdph.somme.fr/mdph/mdph/vivre-a-domicile/vivre-dans-un-logement-adapte/",
        sourceCheckedAt: "2026-08-12",
        status: "verified"
      }
    ],
    nearbyLocations: ["monte-escalier-nord", "monte-escalier-oise"],
    localPlaces: ["Amiens", "Abbeville", "Albert", "Péronne", "Doullens"],
    faq: [
      { question: "Quel est le prix d’un monte-escalier dans la Somme ?", answer: "Les repères nationaux 2026 sont de 2 500 à 5 500 € pose comprise pour un escalier droit et de 6 000 à 12 000 € pour un tournant. La configuration, les courbes, les options et les travaux annexes fixent le montant réel.", local: true },
      { question: "Quelle aide spécifique le Département de la Somme propose-t-il pour adapter un logement ?", answer: "Le Département présente une aide à l’adaptation du logement complémentaire à celle de l’Anah. Les travaux doivent répondre aux conditions du dispositif et être préconisés par un opérateur-conseil agréé.", local: true },
      { question: "Pourquoi distinguer Amiens, les bourgs et les communes rurales lors de l’étude ?", answer: "Les contraintes d’accès, de parties communes, de stationnement et de configuration intérieure peuvent différer. La page départementale donne le cadre ; la visite du logement détermine la solution technique.", local: true },
      { question: "Un monte-escalier extérieur est-il adapté près du littoral picard ?", answer: "Une installation extérieure est possible avec un équipement conçu pour l’exposition. Le support, l’humidité, l’évacuation de l’eau, l’alimentation et l’entretien doivent être vérifiés précisément.", local: true },
      { question: "La MDPH de la Somme peut-elle étudier un besoin d’aménagement ?", answer: "La MDPH informe sur le logement adapté et évalue les droits liés au handicap, dont la PCH selon la situation. Le dossier et les devis doivent être examinés par l’organisme compétent.", local: true },
      { question: "La forte part de maisons signifie-t-elle qu’un rail droit suffit ?", answer: "Non. Une maison peut comporter une volée droite, un quart tournant, plusieurs paliers ou un escalier étroit. La part départementale des maisons ne permet pas de choisir le rail d’un logement précis.", local: true },
      { question: "L’APA peut-elle couvrir la totalité du projet ?", answer: "L’APA dépend de l’évaluation de l’autonomie et du plan d’aide. Les dépenses retenues, le montant accordé et la participation du bénéficiaire sont précisés après instruction par le Département.", local: true },
      { question: "Comment comparer correctement des devis de monte-escalier ?", answer: "Comparez le modèle, le rail, la pose, les options, les garanties, l’entretien, le service après-vente et les travaux annexes. Des périmètres identiques rendent les écarts de prix réellement lisibles.", local: false }
    ],
    officialSources: [
      {
        organization: "Conseil départemental de la Somme",
        exactTitle: "Aide à l’adaptation du logement",
        supportedClaims: ["Travaux d’adaptation", "Complément à l’aide de l’Anah", "Préconisation par un opérateur-conseil"],
        dataYear: "2026",
        publishedAt: "2026-04-20",
        checkedAt: "2026-08-12",
        officialUrl: "https://www.somme.fr/services/seniors/rester-a-domicile/aide-a-ladaptation-du-logement/",
        additionalOfficialUrls: ["https://www.somme.fr/services/seniors/les-aides/lallocation-personnalisee-dautonomie-apa/"],
        scope: "local"
      },
      {
        organization: "MDPH de la Somme",
        exactTitle: "Vivre dans un logement adapté",
        supportedClaims: ["Logement adapté", "Orientation liée au handicap", "PCH selon la situation"],
        dataYear: "2026",
        publishedAt: null,
        checkedAt: "2026-08-12",
        officialUrl: "https://mdph.somme.fr/mdph/mdph/vivre-a-domicile/vivre-dans-un-logement-adapte/",
        scope: "local"
      }
    ],
    conclusion: "Dans la Somme, la forte présence de maisons et l’ancienneté d’une partie du parc donnent un contexte utile, sans remplacer la mesure de l’escalier. Décrivez l’accès, les virages et le lieu d’installation pour préparer une étude adaptée au logement.",
    postalCodeExample: "80000",
    stairLocation: "Intérieur ou extérieur, avec attention particulière à l’exposition littorale",
    turns: "Demi-paliers, quarts tournants et volées multiples à relever",
    landings: "Départs, arrivées et accès aux pièces à conserver dégagés",
    obstacles: ["Portes", "murs irréguliers", "rampes", "passages partagés", "exposition extérieure"],
    projectAssistance: ["Aide départementale à l’adaptation", "APA", "PCH selon éligibilité"]
  }),
  ...generatedNationalDepartmentPages,
  ...generatedShowerDepartmentPages,
  ...generatedShowerCityPages,
  commonDraft({
    id: "monte-escalier-nord-lille",
    service: "monte-escalier",
    pageLevel: "city",
    regionName: "Hauts-de-France",
    regionSlug: "hauts-de-france",
    departmentName: "Nord",
    departmentSlug: "nord",
    departmentCode: "59",
    cityName: "Lille",
    citySlug: "lille",
    inseeCode: "59350",
    postalCodes: ["59000"],
    intercommunalityName: "Métropole Européenne de Lille",
    coverageStatus: "nationwide",
    seoTitle: "Monte-escalier à Lille : prix et solutions — Go Senior",
    metaDescription: "Préparation de la page locale Go Senior consacrée aux monte-escaliers à Lille. Les données locales doivent être vérifiées avant publication.",
    h1: "Monte-escalier à Lille : prix et solutions disponibles",
    nationalPriceReference: stairliftPrices,
    projectOptions: stairliftOptions,
    cta: {
      title: "Vérifiez les solutions à Lille",
      description: null,
      project: "monte-escalier",
      postalCodeExample: "59000"
    },
    canonical: "/monte-escalier/nord/lille/",
    serviceDetails: {
      stairLocation: null,
      stairShape: null,
      levels: null,
      turns: null,
      landings: null,
      width: null,
      obstacles: [],
      railType: null,
      possibleTimelines: [],
      availableModels: [],
      nationalPriceRanges: stairliftPrices,
      projectAssistance: []
    }
  })
];
