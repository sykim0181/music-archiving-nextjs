import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { setSelectedAlbum, setVinylPosition } from "@/lib/redux/selectedAlbum";
import { Album } from "@/types/type";
import { useTypedSelector } from "@/lib/redux/store";

interface Prop {
  album: Album;
}

const LpVinyl = (prop: Prop) => {
  const { album } = prop;

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const dispatch = useDispatch();
  const selectedAlbum = useTypedSelector((state) => state.selectedAlbum.album);

  const vinylRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedAlbum) {
      setIsSelected(false);
    }
  }, [selectedAlbum]);

  useEffect(() => {
    if (isSelected && vinylRef.current) {
      const boundingRect = vinylRef.current.getBoundingClientRect();
      const curPosX = boundingRect.x;
      const curPosY = boundingRect.y;
      dispatch(
        setVinylPosition({
          posX: curPosX,
          posY: curPosY,
        })
      );
    }
  }, [isSelected, dispatch]);

  const onMouseDown = () => {
    setIsSelected(true);
    dispatch(setSelectedAlbum({ album }));
  };

  return (
    <div
      className="vinyl"
      ref={vinylRef}
      onMouseDown={onMouseDown}
      style={{
        cursor: "pointer",
        width: "100%",
        height: "100%",
      }}
    >
      <Image src="/vinyl-black.png" alt="vinyl" fill />
    </div>
  );
};

export default LpVinyl;
