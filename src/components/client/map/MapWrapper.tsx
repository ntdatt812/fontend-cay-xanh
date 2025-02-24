import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLayers from './MapLayers';
import MapMarker from './MapMarker';
import { useEffect, useState } from 'react';
import { getAllTreesWithoutPaginateAPI } from '@/services/api';

const defaultPosition: [number, number] = [19.76861042809915, 105.77921655662206];

const MapWrapper = () => {
    const [trees, setTrees] = useState<ITreeTable[]>([]);
    useEffect(() => {
        const fetchTrees = async () => {
            try {
                // Thay 'API_URL_HERE' bằng URL API của bạn trả về danh sách cây
                const res = await getAllTreesWithoutPaginateAPI()
                console.log(">>> check res: ", res.data)
                if (res && res.data) {
                    setTrees(res.data);
                }
            } catch (error) {
                console.error('Error fetching trees:', error);
            }
        };
        fetchTrees();
    }, []);

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
                <MapMarker trees={trees} />
            </MapContainer>
        </div>
    );
};

export default MapWrapper;
