
import { Marker, Popup } from 'react-leaflet';
import { treeIcon } from './mapIcons';
import TreePopup from './TreePopup';
import { useNavigate } from 'react-router-dom';
import ModalPostFeedback from '../feedback/create.feedback';
import { useState } from 'react';

interface IProps {
    trees: ITreeTable[]
}

const MapMarker = (props: IProps) => {
    const { trees } = props
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
    const navigate = useNavigate();

    return (
        <>
            {trees.map((tree) => {
                return (
                    <Marker
                        key={tree._id}
                        position={[+tree.lat, +tree.lng]}
                        icon={treeIcon}
                        eventHandlers={{
                            click: (e) => {
                                const map = e.target._map;
                                const markerLatLng = e.target.getLatLng();
                                map.flyTo(markerLatLng, 19, { animate: true, duration: 2 });
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
                                    setOpenModalCreate(true)
                                }}
                            />
                            <ModalPostFeedback
                                setOpenModalCreate={setOpenModalCreate}
                                openModalCreate={openModalCreate}
                                tree={tree}
                            />
                        </Popup>
                    </Marker >
                );
            })}
        </>
    );
};

export default MapMarker;