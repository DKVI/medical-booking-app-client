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
  // Nội dung mail gửi cho bác sĩ khi có lịch hẹn mới
  notifyDoctorAppointment: (
    appointmentNumber,
    patientName,
    address,
    specialty,
    appointmentDate,
    appointmentTime,
    doctorEmail
  ) => {
    return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #496ea2;">New Appointment Notification</h2>
                <p>Dear <strong>Dr. ${doctorEmail}</strong>,</p>
                <p>You have a new appointment scheduled. Here are the details:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Appointment Number:</strong> ${appointmentNumber}</li>
                    <li><strong>Patient Name:</strong> ${patientName}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Specialty:</strong> ${specialty}</li>
                    <li><strong>Date:</strong> ${appointmentDate}</li>
                    <li><strong>Time:</strong> ${appointmentTime}</li>
                </ul>
                <p>Please check your dashboard for more details.</p>
                <p style="color: #496ea2;">Best regards,<br>Medical Booking App Team</p>
            </div>
        `;
  },
  resetPassword: (username, email, newPassword) => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #496ea2;">Password Reset Notification</h2>
        <p>Dear <strong>${username}</strong> (${email}),</p>
        <p>Your password has been reset. Here is your new temporary password:</p>
        <div style="background: #f3f8ff; color: #2563eb; font-weight: bold; font-size: 18px; padding: 12px 20px; border-radius: 8px; display: inline-block; margin: 12px 0;">
          ${newPassword}
        </div>
        <p>
          <strong>Important:</strong> For your security, please log in with this password and change it immediately after logging in.
        </p>
        <p style="color: #496ea2;">Best regards,<br>Medical Booking App Team</p>
      </div>
    `;
  },
};

export default mailPattern;
