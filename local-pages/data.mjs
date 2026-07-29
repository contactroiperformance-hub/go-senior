const updatedAt = "2026-07-29";

const stairliftPrices = Object.freeze([
  {
    label: "Monte-escalier droit",
    range: "2 500 – 5 500 €",
    scope: "Repère national 2026, pose comprise",
    sourcePath: "/guides/prix-monte-escalier/"
  },
  {
    label: "Monte-escalier tournant",
    range: "6 000 – 12 000 €",
    scope: "Repère national 2026, pose comprise",
    sourcePath: "/guides/prix-monte-escalier/"
  },
  {
    label: "Monte-escalier extérieur",
    range: "4 000 – 10 000 €",
    scope: "Repère national 2026, pose comprise",
    sourcePath: "/guides/prix-monte-escalier/"
  }
]);

const showerPrices = Object.freeze([
  {
    label: "Adaptation d’une douche existante",
    range: "500 – 2 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/"
  },
  {
    label: "Remplacement d’une baignoire",
    range: "4 000 – 9 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/"
  },
  {
    label: "Douche extra-plate ou préfabriquée adaptée",
    range: "3 000 – 6 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/"
  },
  {
    label: "Douche de plain-pied ou sur mesure",
    range: "5 000 – 10 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-douche-senior/"
  },
  {
    label: "Adaptation complète de la salle de bain",
    range: "8 000 – 15 000 €",
    scope: "Repère national 2026",
    sourcePath: "/guides/prix-salle-de-bain-adaptee/"
  }
]);

const stairliftOptions = Object.freeze([
  {
    title: "Escalier droit",
    description: "Rail standard pour une volée sans virage.",
    href: "/projet/?projet=monte-escalier&type=droit"
  },
  {
    title: "Escalier tournant",
    description: "Rail fabriqué sur mesure pour suivre les virages et les paliers.",
    href: "/projet/?projet=monte-escalier&type=tournant"
  },
  {
    title: "Escalier extérieur",
    description: "Équipement conçu pour un perron ou un accès exposé aux intempéries.",
    href: "/projet/?projet=monte-escalier&type=exterieur"
  }
]);

const showerOptions = Object.freeze([
  {
    title: "Baignoire à remplacer",
    description: "Douche installée dans l’emplacement existant, avec des travaux souvent concentrés sur quelques jours selon la configuration.",
    href: "/projet/?projet=baignoire-douche"
  },
  {
    title: "Douche à sécuriser",
    description: "Siège, barres d’appui, sol adapté et robinetterie selon les besoins.",
    href: "/projet/?projet=douche-senior"
  },
  {
    title: "Salle de bain à réagencer",
    description: "Adaptation plus complète lorsque la circulation ou l’implantation doivent évoluer.",
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
    professionalCoverageStatus: "coverage_unavailable",
    coveredPostalCodes: [],
    nearbyLocations: [],
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
    seoTitle: "Monte-escalier dans le Nord : prix et aides — Go Senior",
    metaDescription: "Préparation de la page locale Go Senior consacrée aux monte-escaliers dans le Nord. Les données locales doivent être vérifiées avant publication.",
    h1: "Monte-escalier dans le Nord : prix, aides et professionnels",
    nationalPriceReference: stairliftPrices,
    projectOptions: stairliftOptions,
    cta: {
      title: "Vérifiez les solutions dans le Nord",
      description: null,
      project: "monte-escalier",
      postalCodeExample: "59000"
    },
    canonical: "/monte-escalier/nord/",
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
  }),
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
  }),
  commonDraft({
    id: "douche-senior-gironde",
    service: "douche-senior",
    pageLevel: "department",
    regionName: "Nouvelle-Aquitaine",
    regionSlug: "nouvelle-aquitaine",
    departmentName: "Gironde",
    departmentSlug: "gironde",
    departmentCode: "33",
    seoTitle: "Douche senior en Gironde : prix et aides — Go Senior",
    metaDescription: "Préparation de la page locale Go Senior consacrée aux douches senior en Gironde. Les données locales doivent être vérifiées avant publication.",
    h1: "Douche senior en Gironde : prix, aides et professionnels",
    nationalPriceReference: showerPrices,
    projectOptions: showerOptions,
    cta: {
      title: "Vérifiez les solutions en Gironde",
      description: null,
      project: "douche-senior",
      postalCodeExample: "33000"
    },
    canonical: "/douche-senior/gironde/",
    serviceDetails: {
      currentInstallation: null,
      bathReplacement: null,
      showerSecuring: null,
      bathroomReconfiguration: null,
      receiverType: null,
      extraFlatShower: null,
      walkInShower: null,
      seat: null,
      grabBars: null,
      plumbing: null,
      waterproofing: null,
      coownership: null,
      nationalPriceRanges: showerPrices,
      projectAssistance: []
    }
  }),
  commonDraft({
    id: "douche-senior-gironde-bordeaux",
    service: "douche-senior",
    pageLevel: "city",
    regionName: "Nouvelle-Aquitaine",
    regionSlug: "nouvelle-aquitaine",
    departmentName: "Gironde",
    departmentSlug: "gironde",
    departmentCode: "33",
    cityName: "Bordeaux",
    citySlug: "bordeaux",
    inseeCode: "33063",
    postalCodes: ["33000"],
    intercommunalityName: "Bordeaux Métropole",
    seoTitle: "Douche senior à Bordeaux : prix et solutions — Go Senior",
    metaDescription: "Préparation de la page locale Go Senior consacrée aux douches senior à Bordeaux. Les données locales doivent être vérifiées avant publication.",
    h1: "Douche senior à Bordeaux : prix et solutions disponibles",
    nationalPriceReference: showerPrices,
    projectOptions: showerOptions,
    cta: {
      title: "Vérifiez les solutions à Bordeaux",
      description: null,
      project: "douche-senior",
      postalCodeExample: "33000"
    },
    canonical: "/douche-senior/gironde/bordeaux/",
    serviceDetails: {
      currentInstallation: null,
      bathReplacement: null,
      showerSecuring: null,
      bathroomReconfiguration: null,
      receiverType: null,
      extraFlatShower: null,
      walkInShower: null,
      seat: null,
      grabBars: null,
      plumbing: null,
      waterproofing: null,
      coownership: null,
      nationalPriceRanges: showerPrices,
      projectAssistance: []
    }
  })
];
