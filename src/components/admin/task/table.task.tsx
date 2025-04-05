import { deleteUserAPI, getTasksAPI, getUserAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

import dayjs from 'dayjs';
import DetailTask from './detail.task';
import CreateTask from './create.task';
import AccessControl from '@/components/auth/role.guard';


type TSearch = {
    title: string;
    createdAt: string;
    createdAtRange: string;
}


const TableTask = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<ITaskTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<ITaskTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message, notification } = App.useApp()


    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true)
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteUser(false)
    }

    const columns: ProColumns<ITaskTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id', // tên của thuộc tính
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            console.log("check entity: ", entity)
                            setOpenViewDetail(true);
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'description'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hidden: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: "date",
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {dayjs(entity.createdAt).format("DD-MM-YYYY")}
                    </>
                )
            },
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            hideInSearch: true,
            valueType: "date",
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {dayjs(entity.updatedAt).format("DD-MM-YYYY")}
                    </>
                )
            },
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <AccessControl allowedRoles={["ADMIN"]}>
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa user"}
                                description={`Bạn có chắc chắn muốn xóa công việc không ?`}
                                onConfirm={() => handleDeleteUser(entity._id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                                okButtonProps={{ loading: isDeleteUser }}
                            >
                                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                    <DeleteTwoTone
                                        twoToneColor="#ff4d4f"
                                        style={{ cursor: "pointer" }}
                                    />
                                </span>
                            </Popconfirm>
                        </AccessControl>

                    </>
                )
            }
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<ITaskTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    //lấy user, filter theo điều kiện
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.title) {
                            query += `&title=/${params.title}/i`
                        }
                        // if (params.name) {
                        //     query += `&name=/${params.name}/i`
                        // }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }
                    //default
                    query += `&sort=-createdAt`;

                    query += "&populate=assignedTo&fields=assignedTo._id,assignedTo.email,assignedTo.name";

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }


                    const res = await getTasksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                dateFormatter="string"
                headerTitle="Công việc"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Thêm mới
                    </Button>

                ]}
            />
            <DetailTask
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
            />
            <CreateTask
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableTask;