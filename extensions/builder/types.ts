import { Component, ComponentID } from '@bit/bit.core.component';
import { Network } from '@bit/bit.core.isolator';
import { ExecutionContext } from '@bit/bit.core.environments';

export interface BuildContext extends ExecutionContext {
  /**
   * all components about to be built/tagged.
   */
  components: Component[];

  /**
   * graph of capsules ready to be built.
   */
  capsuleGraph: Network;
}

export type ArtifactProps = {
  dirName: string;
};

export type ComponentResult = {
  id: ComponentID;
  data?: any;
  errors: Array<Error | string>;
  warning?: string[];
};

export interface BuildResults {
  components: ComponentResult[];
  artifacts: ArtifactProps[];
}

export interface BuildTask {
  /**
   * extensionId hosting this task.
   * @todo: should be automatically injected by Harmony
   */
  extensionId: string;
  /**
   * description of what the task does.
   * if available, the logger will log it show it in the status-line.
   * it's helpful to distinguish multiple tasks of the same extension.
   */
  description?: string;
  /**
   * execute a task in a build context
   */
  execute(context: BuildContext): Promise<BuildResults>;
}
