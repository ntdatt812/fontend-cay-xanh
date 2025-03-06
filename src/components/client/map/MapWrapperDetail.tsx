import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLayers from './MapLayers';
import MapMarkerDetail from './MapMarkerDetail';

const defaultPosition: [number, number] = [19.76861042809915, 105.77921655662206];

interface IProps {
    tree: ITreeDetail | null;
}

const MapWrapperDetail = ({ tree }: IProps) => {
    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                center={defaultPosition}
                zoom={17}
                scrollWheelZoom={true}
                wheelPxPerZoomLevel={400}
                style={{ height: '100vh', width: '100%' }}
            >
                <MapLayers />
                <MapMarkerDetail tree={tree} />
            </MapContainer>
        </div>
    );
};

export default MapWrapperDetail;
