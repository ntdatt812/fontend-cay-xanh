import MapWrapper from "@/components/client/map/MapWrapper"
import { getDashboardAPI } from "@/services/api";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import 'styles/home.scss'

const HomePage = () => {
    const [dashboard, setDashboard] = useState<IDashboard | null>(null);
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getDashboardAPI();
                console.log(res)
                if (res && res.data) {
                    setDashboard(res.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="homepage-container" >
            <div className="map-wrapper-container">
                <MapWrapper />
            </div>
            <div className="statistics-container">
                <Row gutter={[8, 8]}>
                    <Col md={9} sm={24} xs={24}>
                        <div className="stat-item-1">
                            <Col md={8} sm={24} xs={24}>
                                <div className="totalTrees">
                                    <div className="stat-icon">🌳</div>
                                    <div className="stat-value">{dashboard?.totalTrees}</div>
                                    <div className="stat-label">Cây xanh</div>
                                </div>
                            </Col>
                            <Col md={16} sm={24} xs={24} >
                                <div className="listDK">
                                    <div>Cây loại 1 (Đường kính thân ≤ 20 cm): <strong>{dashboard?.treeDiameter?.cayLoai1}</strong></div>
                                    <div>Cây loại 2 (Đường kính thân 20 - 50 cm): <strong>{dashboard?.treeDiameter?.cayLoai2}</strong></div>
                                    <div>Cây loại 3 (Đường kính thân 50+ cm): <strong>{dashboard?.treeDiameter?.cayLoai3}</strong></div>
                                </div>
                            </Col>
                        </div>
                    </Col>
                    <Col md={5} sm={24} xs={24}>
                        <div className="stat-item">
                            <div className="stat-icon">🌱</div>
                            <div className="stat-value">10</div>
                            <div className="stat-label">Chủng loại cây</div>
                        </div>
                    </Col>
                    <Col md={5} sm={24} xs={24}>
                        <div className="stat-item">
                            <div className="stat-icon">🪴</div>
                            <div className="stat-value">{dashboard?.newTrees}</div>
                            <div className="stat-label">Cây mới trồng gần đây</div>
                        </div>
                    </Col>
                    <Col md={5} sm={24} xs={24}>
                        <div className="stat-item">
                            <div className="stat-icon">📌</div>
                            <div className="stat-value">{dashboard?.uniqueRegions}</div>
                            <div className="stat-label">Khu vực</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default HomePage