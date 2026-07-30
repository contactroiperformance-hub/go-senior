const LEADBYTE_URL = "https://roiperformance.leadbyte.co.uk/api/submit.php?campid=GO-SENIOR&returnjson=yes";
const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_RESPONSE_BYTES = 16 * 1024;

const PROJECT_LABELS = {
  "monte-escalier": "Installer un monte-escalier",
  "baignoire-douche": "Remplacer une baignoire par une douche",
  "douche-senior": "Installer une douche adaptée",
  "salle-de-bain": "Adapter une salle de bain"
};

const ANSWER_LABELS = {
  type: {
    droit: "Monte-escalier droit",
    tournant: "Monte-escalier tournant",
    exterieur: "Monte-escalier extérieur",
    debout: "Monte-escalier debout"
  },
  niveaux: {
    "2": "2 niveaux",
    "3": "3 niveaux",
    "4+": "Plus de 3 niveaux"
  },
  installation: {
    baignoire: "Une baignoire",
    douche: "Une douche à adapter"
  },
  souhait: {
    remplacement: "Remplacer la baignoire par une douche",
    "plain-pied": "Douche de plain-pied",
    adaptation: "Adapter l’existant"
  },
  delai: {
    asap: "Dès que possible",
    "3mois": "Dans les 3 mois",
    plus: "Plus de 3 mois"
  },
  proprio: {
    oui: "Oui",
    non: "Non"
  }
};

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

async function readLimitedBody(stream, maximumBytes) {
  if (!stream) return "";

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let value = "";

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maximumBytes) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      value += decoder.decode(chunk.value, { stream: true });
    }
    value += decoder.decode();
    return value;
  } finally {
    reader.releaseLock();
  }
}

function cleanText(value, maximumLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maximumLength);
}

function normalizePhone(value) {
  const compact = cleanText(value, 40).replace(/[^\d+]/g, "");
  if (compact.startsWith("+33")) return `0${compact.slice(3)}`;
  if (compact.startsWith("0033")) return `0${compact.slice(4)}`;
  return compact;
}

function parseLead(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "invalid_payload" };
  }

  const email = cleanText(input.email, 254).toLowerCase();
  const postcode = cleanText(input.postcode, 5);
  const firstname = cleanText(input.firstname, 80);
  const lastname = cleanText(input.lastname, 80);
  const towncity = cleanText(input.towncity, 120);
  const phone1 = normalizePhone(input.phone1);
  const project = cleanText(input.project, 40);
  const answers = input.answers && typeof input.answers === "object" && !Array.isArray(input.answers)
    ? input.answers
    : {};

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !/^\d{5}$/.test(postcode)
    || !firstname
    || !lastname
    || !/^0[1-9]\d{8}$/.test(phone1)
    || !PROJECT_LABELS[project]
    || input.consent !== true
  ) {
    return { error: "invalid_fields" };
  }

  for (const requiredAnswer of ["delai", "proprio"]) {
    if (!ANSWER_LABELS[requiredAnswer][answers[requiredAnswer]]) {
      return { error: "invalid_answers" };
    }
  }

  if (project === "monte-escalier") {
    if (!ANSWER_LABELS.type[answers.type] || !ANSWER_LABELS.niveaux[answers.niveaux]) {
      return { error: "invalid_answers" };
    }
  } else if (
    !ANSWER_LABELS.installation[answers.installation]
    || !ANSWER_LABELS.souhait[answers.souhait]
  ) {
    return { error: "invalid_answers" };
  }

  return {
    value: {
      email,
      postcode,
      firstname,
      lastname,
      towncity,
      phone1,
      project,
      answers
    }
  };
}

function toLeadByteFields(lead) {
  const answer = (key) => ANSWER_LABELS[key][lead.answers[key]] || "";
  const fields = new URLSearchParams({
    email: lead.email,
    postcode: lead.postcode,
    "selectionner_un_service:": "Habitat",
    firstname: lead.firstname,
    lastname: lead.lastname,
    phone1: lead.phone1,
    source: "go-senior.fr",
    "Quand_souhaitez-vous_êtres_rappelé?": "Dès que possible",
    "quand_souhaitez-vous_réaliser_le_projet_?": answer("delai"),
    "Êtes-vous_propriétaire_du_logement_?": answer("proprio"),
    "quel_projet_envisagez-vous_?": answer("souhait") || PROJECT_LABELS[lead.project]
  });

  if (lead.towncity) fields.set("towncity", lead.towncity);

  const optionalFields = {
    "quelle_est_votre_installation_actuelle_?": answer("installation"),
    "quel_type_de_monte-escalier_recherchez-vous_?": answer("type"),
    "de_combien_de_niveaux_est_composé_votre_logement_?": answer("niveaux")
  };

  for (const [key, value] of Object.entries(optionalFields)) {
    if (value) fields.set(key, value);
  }

  return fields;
}

function leadByteAccepted(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (payload.code === 1) return true;
  return typeof payload.status === "string" && payload.status.toLowerCase() === "success";
}

export async function onRequestPost(context) {
  const request = context.request;
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  const contentType = request.headers.get("Content-Type") || "";
  const contentLength = Number(request.headers.get("Content-Length") || 0);

  if (origin && origin !== requestUrl.origin) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let input;
  try {
    input = JSON.parse(await readLimitedBody(request.body, MAX_REQUEST_BYTES));
  } catch (error) {
    const status = error instanceof Error && error.message === "body_too_large" ? 413 : 400;
    return json({ ok: false, error: status === 413 ? "payload_too_large" : "invalid_json" }, status);
  }

  const parsed = parseLead(input);
  if (parsed.error) {
    return json({ ok: false, error: parsed.error }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(LEADBYTE_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: toLeadByteFields(parsed.value).toString(),
      signal: AbortSignal.timeout(10_000)
    });
  } catch {
    console.error(JSON.stringify({ event: "leadbyte_submission", outcome: "network_error" }));
    return json({ ok: false, error: "submission_failed" }, 502);
  }

  let upstreamPayload;
  try {
    const responseLength = Number(upstream.headers.get("Content-Length") || 0);
    if (responseLength > MAX_RESPONSE_BYTES) throw new Error("body_too_large");
    upstreamPayload = JSON.parse(await readLimitedBody(upstream.body, MAX_RESPONSE_BYTES));
  } catch {
    console.error(JSON.stringify({
      event: "leadbyte_submission",
      outcome: "invalid_response",
      status: upstream.status
    }));
    return json({ ok: false, error: "submission_failed" }, 502);
  }

  if (!upstream.ok || !leadByteAccepted(upstreamPayload)) {
    console.warn(JSON.stringify({
      event: "leadbyte_submission",
      outcome: "rejected",
      status: upstream.status,
      code: typeof upstreamPayload.code === "number" ? upstreamPayload.code : null
    }));
    return json({ ok: false, error: "submission_rejected" }, 422);
  }

  console.log(JSON.stringify({ event: "leadbyte_submission", outcome: "accepted" }));
  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}

export const __test = {
  parseLead,
  toLeadByteFields,
  leadByteAccepted
};
