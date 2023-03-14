import React from 'react';
import styles from "../styles/components/Divider.module.css";
import { ResizeRotateNode } from './ResizeRotateNode';

export function Divider({ data } : any) {
  return (
    <ResizeRotateNode data={data}>
      <div className={styles.divider} />
    </ResizeRotateNode>
  );
}
