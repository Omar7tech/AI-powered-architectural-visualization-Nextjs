
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Upload from "@/components/Upload";
import Projects from "@/components/Projects";


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
            <Upload />
          </div>
        </div>

      </section>
      <Projects />
    </div>
  );
}
