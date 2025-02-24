import L from 'leaflet';

export const treeIcon = L.icon({
    iconUrl: '/chamxanh.png', // File nằm trong thư mục public
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});
