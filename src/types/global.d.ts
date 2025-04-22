export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string,
            name: string,
            role: string,
            id: string,
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        name: string;
    }

    interface IUser {
        email: string,
        name: string,
        role: string,
        avatar: string,
        _id: string,
    }

    interface IFetchAccount {
        user: IUser
    }

    interface IUserTable {
        _id: string,
        name: string,
        email: string,
        avatar: string;
        role: string,
        createdAt: Date,
        updatedAt: Date,
    }

    interface ITreeTable {
        _id: string;
        tencayxanh: string;
        khuvuc: string,
        lat: string;
        lng: string;
        chieucao: number;
        namtrong: number;
        mota: string;
        hinhanh: string;
        sohieu: string,
        nuoc: string;
        phan: string;
        saubenh: string,
        hientrang: string,
        duongkinh: number,
        chuvi: number,
        history: IHistoryTree,
        createdBy: IUser;
        createdAt: string;
        updatedAt: string;
    }

    interface ITree {
        _id: string,
        tencayxanh: string,
        khuvuc: string,
        sohieu: string
        lat: string,
        lng: string
    }

    interface IUpdateAt {
        _id: string;
        email: string;
        name: string;
    }

    interface IHistory {
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        updatedAt: string; // ISO Date String
        updatedBy: IUser;
    }

    interface IFeedback {
        _id: string;
        fullName: string;
        phoneNumber: string;
        report: string;
        emailFeedback: string;
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        title: string;
        content: string;
        treeId: ITree;
        userId: string;
        hinhanh: string;
        history: IHistory[];
        createdBy: IUser;
        createdAt: string;
        updatedAt: string;
        updatedBy: IUpdateAt;
    }

    interface ITaskTable {
        _id: string;
        title: string;
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        imageUrl: string;
        report: string;
        description: string;
        assignedTo: IUpdateAt;
        createdBy: IUser;
        createdAt: string;
        updatedAt: string;
        updatedBy: IUser;
    }

    interface treeType {
        cayLoai1: number,
        cayLoai2: number,
        cayLoai3: number
    }

    interface IDashboard {
        totalTrees: number,
        treeDiameter: treeType,
        uniqueRegions: number,
        newTrees: number
    }
    interface IHistoryTree {
        chieucao: number;
        duongkinh: number;
        chuvi: number;
        hinhanh: string;
        nuoc: string | null;
        phan: string | null;
        saubenh: string | null;
        updatedAt: string;
        updatedBy: {
            _id: string;
            email: string;
            name: string;
        };
    }

}
