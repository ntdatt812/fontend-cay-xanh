import MapWrapper from "@/components/client/map/MapWrapper"
import 'styles/home.scss'

const HomePage = () => {
    return (
        <div className="homepage-container" >
            <div className="map-wrapper-container">
                <MapWrapper />
            </div>
            <div className="statistics-container">
                <div className="stat-item">
                    <div className="stat-icon">🌳</div>
                    <div className="stat-value">3</div>
                    <div className="stat-label">Cây xanh</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🏛️</div>
                    <div className="stat-value">157</div>
                    <div className="stat-label">Cây di sản</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🌱</div>
                    <div className="stat-value">254</div>
                    <div className="stat-label">Chủng loại cây</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🪴</div>
                    <div className="stat-value">1</div>
                    <div className="stat-label">Cây trồng thêm</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🏞️</div>
                    <div className="stat-value">3</div>
                    <div className="stat-label">Thảm xanh</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">💧</div>
                    <div className="stat-value">1</div>
                    <div className="stat-label">Mặt nước</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📍</div>
                    <div className="stat-value">340</div>
                    <div className="stat-label">Ô trống</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📌</div>
                    <div className="stat-value">14</div>
                    <div className="stat-label">Khu vực</div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🛤️</div>
                    <div className="stat-value">189</div>
                    <div className="stat-label">Tuyến</div>
                </div>
            </div>
        </div>
    )
}
export default HomePage