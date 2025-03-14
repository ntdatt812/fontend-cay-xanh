// import { useState } from "react";
// import { Modal, Button } from "antd";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { LatLng } from "leaflet";

// interface MapPickerProps {
//     visible: boolean;
//     onClose: () => void;
//     onSelectLocation: (lat: number, lng: number) => void;
// }

// const MapPicker = ({ visible, onClose, onSelectLocation }: MapPickerProps) => {
//     const [position, setPosition] = useState<[number, number] | null>(null);

//     function LocationMarker() {
//         useMapEvents({
//             click(e) {
//                 setPosition([e.latlng.lat, e.latlng.lng]);
//             },
//         });

//         return position ? <Marker position={position} /> : null;
//     }

//     function MyComponent() {
//         const [position, setPosition] = useState<LatLng | null>(null);

//         const map = useMapEvents({
//             click: () => {
//                 map.locate();
//             },
//             locationfound: (location) => {
//                 setPosition(location.latlng);
//                 map.flyTo(location.latlng, map.getZoom()); // Zoom vào vị trí người dùng
//             },
//             locationerror: (error) => {
//                 console.error("Không thể xác định vị trí:", error.message);
//                 alert("Không thể xác định vị trí! Hãy kiểm tra cài đặt GPS.");
//             },
//         });

//         return position ? (
//             <Marker position={position}>
//                 Bạn đang ở đây! 📍
//             </Marker>
//         ) : null;
//     }

//     return (
//         <Modal
//             open={visible}
//             onCancel={onClose}
//             onOk={() => {
//                 if (position) {
//                     onSelectLocation(position[0], position[1]);
//                 }
//                 onClose();
//             }}
//             okText="Chọn tọa độ"
//             cancelText="Hủy"
//             width="70vw"
//             height="80vh"
//         >
//             <MapContainer
//                 center={[19.76861042809915, 105.77921655662206]}
//                 zoom={18} style={{ height: "80vh" }}
//                 wheelPxPerZoomLevel={150}
//             >
//                 <TileLayer
//                     attribution='&copy; Nguyễn Thành Đạt'
//                     url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
//                     maxZoom={22}
//                 />
//                 <LocationMarker />

//                 <MyComponent/>
//             </MapContainer>
//         </Modal >
//     );
// };

// export default MapPicker;

import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import { EnvironmentOutlined } from "@ant-design/icons";
import { getAllTreesWithoutPaginateAPI } from "@/services/api";
import { treeIcon } from "@/components/client/map/mapIcons";

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (lat: number, lng: number) => void;
}

const MapPicker = ({ visible, onClose, onSelectLocation }: MapPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
    const [filters, setFilters] = useState<{ khuvuc: string[]; duongkinh: string[] }>({
        khuvuc: [],
        duongkinh: [],
    });
    const [trees, setTrees] = useState<ITreeTable[]>([]);

    let mapInstance: any = null;

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                setCurrentPosition(null);
            },
        });
        return position ? <Marker position={position} /> : null;
    }

    function MyComponent() {
        const map = useMapEvents({
            locationfound: (location) => {
                setPosition(null);
                setCurrentPosition(location.latlng);
                map.flyTo(location.latlng, map.getZoom());
            },
            locationerror: (error) => {
                console.error("Không thể xác định vị trí:", error.message);
                alert("Không thể xác định vị trí! Hãy kiểm tra cài đặt GPS.");
            },
        });

        mapInstance = map;
        return currentPosition ? <Marker position={currentPosition} /> : null;
    }

    const handleGetCurrentLocation = () => {
        if (mapInstance) {
            mapInstance.locate();
        }
    };

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
        <Modal
            open={visible}
            onCancel={onClose}
            onOk={() => {
                if (position) {
                    onSelectLocation(position[0], position[1]);
                } else if (currentPosition) {
                    onSelectLocation(currentPosition.lat, currentPosition.lng);
                }
                onClose();
            }}
            okText="Chọn tọa độ"
            cancelText="Hủy"
            width="70vw"
            height="80vh"
        >
            <MapContainer
                center={[19.76861042809915, 105.77921655662206]}
                zoom={18}
                style={{ height: "80vh" }}
                wheelPxPerZoomLevel={150}
            >
                <TileLayer
                    attribution='&copy; Nguyễn Thành Đạt'
                    url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                    maxZoom={22}
                />
                <LocationMarker />
                <MyComponent />
                {trees.map((tree) => {
                    return (
                        <Marker
                            key={tree._id}
                            position={[+tree.lat, +tree.lng]}
                            icon={treeIcon}
                        />
                    );
                })}
            </MapContainer>
            <Button
                shape="circle"
                icon={<EnvironmentOutlined />}
                style={{ position: "absolute", top: 110, left: 35, zIndex: 1000 }}
                onClick={handleGetCurrentLocation}
            />
        </Modal>
    );
};

export default MapPicker;
