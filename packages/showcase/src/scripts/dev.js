console.log("Initializing index page...");

import * as Foundations from "@lf-widgets/foundations";
import * as Framework from "@lf-widgets/framework";
import * as Core from "@lf-widgets/core";
import * as Showcase from "@lf-widgets/showcase";
console.log("LF modules loaded!", Core, Foundations, Framework, Showcase);

initFramework();
initDom();

const readyCb = (e) => {
  const { comp, eventType } = e.detail;
  switch (eventType) {
    case "ready":
      console.log("App ready!");
      comp.unmount();
      document.querySelector("lf-showcase").hidden = false;
      break;
  }
  document.removeEventListener("lf-splash-event", readyCb);
};

document.addEventListener("lf-splash-event", readyCb);

//#region initDom
function initDom() {
  const body = document.body;

  // showcase
  const showcase = document.createElement("lf-showcase");
  showcase.hidden = true;
  showcase.lfHeader = true;
  const showcaseWrapper = document.createElement("div");
  showcaseWrapper.id = "lf-showcase";
  showcaseWrapper.appendChild(showcase);

  // splash
  const spinner = document.createElement("lf-spinner");
  spinner.ariaLive = "polite";
  spinner.lfActive = true;
  spinner.lfLayout = "14";
  spinner.role = "status";
  const splash = document.createElement("lf-splash");
  splash.ariaLabel = "Loading application";
  splash.id = "splash";
  splash.appendChild(spinner);

  // bg
  const bg = document.createElement("div");
  bg.ariaHidden = true;
  bg.id = "bg";

  body.appendChild(splash);
  body.appendChild(bg);
  body.appendChild(showcaseWrapper);
}
//#endregion

//#region initFramework
function initFramework() {
  const lfFramework = Framework.getLfFramework();
  const { assets, theme } = lfFramework;

  const path =
    window.location.href.split("/").slice(0, -1).join("/") + "/assets";
  console.log("Setting assets path...", path);
  assets.set(path);

  console.log("Setting default theme...");
  theme.set("dark");

  console.log("Modules loaded:", lfFramework.getModules());
  console.log("Framework ready!", lfFramework);
}
//#endregion
