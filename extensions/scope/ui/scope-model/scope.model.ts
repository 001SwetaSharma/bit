import { ComponentModel } from '@bit/bit.core.component';

export class ScopeModel {
  constructor(
    /**
     * the scope name.
     */
    readonly name: string,

    /**
     * components contained in the scope.
     */
    readonly components: ComponentModel[]
  ) {}

  static from(object: any) {
    const components = object.scope.components || [];
    return new ScopeModel(
      object.scope.name,
      components.map((component) => ComponentModel.from(component))
    );
  }

  static empty() {
    return new ScopeModel('', []);
  }
}
