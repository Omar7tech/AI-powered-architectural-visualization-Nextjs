'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);

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
    <section className='mt-20'>
      <h1>{projectData.name || 'Untitled Project'}</h1>
      <div className='visualizer'>
        {projectData.initialImage && (
          <div className='image-container'>
            <h2>Source Image</h2>
            <Image src={projectData.initialImage} alt="source" width={500} height={500} unoptimized/>
          </div>
        )}
      </div>
    </section>
  );
}