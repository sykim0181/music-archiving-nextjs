import MoonLoader from "react-spinners/MoonLoader";

interface Prop {
  size: number;
}

const Loading = (prop: Prop) => {
  const { size } = prop;

  return <MoonLoader color="#000000" size={size} />;
};

export default Loading;
