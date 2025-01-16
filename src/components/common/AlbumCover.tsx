import Image from "next/image";
import React from "react";

interface Props {
  imgSrc: string;
}

const AlbumCover = (props: Props) => {
  const { 
    imgSrc,
  } = props;

  return (
    <Image src={imgSrc} alt="" fill/>
  )
}

export default React.memo(AlbumCover);