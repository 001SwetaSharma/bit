import { Workspace } from '@bit/bit.core.workspace';
// import { BitCli } from '@bit/bit.core.cli';
import { WatchCommand } from './watch.cmd';
import { Compile } from '@bit/bit.core.compiler';
import Watch from './watch';
import { CLIExtension } from '@bit/bit.core.cli';

export type watchDeps = [CLIExtension, Compile, Workspace];

export function provideWatch([cli, compile, workspace]: watchDeps) {
  const watch = new Watch(compile, workspace);
  cli.register(new WatchCommand(watch));
  return watch;
}
