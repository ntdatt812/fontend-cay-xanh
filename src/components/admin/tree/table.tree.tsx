import { useRef, useState } from 'react';
import { Popconfirm, Button, App } from 'antd';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { dateRangeValidate } from '@/services/helper';
import DetailTree from './detail.tree';
import { deleteTreeAPI, getTreesAPI } from '@/services/api';
import CreateTree from './create.tree';
import UpdateTree from './update.tree';



type TSearch = {
    tencayxanh: string;
    namtrong: number;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
}
const TableTree = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<ITreeTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<ITreeTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<ITreeTable | null>(null);

    const [isDeleteTree, setisDeleteTree] = useState<boolean>(false);
    const { message, notification } = App.useApp();


    const handleDeleteTree = async (_id: string) => {
        setisDeleteTree(true)
        const res = await deleteTreeAPI(_id);
        if (res && res.data) {
            message.success('Xóa cây thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setisDeleteTree(false)
    }

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<ITreeTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(entity);
                        setOpenViewDetail(true);
                    }}>{entity._id}</a>
                )
            },

        },
        {
            title: 'Tên cây',
            dataIndex: 'tencayxanh',
            sorter: true
        },
        {
            title: 'Khu vực',
            dataIndex: 'khuvuc',
            sorter: true
        },
        {
            title: 'Số hiệu',
            dataIndex: 'sohieu',
            hideInSearch: true,
        },
        {
            title: 'Năm trồng',
            dataIndex: 'namtrong',
            sorter: true,
        },
        {
            title: 'Ngày thêm',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: "date",
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: 'date',
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 5px" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(entity);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa cây xanh"
                            description={
                                <>
                                    Bạn có chắc chắn muốn xóa cây <b>{entity.tencayxanh}</b> tại khu vực <b>{entity.khuvuc}</b> không?
                                </>
                            }
                            onConfirm={() => handleDeleteTree(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteTree }}
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                    </>

                )
            }
        }
    ];

    return (
        <>
            <ProTable<ITreeTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.tencayxanh) {
                            query += `&tencayxanh=/${params.tencayxanh}/i`
                        }
                        if (params.namtrong) {
                            query += `&namtrong=${params.namtrong}`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }

                    }

                    let sortQuery = '';

                    // Ưu tiên sắp xếp theo thứ tự: namtrong -> tencayxanh -> createdAt
                    if (sort) {
                        if (sort.namtrong) {
                            sortQuery = `${sort.namtrong === 'ascend' ? 'namtrong' : '-namtrong'}`;
                        }
                        if (sort.khuvuc) {
                            sortQuery = `${sort.khuvuc === 'ascend' ? 'khuvuc' : '-khuvuc'}`;
                        }
                        if (sort.tencayxanh) {
                            sortQuery = `${sort.tencayxanh === 'ascend' ? 'tencayxanh' : '-tencayxanh'}`;
                        }
                        if (sort.createdAt) {
                            sortQuery = `${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                        }
                    }

                    // Mặc định theo ngày thêm mới nhất nếu không có tiêu chí sắp xếp nào
                    if (!sortQuery) {
                        sortQuery = '-createdAt';
                    }

                    query += `&sort=${sortQuery}`;

                    const res = await getTreesAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? [])
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
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} hàng</div>) }
                    }
                }

                headerTitle="Table tree"
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
            <DetailTree
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateTree
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateTree
                openModalUpdate={openModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
            />
        </>
    )
}


export default TableTree;