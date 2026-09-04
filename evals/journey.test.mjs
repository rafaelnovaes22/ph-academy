import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script, runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function functionSource(name) {
  const start = html.indexOf("function " + name + "(");
  assert.ok(start >= 0, name);
  let candidate = "";
  for (const line of html.slice(start).split("\n")) {
    candidate += line + "\n";
    try {
      new Script("(" + candidate + ")");
      return candidate;
    } catch {}
  }
  throw new Error("Could not extract function: " + name);
}

test("inline scripts parse", () => {
  for (const [, source] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(source);
});

test("course access is identified as external and checkout is preserved", () => {
  assert.match(html, /compra e o acesso ao curso acontecem na plataforma oficial/);
  assert.ok(html.includes("https://pay.hotmart.com/V92534280P"));
});
