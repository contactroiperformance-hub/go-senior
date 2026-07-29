import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

class MockDCLogic {
  props = {};

  setState(update, callback) {
    const patch = typeof update === "function" ? update(this.state) : update;
    this.state = { ...this.state, ...patch };
    if (callback) callback();
  }
}

const React = {
  createElement(tag, props, kids) {
    return { tag, props, kids };
  }
};

async function componentFrom(file) {
  const source = await readFile(file, "utf8");
  const script = source.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `Missing component script in ${file}`);
  return new Function("DCLogic", "React", "location", `${script}\nreturn Component;`);
}

async function miniForm(search) {
  const location = { search, href: "" };
  const factory = await componentFrom(path.join(root, "dist", "MiniFormulaire.dc.html"));
  const Component = factory(MockDCLogic, React, location);
  const component = new Component();
  component.props = {};
  component.componentDidMount();
  return component;
}

const complete = await miniForm(
  "?projet=monte-escalier&type=droit&niveaux=2&delai=asap&proprio=oui&cp=59000&ville=Lille"
);
let screen = complete.ecrans()[complete.state.ecran];
assert.equal(screen.type, "coords");
assert.equal(complete.state.cpFourni, true);
assert.equal(complete.state.ville, "Lille");

let values = complete.renderVals();
assert.equal(values.titre, "Étudiez votre projet à Lille en 2 minutes");
assert.equal(values.secteurAffiche, "59000 · Lille");
assert.equal(values.montrerRecap, true);
assert.deepEqual(
  values.recap.map((item) => item.label),
  ["Votre projet", "Type de monte-escalier", "Niveaux du logement", "Délai envisagé", "Propriétaire du logement"]
);

values.modifierCp();
screen = complete.ecrans()[complete.state.ecran];
assert.equal(screen.type, "cp");

const partial = await miniForm("?projet=monte-escalier&type=droit&delai=asap");
screen = partial.ecrans()[partial.state.ecran];
assert.equal(screen.cle, "niveaux");
values = partial.renderVals();
values.options[0].pick();
screen = partial.ecrans()[partial.state.ecran];
assert.equal(screen.cle, "proprio");

const partialPostcode = await miniForm(
  "?projet=monte-escalier&type=droit&niveaux=2&delai=asap&proprio=oui&cp=590"
);
screen = partialPostcode.ecrans()[partialPostcode.state.ecran];
assert.equal(screen.type, "cp");

const blockLocation = { search: "", href: "" };
const blockFactory = await componentFrom(path.join(root, "dist", "BlocProjet.dc.html"));
const BlockComponent = blockFactory(MockDCLogic, React, blockLocation);
const block = new BlockComponent();
block.props = {
  projet: "monte-escalier",
  cpExemple: "59000",
  ville: "Lille"
};
block.state.cp = "59000";
const blockValues = block.renderVals();
assert.equal(blockValues.cpExemple, "59000");
blockValues.go({ preventDefault() {} });
assert.equal(
  blockLocation.href,
  "/projet/?projet=monte-escalier&cp=59000&ville=Lille"
);

console.log("Validated smart-form URL prefill, answer skipping, city title, recap, postcode editing, and local CTA handoff.");
