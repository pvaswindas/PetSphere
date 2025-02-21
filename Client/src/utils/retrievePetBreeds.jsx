import axiosInstance from "../axios/axiosinstance"


export const retrievePetBreeds = async (pet_type_id) => {
    try {
        const response = await axiosInstance.get(`pet/breeds/${pet_type_id}`)

        if (response.status === 204) {
            return []
        } else {
            return response.data
        }
    } catch (error) {
        return []
    }
}
