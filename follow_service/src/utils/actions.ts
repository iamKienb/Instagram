import axios from 'axios'

export const getUser = async(userId:number) =>{
    try {
        const response = await axios.get(`http://localhost:8001/getProfile/${userId}`,{
            method: "GET" 
        });
        return {
            userId: response.data.id,
            username: response.data.username,
            firstName: response.data.firstName,
            profilePicture: response.data.profilePicture,
            lastName: response.data.lastName
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}