import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faHospital,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "../components/ContactForm";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

function Home() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLogin, setIsLogin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Intersection Observer for each section
  const { ref: bannerRef, inView: bannerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: servicesRef, inView: servicesInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Intersection Observer for Contact Us Section

  const { ref: contactRef, inView: contactInView } = useInView({
    triggerOnce: true, // Chỉ kích hoạt một lần
    threshold: 0.2, // Kích hoạt khi 20% của phần tử vào viewport
  });

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Banner Section */}
      <motion.section
        ref={bannerRef}
        className="banner"
        style={{
          backgroundImage: `url('/banner.png')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
        }}
        variants={sectionVariants}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        transition={{ duration: 1 }}
      >
        <div className="banner-text w-full h-full lg:w-1/2 flex align-middle">
          <div className="inline-block m-auto">
            <h2
              className="text-[30px] lg:text-[60px]"
              style={{
                fontWeight: "bold!important",
                filter: "drop-shadow(0px 4px 6px #cccc)",
              }}
            >
              Simplifying Healthcare Access
            </h2>
            <p
              className="text-[16px] lg:text-[20px]"
              style={{
                filter: "drop-shadow(0px 4px 6px #cccc)",
              }}
            >
              Connecting You to Care - Anytime - Anywhere.
            </p>
            <div className="pt-[30px]">
              {isLogin ? (
                <motion.a
                  type="button"
                  href="#services"
                  className="bg-white text-[20px] px-[15px] py-[10px] border cursor-pointer transition-all ease-in-out duration-700 rounded-[0px] hover:rounded-[20px]"
                  style={{
                    color: "var(--base-color)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Learn More
                </motion.a>
              ) : (
                <motion.a
                  type="button"
                  href="#services"
                  className="bg-white text-[20px] px-[15px] py-[10px] border cursor-pointer transition-all ease-in-out duration-700 rounded-[0px] hover:rounded-[20px]"
                  style={{
                    color: "var(--base-color)",
                  }}
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Go To Dashboard
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        ref={servicesRef}
        className="lg:p-[80px]"
        id="services"
        style={{
          height: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
        variants={sectionVariants}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
        transition={{ duration: 1 }}
      >
        <div className="service-container w-full">
          <h3
            className="lg:m-[20px] text-center text-[var(--base-color)]"
            style={{ fontWeight: "bold" }}
          >
            OUR SERVICES
          </h3>
          <motion.div
            className="flex pt-[80px] pb-[80px] justify-center"
            style={{ gap: "80px" }}
          >
            <motion.div
              className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faCalendarDays} />
              <h4 className="text-[18px]">Online Appointment Booking</h4>
              <p className="text-[12px] mt-[12px]">
                Find doctors, browse specialties, and book appointments quickly
                and easily—anytime, anywhere.
              </p>
            </motion.div>
            <motion.div
              className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faHospital} />
              <h4 className="text-[18px]">Trusted Hospital & Clinic Network</h4>
              <p className="text-[12px] mt-[12px]">
                Access a wide network of verified healthcare providers for
                reliable and professional medical care.
              </p>
            </motion.div>
            <motion.div
              className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faNotesMedical} />
              <h4 className="text-[18px]">
                Health Records & Appointment Reminders
              </h4>
              <p className="text-[12px] mt-[12px]">
                Keep track of your medical history and get automatic reminders
                for upcoming visits or follow-ups.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        ref={aboutRef}
        className="lg:p-[80px] bg-[var(--base-color)]"
        id="about"
        style={{
          height: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
        variants={sectionVariants}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        transition={{ duration: 1 }}
      >
        <div className="about-container w-full">
          <h3
            className="lg:m-[20px] text-center text-white"
            style={{ fontWeight: "bold" }}
          >
            ABOUT US
          </h3>
          <div className="flex h-[calc(100%-100px)]">
            {/* Text Content */}
            <div className="w-1/2 lg:px-[40px] text-left flex">
              <div className="m-auto">
                <p className="text-[18px]" style={{ lineHeight: "1.5" }}>
                  <span className="font-bold">Medical Booking</span> is a
                  pioneering digital health platform on a mission to make
                  healthcare more accessible, transparent, and efficient for
                  everyone. We connect patients with trusted healthcare
                  providers, enabling seamless appointment booking and access to
                  medical records.
                </p>
                <p
                  className="text-[18px] mt-[20px]"
                  style={{ lineHeight: "1.5" }}
                >
                  Our platform is designed to empower patients with the tools
                  they need to take control of their health journey, while also
                  supporting healthcare providers with efficient practice
                  management solutions.
                </p>
              </div>
            </div>

            {/* Image Content */}
            <div
              className="w-1/2 h-full lg:mx-[40px] overflow-hidden shadow-xl"
              style={{
                backgroundImage: "url(/2-banner.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "left",
                border: "none",
                borderRadius: "20px",
              }}
            ></div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={contactRef}
        id="contact"
        className="bg-[white]"
        style={{
          height: "100vh", // Chiều cao toàn màn hình
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px", // Thêm padding để tránh bị nhô lên
        }}
      >
        {contactInView && (
          <motion.div
            className="contact-form-container w-full h-full bg-white rounded-[20px] "
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <ContactForm />
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Home;
