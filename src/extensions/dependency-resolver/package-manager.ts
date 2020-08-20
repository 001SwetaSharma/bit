import { ComponentMap } from '../component/component-map';
import { DependenciesObjectDefinition } from './types';

export type PackageManagerInstallOptions = {
  cacheRootDir?: string;
  /**
   * decide whether to dedup dependencies.
   */
  dedupe?: boolean;
};

export type PackageManagerResolveRemoteVersionOptions = {
  cacheRootDir?: string;
  fetchToCache?: boolean;
  update?: boolean;
};

export interface PackageManager {
  /**
   * install dependencies
   * @param componentDirectoryMap
   */
  install(
    rootDir: string,
    rootDepsObject: DependenciesObjectDefinition,
    componentDirectoryMap: ComponentMap<string>,
    options?: PackageManagerInstallOptions
  ): Promise<void>;

  resolveRemoteVersion(packageName: string, options: PackageManagerResolveRemoteVersionOptions): Promise<string>;
}
