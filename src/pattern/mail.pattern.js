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
    appointmentTime,
    userEmail
  ) => {
    return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #496ea2;">Appointment Confirmation</h2>
                <p>Dear <strong>${userEmail}</strong>,</p>
                <p>Your appointment has been successfully confirmed. Here are the details:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Appointment Number:</strong> ${appointmentNumber}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
                    <li><strong>Specialty:</strong> ${specialty}</li>
                    <li><strong>Date:</strong> ${appointmentDate}</li>
                    <li><strong>Time:</strong> ${appointmentTime}</li>
                </ul>
                <p>Please arrive 15 minutes early and bring any necessary documents.</p>
                <p style="color: #496ea2;">Best regards,<br>Medical Booking App Team</p>
            </div>
        `;
  },
};

export default mailPattern;
