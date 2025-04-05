import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'styles/map-icons.scss';

export const treeIcon = L.icon({
    iconUrl: '/chamxanh.png',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});

export const treeIcon1 = L.icon({
    iconUrl: '/icon_green_1.png',
    iconSize: [15, 15],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});

export const treeIcon2 = L.icon({
    iconUrl: '/icon_green_2.png',
    iconSize: [15, 15],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});

export const treeIcon3 = L.icon({
    iconUrl: '/icon_green_3.png',
    iconSize: [15, 15],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});

export const treeDetailIcon = L.divIcon({
    className: 'tree-detail-icon',
    html: `<img src="/chamdo.png" alt="Tree Detail" />`,
    iconSize: [12, 12],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});