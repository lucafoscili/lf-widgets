// @ts-nocheck
export const LF_SYNTAX_JSX = (Prism: Prism.Environment) => {
  var n = Prism.util.clone(Prism.languages.javascript),
    e = "(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})";
  function a(t: string, n?: string) {
    return (
      (t = t
        .replace(/<S>/g, function () {
          return "(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)";
        })
        .replace(/<BRACES>/g, function () {
          return "(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})";
        })
        .replace(/<SPREAD>/g, function () {
          return e;
        })),
      RegExp(t, n)
    );
  }
  ((e = a(e).source),
    (Prism.languages.jsx = Prism.languages.extend("markup", n)),
    (Prism.languages.jsx.tag.pattern = a(
      "</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:\"(?:\\\\[^]|[^\\\\\"])*\"|'(?:\\\\[^]|[^\\\\'])*'|[^\\s{'\"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>",
    )),
    (Prism.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
    (Prism.languages.jsx.tag.inside["attr-value"].pattern =
      /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
    (Prism.languages.jsx.tag.inside.tag.inside["class-name"] =
      /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
    (Prism.languages.jsx.tag.inside.comment = n.comment),
    Prism.languages.insertBefore(
      "inside",
      "attr-name",
      {
        spread: {
          pattern: a("<SPREAD>"),
          inside: Prism.languages.jsx,
        },
      },
      Prism.languages.jsx.tag,
    ),
    Prism.languages.insertBefore(
      "inside",
      "special-attr",
      {
        script: {
          pattern: a("=<BRACES>"),
          alias: "language-javascript",
          inside: {
            "script-punctuation": {
              pattern: /^=(?=\{)/,
              alias: "punctuation",
            },
            rest: Prism.languages.jsx,
          },
        },
      },
      Prism.languages.jsx.tag,
    ));
  var s = function (t) {
      return t
        ? "string" == typeof t
          ? t
          : "string" == typeof t.content
            ? t.content
            : t.content.map(s).join("")
        : "";
    },
    g = function (n) {
      for (var e = [], a = 0; a < n.length; a++) {
        var o = n[a],
          i = !1;
        if (
          ("string" != typeof o &&
            ("tag" === o.type && o.content[0] && "tag" === o.content[0].type
              ? "</" === o.content[0].content[0].content
                ? e.length > 0 &&
                  e[e.length - 1].tagName === s(o.content[0].content[1]) &&
                  e.pop()
                : "/>" === o.content[o.content.length - 1].content ||
                  e.push({
                    tagName: s(o.content[0].content[1]),
                    openedBraces: 0,
                  })
              : e.length > 0 && "punctuation" === o.type && "{" === o.content
                ? e[e.length - 1].openedBraces++
                : e.length > 0 &&
                    e[e.length - 1].openedBraces > 0 &&
                    "punctuation" === o.type &&
                    "}" === o.content
                  ? e[e.length - 1].openedBraces--
                  : (i = !0)),
          (i || "string" == typeof o) &&
            e.length > 0 &&
            0 === e[e.length - 1].openedBraces)
        ) {
          var r = s(o);
          (a < n.length - 1 &&
            ("string" == typeof n[a + 1] || "plain-text" === n[a + 1].type) &&
            ((r += s(n[a + 1])), n.splice(a + 1, 1)),
            a > 0 &&
              ("string" == typeof n[a - 1] || "plain-text" === n[a - 1].type) &&
              ((r = s(n[a - 1]) + r), n.splice(a - 1, 1), a--),
            (n[a] = new Prism.Token("plain-text", r, null, r)));
        }
        o.content && "string" != typeof o.content && g(o.content);
      }
    };
  Prism.hooks.add("after-tokenize", function (t) {
    ("jsx" !== t.language && "tsx" !== t.language) || g(t.tokens);
  });
};
