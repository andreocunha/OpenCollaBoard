import React from 'react';
import { ResizeRotateNode } from './ResizeRotateNode';

export function ImageComponent(props: any) {

  return (
    <ResizeRotateNode data={props.data}>
      <img
        src={props.data.data.url}
        alt="Image"
        width="100%"
        height="100%"
        style={{
          minWidth: 100,
        }}
      />  
    </ResizeRotateNode>
  );
}
