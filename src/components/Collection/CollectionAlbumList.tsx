import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useDispatch } from "react-redux";
import SyncLoader from "react-spinners/SyncLoader";

import { Album, Collection } from "@/types/type";
import { setModal } from "@/lib/redux/modalInfo";
import { getCollectionAlbumList } from "@/utils/utils";

interface CollectionAlbumListProps {
  collection: Collection
}

const CollectionAlbumList = (props: CollectionAlbumListProps) => {
  const { collection } = props;

  const dispatch = useDispatch();

  const { data, isError, isFetching } = useQuery({
    queryKey: ['collection-album-list', collection.id],
    queryFn: () => getCollectionAlbumList(collection),
    staleTime: Infinity
  });

  if (isError) {
    return (
      <p>앨범 목록을 불러오는데 실패했습니다.</p>
    );
  }

  if (isFetching || data === undefined) {
    return (
      <div className="collection_album_list_loader_container">
        <SyncLoader color="#000000" size={10} />
      </div>
    );
  }

  const onClickAlbumItem = (album: Album) => {
    dispatch(setModal({
      modalType: 'album_info',
      modalProp: { album }
    }));
  };

  const albumListElements = data.map((album, idx) => {
    if (album === undefined) {
      return <></>;
    }

    return (
      <li 
        className="album_item" 
        key={album.id} 
        onClick={() => onClickAlbumItem(album)}
      >
        <p className="album_item_index">{idx + 1}</p>
        <div className="album_item_image">
          <Image src={album.imageUrl} width={70} height={70} alt={album.name} />
        </div>

        <div className="album_item_info">
          <p className="album_item_name">{album.name}</p>
          <div className="album_item_description">
            <p className="album_item_artist">{album.artists.join(', ')}</p>
            <p className="album_item_description_divider">·</p>
            <p className="album_item_track_number">{`${album.total_tracks}곡`}</p>
          </div>
        </div>        
      </li>
    );
  });

  return (
    <ul className="list_album">
      {albumListElements}
    </ul>
  );
};

export default CollectionAlbumList;