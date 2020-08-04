import React from 'react';
import classNames from 'classnames';
import { clickable } from '../../../../to-eject/css-components/clickable';
import { hoverable } from '../../../../to-eject/css-components/hoverable';

import styles from './command-bar-item.module.scss';

export type CommandBarOptionProps = { active?: boolean } & React.HTMLAttributes<HTMLDivElement>;

export function CommandBarOption({ className, active, ...rest }: CommandBarOptionProps) {
  return (
    <div
      {...rest}
      className={classNames(className, clickable, hoverable, styles.commandBarOption, active && styles.active)}
    />
  );
}
