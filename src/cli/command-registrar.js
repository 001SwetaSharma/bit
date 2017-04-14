// @flow
import prog from 'caporal';
import pkg from '../../package.json';
import loader from './loader';
import commands from './commands/command-list';

function errorHandler(e) {
  loader.off();
  console.error(e); // eslint-disable-line
  process.exit(1);
}

function logAndExit(str) {
  loader.off();
  console.log(str); // eslint-disable-line
  process.exit(0);
}

function start() {
  const program = prog
  .version(pkg.version)
  .description('bit driver for javascript');

  commands.forEach((c) => {
    const currentCommand = program.command(c.name, c.description);

    if (c.arguments && Array.isArray(c.arguments)) {
      c.arguments.forEach(arg => currentCommand.argument(arg.name, arg.description));
    }

    currentCommand.action((args, options) => {
      if (c.loader === true) loader.on();
      loader.start(`performing ${c.name} command`);
      c.action(args, options)
      .then(c.report)
      .then(logAndExit)
      .catch(c.handleError || errorHandler);
    });
  });

  program.parse(process.argv);
}

export default start;
