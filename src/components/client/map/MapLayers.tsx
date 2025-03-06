import { LayersControl, TileLayer } from 'react-leaflet';

const MapLayers = () => {
    return (
        <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Bản đồ đường phố">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={22}
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ vệ tinh">
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA'
                    url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${import.meta.env.VITE_API_MAP}`}
                    maxZoom={22}
                    maxNativeZoom={19}
                />
            </LayersControl.BaseLayer>
        </LayersControl>
    );
};

export default MapLayers;
