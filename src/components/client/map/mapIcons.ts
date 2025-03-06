import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'styles/map-icons.scss';

export const treeIcon = L.icon({
    iconUrl: '/chamxanh.png', // File nằm trong thư mục public
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
});

export const treeDetailIcon = L.divIcon({
    className: 'tree-detail-icon', // Sử dụng class để thêm animation
    html: `<img src="/chamdo.png" alt="Tree Detail" />`, // Đổi URL nếu cần
    iconSize: [20, 20],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});