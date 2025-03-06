import { Marker, Popup, useMap } from 'react-leaflet';
import { treeDetailIcon } from './mapIcons';
import TreePopup from './TreePopup';
import { useEffect, useRef } from 'react';
import { LatLngTuple } from 'leaflet';

interface IProps {
    tree: ITreeDetail | null;
}

const MapMarkerDetail = ({ tree }: IProps) => {

    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null); // Sử dụng useRef để tham chiếu đến Marker

    useEffect(() => {
        if (tree) {
            // Khai báo kiểu dữ liệu rõ ràng là LatLngTuple
            const markerLatLng: LatLngTuple = [+tree.lat, +tree.lng];
            map.flyTo(markerLatLng, 19, { animate: true, duration: 2 });

            // Mở popup khi Marker được thêm vào bản đồ
            if (markerRef.current) {
                markerRef.current.openPopup();
            }
        }
    }, [tree, map]);

    if (!tree) {
        return <></>;
    }

    return (
        <Marker
            key={tree._id}
            position={[+tree.lat, +tree.lng] as LatLngTuple} // Xác định kiểu rõ ràng
            icon={treeDetailIcon}
            ref={markerRef} // Gán ref cho Marker
        >
            <Popup>
                <TreePopup
                    tree={tree}
                    onDetail={() => {
                    }}
                    onFeedback={() => {
                    }}
                />
            </Popup>
        </Marker>
    );
};

export default MapMarkerDetail;
