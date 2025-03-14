import { useState } from "react";
import { Modal, Button } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (lat: number, lng: number) => void;
}

const MapPicker = ({ visible, onClose, onSelectLocation }: MapPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });

        return position ? <Marker position={position} /> : null;
    }

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            onOk={() => {
                if (position) {
                    onSelectLocation(position[0], position[1]);
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
                zoom={18} style={{ height: "80vh" }}
                wheelPxPerZoomLevel={150}
            >
                <TileLayer
                    attribution='&copy; Nguyễn Thành Đạt'
                    url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                    maxZoom={22}
                />
                <LocationMarker />
            </MapContainer>
        </Modal >
    );
};

export default MapPicker;