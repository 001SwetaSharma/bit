export type CommandOptions = {
  name: string;
  description?: string;
};
export type CommandHandler = (...arg: any[]) => any;
export type CommandEntry = CommandOptions & {
  handler: CommandHandler;
};
export type CommandId = string;

export default class CommandRegistryUi extends Map<CommandId, CommandEntry> {
  static dependencies = [];
  static slots = [];
  static async provider(/* deps: []] config, slots: [] */) {
    const CommandRegistry = new CommandRegistryUi();
    return CommandRegistry;
  }

  run<R = any>(id: CommandId, ...rest: any[]) {
    const command = this.get(id);
    if (!command) return undefined;

    const result = command.handler(...rest);
    return result as R;
  }
}
