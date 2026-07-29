import assert from "node:assert/strict";
import { onRequest, onRequestPost } from "../functions/api/lead.js";

const validLead = {
  email: "marie.dupont@example.fr",
  postcode: "75015",
  firstname: "Marie",
  lastname: "Dupont",
  phone1: "06 12 34 56 78",
  project: "monte-escalier",
  answers: {
    type: "tournant",
    niveaux: "3",
    delai: "3mois",
    proprio: "oui"
  },
  consent: true
};

function leadRequest(body, headers = {}) {
  return new Request("https://go-senior.fr/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://go-senior.fr",
      ...headers
    },
    body: JSON.stringify(body)
  });
}

const methodResponse = onRequest();
assert.equal(methodResponse.status, 405);

const invalidResponse = await onRequestPost({ request: leadRequest({}) });
assert.equal(invalidResponse.status, 400);
assert.deepEqual(await invalidResponse.json(), { ok: false, error: "invalid_fields" });

const forbiddenResponse = await onRequestPost({
  request: leadRequest(validLead, { Origin: "https://example.com" })
});
assert.equal(forbiddenResponse.status, 403);

let postedUrl = "";
let postedBody = "";
const originalFetch = globalThis.fetch;

try {
  globalThis.fetch = async (url, init) => {
    postedUrl = String(url);
    postedBody = String(init.body);
    return Response.json({ code: 1, response: "OK", leadId: 12345 });
  };

  const acceptedResponse = await onRequestPost({ request: leadRequest(validLead) });
  assert.equal(acceptedResponse.status, 200);
  assert.deepEqual(await acceptedResponse.json(), { ok: true });

  const submitted = new URLSearchParams(postedBody);
  assert.equal(
    postedUrl,
    "https://roiperformance.leadbyte.co.uk/api/submit.php?campid=GO-SENIOR&returnjson=yes"
  );
  assert.equal(submitted.get("email"), validLead.email);
  assert.equal(submitted.get("postcode"), validLead.postcode);
  assert.equal(submitted.get("selectionner_un_service:"), "Habitat");
  assert.equal(submitted.get("firstname"), validLead.firstname);
  assert.equal(submitted.get("lastname"), validLead.lastname);
  assert.equal(submitted.get("phone1"), "0612345678");
  assert.equal(submitted.get("source"), "go-senior.fr");
  assert.equal(submitted.get("Quand_souhaitez-vous_êtres_rappelé?"), "Dès que possible");
  assert.equal(submitted.get("quand_souhaitez-vous_réaliser_le_projet_?"), "Dans les 3 mois");
  assert.equal(submitted.get("Êtes-vous_propriétaire_du_logement_?"), "Oui");
  assert.equal(submitted.get("quel_type_de_monte-escalier_recherchez-vous_?"), "Monte-escalier tournant");
  assert.equal(submitted.get("de_combien_de_niveaux_est_composé_votre_logement_?"), "3 niveaux");
  assert.equal(submitted.get("quel_projet_envisagez-vous_?"), "Installer un monte-escalier");
  assert.equal(submitted.has("towncity"), false);
  assert.equal(submitted.has("quelle_est_votre_installation_actuelle_?"), false);

  const bathroomLead = {
    ...validLead,
    phone1: "+33 6 12 34 56 78",
    project: "douche-senior",
    answers: {
      installation: "douche",
      souhait: "plain-pied",
      delai: "asap",
      proprio: "non"
    }
  };
  const bathroomResponse = await onRequestPost({ request: leadRequest(bathroomLead) });
  assert.equal(bathroomResponse.status, 200);
  const bathroomFields = new URLSearchParams(postedBody);
  assert.equal(bathroomFields.get("phone1"), "0612345678");
  assert.equal(bathroomFields.get("quelle_est_votre_installation_actuelle_?"), "Une douche à adapter");
  assert.equal(bathroomFields.get("quel_projet_envisagez-vous_?"), "Douche de plain-pied");
  assert.equal(bathroomFields.has("quel_type_de_monte-escalier_recherchez-vous_?"), false);
  assert.equal(bathroomFields.has("de_combien_de_niveaux_est_composé_votre_logement_?"), false);

  globalThis.fetch = async () => Response.json({ code: -2, response: "Rejected" });
  const rejectedResponse = await onRequestPost({ request: leadRequest(validLead) });
  assert.equal(rejectedResponse.status, 422);
  assert.deepEqual(await rejectedResponse.json(), { ok: false, error: "submission_rejected" });
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Validated LeadByte mapping, validation, success, and rejection handling without submitting a lead.");
