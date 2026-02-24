'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { generate3DView } from '../../../../lib/ai.action';
import { Box, Download, RefreshCcw, Share2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createProject, getProjectById } from '../../../../lib/puter.action';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const hasInitialGenerated = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(projectData?.initialRender || null);

  const handleBack = () => {
    router.push('/');
  }

  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage) {
      return;
    }
    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: item.sourceImage });
      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);
        const updatedItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? null,
          isPublic: item.isPublic ?? false,
        }
        const saved = await createProject({ item: updatedItem, visibility: "private" });
        if (saved) {
          setProject(saved);
          setCurrentImage(saved.renderedImage || result.renderedImage);
        }
      }
    } catch (error) {
      console.error('Failed to generate 3D view:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenerated.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);

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
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className='note'>Created By You</p>
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
                <img src={currentImage} alt="3D View" width={500} height={500} />
              ) : (
                <div className='render-placeholder'>
                  {
                    project?.sourceImage && (
                      <img src={project.sourceImage} alt="Original" className='render-fallback' width={500} height={500} />
                    )
                  }
                </div>
              )
            }

            {isProcessing && (
              <div className='render-overlay'>
                <div className='rendering-card'>
                  <RefreshCcw className='spinner' />
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