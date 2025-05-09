import { Marker, Popup, useMap } from 'react-leaflet';
import { treeDetailIcon } from './mapIcons';
import { useEffect, useRef } from 'react';
import { LatLngTuple } from 'leaflet';
import DetailTreePopup from './DetailTreePopup';

interface IProps {
    tree: ITreeTable | null;
}

const MapMarkerDetail = ({ tree }: IProps) => {

    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null); // Sử dụng useRef để tham chiếu đến Marker
    console.log("check tree", tree)
    useEffect(() => {
        if (tree) {
            const markerLatLng: LatLngTuple = [+tree.lat, +tree.lng];
            map.flyTo(markerLatLng, 20, { animate: true, duration: 2 });

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
            ref={markerRef}
        >
            <Popup>
                <DetailTreePopup
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
