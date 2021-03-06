import React from "react";
import QuillJS from "quill";
import ReactDOM from "react-dom";
import CodeContainer from "../index";
import MercuryCore from "mercury-core";
import ProviderWithContext from "../../../../Platform/ProviderWithContext";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";

const CodeEditorBlock = QuillJS.import("blots/block/embed");
const Index = (context, store) => {
  return class extends CodeEditorBlock {
    static create(containerID) {
      let node = super.create();
      node.setAttribute("data-container-id", `${containerID}`);
      const containerContext = this.getOrCreateCodeContainer(containerID, context);
      const noteId = context.parentId;
      const paragraphId = context.id;
      // node.setAttribute("contentEditable", false);
      ReactDOM.render(
        <BrowserRouter>
          <ProviderWithContext store={store}>
            <CodeContainer noteId={noteId} paragraphId={paragraphId} context={containerContext} />
          </ProviderWithContext>
        </BrowserRouter>,
        node
      );
      return node;
    }

    static value(node) {
      return node.getAttribute("data-container-id");
    }

    static getOrCreateCodeContainer(containerId, context) {
      const containers = context.containers;
      const codeContainer = containers.find(container => container.id === containerId);
      if (codeContainer) {
        return new MercuryCore.Code.Container(codeContainer, context);
      }
      const newCodeContainer = new MercuryCore.Code.Container({ id: containerId }, context);
      containers.push(newCodeContainer);
      return newCodeContainer;
    }
  };
};

export default (context, store) => {
  const container = Index(context, store);
  container.blotName = "code-editor-container";
  container.tagName = "div";
  container.className = "mercury-code-editor-container-warp";
  return container;
};
