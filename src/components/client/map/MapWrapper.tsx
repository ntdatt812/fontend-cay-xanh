import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLayers from './MapLayers';
import MapMarker from './MapMarker';
import { useEffect, useState } from 'react';
import { getAllTreesWithoutPaginateAPI } from '@/services/api';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import FilterPopover from '../filter/filterBar';

// import { LatLng } from 'leaflet';

const defaultPosition: [number, number] = [19.76861042809915, 105.77921655662206];

// function MyComponent() {
//     const [position, setPosition] = useState<LatLng | null>(null);

//     const map = useMapEvents({
//         click: () => {
//             map.locate();
//         },
//         locationfound: (location) => {
//             setPosition(location.latlng);
//             map.flyTo(location.latlng, map.getZoom()); // Zoom vào vị trí người dùng
//         },
//         locationerror: (error) => {
//             console.error("Không thể xác định vị trí:", error.message);
//             alert("Không thể xác định vị trí! Hãy kiểm tra cài đặt GPS.");
//         },
//     });

//     return position ? (
//         <Marker position={position}>
//             <Popup>Bạn đang ở đây! 📍</Popup>
//         </Marker>
//     ) : null;
// }

// function LocationMarker() {
//     const [position, setPosition] = useState<[number, number] | null>(null);

//     useMapEvents({
//         click(e) {
//             console.log("Tọa độ được click:", e.latlng);
//             setPosition([e.latlng.lat, e.latlng.lng]);
//         }
//     });

//     return position ? (
//         <Marker position={position}>
//             <Popup>
//                 Bạn đã bấm vào đây: <br /> {position[0].toFixed(6)}, {position[1].toFixed(6)}
//             </Popup>
//         </Marker>
//     ) : null;
// }


const MapWrapper = () => {
    const [trees, setTrees] = useState<ITreeTable[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [filters, setFilters] = useState<{ khuvuc: string[]; duongkinh: string[] }>({
        khuvuc: [],
        duongkinh: [],
    });
    useEffect(() => {
        const fetchTrees = async () => {
            try {
                const res = await getAllTreesWithoutPaginateAPI(filters);

                if (res && res.data) {
                    setTrees(res.data);
                }
            } catch (error) {
                console.error('Error fetching trees:', error);
            }
        };

        fetchTrees();
    }, [filters]);

    return (
        <div style={{ position: 'relative' }}>
            <div>
                <FilterPopover
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    setFilters={setFilters}
                >
                    <Button
                        onClick={() => setOpenDrawer(true)}
                        icon={<FilterOutlined style={{ fontSize: '24px' }} />}
                        shape="circle"
                        style={{
                            position: 'absolute',
                            top: '12%',
                            left: '12px',
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            zIndex: 1000
                        }}
                    />
                </FilterPopover>
            </div>

            <MapContainer
                center={defaultPosition}
                zoom={17}
                scrollWheelZoom={true}
                wheelPxPerZoomLevel={400}
                style={{ height: '100vh', width: '100%' }}
            >
                <MapLayers />
                <MapMarker trees={trees} />
                {/* <MyComponent /> */}
                {/* <LocationMarker /> */}
            </MapContainer>

        </div>
    );
};

export default MapWrapper;
