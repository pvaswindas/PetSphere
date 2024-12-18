import axiosInstance from "../axios/axiosinstance"
import { setPetType } from "../redux/slices/PetSlice"

export const retrieveAvailablePetTypes = async (dispatch) => {
    try {
        const response = await axiosInstance.get('pet/type/')

        if (response.status === 204) {
            return []
        } else {
            dispatch(setPetType({ petTypes: response.data }))
            return response.data
        }
    } catch (error) {
        console.error("Failed to fetch pet types:", error)
        return []
    }
}
