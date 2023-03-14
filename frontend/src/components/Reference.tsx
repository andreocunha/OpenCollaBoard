import { useEffect } from "react";
import { useStore } from 'reactflow';

const zoomSelector = (s: { transform: any[]; }) => s.transform[2];

// receive setZoom from parent component
export function Reference(props: any) {
  const zoom = useStore(zoomSelector);

  useEffect(() => {
    // console.log('zoom', zoom);
    // if has setZoom and is a function, call it with zoom
    props.data.setZoom && typeof props.data.setZoom === 'function' && props.data.setZoom(zoom);

  }, [zoom]);

  return (
    <div 
      style={{
        width: 10,
        height: 10,
        background: 'transparent',
      }}
    />
  );
}