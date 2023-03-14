import { NodeProps } from 'reactflow';
import { Square } from '../components/Square';
import { Cursor } from '../components/Cursor';
import { Reference } from '../components/Reference';
import { Text } from '../components/Text';
import { Divider } from '../components/Divider';
import { ImageComponent } from '../components/Image';

const NODE_TYPES = {
  square: (props: NodeProps<any>) => <Square data={props} />,
  cursor: (props: NodeProps<any>) => {
    const { color } = props.data;
    return <Cursor color={color}/>;
  },
  reference: (props: NodeProps<any>) => <Reference data={props.data} />,
  text: (props: NodeProps<any>) => <Text data={props} />,
  divider: (props: NodeProps<any>) => <Divider data={props} />,
  image: (props: NodeProps<any>) => <ImageComponent data={props} />,
};

export { NODE_TYPES };