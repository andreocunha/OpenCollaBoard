import styles from '@/styles/Room.module.css'
import { useEffect, useState } from 'react'
import { HeadTab } from '@/components/HeadTab';
import ReactFlow, { Controls, ControlButton, Background, useNodesState } from 'reactflow';
import { socket } from '@/services/socket';
import { GenericNode, NodeProps } from '@/types/interfaces';
import { NODE_TYPES } from '@/types/NodeTypes';
import { removeDuplicates } from '@/utils';
import { useTheme } from 'next-themes'

import 'reactflow/dist/style.css';
import { MenuOptions } from '@/components/MenuOptions';

export default function Room({ room }: any) {
  const { theme, setTheme } = useTheme()
  const [nodeMoving, setNodeMoving] = useState<GenericNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [deletedElements, setDeletedElements] = useState<GenericNode[] | null | any>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '0',
      type: 'reference',
      position: { 
        x: 0, 
        y: 0
      },
      data: {
        setZoom: setZoom
      }
    }
  ]);

  useEffect(() => {
    socket.emit('joinRoom', room);
  }, []);


  useEffect(() => {
    socket.on('roomDoesNotExist', () => {
      window.location.href = '/';
    });

    socket.on('loadNodes', (loadNodes: NodeProps[]) => {
      // console.log('loadNodes', loadNodes);
      // add the nodes after the reference node
      const newNodes = [...nodes, ...loadNodes];
      setNodes(newNodes);
    });

    socket.on('nodeCoords', (node: NodeProps) => {
      if (!node || Object.keys(node).length === 0) return;
      // console.log('node', node);
  
      const nodeIndex = nodes.findIndex((n) => n?.id === node.id.toString());

      // remove duplicate nodes
      const nodesWithoutDuplicates = removeDuplicates(nodes);
  
      if (nodeIndex !== -1) {
        const newNodes = [...nodesWithoutDuplicates];
        newNodes[nodeIndex] = node;
        setNodes(newNodes);
      } else {
        // add in nodesWithoutDuplicates the new node
        const newNodes = [...nodesWithoutDuplicates, node];
        setNodes(newNodes);
      }
    });

    socket.on('nodeDeleted', (nodeId: string) => {
      const nodeIndex = nodes.findIndex((n) => n?.id === nodeId);
      if (nodeIndex !== -1) {
        const newNodes = [...nodes];
        newNodes.splice(nodeIndex, 1);
        setNodes(newNodes);
      }
    });

    socket.on('userDisconnect', (id: string) => {
      const nodeIndex = nodes.findIndex((n) => n?.id === id);
      if (nodeIndex !== -1) {
        const newNodes = [...nodes];
        newNodes.splice(nodeIndex, 1);
        setNodes(newNodes);
      }
    });
    
  },[nodes]);

  useEffect(() => {
    // console.log('nodes', nodes);
    if(nodeMoving) {
      const node = nodes.find((n) => n.id === nodeMoving.id.toString());
      socket.emit('nodeMove', {
        id: node?.id,
        position: node?.position,
      });
    }

  },[nodes])

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      // control + z or command + z
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        if(deletedElements && deletedElements.length > 0){
          const newDeletedElements = [...deletedElements];
          const lastElement = newDeletedElements.pop();
          setDeletedElements(newDeletedElements);
          socket.emit('nodeEvent', lastElement);
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [deletedElements]);

  return (
    <>
      <HeadTab title="OpenCollaBoard" />
      <main className={styles.main}>
        <div style={{ height: '100vh', width: '100%' }}>
          <ReactFlow
            nodeTypes={NODE_TYPES}
            nodes={nodes}
            onNodesChange={onNodesChange}
            onNodeDragStart={(e, node) => {
              setNodeMoving(node as any);
            }}
            onNodeDragStop={(e, node) => {
              setNodeMoving(null);
            }}
            onMouseMove={(e) => {
              const nodeElement = document.querySelector('.react-flow__node');
              if(!nodeElement) return;
              const nodeRect = nodeElement.getBoundingClientRect();
              const x = (e.clientX - nodeRect.left) / zoom;
              const y = (e.clientY - nodeRect.top) / zoom;
              socket.emit('mouseMove', { x, y });
            }}
            onNodesDelete={(nodes) => {
              if(nodes[0]){
                socket.emit('nodeDelete', nodes[0].id);
                setDeletedElements([...deletedElements, nodes[0]]);
              }
            }}
          >
            <Background />
            <Controls>
              <ControlButton onClick={() => 
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }>
                {theme === 'dark' ? '🌞' : '🌙'}
              </ControlButton>
            </Controls>
          </ReactFlow>
        </div>
        
        <MenuOptions />
      </main>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  return {
    props: {
      room: id
    }
  }
}