'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { generate3DView } from '../../../../lib/ai.action';
import { Box, Download, Loader2, RefreshCcw, Share2, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const hasInitialGenerated = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(projectData?.initialRender || null);

  const handleBack = () => {
    router.push('/');
  }

  const runGeneration = async () => {
    if (!projectData?.initialImage) {
      return;
    }
    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: projectData.initialImage });
      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);


      }
    } catch (error) {
      console.error('Failed to generate 3D view:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (!projectData?.initialImage || hasInitialGenerated.current) {
      return;
    }
    if (projectData.initialRender) {
      setCurrentImage(projectData.initialRender);
      hasInitialGenerated.current = true;
      return;
    }
    setCurrentImage(projectData.initialImage);
    hasInitialGenerated.current = true;
    runGeneration();
  }, [projectData?.initialImage, projectData?.initialRender]);



  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      const data = localStorage.getItem(`project-${resolvedParams.id}`);
      if (data) {
        setProjectData(JSON.parse(data));
      }
    })();
  }, [params]);

  if (!id) return <div className="mt-20">Loading...</div>;
  if (!projectData) return <div className="mt-20">No project data found for {id}</div>;

  return (
    <div className='visualizer'>
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">Roomify</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>
      <section className='content'>
        <div className='panel'>
          <div className='panel-header'>
            <div className='panel-meta'>
              <p>Project</p>
              <h2>{'untitled project'}</h2>
              <p className='note'>Created Be You</p>
            </div>
            <div className="panel-actions">
              <Button variant="ghost" size="sm" onClick={() => { }} disabled={!currentImage} className="export">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { }} disabled={!currentImage} className="share">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
          <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
            {
              currentImage ? (
                  <Image src={currentImage} alt="3D View" width={500} height={500} unoptimized />
              ) : (
                <div className='render-placeholder'>
                  {
                    projectData.initialImage && (
                      <Image src={projectData.initialImage} alt="Original" className='render-fallback' width={500} height={500} unoptimized />
                    )
                  }
                </div>
              )
            }

            {isProcessing && (
              <div className='render-overlay'>
                <div className='rendering-card'>
                  <RefreshCcw className='spinner'/>
                  <span className='title'>Rendering...</span> 
                    <span className='subtitle'>Generating your 3D view</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}