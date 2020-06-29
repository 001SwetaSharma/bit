import { Preview } from '../preview/preview.preview';

let LOADED_DOCS = [];
let DOCS_TEMPLATE = (doc: any) => doc;
export class DocsPreview {
  static dependencies = [Preview];

  render() {
    const docs = LOADED_DOCS[0];
    DOCS_TEMPLATE(docs);
  }

  static async provider([preview]: [Preview]) {
    const docsPreview = new DocsPreview();
    preview.registerPreview({
      name: 'overview',
      render: docsPreview.render.bind(docsPreview)
    });

    return docsPreview;
  }
}

export function addDocs(template, docModules) {
  LOADED_DOCS = docModules;
  DOCS_TEMPLATE = template;
}
