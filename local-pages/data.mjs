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
  },
  {
    label: "Monte-escalier debout (plateforme d’appui)",
    range: "4 000 – 9 000 €",
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
  },
  {
    title: "Monte-escalier debout",
    description: "Plateforme d’appui pour une personne qui peut rester debout mais doit être stabilisée pendant le trajet.",
    href: "/projet/?projet=monte-escalier&type=debout"
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
    inseeCode: "59",
    seoTitle: "Monte-escalier dans le Nord : prix et aides — Go Senior",
    metaDescription: "Prix d’un monte-escalier dans le Nord, modèles droit, tournant, extérieur ou debout, aides du Département et contacts vérifiés.",
    h1: "Monte-escalier dans le Nord : prix, aides et professionnels",
    introduction: "Dans le Nord, un monte-escalier droit coûte généralement de 2 500 à 5 500 € pose comprise ; un modèle tournant de 6 000 à 12 000 €. Ces repères nationaux 2026 sont à confirmer par un devis après mesure de l’escalier.",
    geographicScope: "Ce guide couvre le département du Nord (59). Les données INSEE portent sur l’ensemble du département ; les aides dépendent de la situation du demandeur et la disponibilité d’un professionnel est vérifiée séparément à partir du code postal.",
    nationalPriceReference: stairliftPrices,
    localCostFactors: [
      "La forme de l’escalier, le nombre de virages et de paliers déterminent si le rail peut être standard ou doit être fabriqué sur mesure.",
      "Dans un logement ancien, la largeur utile, les portes, radiateurs, marches irrégulières et dégagements aux étages doivent être mesurés sur place.",
      "Pour un accès extérieur, le matériel, la protection du rail et l’alimentation électrique doivent être adaptés à une installation exposée aux intempéries.",
      "La pose, les options de sécurité et les éventuels travaux électriques doivent être détaillés séparément dans le devis."
    ],
    demographicData: [
      {
        indicator: "Population municipale",
        value: 2615635,
        unit: "habitants",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      },
      {
        indicator: "Population de 65 à 79 ans",
        value: 13.4,
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      },
      {
        indicator: "Population de 80 ans ou plus",
        value: 4.8,
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      }
    ],
    housingData: [
      {
        indicator: "Maisons dans le parc de logements",
        value: 64.4,
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      },
      {
        indicator: "Propriétaires de leur résidence principale",
        value: 54.1,
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      },
      {
        indicator: "Résidences principales achevées avant 1971, somme des périodes INSEE",
        value: 50.5,
        unit: "%",
        vintage: "RP 2023",
        geography: "Département du Nord (59)",
        inseeCode: "59",
        source: "INSEE, dossier complet DEP-59",
        retrievedAt: "2026-07-30"
      }
    ],
    localHousingCommentary: "Le Nord compte 64,4 % de maisons et, en additionnant les trois périodes publiées par l’INSEE, 50,5 % des résidences principales ont été achevées avant 1971. Ce parc ancien et majoritairement composé de maisons ne permet pas de déduire la forme d’un escalier : dans les secteurs urbains denses comme dans les communes du bassin minier, de Flandre ou de l’Avesnois, une prise de mesures reste indispensable pour vérifier largeur, virages, paliers et points d’arrivée.",
    projectOptions: stairliftOptions,
    localAssistancePrograms: [
      {
        title: "J’Amén’âge 59",
        description: "Le Département du Nord indique que ce dispositif peut aider, sous conditions, les bénéficiaires de l’APA à adapter leur logement. Le dossier doit être étudié avant le commencement des travaux.",
        organization: "Département du Nord",
        checkedAt: "2026-07-30",
        url: "https://mi-mandat.lenord.fr/autonomie"
      },
      {
        title: "PCH — aménagement du logement",
        description: "La MDPH du Nord précise que la prestation de compensation du handicap peut participer à des travaux d’aménagement du logement sur la base d’un devis, après évaluation des conditions d’éligibilité.",
        organization: "MDPH du Nord",
        checkedAt: "2026-07-30",
        url: "https://mdph.lenord.fr/pch"
      },
      {
        title: "Fonds départemental de compensation du handicap",
        description: "Le fonds peut être sollicité dans certaines situations pour un reste à charge lié notamment à l’aménagement du logement, selon les critères précisés dans le formulaire départemental 2025.",
        organization: "MDPH du Nord",
        checkedAt: "2026-07-30",
        url: "https://mdph.lenord.fr/upload/attachments/formulaire_fdch_mdph_2025-688b67de3c35c.pdf"
      },
      {
        title: "MaPrimeAdapt’",
        description: "France Rénov’ cite l’installation d’un monte-escalier parmi les travaux finançables. L’accompagnement, les ressources, l’âge ou la situation de handicap et le logement déterminent l’éligibilité.",
        organization: "France Rénov’",
        checkedAt: "2026-07-30",
        url: "https://france-renov.gouv.fr/aides/maprimeadapt"
      }
    ],
    usefulLocalContacts: [
      {
        title: "Relais Autonomie du Nord",
        description: "Les Relais Autonomie accueillent les personnes âgées, les personnes en situation de handicap et leurs proches. La page officielle permet de rechercher le point d’accueil le plus proche.",
        organization: "Département du Nord — 03 59 73 73 73",
        checkedAt: "2026-07-30",
        url: "https://mdph.lenord.fr/nous-trouver"
      },
      {
        title: "APA à domicile dans le Nord",
        description: "Le Département présente les conditions de l’APA à domicile pour les habitants du Nord âgés d’au moins 60 ans confrontés à une perte d’autonomie.",
        organization: "Département du Nord — 03 59 73 73 73",
        checkedAt: "2026-07-30",
        url: "https://rdas.lenord.fr/l-allocation-personnalisee-d-autonomie-apa-a-domicile"
      }
    ],
    professionalCoverageStatus: "coverage_unavailable",
    coveredPostalCodes: [],
    nearbyLocations: ["monte-escalier-nord-lille"],
    faq: [
      {
        question: "Quel est le prix d’un monte-escalier dans le Nord ?",
        answer: "Les repères nationaux 2026, pose comprise, vont de 2 500 à 5 500 € pour un modèle droit, de 6 000 à 12 000 € pour un tournant, de 4 000 à 10 000 € pour un extérieur et de 4 000 à 9 000 € pour un modèle debout. Le prix réellement applicable dans le Nord dépend des mesures, du rail et des options indiqués au devis.",
        local: true
      },
      {
        question: "Le parc de logements du Nord impose-t-il souvent un rail tournant ?",
        answer: "Non, les données INSEE ne décrivent pas la géométrie des escaliers. Elles montrent que 64,4 % des logements sont des maisons et que 50,5 % des résidences principales ont été achevées avant 1971, après addition des périodes publiées. Seule une mesure sur place permet de choisir entre rail droit et rail sur mesure.",
        local: true
      },
      {
        question: "J’Amén’âge 59 peut-il aider à financer un monte-escalier ?",
        answer: "Le Département du Nord indique que J’Amén’âge 59 peut, sous conditions, aider des bénéficiaires de l’APA à adapter leur logement. Il faut faire vérifier l’éligibilité et obtenir l’accord avant de commencer les travaux ; l’aide n’est ni automatique ni garantie.",
        local: true
      },
      {
        question: "Où demander conseil dans le Nord pour un dossier d’autonomie ?",
        answer: "Les Relais Autonomie du Département informent et orientent les personnes âgées, les personnes handicapées et leurs proches. Le numéro départemental est le 03 59 73 73 73 et la MDPH publie une carte des points d’accueil.",
        local: true
      },
      {
        question: "La PCH peut-elle participer à l’aménagement d’un escalier ?",
        answer: "La MDPH du Nord prévoit un volet d’aménagement du logement dans la PCH, sur la base d’un devis et après étude du besoin et des critères. Un Fonds départemental de compensation peut aussi être examiné dans certaines situations de reste à charge.",
        local: true
      },
      {
        question: "MaPrimeAdapt’ finance-t-elle les monte-escaliers dans le Nord ?",
        answer: "France Rénov’ cite le monte-escalier parmi les travaux éligibles à MaPrimeAdapt’. Les règles sont nationales et l’accès dépend notamment de la situation du ménage, du logement et de l’accompagnement prévu ; un accord doit précéder les travaux.",
        local: false
      },
      {
        question: "Peut-on installer un monte-escalier extérieur dans le Nord ?",
        answer: "Un modèle extérieur est possible si l’accès, le support, l’alimentation et l’exposition peuvent recevoir un équipement conçu pour les intempéries. Une visite technique doit confirmer la fixation, le stationnement de l’appareil et la protection des composants.",
        local: true
      },
      {
        question: "Go Senior garantit-il un professionnel partout dans le Nord ?",
        answer: "Non. La disponibilité dépend du code postal et du projet. Go Senior vérifie le secteur après la demande et, lorsqu’une solution existe, transmet les coordonnées à un seul professionnel indépendant pour un échange et un devis sans engagement.",
        local: true
      }
    ],
    officialSources: [
      {
        organization: "INSEE",
        title: "Dossier complet — Département du Nord (59)",
        supports: "Population, âge, types de logements, statut d’occupation et ancienneté des résidences principales",
        dataDate: "RP 2023, géographie au 1er janvier 2026, publication du 23 juillet 2026",
        checkedAt: "2026-07-30",
        url: "https://www.insee.fr/fr/statistiques/2011101?geo=DEP-59",
        scope: "local"
      },
      {
        organization: "Département du Nord",
        title: "Autonomie — J’Amén’âge 59 et Relais Autonomie",
        supports: "Aide départementale à l’adaptation et réseau de proximité",
        dataDate: "page départementale en vigueur",
        checkedAt: "2026-07-30",
        url: "https://mi-mandat.lenord.fr/autonomie",
        scope: "local"
      },
      {
        organization: "MDPH du Nord",
        title: "Prestation de compensation du handicap",
        supports: "Aménagement du logement, devis et Fonds départemental de compensation",
        dataDate: "page départementale en vigueur",
        checkedAt: "2026-07-30",
        url: "https://mdph.lenord.fr/pch",
        scope: "local"
      },
      {
        organization: "MDPH du Nord",
        title: "Trouver un Relais Autonomie",
        supports: "Points d’accueil et numéro départemental",
        dataDate: "page départementale en vigueur",
        checkedAt: "2026-07-30",
        url: "https://mdph.lenord.fr/nous-trouver",
        scope: "local"
      },
      {
        organization: "France Rénov’",
        title: "MaPrimeAdapt’",
        supports: "Travaux finançables, critères et parcours d’accompagnement",
        dataDate: "règles consultées en 2026",
        checkedAt: "2026-07-30",
        url: "https://france-renov.gouv.fr/aides/maprimeadapt",
        scope: "national"
      }
    ],
    conclusion: "Dans le Nord, l’importance des maisons et du parc achevé avant 1971 justifie une vérification attentive de la largeur, des virages et des paliers, sans présumer de la configuration réelle. Comparez les quatre familles de monte-escalier, vérifiez les aides auprès des organismes officiels, puis indiquez votre code postal pour savoir si un professionnel peut étudier votre escalier.",
    cta: {
      title: "Vérifiez les solutions dans le Nord",
      description: "Indiquez votre code postal pour démarrer directement l’étude de votre projet dans le Nord.",
      project: "monte-escalier",
      postalCodeExample: "59000"
    },
    canonical: "/monte-escalier/nord/",
    sourceCheckedAt: "2026-07-30",
    status: "published",
    indexStatus: "index",
    sitemapStatus: "included",
    publishedAt: "2026-07-30",
    updatedAt: "2026-07-30",
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
      availableModels: ["Droit", "tournant", "extérieur", "debout"],
      nationalPriceRanges: stairliftPrices,
      projectAssistance: ["MaPrimeAdapt’", "PCH", "J’Amén’âge 59", "Fonds départemental de compensation selon éligibilité"]
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
