import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  styled,
} from "@mui/material";
import { BiSupport, BiPhone, BiMap, BiMessageDetail } from "react-icons/bi";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  },
}));

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fullName: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const newErrors = { ...errors };
    switch (name) {
      case "email":
        newErrors.email = !validateEmail(value) ? "Invalid email format" : "";
        break;
      case "phone":
        newErrors.phone = !validatePhone(value) ? "Invalid phone number" : "";
        break;
      default:
        newErrors[name] = !value ? `${name} is required` : "";
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log("Form submitted:", formData);
  };

  const contactCards = [
    {
      title: "Sales",
      icon: <BiMessageDetail size={40} />,
      description: "Get in touch with our sales team",
      action: "Chat Now",
    },
    {
      title: "Support",
      icon: <BiSupport size={40} />,
      description: "24/7 customer support available",
      action: "Get Help",
    },
    {
      title: "Visit",
      icon: <BiMap size={40} />,
      description: "Find our office locations",
      action: "View Map",
    },
    {
      title: "Call",
      icon: <BiPhone size={40} />,
      description: "Call us for immediate assistance",
      action: "Call Now",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      className="text-[var(--base-color)]"
    >
      <h3 className="lg:m-[20px] text-[48px] font-bold">CONTACT US</h3>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 8 }}
      >
        We'd love to hear from you. Please fill out this form or reach out using
        one of the options below.
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
              autoComplete="name"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              autoComplete="tel"
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                mt: 2,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {contactCards.map((card, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2, color: "primary.main" }}>{card.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      {card.action}
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactForm;
