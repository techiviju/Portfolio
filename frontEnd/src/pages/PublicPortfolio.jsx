import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Use DIRECT axios to bypass token interceptors
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Navbar,
  Hero,
  About,
  Skills,
  Projects,
  Contact,
  Footer,
} from "../components";

const PublicPortfolio = () => {
  const { username } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        // Fetch from backend
        const response = await axios.get(`/api/users/${username}`);

        // Optimize/Map backend data to match Frontend UI Props
        const formattedData = transformBackendDataToUI(response.data);
        setPortfolioData(formattedData);
      } catch (err) {
        console.error("Load failed:", err);
        setError(
          err.response?.status === 404
            ? "User not found"
            : "Failed to load portfolio"
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchPortfolio();
  }, [username]);

  // --- DATA TRANSFORMER ---
  const transformData = (data) => {
    if (!data) return null;
    const safeList = (list) => (Array.isArray(list) ? list : []);
    const skills = data.skills || {};

    return {
      navbar: {
        firstName: data.navbar?.firstName || "User",
        lastName: data.navbar?.lastName || "",
      },
      hero: {
        title: data.hero?.title || "Hello, I'm Developer",
        subtitle: data.hero?.subtitle || "Welcome to my portfolio.",
        ctaText: data.hero?.ctaText || "View Work",
        cta2Text: data.hero?.cta2Text || "Contact Me",
      },
      about: {
        description: data.about?.description || "No description available.",
        stats: {
          val1: data.about?.stats?.label1 || "0+", // Backend maps 'label1' to value
          label1: data.about?.stats?.sub1 || "Experience",
          val2: data.about?.stats?.label2 || "0",
          label2: data.about?.stats?.sub2 || "Projects",
        },
      },
      // FIX: Explicitly filtering for ONLY these 3 categories
      skills: {
        backend: safeList(skills.backend),
        frontend: safeList(skills.frontend),
        devops: safeList(skills.devops),
      },
      timeline: safeList(data.timeline),
      projects: safeList(data.projects),
      links: data.links || {},
    };
  };

  const transformBackendDataToUI = (data) => {
    if (!data) return null;

    const firstName = data.navbar?.firstName || "User";
    const lastName = data.navbar?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      // 1. Navbar Props
      navbarProps: {
        name: fullName,
        resumeLink: data.links?.resume || "#",
      },

      // 2. Hero Props
      heroProps: {
        name: fullName,
        heroData: {
          // Splitting title for the UI effect, or using defaults
          titleLine1: data.hero?.title
            ? data.hero.title.split(" ")[0]
            : "Building",
          titleLine2: data.hero?.title
            ? data.hero.title.split(" ").slice(1).join(" ")
            : "Digital Experiences",
          subtitle:
            data.hero?.subtitle || "Full Stack Developer based in India.",
          availabilityText: data.hero?.ctaText || "Available for Work",
        },
      },

      // 3. About Props
      aboutProps: {
        aboutData: {
          description: data.about?.description || "Passionate developer...",
          stat1: {
            value: data.about?.stats?.label1 || "0+",
            label: data.about?.stats?.sub1 || "Years Exp",
          },
          stat2: {
            value: data.about?.stats?.label2 || "10+",
            label: data.about?.stats?.sub2 || "Projects",
          },
        },
        timelineData: Array.isArray(data.timeline)
          ? data.timeline.map((item) => ({
              year: item.year,
              title: item.title,
              subtitle: item.subtitle,
              desc: item.description,
            }))
          : [],
      },

      // 4. Skills Props
      skillsProps: {
        skillsData: {
          Backend: {
            icon: "Server",
            items: (data.skills?.backend || []).map((s) => ({
              name: s,
              level: "Adv",
            })),
          },
          Frontend: {
            icon: "Code",
            items: (data.skills?.frontend || []).map((s) => ({
              name: s,
              level: "Adv",
            })),
          },
          DevOps: {
            icon: "Database",
            items: (data.skills?.devops || []).map((s) => ({
              name: s,
              level: "Int",
            })),
          },
        },
      },

      // 5. Projects Props
      projectsProps: {
        projectsData: Array.isArray(data.projects)
          ? data.projects.map((p, index) => ({
              id: p.id || index, // Ensure ID exists for framer-motion layoutId
              title: p.title,
              tagline: p.tagline || "Featured Project",
              description: p.description,
              tech: p.techStack || [],
              live: p.websiteLink || "#",
              github: p.githubLink || "#",
            }))
          : [],
      },

      // 6. Contact Props
      contactProps: {
        username: username,
        ownerName: fullName, 
        contactInfo: {
          email: data.links?.email || "contact@example.com",
          linkedin: data.links?.linkedin || "#",
          github: data.links?.github || "#",
        },
      },

      // 7. Footer Props
      footerProps: {
        name: fullName,
        resumeDownloadLink: data.links?.resume || "#",
      },
    };
  };

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-neon-green">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );

// Error state
  if (error)
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white p-4">
        <div className="glass p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a href="/" className="text-neon-green hover:underline">
            Return Home
          </a>
        </div>
      </div>
    );

  if (!portfolioData) return null;

  // Render UI
  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans selection:bg-neon-green/30 scroll-smooth">
      <Navbar {...portfolioData.navbarProps} />
      <Hero {...portfolioData.heroProps} />
      <About {...portfolioData.aboutProps} />
      <Skills {...portfolioData.skillsProps} />
      <Projects {...portfolioData.projectsProps} />
      <Contact {...portfolioData.contactProps} />
      <Footer {...portfolioData.footerProps} />
    </div>
  );
};

// --- SUB COMPONENTS ---
export default PublicPortfolio;
