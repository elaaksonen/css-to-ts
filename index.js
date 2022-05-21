const fs = require("fs");
const postcss = require("postcss");
const cssnano = require("cssnano");

/**
 * Transforms css file into ts file.
 *
 * @param {string} css file path
 * @param {string} ts file path
 */
async function cssToTs(css, ts) {
  const cssContent = fs.readFileSync(css, "utf8");
  const minified = await minify(cssContent);
  const rules = toRuleArray(minified);
  fs.writeFileSync(
    ts,
    `// -----------------------------------------------------------------------
//
// THIS FILE IS GENERATED FROM CSS FILE
//
// -----------------------------------------------------------------------\n\n`,
    { flag: "w+" }
  );

  fs.appendFileSync(
    ts,
    `export const addStyles = (addRuleToSheet: (rule: string) => void) => {\n`
  );
  rules.forEach((r) => {
    fs.appendFileSync(ts, "addRuleToSheet(\n");
    fs.appendFileSync(ts, `\`${r}\``);
    fs.appendFileSync(ts, ");\n");
  });

  fs.appendFileSync(ts, "}\n");
}

/**
 * Goes through given css string and makes each global statement a one line rule that can be embedded into a style using JavaScript.
 *
 * @param {string} cssString
 * @return {string[]}
 */
const toRuleArray = (cssString) => {
  let current = 0;
  let finished = false;
  const list = [];
  while (!finished) {
    const blockOpen = cssString.indexOf("{", current);
    if (blockOpen < 0) {
      // No more open blocks found.
      return list;
    }
    let open = 0;
    let blockClose = 0;
    for (i = blockOpen; i < cssString.length; i++) {
      if (cssString[i] === "{") {
        open++;
      }
      if (cssString[i] === "}") {
        open--;
        if (open === 0) {
          blockClose = i;
          break;
        }
      }
    }

    if (blockClose === 0) {
      console.log(
        `ERROR: block (start at position ${blockOpen}) never closed.`
      );
      return [];
    }

    const subBlock = cssString.slice(current, blockClose + 1);
    list.push(subBlock);
    current = blockClose + 1;
    finished = current >= cssString.length;
  }
  return list;
};

const minify = async (str) => {
  const result = await postcss([
    cssnano({
      preset: "default",
    }),
  ]).process(str, { from: "undefined" });
  return result.css;
};

exports.toRuleArray = toRuleArray;
exports.minify = minify;
exports.cssToTs = cssToTs;
exports.default = cssToTs;
