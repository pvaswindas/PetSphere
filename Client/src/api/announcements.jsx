import axiosInstance from "../axios/axiosinstance"

export const getAnnouncements = async (path=null, search=null) => {
    try {
        if (!path) {
            path = 'announcements/updates/'
        } else {
            path = path.split("/api/")[1]
        }
        if (search) {
            path += `?search=${search}`
        }
        const response = await axiosInstance.get(path)
        return response.data
    } catch (error) {
        throw error
    }
}


export const postAnnouncement = async (data=null) => {
    try {
        if (!data) return
        const response = await axiosInstance.post('announcements/updates/', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateAnnouncement = async (announcement_id, updatedData) => {
    try {
        if (!announcement_id || !updatedData) return;

        let formData = new FormData();
        formData.append("title", updatedData.title);
        formData.append("content", updatedData.content);
        console.log(updatedData)
        if (updatedData.icon instanceof File) {
            formData.append("icon", updatedData.icon);
        }

        const response = await axiosInstance.put(
            `announcements/updates/${announcement_id}/`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAnnouncement = async (announcement_id=null) => {
    try {
        if (!announcement_id) return
        const response = await axiosInstance.delete(`announcements/updates/${announcement_id}/`)
        return response.data
    } catch (error) {
        throw error
    }
}