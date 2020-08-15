import { PathLinux } from 'bit-bin/dist/utils/path';
import { ExtensionDataList } from 'bit-bin/dist/consumer/config/extension-data';
import { Compilers, Testers } from 'bit-bin/dist/consumer/config/abstract-config';
import { ComponentOverridesData } from 'bit-bin/dist/consumer/config/component-overrides';
// import CompilerExtension from 'bit-bin/dist/legacy-extensions/compiler-extension';
// import TesterExtension from 'bit-bin/dist/legacy-extensions/tester-extension';
// import { CustomResolvedPath } from 'bit-bin/dist/consumer/component/consumer-component';
// import { ComponentOverridesData } from 'bit-bin/dist/consumer/config/component-overrides';

type LegacyConfigProps = {
  lang?: string;
  compiler?: string | Compilers;
  tester?: string | Testers;
  bindingPrefix: string;
  extensions?: ExtensionDataList;
  overrides?: ComponentOverridesData;
};

/**
 * in-memory representation of the component configuration.
 */
export default class Config {
  constructor(
    /**
     * version main file
     */
    readonly main: PathLinux,

    /**
     * configured extensions
     */
    readonly extensions: ExtensionDataList,

    readonly legacyProperties?: LegacyConfigProps
  ) {}
}
