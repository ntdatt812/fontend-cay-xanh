// import { LayersControl, TileLayer } from 'react-leaflet';

// const MapLayers = () => {
//     return (
//         <LayersControl position="topright">
//             <LayersControl.BaseLayer checked name="Bản đồ gogle">
//                 <TileLayer
//                     // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
//                     url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
//                     maxZoom={22}
//                 />
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer name="satellite">
//                 <TileLayer
//                     // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
//                     url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
//                     maxZoom={22}
//                 />
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer name="hybrid">
//                 <TileLayer
//                     // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
//                     url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
//                     maxZoom={22}
//                 />
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer name="terrain">
//                 <TileLayer
//                     // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
//                     url="http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}"
//                     maxZoom={22}
//                 />
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer name="Bản đồ đường phố">
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Trường Đại học Hồng Đức'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     maxZoom={22}
//                 />
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer name="Bản đồ vệ tinh">
//                 <TileLayer
//                     attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA'
//                     url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${import.meta.env.VITE_API_MAP}`}
//                     maxZoom={22}
//                     maxNativeZoom={19}
//                 />
//             </LayersControl.BaseLayer>
//         </LayersControl>
//     );
// };

// export default MapLayers;

import { TileLayer, LayersControl, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const layers = [
    { name: 'Google Map', url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', icon: '🗺️' },
    { name: 'Satellite', url: 'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', icon: '🛰️' },
    { name: 'Hybrid', url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', icon: '🌍' },
    { name: 'Terrain', url: 'https://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', icon: '⛰️' },
    { name: 'OSM Map', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', icon: '🛣️' },
];

const MapWithLayers = () => {
    const map = useMap();
    const [selectedLayer, setSelectedLayer] = useState(() => {
        return localStorage.getItem('selectedLayer') || layers[0].name;
    });

    // Sự kiện cập nhật khi đổi layer
    useEffect(() => {
        if (!map) return;
        const onLayerChange = (e: L.LayersControlEvent) => {
            setSelectedLayer(e.name);
            localStorage.setItem('selectedLayer', e.name);
        };

        map.on('baselayerchange', onLayerChange);
        return () => {
            map.off('baselayerchange', onLayerChange);
        };
    }, [map]);

    return (
        <LayersControl position="topright">
            {layers.map((layer, index) => (
                <LayersControl.BaseLayer
                    key={index}
                    checked={selectedLayer === layer.name}
                    name={layer.name}
                >
                    <TileLayer url={layer.url} maxZoom={22} />
                </LayersControl.BaseLayer>
            ))}
        </LayersControl>
    );
};

export default MapWithLayers;

