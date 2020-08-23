import React from 'react';
import classNames from 'classnames';
import styles from './component-status.module.scss';
import { StatusTypes } from '../recursive-tree';

export type ComponentStatusProps = {
  status?: StatusTypes;
} & React.HTMLAttributes<HTMLDivElement>;

export function ComponentStatus({ status, className, ...rest }: ComponentStatusProps) {
  if (!status) return null;
  return (
    <div {...rest} className={classNames(styles.status, styles[status], className)}>
      {status[0].toUpperCase()}
    </div>
  );
}
