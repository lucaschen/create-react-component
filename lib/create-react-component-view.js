"use babel";

import { Emitter } from "event-kit";

import { CLASS_BASED, STATELESS } from "./constants";

const createButtonsIn = (el, config) => {
  const returnedConfig = {};

  config.forEach(configObj => {
    const { label, value } = configObj;
    const button = document.createElement("button");
    button.classList.add("btn", "btn-default", "btn-lg");
    button.innerText = label;
    button.addEventListener("click", () => {
      if (returnedConfig.onClick) returnedConfig.onClick(value);
    });
    el.appendChild(button);
  });

  return returnedConfig;
};

export default class CreateReactComponentView {
  componentNameInput = null;

  constructor(serializedState) {
    this.emitter = new Emitter();

    this.element = document.createElement("div");
    this.element.classList.add("create-react-component");

    const question1 = document.createElement("div");
    question1.classList.add("_question");
    question1.innerText = "What is the name of the component?";
    this.element.appendChild(question1);

    this.componentNameInput = document.createElement("input");
    this.componentNameInput.classList.add("_input");
    this.componentNameInput.setAttribute("autofocus", "autofocus");
    this.componentNameInput.setAttribute("type", "text");
    this.element.appendChild(this.componentNameInput);

    const question2 = document.createElement("div");
    question2.classList.add("_question");
    question2.innerText = "What type of component would you like?";
    this.element.appendChild(question2);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("_buttonsContainer");
    this.element.appendChild(buttonsContainer);

    const buttons = createButtonsIn(buttonsContainer, [
      {
        label: "Class-based",
        value: CLASS_BASED
      },
      {
        label: "Stateless",
        value: STATELESS
      }
    ]);

    buttons.onClick = value => {
      this.emitter.emit("chooseComponentType", [this.componentNameInput.value.trim(), value]);
    };
  }

  focus() {
    if (this.componentNameInput) this.componentNameInput.focus();
  }

  reset() {
    if (this.componentNameInput) this.componentNameInput.value = "";
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.emitter.dispose();
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
