import { Button, Col, Divider, Form, Input, Pagination, Row, Spin, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { useEffect, useState } from "react";
import { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import "./feedback.scss";
import { getFeedbacksAPI } from "@/services/api";

type FieldType = {
    title: string;
};

type IFeedback = {
    _id: string;
    title: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    fullName: string;
    updatedBy?: { name: string };
    content: string;
    createdAt: string;
};

const FeedbackPage = () => {
    const [listFeedbacks, setListFeedbacks] = useState<IFeedback[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortQuery, setSortQuery] = useState<string>("all");
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            let query = `current=${current}&pageSize=${pageSize}`;
            if (sortQuery !== "all") {
                query += `&${sortQuery}`;
            } else {
                query += '&sort=-createdAt'
            }
            const res = await getFeedbacksAPI(query);
            if (res && res.data) {
                setListFeedbacks(res.data.result);
                setTotal(res.data.meta.total);
            }
            setLoading(false);
        };
        fetchFeedbacks();
    }, [current, pageSize, sortQuery]); // Thêm current và pageSize vào dependency

    const handleOnChangePage = (page: number, pageSize: number) => {
        setCurrent(page);
        setPageSize(pageSize);
    };


    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (values?.title) {
            setSortQuery(`title=/${values.title}/i`); // Sử dụng title đúng với API
        } else {
            setSortQuery("all"); // Reset về tất cả nếu không nhập gì
        }
        setCurrent(1); // Reset về trang đầu tiên khi tìm kiếm
    };


    const items: TabsProps["items"] = [
        { key: "all", label: "Tất cả" },
        { key: "PENDING", label: "Chờ xử lý" },
        { key: "IN_PROGRESS", label: "Đang xử lý" },
        { key: "COMPLETED", label: "Đã hoàn thành" },
    ];

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div className="feedbackPage-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
                <Row gutter={[20, 20]}>
                    <Col md={24} xs={24}>
                        <Spin spinning={loading} tip={"Đang tải..."}>
                            <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                                <Form onFinish={onFinish} form={form} layout="inline">
                                    <Form.Item name="title">
                                        <Input placeholder="Tìm kiếm tiêu đề phản ánh" style={{ width: "250px" }} allowClear />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                                    </Form.Item>
                                    {/* <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="button"
                                            onClick={() => {
                                                form.resetFields();
                                                setSortQuery("all"); // Reset về trạng thái "Tất cả"
                                                setCurrent(1); // Reset về trang đầu tiên
                                                document.querySelector(".ant-tabs-tab-active")?.classList.remove("ant-tabs-tab-active"); // Xóa active class tab hiện tại
                                                document.querySelector(".ant-tabs-tab:first-child")?.classList.add("ant-tabs-tab-active"); // Đặt lại active cho tab đầu tiên
                                            }}
                                        >
                                            Tất cả
                                        </Button>
                                    </Form.Item> */}
                                </Form>
                                <Row>
                                    <Tabs
                                        defaultActiveKey="all"
                                        items={items}
                                        onChange={(key) => {
                                            setSortQuery(key === "all" ? "all" : `status=${key}`);
                                            setCurrent(1); // Reset về trang đầu tiên khi lọc
                                        }}
                                        style={{ overflowX: "auto" }}
                                    />

                                </Row>
                                <Row className="customize-row">
                                    {listFeedbacks.map((item) => (
                                        <div
                                            className="feedback-card"
                                            key={item._id}
                                            onClick={() => navigate(`/feedback/${item._id}`)}
                                        >
                                            <div className="feedback-wrapper">
                                                <div className="feedback-header">
                                                    <h3 className="feedback-title">{item.title}</h3>
                                                    <span className="feedback-status">
                                                        {item.status === "PENDING" && <span className="status pending">Chờ xử lý</span>}
                                                        {item.status === "IN_PROGRESS" && <span className="status in-progress">Đang xử lý</span>}
                                                        {item.status === "COMPLETED" && <span className="status completed">Đã hoàn thành</span>}
                                                    </span>
                                                </div>
                                                <div className="feedback-details">
                                                    <p className="feedback-sender">
                                                        <span className="label">Người gửi:</span> {item.fullName}
                                                    </p>
                                                    <p className="feedback-receiver">
                                                        <span className="label">Người nhận phản ánh:</span> {item.updatedBy?.name ?? "Chưa xác định"}
                                                    </p>
                                                    <p className="feedback-content">
                                                        <span className="label">Nội dung:</span> {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                                                    </p>
                                                </div>
                                                <div className="feedback-footer">
                                                    <span className="feedback-date">
                                                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Row>
                                <Divider />
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        current={current}
                                        pageSize={pageSize}
                                        total={total}
                                        showSizeChanger
                                        responsive
                                        onChange={handleOnChangePage}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default FeedbackPage;
