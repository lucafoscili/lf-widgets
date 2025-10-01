// @ts-nocheck
export const LF_SYNTAX_TSX = (Prism: typeof import("prismjs")) => {
  const a = Prism.util.clone(Prism.languages.typescript);
  ((Prism.languages.tsx = Prism.languages.extend("jsx", a)),
    delete Prism?.languages?.tsx?.parameter,
    delete Prism?.languages?.tsx?.["literal-property"]);
  const t = Prism.languages?.tsx?.tag;
  ((t.pattern = RegExp(
    "(^|[^\\w$]|(?=</))(?:" + t.pattern.source + ")",
    t.pattern.flags,
  )),
    (t.lookbehind = !0));
};
