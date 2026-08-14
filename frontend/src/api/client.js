import axios from "axios"

console.log(import.meta.env.VITE_API_URL);
const client = axios.create({
    baseURL : import.meta.env.VITE_API_URL ,
    withCredentials : true ,
    timeout : 30000
})

// client.interceptors.response.use(
//     (response) => response,
//     async (error) => {

//         const originalRequest = error.config;

//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry
//         ) {

//             originalRequest._retry = true;

//             try {
//                 await client.post("/users/refresh-token")
//                 return client(originalRequest) ;
//             } catch (err) {
//                 return Promise.reject(err)
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default client ;