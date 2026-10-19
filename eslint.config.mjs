import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    {
        rules: {
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            // Three.js textures/materials must be mutated in-place; this rule
            // is incompatible with the @react-three/fiber programming model.
            "react-hooks/immutability": "off",
            // React Compiler-era rules that became errors in eslint-config-next
            // 16.4. They flag existing video/texture syncing in the 3D scene and
            // Showcase; kept visible as warnings until those effects are refactored.
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/preserve-manual-memoization": "warn",
            // Bare apostrophes in JSX prose are safe; escaping adds noise.
            "react/no-unescaped-entities": "off",
        },
    },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
