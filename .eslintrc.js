module.exports = {
    root: true,
    extends: ["airbnb-typescript", "plugin:prettier/recommended"],
    env: {
        browser: true,
        node: true,
        es2020: true
    },
    parserOptions: {
        project: "./tsconfig.json"
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/naming-convention": "off",
        "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "warn",
        "react/prop-types": "off",
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],
        "simple-import-sort/imports": "error",
        "jsx-a11y/anchor-is-valid": [
            "error",
            {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"]
            }
        ],
        "jsx-a11y/alt-text": "warn",
        "import/no-mutable-exports": "off",
        "import/prefer-default-export": "off",
        "no-console": "off",
        "no-multi-assign": "off",
        "no-case-declarations": "off"
    },
    plugins: ["simple-import-sort"]
};
