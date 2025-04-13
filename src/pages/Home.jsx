import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faHospital,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "../components/ContactForm";
function Home() {
  return (
    <div className="w-full">
      <section
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
      >
        <div
          className="banner-text w-full h-full lg:w-1/2 flex align-middle"
          style={{
            backdropFilter: "opacity(0.5)",
          }}
        >
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
            <p></p>
            <div className="pt-[30px]">
              <a
                type="button"
                href="#services"
                className="bg-white text-[20px] px-[15px] py-[10px] border cursor-pointer transition-all ease-in-out duration-700 rounded-[0px] hover:rounded-[20px]"
                style={{
                  color: "var(--base-color)",
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        className=" lg:p-[80px]"
        id="services"
        style={{
          height: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
      >
        <div className="service-container w-full">
          <h3
            className="lg:m-[20px] text-center text-[var(--base-color)]"
            style={{ fontWeight: "bold" }}
          >
            OUR SERVICES
          </h3>
          <div
            className="flex pt-[80px] pb-[80px] justify-center"
            style={{ gap: "80px" }}
          >
            <div className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]">
              <FontAwesomeIcon icon={faCalendarDays} />
              <h4 className="text-[18px]">Online Appointment Booking</h4>
              <p className="text-[12px] mt-[12px]">
                Find doctors, browse specialties, and book appointments quickly
                and easily—anytime, anywhere.
              </p>
            </div>
            <div className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]">
              <FontAwesomeIcon icon={faHospital} />
              <h4 className="text-[18px]">Trusted Hospital & Clinic Network</h4>
              <p className="text-[12px] mt-[12px]">
                Access a wide network of verified healthcare providers for
                reliable and professional medical care.
              </p>
            </div>
            <div className="w-[250px] h-[250px] bg-[var(--base-color)] py-3 px-6 rounded-[20px]">
              <FontAwesomeIcon icon={faNotesMedical} />
              <h4 className="text-[18px]">
                Health Records & Appointment Reminders
              </h4>
              <p className="text-[12px] mt-[12px]">
                Keep track of your medical history and get automatic reminders
                for upcoming visits or follow-ups.
              </p>
            </div>
          </div>
          <div>
            <a
              type="button"
              href="/sign-up"
              className="bg-white px-[15px] hover:px-[24px] py-[10px] border cursor-pointer transition-all ease-in-out duration-700 rounded-[0px] hover:rounded-[20px] hover:text-white text-[var(--base-color)] hover:bg-[var(--base-color)]"
              style={{
                fontSize: "20px",
              }}
            >
              Try Now
            </a>
          </div>
        </div>
      </section>
      <section
        className="lg:p-[80px] bg-[var(--base-color)]"
        id="services"
        style={{
          height: "100vh",
          display: "flex",
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
        }}
      >
        <div className="about-container w-full">
          <h3
            className="lg:m-[20px] text-center text-white"
            style={{ fontWeight: "bold" }}
          >
            ABOUT US
          </h3>
          <div className="flex h-[calc(100%-100px)]">
            <div className="w-1/2 lg:px-[40px] text-left flex">
              <div className="m-auto">
                <p className="text-[18px]" style={{ lineHeight: "1.5" }}>
                  <span className="font-bold">Medical Booking</span> is a
                  pioneering digital health platform on a mission to make
                  healthcare more accessible, transparent, and efficient for
                  everyone. We aim to eliminate long waiting times and improve
                  the patient experience by connecting users with a growing
                  network of reputable hospitals, clinics, and doctors
                  nationwide.
                </p>
                <span className="font-bold text-[18px]">Our Core Values:</span>
                <ul className="text-[16px] list-disc pl-6">
                  <li>
                    <span className="font-bold">
                      Online Appointment Booking:
                    </span>{" "}
                    Find doctors and book appointments quickly and easily.
                  </li>
                  <li>
                    <span className="font-bold">
                      Trusted Hospital & Clinic Network:
                    </span>{" "}
                    Access verified healthcare providers.
                  </li>
                  <li>
                    <span className="font-bold">
                      Health Records & Appointment Reminders:
                    </span>{" "}
                    Track history and get follow-up alerts.
                  </li>
                </ul>
              </div>
            </div>
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
      </section>
      <section>
        <ContactForm />
      </section>
    </div>
  );
}

export default Home;
