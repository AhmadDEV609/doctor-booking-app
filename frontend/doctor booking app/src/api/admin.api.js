import api from "./axios";



export const getAllDoctors = async () => {

    const { data } = await api.get(
        "/admin/doctors"
    );

    return data;
};


export const updateDoctorStatus = async (
    doctorId,
    status
) => {

    const { data } = await api.patch(
        `/admin/doctors/${doctorId}/status`,
        {
            status
        }
    );

    return data;
};



export const getAppointments = async () => {

    const { data } = await api.get(
        "/appointments"
    );

    return data;
};


export const updateAppointment = async (
    appointmentId,
    status
) => {

    const { data } = await api.patch(
        `/appointments/${appointmentId}`,
        {
            status
        }
    );

    return data;
};