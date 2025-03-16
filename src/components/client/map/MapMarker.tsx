
import { Marker, Popup } from 'react-leaflet';
import { treeIcon, treeIcon1, treeIcon2, treeIcon3 } from './mapIcons';
import TreePopup from './TreePopup';
import { useNavigate } from 'react-router-dom';
import ModalPostFeedback from '../feedback/create.feedback';
import { useState } from 'react';

interface IProps {
    trees: ITreeTable[]
}

const MapMarker = (props: IProps) => {
    const { trees } = props
    const [treeFeedback, setTreeFeedback] = useState<ITree | null>(null)
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
    const navigate = useNavigate();

    const getTreeIcon = (duongkinh: number) => {
        if (duongkinh <= 20) return treeIcon1;
        if (duongkinh > 20 && duongkinh <= 50) return treeIcon2;
        return treeIcon3;
    };

    return (
        <>
            {trees.map((tree) => {
                return (
                    <Marker
                        key={tree._id}
                        position={[+tree.lat, +tree.lng]}
                        icon={getTreeIcon(tree.duongkinh)}
                        eventHandlers={{
                            click: (e) => {
                                const map = e.target._map;
                                const markerLatLng = e.target.getLatLng();
                                map.flyTo(markerLatLng, 20, { animate: true, duration: 2 });
                            },
                        }}
                    >
                        <Popup>
                            <TreePopup
                                tree={tree}
                                onDetail={() => {
                                    console.log("Xem chi tiết của cây:", tree._id);
                                    navigate(`/tree/${tree._id}`)
                                }}
                                onFeedback={() => {
                                    // Xử lý khi bấm nút Phản ánh
                                    console.log("Phản ánh của cây:", tree._id);
                                    setTreeFeedback(tree);
                                    setOpenModalCreate(true)
                                }}
                            />
                            <ModalPostFeedback
                                setOpenModalCreate={setOpenModalCreate}
                                openModalCreate={openModalCreate}
                                treeFeedback={treeFeedback}
                            />
                        </Popup>
                    </Marker >
                );
            })}
        </>
    );
};

export default MapMarker;