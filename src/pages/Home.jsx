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
  const bounceVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        type: "spring",
        bounce: 0.45,
      },
    },
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

  const { ref: contactRef, inView: contactInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
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
        variants={bounceVariants}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
      >
        <motion.div
          className="banner-text w-full h-full lg:w-1/2 flex align-middle"
          variants={bounceVariants}
        >
          <div className="inline-block m-auto">
            <motion.h2
              className="text-[30px] lg:text-[60px]"
              style={{
                fontWeight: "bold!important",
                filter: "drop-shadow(0px 4px 6px #cccc)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={bannerInView ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                type: "spring",
                bounce: 0.45,
                delay: 0.1,
              }}
            >
              Simplifying Healthcare Access
            </motion.h2>
            <motion.p
              className="text-[16px] lg:text-[20px]"
              style={{
                filter: "drop-shadow(0px 4px 6px #cccc)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={bannerInView ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                type: "spring",
                bounce: 0.45,
                delay: 0.2,
              }}
            >
              Connecting You to Care - Anytime - Anywhere.
            </motion.p>
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
                  initial={{ scale: 0.9, opacity: 0, y: 40 }}
                  animate={bannerInView ? { scale: 1, opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    bounce: 0.45,
                    delay: 0.3,
                  }}
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
                  initial={{ scale: 0.9, opacity: 0, y: 40 }}
                  animate={bannerInView ? { scale: 1, opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    bounce: 0.45,
                    delay: 0.3,
                  }}
                >
                  Go To Dashboard
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        ref={servicesRef}
        className="lg:p-[80px] bg-gradient-to-br from-white via-blue-50 to-blue-100"
        id="services"
        style={{
          minHeight: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
        variants={bounceVariants}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
      >
        <div className="service-container w-full">
          <motion.h3
            className="lg:m-[20px] text-center text-[var(--base-color)]"
            style={{ fontWeight: "bold" }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={servicesInView ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.45,
              delay: 0.1,
            }}
          >
            OUR SERVICES
          </motion.h3>
          <motion.div
            className="flex pt-[80px] pb-[80px] justify-center"
            style={{ gap: "80px" }}
          >
            {[
              // Service cards
              {
                icon: faCalendarDays,
                title: "Online Appointment Booking",
                desc: "Find doctors, browse specialties, and book appointments quickly and easily—anytime, anywhere.",
              },
              {
                icon: faHospital,
                title: "Trusted Hospital & Clinic Network",
                desc: "Access a wide network of verified healthcare providers for reliable and professional medical care.",
              },
              {
                icon: faNotesMedical,
                title: "Health Records & Appointment Reminders",
                desc: "Keep track of your medical history and get automatic reminders for upcoming visits or follow-ups.",
              },
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                className="w-[250px] h-[250px] bg-white/90 border border-blue-100 py-6 px-6 rounded-[24px] shadow-2xl flex flex-col items-center justify-center text-[var(--base-color)]"
                whileHover={{ scale: 1.08, boxShadow: "0 8px 32px #60a5fa55" }}
                initial={{ scale: 0.85, opacity: 0, y: 40 }}
                animate={servicesInView ? { scale: 1, opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  type: "spring",
                  bounce: 0.45,
                  delay: 0.15 + idx * 0.12,
                }}
              >
                <FontAwesomeIcon
                  icon={service.icon}
                  className="text-4xl mb-4 text-blue-400 drop-shadow"
                />
                <h4 className="text-[20px] font-bold mb-2 text-center">
                  {service.title}
                </h4>
                <p className="text-[13px] text-center text-blue-900">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center mt-8 text-[16px]  border-blue-400">
            <motion.button
              className="bg-[var(--base-color)] text-blue-400 border font-bold px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition text-[12px]"
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => navigate("/account")}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={servicesInView ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                type: "spring",
                bounce: 0.45,
                delay: 0.5,
              }}
            >
              Try Now
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        ref={aboutRef}
        className="lg:p-[80px] bg-[var(--base-color)]"
        id="about"
        style={{
          minHeight: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
        variants={bounceVariants}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
      >
        <motion.div
          className="about-container w-full"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={aboutInView ? { scale: 1, opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            type: "spring",
            bounce: 0.45,
            delay: 0.1,
          }}
        >
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
            <motion.div
              className="w-1/2 h-full lg:mx-[40px] overflow-hidden shadow-xl"
              style={{
                backgroundImage: "url(/2-banner.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "left",
                border: "none",
                borderRadius: "20px",
              }}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={aboutInView ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                type: "spring",
                bounce: 0.45,
                delay: 0.2,
              }}
            ></motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        ref={contactRef}
        id="contact"
        className="bg-[white]"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        {contactInView && (
          <motion.div
            className="contact-form-container w-full h-full bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-[24px] shadow-2xl border border-blue-100 flex items-center justify-center"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.45,
            }}
          >
            <ContactForm />
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Home;
