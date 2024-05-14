import axios from 'axios'

export const getUser = async(userId:number) =>{
    try {
        const response = await axios.get(`http://localhost:8001/getProfile/${userId}`,{
            method: "GET" 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}