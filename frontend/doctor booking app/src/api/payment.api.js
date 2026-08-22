import api from "./axios";



export const paymentApi = async (paymentData) => {
    const { data } = await api.post(
        "/payment",
        paymentData
    )


    return data
}