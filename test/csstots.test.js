const cssToTs = require("../index.js");

describe("toRuleArray", () => {
  it("should return single element", () => {
    const arr = cssToTs.toRuleArray("div {width: 1em; }");
    expect(arr.length).toBe(1);
  });

  it("should return elements correctly", () => {
    const arr = cssToTs.toRuleArray("div {width: 1px; }div { height: 2px;}");
    expect(arr.length).toBe(2);
    expect(arr[0]).toBe("div {width: 1px; }");
    expect(arr[1]).toBe("div { height: 2px;}");
  });

  it("should return element", () => {
    const arr = cssToTs.toRuleArray(" div {width: 1px; } div { height: 2px;} ");
    expect(arr.length).toBe(2);
    expect(arr[0]).toBe(" div {width: 1px; }");
    expect(arr[1]).toBe(" div { height: 2px;}");
  });

  it("should return an empty array when closing tag is missing", () => {
    const arr = cssToTs.toRuleArray("div {width: 1px; } div { height:");
    expect(arr.length).toBe(0);
  });
});

describe("minify", () => {
  it("should remove whitespaces", async () => {
    const css = await cssToTs.minify(" div { width: 1px; } ");
    expect(css).toBe("div{width:1px}");
  });

  it("should remove comments", async () => {
    const css = await cssToTs.minify(" div { width: 1px; /* comment */ } ");
    expect(css).toBe("div{width:1px}");
  });
});
