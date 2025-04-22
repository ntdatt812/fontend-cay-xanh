import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'styles/tree-detail.scss';
import MapWrapperDetail from "../map/MapWrapperDetail";
import ModalPostFeedback from "../feedback/create.feedback";

import { ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";

interface IProps {
    tree: ITreeTable | null;
    loading: boolean;
}

const TreeDetail = ({ tree, loading }: IProps) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const navigate = useNavigate();


    const columns: ProColumns<IHistoryTree>[] = [
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render(dom, entity, index, action, schema) {
                return (
                    dayjs(entity.updatedAt).format('HH:mm:ss  ||  DD/MM/YYYY')
                )
            },
        },
        {
            title: 'Chiều cao',
            dataIndex: 'chieucao',
        },
        {
            title: 'Chu vi',
            dataIndex: 'chuvi',
            sorter: true
        },
        {
            title: 'Đường kính',
            dataIndex: 'duongkinh',
            hideInSearch: true,
        },
        {
            title: 'Nước',
            dataIndex: 'nuoc',
            sorter: true,
        },
        {
            title: 'Phân bón',
            dataIndex: 'phan',
        },
        {
            title: 'Sâu bệnh',
            dataIndex: 'saubenh',
        },
        {
            title: 'Người cập nhật',
            dataIndex: "updatedBy",
            render(dom, entity, index, action, schema) {
                return (
                    <Image
                        width={60}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/tree/${entity.hinhanh}`}
                    />
                )
            },
        },
        {
            title: 'Người cập nhật',
            dataIndex: "updatedBy",
            render(dom, entity, index, action, schema) {
                return (
                    <>{entity.updatedBy.name}</>
                )
            },
        }
    ];

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
                <Col md={1} sm={0} xs={0}>
                    <div className="back-arrow" onClick={handleBack}>
                        <ArrowLeftOutlined />
                    </div>
                </Col>
                <Col md={11} sm={24} xs={24}>
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
                        {/* <h1 className="tree-title">{tree.tencayxanh}</h1> */}
                        <h1 className="tree-title">Chi tiết thông tin cây xanh</h1>
                        <ul className="tree-attributes">
                            <li><strong>Tên cây xanh:</strong> {tree.tencayxanh}</li>
                            <li><strong>Chiều cao:</strong> {tree.chieucao} cm</li>
                            <li><strong>Năm trồng:</strong> {tree.namtrong}</li>
                            <li><strong>Mô tả:</strong> {tree.mota}</li>
                            <li><strong>Khu vực:</strong> {tree.khuvuc}</li>
                            <li><strong>Hiện trạng:</strong> {tree.hientrang}</li>
                            <li><strong>Đường kính:</strong> {tree.duongkinh} cm</li>
                            <li><strong>Chu vi:</strong> {tree.chuvi} cm</li>
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
                        <div className="title-additional">
                            <h2>Lịch sử cập nhật và chăm sóc cây</h2>
                        </div>
                        <div>
                            <ProTable<IHistoryTree>
                                columns={columns}
                                dataSource={Array.isArray(tree.history) ? tree.history : []}
                                rowKey="_id"
                                search={false}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <div className="additional-info">
                        <div className="title-additional">
                            <h2>Vị trí của cây</h2>
                            <Button
                                className="button-feedback"
                                onClick={() => {
                                    setOpenModalCreate(true)
                                }}
                            >Gửi phản ánh</Button>
                            <ModalPostFeedback
                                setOpenModalCreate={setOpenModalCreate}
                                openModalCreate={openModalCreate}
                                treeFeedback={tree}
                            />
                        </div>
                        <br />
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
