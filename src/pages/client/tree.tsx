import TreeDetail from "@/components/client/tree/tree.detail";
import { getTreeByIdAPI } from "@/services/api";
import { App } from "antd";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TreePage = () => {
    const { id } = useParams();
    const [tree, setTree] = useState<ITreeDetail | null>(null);
    const { notification } = App.useApp()
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            const fetchTreeById = async () => {
                console.log("tree id = ", id)
                const res = await getTreeByIdAPI(id);
                if (res && res.data) {
                    console.log(">>> check tree", res)

                    setTree(res.data)
                    setLoading(false)
                } else {
                    notification.error({
                        message: "Đã có lỗi xảy ra!",
                        description: res.message
                    })
                }
            }
            fetchTreeById()
        }
    }, [id])

    return (
        <div>
            <TreeDetail
                tree={tree}
                loading={loading}
            />
        </div>
    )
}
export default TreePage