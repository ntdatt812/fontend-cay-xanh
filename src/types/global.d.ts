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
        id: string,
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
        hientrang: string,
        duongkinh: number,
        chuvi: number,
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
}
