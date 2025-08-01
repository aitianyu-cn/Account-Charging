/** @format */

const { defineConfig, globalIgnores } = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const stylistic = require("@stylistic/eslint-plugin");
const _import = require("eslint-plugin-import");

const { fixupPluginRules } = require("@eslint/compat");

module.exports = defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
            parserOptions: {},
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: false,
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            sourceType: "module",

            parserOptions: {
                project: "./tsconfig.json",
                noWatch: true,
                parser: "babel-eslint",
            },
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@stylistic": stylistic,
            import: fixupPluginRules(_import),
        },

        rules: {
            "@typescript-eslint/ban-tslint-comment": 2,
            "@typescript-eslint/adjacent-overload-signatures": 2,

            "@typescript-eslint/array-type": [
                2,
                {
                    default: "array",
                },
            ],

            "@typescript-eslint/await-thenable": 2,

            "@typescript-eslint/no-confusing-void-expression": [
                2,
                {
                    ignoreArrowShorthand: true,
                },
            ],

            "@typescript-eslint/consistent-type-assertions": 2,
            "@typescript-eslint/consistent-type-definitions": 2,

            "@typescript-eslint/explicit-member-accessibility": [
                2,
                {
                    accessibility: "explicit",

                    overrides: {
                        accessors: "explicit",
                        constructors: "explicit",
                        parameterProperties: "explicit",
                    },
                },
            ],

            "@typescript-eslint/naming-convention": [
                2,
                {
                    leadingUnderscore: "allow",
                    selector: ["class", "interface"],
                    format: ["PascalCase"],
                },
            ],

            "@typescript-eslint/no-empty-function": 2,
            "@typescript-eslint/no-floating-promises": 2,
            "@typescript-eslint/no-for-in-array": 2,
            "@typescript-eslint/no-misused-new": 2,
            "@typescript-eslint/no-non-null-assertion": 2,

            "@typescript-eslint/no-redeclare": [
                2,
                {
                    ignoreDeclarationMerge: true,
                },
            ],

            "@typescript-eslint/no-shadow": 2,
            "@typescript-eslint/no-this-alias": 2,
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": 2,
            "@typescript-eslint/no-unnecessary-qualifier": 2,
            "@typescript-eslint/no-unnecessary-type-arguments": 2,

            "@typescript-eslint/no-unused-expressions": [
                2,
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                },
            ],

            "@typescript-eslint/prefer-for-of": 2,
            "@typescript-eslint/promise-function-async": 2,
            "@stylistic/semi": [2, "always"],

            "@typescript-eslint/triple-slash-reference": [
                2,
                {
                    path: "always",
                    types: "prefer-import",
                    lib: "always",
                },
            ],

            "@typescript-eslint/typedef": 2,
            "@typescript-eslint/unbound-method": 2,

            "@stylistic/member-delimiter-style": [
                1,
                {
                    multiline: {
                        delimiter: "semi",
                        requireLast: true,
                    },

                    singleline: {
                        delimiter: "semi",
                        requireLast: false,
                    },
                },
            ],

            "comma-dangle": [2, "only-multiline"],

            complexity: [
                2,
                {
                    max: 42,
                },
            ],

            "constructor-super": 2,
            curly: 2,
            "default-case": 2,
            "eol-last": 2,

            eqeqeq: [
                2,
                "always",
                {
                    null: "ignore",
                },
            ],

            "guard-for-in": 2,
            "id-match": 2,
            "import/no-deprecated": 2,
            "import/no-duplicates": 2,
            "new-parens": 2,
            "no-bitwise": 2,
            "no-caller": 2,
            "no-cond-assign": 2,

            "no-console": [
                2,
                {
                    allow: [
                        "warn",
                        "dir",
                        "timeLog",
                        "assert",
                        "clear",
                        "count",
                        "countReset",
                        "group",
                        "groupEnd",
                        "table",
                        "dirxml",
                        "error",
                        "groupCollapsed",
                        "Console",
                        "profile",
                        "profileEnd",
                        "timeStamp",
                        "context",
                    ],
                },
            ],

            "no-debugger": 2,
            "no-duplicate-case": 2,
            "no-empty": 2,
            "no-eval": 2,
            "no-fallthrough": 2,
            "no-floating-decimal": 2,

            "no-multiple-empty-lines": [
                2,
                {
                    max: 2,
                },
            ],

            "no-new-wrappers": 2,
            "no-param-reassign": 2,
            "no-return-await": 2,
            "no-sequences": 2,
            "no-sparse-arrays": 2,
            "no-trailing-spaces": 2,
            "no-undef-init": 2,
            "no-unsafe-finally": 2,
            "no-unused-labels": 2,
            "no-var": 2,
            "one-var": [2, "never"],

            "prefer-arrow-callback": [
                2,
                {
                    allowNamedFunctions: true,
                },
            ],

            "prefer-const": 2,
            "prefer-object-spread": 2,
            "prefer-template": 2,
            "quote-props": [2, "consistent"],
            radix: 2,

            "sort-imports": [
                2,
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    allowSeparatedGroups: true,
                },
            ],

            "use-isnan": 2,
            "no-extend-native": 0,
            "no-use-before-define": 0,
            "no-irregular-whitespace": 0,
            "no-new": 0,
            "no-undef": 0,
            "no-unused-vars": 0,
            "no-native-reassign": 0,
            semi: 0,
            "no-const-assign": 0,
        },
    },
    globalIgnores([
        "**/.config",
        "**/.doc",
        "**/.vscode",
        "**/dist",
        "**/build",
        "**/scripts",
        "**/test",
        "csp.config.js",
        "eslint.config.ts",
    ]),
]);
