import axios from 'services/axios.customize'

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
}

export const registerAPI = (name: string, email: string, password: string) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend)
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend)
}

export const getUserAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (name: string, email: string,
    password: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, email, password, role })
}

export const updateUserAPI = (_id: string, name: string, email: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        { _id, name, email, role })
}

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/users/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getTreesAPI = (query: string) => {
    const urlBackend = `/api/v1/trees?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ITreeTable>>>(urlBackend)
}
export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', fileImg);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folder
        },
    });
}

export const createTreeAPI = (
    tencayxanh: string,
    chieucao: number,
    hientrang: string,
    hinhanh: string,
    khuvuc: string,
    lat: string,
    lng: string,
    mota: string,
    namtrong: number,
    sohieu: string,
    chuvi: number) => {
    const urlBackend = "/api/v1/trees";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        {
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu, chuvi
        })
}

export const updateTreeAPI = (
    _id: string,
    tencayxanh: string,
    chieucao: number,
    hientrang: string,
    hinhanh: string,
    khuvuc: string,
    lat: string,
    lng: string,
    mota: string,
    namtrong: number,
    sohieu: string,
    chuvi: number,
    nuoc: string,
    phan: string,
    saubenh: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        {
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu, chuvi, nuoc, phan, saubenh
        })
}

export const deleteTreeAPI = (_id: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getAllTreesWithoutPaginateAPI = (filters: { khuvuc: string[]; duongkinh: string[] }) => {
    const urlBackend = `/api/v1/trees/all`;

    return axios.get<IBackendRes<ITreeTable[]>>(urlBackend, {
        params: filters,
    });
};

export const getTreeByIdAPI = (_id: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.get<IBackendRes<ITreeTable>>(urlBackend)
}

export const getFeedbacksAPI = (query: string) => {
    const urlBackend = `/api/v1/feedbacks?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IFeedback>>>(urlBackend)
}

export const updateStatusFeedbackAPI = (_id: string, status: string, report: string) => {
    const urlBackend = `/api/v1/feedbacks/${_id}`;
    return axios.patch<IBackendRes<IFeedback>>(urlBackend, { status, report })
}

export const createFeedbackAPI = (fullName: string, phoneNumber: string, emailFeedback: string, title: string,
    content: string, treeId: string, hinhanh: string) => {
    const urlBackend = "/api/v1/feedbacks";
    return axios.post<IBackendRes<IFeedback>>(urlBackend,
        {
            fullName, phoneNumber, emailFeedback, title, content, treeId, hinhanh
        })
}

export const getFeedbackByIdAPI = (_id: string) => {
    const urlBackend = `/api/v1/feedbacks/${_id}`;
    return axios.get<IBackendRes<IFeedback>>(urlBackend)
}

export const deleteFeedbackAPI = (_id: string) => {
    const urlBackend = `/api/v1/feedbacks/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getTasksAPI = (query: string) => {
    const urlBackend = `/api/v1/tasks?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ITaskTable>>>(urlBackend)
}

export const createTaskAPI = (title: string, description: string, assignedTo: string) => {
    const urlBackend = "/api/v1/tasks";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { title, description, assignedTo })
}

export const getEmployeeTasksAPI = async (userId: string) => {
    const urlBackend = `api/v1/tasks/user/${userId}`;

    return axios.get(urlBackend);
};

export const UpdateEmployTaskAPI = (_id: string, status: string, report: string, imageUrl: string) => {
    const urlBackend = `/api/v1/tasks/${_id}`;
    return axios.patch<IBackendRes<ITaskTable>>(urlBackend, { status, report, imageUrl })
}

export const deleteTaskAPI = (_id: string) => {
    const urlBackend = `/api/v1/tasks/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getDashboardAPI = () => {
    const urlBackend = `/api/v1/trees/dashboard`;
    return axios.post<IBackendRes<IDashboard>>(urlBackend)
}