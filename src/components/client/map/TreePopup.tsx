// src/components/Map/TreePopup.tsx
import React from 'react';
import '@/styles/treepopup.scss';

export interface ITreeTable {
    _id: string;
    tencayxanh: string;
    chieucao: number;
    namtrong: number;
    sohieu: string;
    hientrang: string;
}

interface TreePopupProps {
    tree: ITreeTable;
    onDetail: () => void;
    onFeedback: () => void;
}

const TreePopup: React.FC<TreePopupProps> = ({ tree
    , onDetail, onFeedback
}) => {
    return (
        <div className="tree-popup">
            <div className="info">
                <p>
                    <span className="label">Tên cây:</span> {tree.tencayxanh}
                </p>
                <p>
                    <span className="label">Chiều cao:</span> {tree.chieucao} cm
                </p>
                <p>
                    <span className="label">Năm trồng:</span> {tree.namtrong}
                </p>
                <p>
                    <span className="label">Số hiệu:</span> {tree.sohieu}
                </p>
                <p>
                    <span className="label">Tình trạng:</span> {tree.hientrang}
                </p>
            </div>
            <div className="actions">
                <button className="detail"
                    onClick={onDetail}
                >
                    Xem chi tiết
                </button>
                <button className="feedback"
                    onClick={onFeedback}
                >
                    Phản ánh
                </button>
            </div>
        </div>
    );
};

export default TreePopup;
