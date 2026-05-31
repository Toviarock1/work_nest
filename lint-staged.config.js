const config = {
  "*.{ts,tsx,js,mjs,cjs}": ["prettier --write", "eslint --fix"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
};

export default config;
