import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import { PERSONAL_DETAILS } from '../data';

export const Contact = () => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    result: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.isSubmitting) return;

    if (!WEB3FORMS_ACCESS_KEY) {
        console.error("Web3Forms Access Key is missing! Check your .env file or Netlify settings.");
        setStatus({ isSubmitting: false, result: "error" });
        return;
    }

    setStatus({ isSubmitting: true, result: null });

    const data = JSON.stringify({
      ...formData,
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New Message from ${formData.name} (Portfolio)`,
    });

    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
      try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0) {
          throw new Error("Network response was not ok");
        }
        return response;
      } catch (error) {
        if (retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        } else {
          throw error;
        }
      }
    };

    try {
      const response = await fetchWithRetry("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ isSubmitting: false, result: "success" });
        setFormData({ name: "", email: "", message: "" });
        setTimeout(
          () => setStatus((prev) => ({ ...prev, result: null })),
          5000 
        );
      } else {
        console.error("Form submission error:", result);
        setStatus({ isSubmitting: false, result: "error" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus({ isSubmitting: false, result: "error" });
    }
  };

  const inputClasses =
    "w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none transition-all duration-200";

  const labelClasses = "block text-sm font-medium text-gray-400 mb-2 text-left";

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden">
          
          {/* Header text from data.js */}
          <div className="p-8 md:p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {PERSONAL_DETAILS.contact.heading}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {PERSONAL_DETAILS.contact.subHeading}
            </p>
          </div>

          <div className="grid md:grid-cols-2 border-t border-gray-700/50">
            
            {/* === LEFT COLUMN: FORM === */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className={labelClasses}>Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your Name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className={labelClasses}>Message</label>
                  <textarea
                    rows="4"
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClasses} resize-none`} 
                    placeholder="How can I help you?"
                    required
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.isSubmitting}
                  className="w-full bg-green-400 text-black font-bold py-3 px-6 rounded-lg
                           hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/20 hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
                           transition-all duration-200 flex items-center justify-center gap-2
                           disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {status.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {status.result && (
                    <motion.div
                      key={status.result}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg text-sm flex items-center justify-center gap-2
                        ${status.result === "success"
                          ? "bg-green-500/10 border border-green-500/20 text-green-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }
                      `}
                    >
                      {status.result === "success" ? (
                        <>
                          <CheckCircle size={18} /> Message Sent Successfully!
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={18} /> Something went wrong.
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* === RIGHT COLUMN: INFO === */}
            <div className="p-8 md:p-12 bg-black/20 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-700/50">
              <div className="space-y-8 text-left">
                <InfoItem
                  icon={<Mail className="text-blue-400" size={20} />}
                  label="Email"
                  link={`mailto:${PERSONAL_DETAILS.contact.email}`}
                  text={PERSONAL_DETAILS.contact.email}
                />
                <InfoItem
                  icon={<Linkedin className="text-blue-400" size={20} />}
                  label="LinkedIn"
                  link={PERSONAL_DETAILS.contact.linkedin}
                  text={PERSONAL_DETAILS.contact.linkedinLabel}
                />
                <InfoItem
                  icon={<Github className="text-blue-400" size={20} />}
                  label="GitHub"
                  link={PERSONAL_DETAILS.contact.github}
                  text={PERSONAL_DETAILS.contact.githubLabel}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for contact info
const InfoItem = ({ icon, label, link, text }) => (
  <div className="flex items-start gap-5 group">
    <div className="p-3.5 bg-gray-800 rounded-2xl border border-gray-700 group-hover:border-green-400/50 transition-colors duration-300">
      {icon}
    </div>
    <div className="flex flex-col justify-center pt-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-lg text-white hover:text-green-400 transition-colors break-all"
        aria-label={`Link to ${label}`}
      >
        {text}
      </a>
    </div>
  </div>
);

export default Contact;