import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Roomify",
  description: "Roomify - AI Powered Interior Design",
};


export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing Roomify 21.0</p>
        </div>
        <h1>Build beautiful spaces at the speed of thought with Roomify</h1>
        <p className="subtitle">Roomify is an AI first environment that help you visualize, render, and ship architectural projects faster than ever before.</p>
        <div className="actions">
          <a href="#upload" className="cta">Start Building <ArrowRight className="icon" /> </a>
          <Button variant="outline" size="lg" className="demo">Watch Demo</Button>
        </div>
        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan</h3>
              <p>
                Supports JPG, PNG, formats up tp 10MB
              </p>
            </div>
            <p>Upload images</p>
          </div>
        </div>

      </section>
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your Latest work and shared community projects, all in one place</p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <Image alt="Project" src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png" width={500} height={500} />
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>
              <div className="card-body">
                <div>
                  <h3>sdf</h3>
                  <div className="meta">
                    <Clock className="icon" />
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>By Omar7Tech</span>
                  </div>
                </div>
                <div className="arrow">
                  <ArrowUpRight className="icon" size={18} /> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
