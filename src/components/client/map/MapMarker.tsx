
import { Marker, Popup } from 'react-leaflet';
import { treeIcon } from './mapIcons';
import TreePopup from './TreePopup';

interface IProps {
    trees: ITreeTable[]
}

const MapMarker = (props: IProps) => {
    const { trees } = props
    console.log(">>> check res: ", trees)

    return (
        <>
            {trees.map((tree) => {
                return (
                    <Marker
                        key={tree._id} // Thêm key để React quản lý danh sách tốt hơn
                        position={[+tree.lat, +tree.lng]}
                        icon={treeIcon}
                        eventHandlers={{
                            click: (e) => {
                                const map = e.target._map; // Lấy instance của bản đồ từ Marker
                                const markerLatLng = e.target.getLatLng();
                                // Sử dụng flyTo với animate và duration để tạo hiệu ứng chuyển động chậm hơn
                                map.flyTo(markerLatLng, 22, { animate: true, duration: 2 });
                            },
                        }}
                    >
                        <Popup>
                            <TreePopup
                                tree={tree}
                                onDetail={() => {
                                    // Xử lý khi bấm nút Xem chi tiết
                                    console.log("Xem chi tiết của cây:", tree._id);
                                }}
                                onFeedback={() => {
                                    // Xử lý khi bấm nút Phản ánh
                                    console.log("Phản ánh của cây:", tree._id);
                                }}
                            />
                        </Popup>
                    </Marker >
                );
            })}
        </>
    );
};

export default MapMarker;