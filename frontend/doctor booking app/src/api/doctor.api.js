import api from "./axios";







// ================= GET APPROVED DOCTORS =================

export const getDoctors = async (page = 1, speciality = "") => {

    const { data } = await api.get("/filter", {

        params: {
            page,
            limit: 6,
            speciality
        }

    });

    return data;

};




// ================= GET USER =================

export const getUser = async () => {

    const { data } = await api.get(
        "/users/getUser"
    );

    return data;

};


// ================= GET DOCTOR PROFILE =================

export const getDoctorProfile = async () => {

    const { data } = await api.get(
        "/users/myDoctorProfile"
    );

    return data;

};


// ================= UPDATE DOCTOR PROFILE =================

export const updateDoctorProfile = async (doctorData) => {

    const { data } = await api.patch(
        "/users/doctorupdateProfile",
        doctorData
    );

    return data;

};


// ================= UPLOAD DEGREE =================

export const uploadDegreeImage = async (file) => {

    const formData = new FormData();

    formData.append("degreeImage", file);

    const { data } = await api.post(
        "/users/uploaddocumentImage",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return data;

};









export const getDoctorById = async (doctorId) => {

    const { data } = await api.get(
        `/filter/${doctorId}`
    );

    return data;
};



export const createAppointment = async (
    doctorId,
    appointmentData
) => {

    const { data } = await api.post(
        `/appointments/${doctorId}`,
        appointmentData
    );

    return data;
};



