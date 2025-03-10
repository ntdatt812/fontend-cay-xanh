import FeedbackDetail from "@/components/admin/feedback/detail.feedback";
import { getFeedbacksAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App } from "antd";
import { useRef, useState } from "react";

const ManageFeedbackPage = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
    const [currentDataTable, setCurrentDataTable] = useState<IFeedback[]>([]);
    const [dataInit, setDataInit] = useState<IFeedback | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    // const { message, notification } = App.useApp();

    const columns: ProColumns<IFeedback>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record._id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        { title: 'Trạng thái', dataIndex: 'status', sorter: true },
        { title: 'Tiêu đề', dataIndex: 'title', sorter: true },
        { title: 'Người phản ánh', dataIndex: 'fullName', hideInSearch: true },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', sorter: true },
        { title: 'Ngày gửi', dataIndex: 'createdAt', valueType: "date", sorter: true },
    ];

    const reloadTable = () => {
        actionRef?.current?.reload();
    }

    return (
        <>
            <ProTable<IFeedback>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.tencayxanh) query += `&tencayxanh=/${params.tencayxanh}/i`;
                    if (params.namtrong) query += `&namtrong=${params.namtrong}`;
                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                    }

                    // Xây dựng query sort hợp lệ
                    const sortQuery = Object.entries(sort)
                        .map(([key, value]) => (value === 'ascend' ? key : `-${key}`))
                        .join(',');
                    if (sortQuery) query += `&sort=${sortQuery}`;

                    query += "&populate=treeId&fields=treeId._id,treeId.tencayxanh,treeId.khuvuc,treeId.lat,treeId.lng";
                    const res = await getFeedbacksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data.result || []);
                    }
                    return {
                        data: res.data?.result,
                        success: true,
                        total: res.data?.meta.total,
                    };
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} hàng`,
                }}
                headerTitle="Table Feedback"
            />
            <FeedbackDetail
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </>
    );
};

export default ManageFeedbackPage;
