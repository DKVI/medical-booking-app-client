const mailPattern = {
  createAccount: (username, verificationLink) => {
    return `
            Hello ${username},

            Your account has been successfully created! 
            Please visit the following link to verify your account:

            ${verificationLink}

            Best regards,
            Medical Booking App Team
        `;
  },
  confirmAppointment: (
    appointmentNumber,
    address,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime
  ) => {
    return `
            Dear Patient,

            Your appointment has been successfully confirmed. Here are the details:

            Appointment Number: ${appointmentNumber}
            Address: ${address}
            Doctor: Dr. ${doctorName}
            Specialty: ${specialty}
            Date: ${appointmentDate}
            Time: ${appointmentTime}

            Please arrive 15 minutes early and bring any necessary documents.

            Best regards,
            Medical Booking App Team
        `;
  },
};

export default mailPattern;
