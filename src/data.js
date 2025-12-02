import { Server, Code, Database } from 'lucide-react';

export const PERSONAL_DETAILS = {
  name: "Vijay Chaudhari",
  role: "Full Stack Java Developer",
  
  hero: {
    status: "Available for Immediate Joining",
    titleLine1: "Building",
    titleHighlight: "Robust Backends",
    titleSuffix: "& Smooth UIs",
    description: "A Full Stack Java Developer focused on writing clean, efficient code and building scalable web applications.",
    btnPrimary: "View Work",
    btnSecondary: "Contact Me"
  },

  about: {
    heading: "About Me",
    
    bio: "I am a passionate Full Stack Java Developer dedicated to building secure and user-friendly web applications. With a strong command of Java, Spring Boot, and React.js, I focus on creating clean code and efficient REST APIs. My work bridges complex backend logic with modern design, utilizing tools like MySQL and Docker to deliver reliable software solutions. I enjoy solving challenging problems and am ready to transform ideas into high-quality digital products.",
    stats: {
      expValue: "Fresh",
      expLabel: "Perspective",
      projValue: "3+",
      projLabel: "Mini Projects"
    }
  },

  contact: {
    heading: "Let's Work Together vijay",
    subHeading: "I'm currently looking for new opportunities as a Full Stack Java Developer. Send me a message and let's connect.",
    email: "vijaychaudhari5220@gmail.com",
    linkedin: "https://www.linkedin.com/in/vijay-achaudhari/",
    linkedinLabel: "Linkedin",
    github: "https://github.com/techiviju",
    githubLabel: "github"
  }
};

export const SKILLS = {
  Backend: {
    icon: Server,
    items: [
      { name: 'Java', level: 'Advanced' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'Spring Boot', level: 'Advanced' },
      { name: 'Spring Security', level: 'Basics' },
      { name: 'Spring MVC', level: 'Basics' },
      { name: 'Hibernate/JPA', level: 'Intermediate' },
      { name: 'JDBC', level: 'Advanced' },
      { name: 'Servlets', level: 'Intermediate' },
      { name: 'JSP', level: 'Intermediate' },
      { name: 'REST API', level: 'Intermediate' },
      { name: 'JSON', level: 'Intermediate' },
      { name: 'JWT', level: 'Basics' },
      { name: 'JUnit', level: 'Intermediate' }
    ]
  },
  Frontend: {
    icon: Code,
    items: [
      { name: 'React.js', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'Bootstrap', level: 'Basics' },
      { name: 'JavaScript (ES6+)', level: 'Intermediate' },
      { name: 'HTML5', level: 'Advanced' },
      { name: 'CSS', level: 'Advanced' }
    ]
  },
  DevOps: {
    icon: Database,
    items: [
      { name: 'Docker', level: 'Basics' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'Git', level: 'Advanced' },
      { name: 'Maven', level: 'Intermediate' },
      { name: 'Jenkin', level: 'Intermediate' },
      { name: 'Postman', level: 'Intermediate' },
      { name: 'MySql', level: 'Intermediate' },
    ]
  }
};

export const PROJECTS = [
  {
    id: 1,
    title: "Notes Application",
    tagline: "Secure, Full-Stack Notes Application built with Spring Boot and React.",
    description: "Developed a secure, full-stack Notes Management Application utilizing Java Spring Boot to build robust RESTful APIs and React.js with Tailwind CSS for a responsive user interface. The system features JWT authentication with role-based access (Admin/User), secure data handling via BCrypt encryption, and persistent storage managed by MySQL and JPA/Hibernate. This project demonstrates expertise across the entire development lifecycle, from designing efficient backend services and CRUD operations to creating dynamic frontend experiences and preparing for deployment using Maven and Docker.",
    tech: ["Java", "Spring Boot", "Spring Security", "JWT", "JPA/Hibernate", "MySQL", "React", "Tailwind CSS", "JS", "Git/GitHub", "Maven", "Docker"],
    github: "https://github.com/techiviju/Notes-Application",
    live: "https://notes-app-net.netlify.app/"
  },
  {
    id: 2,
    title: "Doctor-Patient Portal",
    tagline: "Secure Healthcare Management System with Role-Based Access",
    description: "Engineered a robust healthcare platform facilitating interaction between patients, doctors, and admins. Features include secure authentication, appointment scheduling, and dynamic dashboards. Fully containerized with Docker for scalable cloud deployment.",
    tech: ["Java", "JSP & Servlets", "MySQL", "JDBC", "Docker", "Render"],
    github: "https://github.com/techiviju/Doctor-Patient-Project",  
    live: "https://doctor-patient-portal-08hh.onrender.com/"
  }
];

export const TIMELINE = [
  { year: "2024", title: "Bachelor of Computer Applications (BCA)", subtitle: "Gondwana University", desc: "Strong Foundation in Computing Principles." },
  { year: "August 2025", title: "Oracle Certified Foundations Associate (OCI)", subtitle: "Oracle", desc: "Core Cloud Infrastructure Knowledge." },
];