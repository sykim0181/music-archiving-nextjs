import { useContext, useState } from "react";
import styles from "@/styles/AlbumsInteraction.module.scss";
import { RxPlus } from "react-icons/rx";
import AddAlbumModal from "./Editable/AddAlbumModal";
import LpComponent from "./LpComponent";
import { AlbumsContext } from "../../providers/InteractionProvider";

interface Props {
  addable?: boolean;
}

const AlbumList = ({ addable }: Props) => {
  const albums = useContext(AlbumsContext);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className={`${styles.list_lp} invisible_scroll`}>
      {albums.map((album) => (
        <LpComponent
          key={album.id}
          album={album}
          className={styles.list_lp_item}
        />
      ))}
      {addable && (
        <div
          className={styles.list_lp_item}
          onClick={() => setShowAddModal(true)}
        >
          <div className={styles.add_album_button}>
            <RxPlus />
          </div>
        </div>
      )}
      {showAddModal && (
        <AddAlbumModal closeModal={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default AlbumList;
