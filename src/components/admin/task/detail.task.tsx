import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Drawer, GetProp, Image, Upload, UploadFile, UploadProps } from "antd";
import { Divider } from "antd/lib";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: ITaskTable | null;
    setDataViewDetail: (v: ITaskTable | null) => void;

}

const DetailTask = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        if (dataViewDetail) {
            let imgTask: any = {};
            if (dataViewDetail.imageUrl) {
                imgTask = {
                    uid: uuidv4(),
                    name: dataViewDetail.imageUrl,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/task/${dataViewDetail.imageUrl}`,
                }
            }
            setFileList([imgTask])
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
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin công việc"
                    bordered
                    column={2}
                >
                    <Descriptions.Item span={2} label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Tiêu đề">{dataViewDetail?.title}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Nội dung">{dataViewDetail?.description}</Descriptions.Item>
                    {/* <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Ngày tạo công việc">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Descriptions
                    title="Báo cáo của nhân viên"
                    bordered
                    column={2}
                >
                    <Descriptions.Item span={2} label="Nội dung báo cáo">{dataViewDetail?.report ?? "Chưa báo cáo"}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Người thực hiện">{dataViewDetail?.assignedTo.name}</Descriptions.Item>
                    <Descriptions.Item label="Ngày báo cáo">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="center" >Hình ảnh báo cáo</Divider>
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
export default DetailTask;