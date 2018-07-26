"use babel";

import fs from "fs-extra";
import path from "path";

const createResolver = parentPath => relativePath => path.resolve(parentPath, relativePath);
const inject = (content, obj) => content.replace(/%([A-Z_]+)%/g, ($, param) => obj[param]).trim() + "\n";
const sanitise = dirName => dirName.replace(/[^a-zA-Z0-9_-]+/g, "");

const SEPARATOR = "------------";

const CLASS_BASED_TEMPLATE = fs
  .readFileSync(path.resolve(__dirname, "./templates/class-based.crctemplate"), "utf-8")
  .split(SEPARATOR);
const STATELESS_TEMPLATE = fs
  .readFileSync(path.resolve(__dirname, "./templates/stateless.crctemplate"), "utf-8")
  .split(SEPARATOR);

const checkIfExists = dirPath => {
  if (fs.existsSync(dirPath)) throw new Error(`${dirPath} already exists!`);
};

export default class ComponentGenerator {
  static createClassBasedComponent(uncleanComponentName, parentPath) {
    const componentName = sanitise(uncleanComponentName);

    const componentPath = path.resolve(parentPath, `./${componentName}`);
    checkIfExists(componentPath);

    const resolve = createResolver(componentPath);
    fs.mkdirpSync(resolve("./"));
    fs.writeFileSync(
      resolve("./index.js"),
      inject(CLASS_BASED_TEMPLATE[0], {
        COMPONENT_NAME: componentName
      })
    );
    fs.writeFileSync(
      resolve(`./${componentName}.js`),
      inject(CLASS_BASED_TEMPLATE[1], {
        COMPONENT_NAME: componentName
      })
    );
    fs.writeFileSync(resolve(`./${componentName}.scss`), "");
  }

  static createStatelessComponent(uncleanComponentName, parentPath) {
    const componentName = sanitise(uncleanComponentName);

    const componentPath = path.resolve(parentPath, `./${componentName}`);
    checkIfExists(componentPath);

    const resolve = createResolver(path.resolve(parentPath, `./${componentName}`));
    fs.mkdirpSync(resolve("./"));
    fs.writeFileSync(
      resolve("./index.js"),
      inject(STATELESS_TEMPLATE[0], {
        COMPONENT_NAME: componentName
      })
    );
    fs.writeFileSync(
      resolve(`./${componentName}.js`),
      inject(STATELESS_TEMPLATE[1], {
        COMPONENT_NAME: componentName
      })
    );
    fs.writeFileSync(resolve(`./${componentName}.scss`), "");
  }
}
