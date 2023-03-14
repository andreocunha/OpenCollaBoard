import React, { useEffect, useState, useRef } from 'react';
import { socket } from "@/services/socket";
import styles from "../styles/components/ResizeRotateNode.module.css";
import { createNewNode } from '@/utils';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export function ResizeRotateNode({ data, children } : any) {
  const dimensionsControlRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialWidth, setInitialWidth] = useState(100);
  const [initialHeight, setInitialHeight] = useState(100);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if(!isEditing){
      setInitialWidth(data?.data?.width || 100);
      setInitialHeight(data?.data?.height || 100);
    }
  }, [data]);

  useEffect(() => {
    // linsten if ctrl+c is pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      // ctrl+c or command+c
      if((e.key.toLowerCase() === 'c' && e.ctrlKey) || (e.key.toLowerCase() === 'c' && e.metaKey) && isEditing){
        setHasCopied(true);
      }
      if((e.key.toLowerCase() === 'v' && e.ctrlKey) || (e.key.toLowerCase() === 'v' && e.metaKey) && isEditing && hasCopied){
        createNewNode(data.type, { 
          ...data.data,
          width: initialWidth,
          height: initialHeight
        }, data.zIndex);
        setHasCopied(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  },[dimensionsControlRef, isEditing, initialHeight, initialWidth, hasCopied]);

  return (
    <div
      className={styles.container}
      ref={dimensionsControlRef}
      onDoubleClick={(e) => setIsEditing(true)}
      onClick={(e) => setIsEditing(false)}
      // on long press
      onContextMenu={(e) => {
        e.preventDefault();
        setIsEditing(true);
      }}
      style={{
        width: isResizing ? '100%' : initialWidth,
        height: isResizing ? '100%' : initialHeight
      }}
    >
      <NodeResizer
        minHeight={5}
        minWidth={5}
        lineStyle={{ stroke: 'black', strokeWidth: 1 }}
        isVisible={isEditing}
        lineClassName={styles.line}
        handleClassName={styles.handle}
        onResize={(size) => {
          // console.log('onResize')
          setIsResizing(true);
          const { width, height } = dimensionsControlRef.current?.getBoundingClientRect() || { width: 5, height: 150 };
          setInitialHeight(height);
          setInitialWidth(width);
          const newData = {
            ...data.data,
            width: width,
            height: height
          }

          socket.emit('nodeMove', {
            id: data.id,
            data: newData,
          });
        }}
        onResizeEnd={(size) => {
          setIsResizing(false);
          const { width, height } = dimensionsControlRef.current?.getBoundingClientRect() || { width: 5, height: 150 };
          setInitialHeight(height);
          setInitialWidth(width);
          const newData = {
            ...data.data,
            width: width,
            height: height
          }

          socket.emit('nodeEvent', {
            id: data.id,
            data: newData,
          });
        }}
      />
      {children}
    </div>
  );
}
