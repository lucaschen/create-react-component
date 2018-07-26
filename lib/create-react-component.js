"use babel";

import { CompositeDisposable } from "atom";
import fs from "fs";
import path from "path";

import ComponentGenerator from "./ComponentGenerator";
import { CLASS_BASED, STATELESS } from "./constants";
import CreateReactComponentView from "./create-react-component-view";

export default {
  componentTypeListener: null,
  createReactComponentView: null,
  modalPanel: null,
  subscriptions: null,
  treeView: null,

  activate(state) {
    this.createReactComponentView = new CreateReactComponentView(state.createReactComponentViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.createReactComponentView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "create-react-component:create-in-dir": () => this.createInDir(),
        "create-react-component:close-create-in-dir-modal": () => this.closeCreateInDirModal()
      })
    );
  },

  consumeTreeView(treeView) {
    this.treeView = treeView;
  },

  createComponent([componentName, componentType]) {
    const selectedPath = this.treeView.selectedPaths()[0];

    let dirToCreateIn;
    try {
      if (fs.lstatSync(selectedPath).isDirectory()) {
        dirToCreateIn = selectedPath;
      } else {
        dirToCreateIn = path.dirname(selectedPath);
      }
    } catch (e) {
      return;
    }

    if (!dirToCreateIn) return;

    switch (componentType) {
      case CLASS_BASED:
        ComponentGenerator.createClassBasedComponent(componentName, dirToCreateIn);
        break;
      case STATELESS:
        ComponentGenerator.createStatelessComponent(componentName, dirToCreateIn);
        break;
    }

    this.createReactComponentView.reset();
    this.closeCreateInDirModal();
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.createReactComponentView.destroy();
  },

  serialize() {
    return {
      createReactComponentViewState: this.createReactComponentView.serialize()
    };
  },

  createInDir() {
    if (!this.treeView) return;
    this.modalPanel.show();
    this.createReactComponentView.focus();
    if (this.componentTypeListener) this.componentTypeListener.dispose();
    this.componentTypeListener = this.createReactComponentView.emitter.on(
      "chooseComponentType",
      this.createComponent.bind(this)
    );
  },

  closeCreateInDirModal() {
    if (!this.modalPanel.isVisible()) return;
    this.modalPanel.hide();
  }
};
