import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import {
  Save,
  Plus,
  Trash2,
  Layout,
  User,
  Briefcase,
  Code,
  Share2,
  Loader2,
  Server,
  Globe,
  Cpu,
  Menu,
  X,
  Check,
  ExternalLink,
  Github,
  Mail, 
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- FIX 1: Initialize as empty array [] ---
  const [messages, setMessages] = useState([]); 
  const [loadingMessages, setLoadingMessages] = useState(false);

  // State for inline skill adding
  const [addingSkill, setAddingSkill] = useState(null);
  const [newSkillName, setNewSkillName] = useState("");

  // Initial State
  const [portfolio, setPortfolio] = useState({
    navbar: { firstName: "", lastName: "" },
    hero: {
      title: "",
      subtitle: "",
      ctaText: "View Work",
      cta2Text: "Contact Me",
    },
    about: {
      description: "",
      stats: {
        label1: "Fresh",
        sub1: "Perspective",
        label2: "3+",
        sub2: "Mini Projects",
      },
    },
    links: { github: "", linkedin: "", twitter: "", resume: "", email: "" },
    projects: [],
    timeline: [],
    skills: {
      backend: [],
      frontend: [],
      devops: [],
      tools: [],
    },
  });

  // 1. Fetch Portfolio Data
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/users/${user.username}`);
        const data = response.data;

        // FIX: Use logical OR (||) to prevent nulls overwriting defaults
        setPortfolio((prev) => ({
          ...prev,
          navbar: data.navbar || prev.navbar,
          hero: { ...prev.hero, ...data.hero },
          about: {
            description: data.about?.description || "",
            stats: data.about?.stats || prev.about.stats,
          },
          links: data.links || prev.links,
          projects: data.projects || [],
          timeline: data.timeline || [],
          skills: data.skills || prev.skills,
        }));
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  // --- 2. Fetch Messages ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeTab === "messages" && user?.username) {
        setLoadingMessages(true);
        try {
          const response = await api.get("/contact/my-messages");
          
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          } else {
            console.warn("Messages response was not an array:", response.data);
            setMessages([]);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessages([]); // Fallback to empty array on error
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    fetchMessages();
  }, [activeTab, user]);

  // --- Handlers ---

  const handleNestedChange = (section, field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleDeepNestedChange = (section, subsection, field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  // --- Array Managers ---

  const handleArrayAdd = (key, initialItem) => {
    setPortfolio((prev) => ({ ...prev, [key]: [...prev[key], initialItem] }));
  };

  const handleArrayRemove = (key, index) => {
    setPortfolio((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (key, index, field, value) => {
    const newArray = [...portfolio[key]];
    newArray[index] = { ...newArray[index], [field]: value };
    setPortfolio((prev) => ({ ...prev, [key]: newArray }));
  };

  // --- Skill Manager ---

  const startAddSkill = (category) => {
    setAddingSkill(category);
    setNewSkillName("");
  };

  const cancelAddSkill = () => {
    setAddingSkill(null);
    setNewSkillName("");
  };

  const confirmAddSkill = (category) => {
    if (!newSkillName.trim()) return;

    // Initialize category if missing
    const currentSkills = portfolio.skills[category] || [];

    setPortfolio((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...currentSkills, newSkillName.trim()],
      },
    }));

    setAddingSkill(null);
    setNewSkillName("");
  };

  const handleSkillRemove = (category, skillToRemove) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skillToRemove),
      },
    }));
  };

  // --- Save ---

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.post("/portfolio", portfolio);
      setMessage({ type: "success", text: "Portfolio updated successfully!" });
    } catch (error) {
      console.error("Save failed:", error);
      const backendError = error.response?.data?.message || error.message;
      setMessage({ type: "error", text: `Failed: ${backendError}` });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleString();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-neon-green">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-16 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="text-neon-blue" />
            <span className="font-bold text-white">CMS</span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-gray-500 text-sm hidden sm:inline">
              Editing {user?.username || "User"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {message.text && (
              <span
                className={`text-sm font-medium ${
                  message.type === "success"
                    ? "text-neon-green"
                    : "text-red-400"
                }`}
              >
                {message.text}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-neon-green text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00cc82] transition-all disabled:opacity-50 shadow-neon-green"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Publish Changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-2">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 sticky top-24">
            {/* --- NEW: Inbox Tab --- */}
            {[
              { id: "messages", label: "Inbox", icon: Mail }, // New Tab
              { id: "navbar", label: "Navbar", icon: Menu },
              { id: "hero", label: "Hero", icon: Layout },
              { id: "about", label: "About & Stats", icon: User },
              { id: "timeline", label: "Timeline", icon: Briefcase },
              { id: "skills", label: "Tech Stack", icon: Cpu },
              { id: "projects", label: "Projects", icon: Code },
              { id: "contact", label: "Contact Info", icon: Share2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-white/10 text-neon-blue border-l-2 border-neon-blue"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {/* Optional Badge for Inbox */}
                {tab.id === "messages" && messages.length > 0 && (
                  <span className="ml-auto bg-neon-green text-black text-[10px] font-bold px-1.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-10 space-y-6">
          
          {/* --- INBOX / MESSAGES VIEW --- */}
          {activeTab === "messages" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Mail className="text-neon-blue" /> Message Inbox
              </h2>
              
              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-neon-blue w-8 h-8" />
                </div>
              ) : messages.length === 0 ? (
                <div className="glass p-12 rounded-xl text-center text-gray-500 border border-dashed border-white/10">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No messages yet.</p>
                  <p className="text-xs mt-2">When people contact you via your portfolio, messages will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="glass p-6 rounded-xl border border-white/5 hover:border-neon-blue/30 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue/20 to-purple-500/20 flex items-center justify-center text-neon-blue font-bold">
                            {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{msg.senderName || "Unknown"}</h3>
                            <a href={`mailto:${msg.senderEmail}`} className="text-sm text-gray-400 hover:text-neon-green transition-colors">
                              {msg.senderEmail || "No Email"}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          {formatDate(msg.timestamp)}
                        </div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-lg border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                        {msg.message || "No content"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- NAVBAR --- */}
          {activeTab === "navbar" && (
            <div className="glass p-8 rounded-xl animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Menu className="text-neon-blue" /> Navbar Configuration
              </h2>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  {/* FIX: Added || "" to ensure controlled input */}
                  <input
                    type="text"
                    value={portfolio.navbar.firstName || ""}
                    onChange={(e) =>
                      handleNestedChange("navbar", "firstName", e.target.value)
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-blue focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-neon-green text-xs uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={portfolio.navbar.lastName || ""}
                    onChange={(e) =>
                      handleNestedChange("navbar", "lastName", e.target.value)
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-green focus:outline-none text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- HERO --- */}
          {activeTab === "hero" && (
            <div className="glass p-8 rounded-xl animate-fade-in ">
              <h2 className="text-2xl font-bold text-white mb-6">
                Hero Section
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                    Headline
                  </label>
                  <input
                    placeholder="Building Robust Backends & Smooth UIs"
                    type="text"
                    value={portfolio.hero.title || ""}
                    onChange={(e) =>
                      handleNestedChange("hero", "title", e.target.value)
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-blue text-white text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                    Subtitle
                  </label>
                  <textarea
                    placeholder="Hi, I'm a Full Stack Developer..."
                    value={portfolio.hero.subtitle || ""}
                    onChange={(e) =>
                      handleNestedChange("hero", "subtitle", e.target.value)
                    }
                    rows="3"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-blue text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                      Available
                    </label>
                    <input
                      placeholder="Available for Immediate Joining"
                      type="text"
                      value={portfolio.hero.ctaText || ""}
                      onChange={(e) =>
                        handleNestedChange("hero", "ctaText", e.target.value)
                      }
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                      Secondary Button
                    </label>
                    <input disabled placeholder="Contact Me"
                      type="text"
                      value={portfolio.hero.cta2Text || ""}
                      onChange={(e) =>
                        handleNestedChange("hero", "cta2Text", e.target.value)
                      }
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- ABOUT --- */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6">About Me</h2>
                <textarea
                  value={portfolio.about.description || ""}
                  onChange={(e) =>
                    handleNestedChange("about", "description", e.target.value)
                  }
                  rows="6"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-blue text-white"
                  placeholder="Bio..."
                />
              </div>

              <div className="glass p-8 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-6">
                  Quick Stats 
                </h2><small>Below box of About</small>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-4 border border-white/5 rounded-lg bg-white/5">
                    <label className="block text-neon-green text-xs uppercase mb-1">
                      Stat 1 Value
                    </label>
                    <input
                      placeholder="Experience"
                      type="text"
                      value={portfolio.about.stats.label1 || ""}
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "about",
                          "stats",
                          "label1",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-2xl font-bold text-white mb-2 border-b border-white/10 outline-none"
                    />
                    <label className="block text-gray-500 text-xs uppercase mb-1">
                      Stat 1 Label
                    </label>
                    <input
                      placeholder="Perspective / 5 "
                      type="text"
                      value={portfolio.about.stats.sub1 || ""}
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "about",
                          "stats",
                          "sub1",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-sm text-gray-400 border-b border-white/10 outline-none"
                    />
                  </div>
                  <div className="p-4 border border-white/5 rounded-lg bg-white/5">
                    <label className="block text-neon-blue text-xs uppercase mb-1">
                      Stat 2 Value
                    </label>
                    <input
                      placeholder="Projects"
                      type="text"
                      value={portfolio.about.stats.label2 || ""}
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "about",
                          "stats",
                          "label2",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-2xl font-bold text-white mb-2 border-b border-white/10 outline-none"
                    />
                    <label className="block text-gray-500 text-xs uppercase mb-1">
                      Stat 2 Label
                    </label>
                    <input
                      placeholder="Completed / 3+"
                      type="text"
                      value={portfolio.about.stats.sub2 || ""}
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "about",
                          "stats",
                          "sub2",
                          e.target.value
                        )
                      }
                      className="w-full bg-transparent text-sm text-gray-400 border-b border-white/10 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TIMELINE --- */}
          {activeTab === "timeline" && (
            <div className="glass p-8 rounded-xl animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Experience / Education
                </h2>
                <button
                  onClick={() =>
                    handleArrayAdd("timeline", {
                      year: "2024",
                      title: "Role",
                      subtitle: "Company",
                      description: "Details...",
                    })
                  }
                  className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded hover:bg-white/20 transition-colors"
                >
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              <div className="space-y-8 border-l border-white/10 ml-4 pl-8 relative">
                {portfolio.timeline.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full bg-dark-bg border-2 border-neon-blue"></div>
                    <button
                      onClick={() => handleArrayRemove("timeline", index)}
                      className="absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid gap-2">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={item.year || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "timeline",
                              index,
                              "year",
                              e.target.value
                            )
                          }
                          className="bg-transparent text-neon-green font-mono w-20 border-b border-white/10 focus:border-neon-green outline-none"
                          placeholder="Year"
                        />
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "timeline",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="bg-transparent text-white font-bold w-full border-b border-white/10 focus:border-white outline-none"
                          placeholder="Job Title / Degree"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            "timeline",
                            index,
                            "subtitle",
                            e.target.value
                          )
                        }
                        className="bg-transparent text-sm text-gray-400 w-full border-b border-white/10 outline-none"
                        placeholder="Company / College"
                      />
                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            "timeline",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full bg-black/20 rounded p-2 text-sm text-gray-300 border border-white/5 focus:border-neon-blue outline-none resize-none"
                        rows="2"
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SKILLS --- */}
          {activeTab === "skills" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white">
                Technical Arsenal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["backend", "frontend", "devops"].map((cat) => {
                  const colors = {
                    backend: "text-neon-green border-neon-green",
                    frontend: "text-neon-blue border-neon-blue",
                    devops: "text-purple-400 border-purple-400",
                  };
                  const Icons = {
                    backend: Server,
                    frontend: Globe,
                    devops: Cpu,
                  };
                  const Icon = Icons[cat];
                  return (
                    <div
                      key={cat}
                      className={`glass p-6 rounded-xl border-t-4 ${
                        colors[cat].split(" ")[1]
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-4 font-bold ${
                          colors[cat].split(" ")[0]
                        }`}
                      >
                        <Icon size={20} />{" "}
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {portfolio.skills[cat]?.map((skill) => (
                          <span
                            key={skill}
                            className="bg-white/10 px-2 py-1 rounded text-xs flex items-center gap-1"
                          >
                            {skill}{" "}
                            <X
                              size={12}
                              className="cursor-pointer hover:text-red-400"
                              onClick={() => handleSkillRemove(cat, skill)}
                            />
                          </span>
                        ))}
                      </div>
                      {addingSkill === cat ? (
                        <div className="flex items-center gap-2 mt-2 animate-fade-in">
                          <input
                            autoFocus
                            type="text"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="Skill Name..."
                            className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white"
                            onKeyDown={(e) =>
                              e.key === "Enter" && confirmAddSkill(cat)
                            }
                          />
                          <button
                            onClick={() => confirmAddSkill(cat)}
                            className="text-neon-green p-1"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelAddSkill}
                            className="text-red-400 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startAddSkill(cat)}
                          className="w-full py-2 border border-dashed border-white/20 rounded text-gray-400 hover:text-white text-sm"
                        >
                          + Add Skill
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- PROJECTS --- */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <button
                  onClick={() =>
                    handleArrayAdd("projects", {
                      title: "New Project",
                      tagline: "Tagline",
                      techStack: [],
                      description: "",
                      websiteLink: "",
                      githubLink: "",
                    })
                  }
                  className="flex items-center gap-2 text-neon-green bg-neon-green/10 px-4 py-2 rounded hover:bg-neon-green/20 transition-colors"
                >
                  <Plus className="w-5 h-5" /> Add Project
                </button>
              </div>
              {portfolio.projects.map((project, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-xl relative group border border-white/5 hover:border-white/20 transition-colors"
                >
                  <button
                    onClick={() => handleArrayRemove("projects", index)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          value={project.title || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "projects",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-bold focus:border-neon-blue text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={project.tagline || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "projects",
                              index,
                              "tagline",
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent border-b border-white/10 py-1 text-neon-green text-sm focus:border-neon-green outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase">
                          Description
                        </label>
                        <textarea
                          value={project.description || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "projects",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows="3"
                          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 mt-1 text-sm text-gray-300 focus:border-neon-blue outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase">
                          Tech Stack (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(project.techStack)
                              ? project.techStack.join(", ")
                              : project.techStack || ""
                          }
                          onChange={(e) =>
                            handleArrayChange(
                              "projects",
                              index,
                              "techStack",
                              e.target.value.split(",").map((s) => s.trim())
                            )
                          }
                          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 mt-1 text-sm text-blue-300 focus:border-neon-blue outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 uppercase">
                            Live URL
                          </label>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded px-2 mt-1">
                            <ExternalLink size={14} className="text-gray-500" />
                            <input
                              type="text"
                              value={project.websiteLink || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  "projects",
                                  index,
                                  "websiteLink",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent py-2 text-sm outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase">
                            Github URL
                          </label>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded px-2 mt-1">
                            <Github size={14} className="text-gray-500" />
                            <input
                              type="text"
                              value={project.githubLink || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  "projects",
                                  index,
                                  "githubLink",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent py-2 text-sm outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- CONTACT --- */}
          {activeTab === "contact" && (
            <div className="glass p-8 rounded-xl animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["email", "linkedin", "github", "twitter", "resume"].map(
                  (key) => (
                    <div key={key}>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={portfolio.links[key] || ""}
                        onChange={(e) =>
                          handleNestedChange("links", key, e.target.value)
                        }
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-neon-blue text-white"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;