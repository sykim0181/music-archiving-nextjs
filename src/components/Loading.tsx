import { Oval } from "react-loader-spinner";

interface Prop {
  width: number;
  height: number;
}

const Loading = (prop: Prop) => {
  const { width, height } = prop;

  return (
    <Oval 
      color='#D3D3D3' 
      secondaryColor='#000000' 
      width={width}
      height={height}
    />
  )
}

export default Loading