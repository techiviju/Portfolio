import React from 'react';
// import './App.css'; // Importing a CSS file for styling
import { Navbar, Hero, About, Skills, Projects, Contact, Footer } from './components';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;