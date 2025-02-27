import axiosInstance from "../axios/axiosinstance"
import { setPetBreed } from "../redux/slices/PetSlice"


export const retrieveAvailablePetBreeds = async (dispatch, pet_type=null) => {
    try {
        let path = 'pet/breeds/'
        if (pet_type){
            path = `pet/breeds/${pet_type}`
        }
        const response = await axiosInstance.get(path)

        if (response.status === 204) {
            return []
        } else {
            dispatch(setPetBreed({ petBreeds: response.data }))
            return response.data
        }
    } catch (error) {
        return []
    }
}
