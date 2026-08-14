import client from "./client";

export const authApi = {
    register : (data) => client.post("/users/register", data) ,

    login : (data) => client.post("/users/login",data) ,

    logout : () => client.post("/users/logout") ,

    currentUser : () => client.get("/users/current-user") ,

    refresh : () => client.post("/users/refresh-token") ,

    updateProfile : (data) => client.patch("/users/updateProfile" ,data) ,

    changePassword : (data) => client.patch("/users/updatePassword" ,data) ,

    updateProfile: (data) =>
        client.patch("/users/update-profile", data),

    updateAvatar: (formData) =>
        client.patch(
            "/users/update-avatar",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
    ),
} ;