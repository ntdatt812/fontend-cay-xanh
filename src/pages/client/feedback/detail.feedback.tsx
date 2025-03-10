import { getFeedbackByIdAPI } from "@/services/api";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { App, Col, Image, Row, Spin, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './detail.feedback.scss'
const DetailFeedback = () => {
    const { id } = useParams();
    const { notification } = App.useApp();
    const [dataDetail, setDataDetail] = useState<IFeedback | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchFeedbackDetail = async () => {
                setLoadingDetail(true);
                const res = await getFeedbackByIdAPI(id);
                if (res.data) {
                    setDataDetail(res.data);
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra!",
                        description: res.message,
                    });
                }
                setLoadingDetail(false);
            };
            fetchFeedbackDetail();
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingDetail) {
        return (
            <div className="feedback-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (!dataDetail) {
        return <div className="feedback-error">Không tìm thấy thông tin phản ánh.</div>;
    }

    return (
        <div className="feedback-container">
            <Card className="feedback-card">
                {/* Nút quay lại */}
                <div className="back-button" onClick={handleBack}>
                    <ArrowLeftOutlined />
                </div>
                <Row gutter={[20, 20]} align="middle">
                    {/* Ảnh phản ánh */}
                    <Col md={8} sm={24} xs={24} className="feedback-image">
                        <Image
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/feedback/${dataDetail?.hinhanh ?? "default.png"}`}
                            alt={dataDetail?.title ?? "Không có tên"}
                            preview={{ mask: <span>Xem chi tiết</span> }}
                        />
                    </Col>

                    {/* Nội dung phản ánh */}
                    <Col md={16} sm={24} xs={24}>
                        <div className="feedback-info">
                            <h1 className="feedback-title">{dataDetail.title}</h1>
                            <ul className="feedback-attributes">
                                <li><strong>Người phản ánh:</strong> {dataDetail.fullName}</li>
                                <li><strong>Email:</strong> {dataDetail.emailFeedback}</li>
                                <li><strong>Số điện thoại:</strong> {dataDetail.phoneNumber}</li>
                                <li><strong>Nội dung:</strong> <p>{dataDetail.content}</p></li>
                                <li>
                                    <strong>Ngày gửi:</strong>
                                    {new Date(dataDetail.createdAt).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                    })} -
                                    {new Date(dataDetail.createdAt).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </li>
                                <li><strong>Người tiếp nhận:</strong> {dataDetail?.updatedBy?.name ?? "Chưa cập nhật"}</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DetailFeedback;
