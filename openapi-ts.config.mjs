/** @type {import('@hey-api/openapi-ts').UserConfig} */
export default {
  input: './openapi/openapi.json',
  output: {
    path: './src/api/generated',
    postProcess: ['prettier'],
  },
  plugins: ['@hey-api/typescript'],
}
