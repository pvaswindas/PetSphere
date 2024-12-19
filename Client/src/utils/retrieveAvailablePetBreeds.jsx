import axiosInstance from "../axios/axiosinstance"
import { setPetBreed } from "../redux/slices/PetSlice"


export const retrieveAvailablePetBreeds = async (dispatch) => {
    try {
        const response = await axiosInstance.get('pet/breed/')

        if (response.status === 204) {
            return []
        } else {
            dispatch(setPetBreed({ petBreeds: response.data }))
            return response.data
        }
    } catch (error) {
        console.error("Failed to fetch pet types:", error)
        return []
    }
}
