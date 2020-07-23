import { head } from 'lodash';
import { join } from 'path';
import { BuildTask, BuildContext, BuildResults } from '../builder';
import { BundlerExtension, Bundler, BundlerContext } from '../bundler';
import { ComponentMap } from '../component';
import { PreviewExtension } from './preview.extension';
import { PreviewDefinition } from './preview-definition';
import { Capsule } from '../isolator';
import { AbstractVinyl } from '../../consumer/component/sources';
import { Target } from '../bundler/dev-server-context';

export class PreviewTask implements BuildTask {
  constructor(
    /**
     * bundler extension.
     */
    private bundler: BundlerExtension,

    /**
     * preview extension.
     */
    private preview: PreviewExtension
  ) {}

  extensionId = '@teambit/preview';

  async execute(context: BuildContext): Promise<BuildResults> {
    const defs = this.preview.getDefs();
    const capsules = context.capsuleGraph.capsules;

    const targets: Target[] = await Promise.all(
      capsules.map(async ({ capsule }) => {
        return {
          entries: await this.computePaths(capsule, defs, context),
          path: capsule.path,
        };
      })
    );

    const bundlerContext: BundlerContext = Object.assign(context, {
      targets,
      entry: [],
    });

    const bundler: Bundler = await context.env.getBundler(bundlerContext);

    await bundler.run();
    // const buildOutputs = await Promise.all(promises);

    return {
      components: buildOutputs,
      artifacts: [{ dirName: 'public' }],
    };
  }

  private async computePaths(capsule: Capsule, defs: PreviewDefinition[], context: BuildContext): Promise<string[]> {
    const moduleMapsPromise = defs.map(async (previewDef) => {
      const moduleMap = await previewDef.getModuleMap([capsule.component]);
      const paths = this.getPathsFromMap(capsule, moduleMap);
      const template = previewDef.renderTemplatePath ? await previewDef.renderTemplatePath(context) : 'undefined';

      const link = this.preview.writeLink(
        previewDef.prefix,
        paths,
        previewDef.renderTemplatePath ? await previewDef.renderTemplatePath(context) : undefined,
        capsule.path
      );

      const files = paths
        .toArray()
        .flatMap(([, file]) => file)
        .concat([link]);

      if (template) return files.concat([template]);
      return files;
    });
    const moduleMaps = await Promise.all(moduleMapsPromise);

    return moduleMaps.flatMap((_) => _);
  }

  private getPathsFromMap(capsule: Capsule, moduleMap: ComponentMap<AbstractVinyl[]>): ComponentMap<string[]> {
    return moduleMap.map((files) => {
      return files.map((file) => join(capsule.path, file.relative));
    });
  }
}
