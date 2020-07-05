## Local development

``` yarn start <flags> ```

## Prettier

Basic prettier setttings are set up, but it subject to change.

## ESlint / TSlint

The project is using only ESlint, because of the fact that TSlint will no longer be supported in 2020.

## Deployment
Project is written in TypeScript, which means you have to compile it to JS before publishing on npm. Currently, the way package.json is set up, you have to put the compiled .js files into the root directory. So, with that in mind:
1. Build the project

```yarn run build``` / ```npm run build```

2. Move yayfetch.js into the root directory

```mv ./build/yayfetch.js .```

3. Publish via yarn/npm

```yarn publish``` / ```npm publish```