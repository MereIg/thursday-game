import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { SPRITE_SPECS } from "../src/geometry.js";
const root=new URL("../",import.meta.url);
const contract=JSON.parse(readFileSync(new URL("assets/web/integrity.json",root),"utf8"));
assert.deepEqual(contract.specs,SPRITE_SPECS,"Sprite anchor contract changed: rerun the read-only asset audit and visually review.");
for(const file of contract.files){
  const data=readFileSync(new URL(file.path,root));
  assert.equal(createHash("sha256").update(data).digest("hex"),file.sha256,`${file.path}: art changed after approval; run audit and inspect in-game.`);
  const master=new URL(`assets/production/characters/${file.path.split("/").at(-1)}`,root);
  if(existsSync(master))assert.equal(createHash("sha256").update(readFileSync(master)).digest("hex"),file.sha256,`${master}: production and runtime differ`);
}
console.log(`Asset integrity: ${contract.files.length} approved runtime images and shared sprite anchor contract PASS.`);
