module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import", "monorepo-cop"],
    ignorePatterns: ["node_modules", "packages/*/lib", "coverage"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:monorepo-cop/recommended"
    ],
    rules: {
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-inner-declarations": "off",
        "no-inner-declarations": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "prefer-const": ["error", { destructuring: "all", ignoreReadBeforeAssign: false }],
        "@typescript-eslint/camelcase": ["error", { allow: ["^Lib_", "^TID_", "^TAG_"] }],
        "import/order": "warn",
        "import/no-extraneous-dependencies": "error",
        "import/newline-after-import": ["error", { count: 1 }]
    }
};
