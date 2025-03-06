import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Image, Row, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/tree-detail.scss';
import MapWrapperDetail from "../map/MapWrapperDetail";

interface IProps {
    tree: ITreeDetail | null;
    loading: boolean;
}

const TreeDetail = ({ tree, loading }: IProps) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    if (loading) {
        return (
            <div className="tree-detail-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (!tree) {
        return <div className="tree-detail-error">Không tìm thấy thông tin cây xanh.</div>;
    }
    console.log(tree)

    return (
        <div className="tree-detail">
            <Row gutter={[20, 20]}>
                <Col md={2} sm={0} xs={0}>
                    <div className="back-arrow" onClick={handleBack}>
                        <ArrowLeftOutlined />
                    </div>
                </Col>
                <Col md={10} sm={24} xs={24}>
                    <div className="tree-image">
                        <Image
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/tree/${tree.hinhanh ?? 'default-image.png'}`}
                            alt={tree.tencayxanh ?? 'Không có tên'}
                            preview={{
                                visible: isPreviewVisible,
                                onVisibleChange: (value) => setIsPreviewVisible(value),
                                mask: <span>Xem chi tiết</span>,
                            }}
                            onClick={() => setIsPreviewVisible(true)}
                        />
                    </div>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <div className="tree-info">
                        <h1 className="tree-title">{tree.tencayxanh}</h1>
                        <ul className="tree-attributes">
                            <li><strong>Tên cây xanh:</strong> {tree.tencayxanh}</li>
                            <li><strong>Chiều cao:</strong> {tree.chieucao} cm</li>
                            <li><strong>Năm trồng:</strong> {tree.namtrong}</li>
                            <li><strong>Mô tả:</strong> {tree.mota}</li>
                            <li><strong>Khu vực:</strong> {tree.khuvuc}</li>
                            <li><strong>Hiện trạng:</strong> {tree.hientrang}</li>
                            <li><strong>Số hiệu:</strong> {tree.sohieu}</li>
                            <li><strong>Vĩ độ:</strong> {tree.lat}</li>
                            <li><strong>Kinh độ:</strong> {tree.lng}</li>
                        </ul>
                    </div>
                </Col>
            </Row>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <div className="additional-info">
                        <h2>Vị trí của cây</h2>
                        <MapWrapperDetail
                            tree={tree}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TreeDetail;
