export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": null,          // allow PascalCase/mixed class names
    "selector-id-pattern": null,             // allow IDs like #shadesCanvas
    "no-descending-specificity": null,       // stop selector-order churn
    "media-feature-range-notation": null,    // allow your current media syntax
    "declaration-block-single-line-max-declarations": null
  }
};