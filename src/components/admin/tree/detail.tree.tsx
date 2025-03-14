
import { Descriptions, Divider, Drawer, Image, Upload } from "antd";
import { useEffect, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { v4 as uuidv4 } from 'uuid';
interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: ITreeTable | null;
    setDataViewDetail: (v: ITreeTable | null) => void;
}


const DetailTree = (props: IProps) => {
    const {
        openViewDetail, setOpenViewDetail,
        dataViewDetail, setDataViewDetail
    } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);


    useEffect(() => {
        if (dataViewDetail) {
            let imgTree: any = {};
            if (dataViewDetail.hinhanh) {
                imgTree = {
                    uid: uuidv4(),
                    name: dataViewDetail.hinhanh,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/tree/${dataViewDetail.hinhanh}`,
                }
            }
            setFileList([imgTree])
        }
    }, [dataViewDetail])

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"80vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin Book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên cây xanh">{dataViewDetail?.tencayxanh}</Descriptions.Item>
                    <Descriptions.Item label="Chiều cao">{dataViewDetail?.chieucao} cm</Descriptions.Item>
                    <Descriptions.Item label="Năm trồng">{dataViewDetail?.namtrong}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Mô tả">{dataViewDetail?.mota}</Descriptions.Item>
                    <Descriptions.Item label="Khu vực">{dataViewDetail?.khuvuc}</Descriptions.Item>
                    <Descriptions.Item label="Số hiệu">{dataViewDetail?.sohieu}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Tình trạng">{dataViewDetail?.hientrang}</Descriptions.Item>
                    <Descriptions.Item label="Đường kính">{dataViewDetail?.duongkinh} cm</Descriptions.Item>
                    <Descriptions.Item label="Chu vi">{dataViewDetail?.chuvi} cm</Descriptions.Item>
                    <Descriptions.Item label="Kinh độ">{dataViewDetail?.lat}</Descriptions.Item>
                    <Descriptions.Item label="Vĩ độ">{dataViewDetail?.lng}</Descriptions.Item>
                    {/* <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category} />
                    </Descriptions.Item> */}

                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" > Ảnh cây xanh </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}

                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailTree;