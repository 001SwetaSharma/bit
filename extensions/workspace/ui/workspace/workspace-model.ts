// import { ComponentMeta } from '@teambit/component';
import { ComponentID } from '@teambit/component';
import { ComponentStatus } from '../../workspace-component/component-status';
import { DeprecationInfo } from '@teambit/deprecation';
import { Descriptor } from '@teambit/environments';
import { ComponentModel } from '@teambit/component';
import { ComponentModelProps } from '@teambit/component';

export type WorkspaceModelComponent = {
  id: ComponentID;
  status: ComponentStatus;
  deprecation: DeprecationInfo;
  env: Descriptor;
};

export type WorkspaceProps = {
  name: string;
  path: string;
  components: ComponentModelProps[];
};

export class Workspace {
  constructor(
    /**
     * name of the workspace.
     */
    readonly name: string,

    /**
     * absolute path of the workspace.
     */
    readonly path: string,

    /**
     * components container in the workspace.
     */
    readonly components: ComponentModel[]
  ) {}

  /**
   * return a component from the workspace.
   */
  getComponent(id: ComponentID) {
    return this.components.find((component) => component.id.fullName === id.fullName);
  }

  static from({ name, path, components }: WorkspaceProps) {
    return new Workspace(
      name,
      path,
      components.map((value) => {
        return ComponentModel.from(value);
      })
    );
  }

  static empty() {
    return new Workspace('', '', []);
  }
}
