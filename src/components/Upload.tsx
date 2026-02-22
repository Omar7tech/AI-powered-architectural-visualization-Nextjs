'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectsContext';
import { CheckCircle2, ChevronLeftCircleIcon, ChevronRightIcon, ImageIcon, Layers, UploadIcon } from 'lucide-react';
import { filesize } from 'filesize';
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../../lib/constants';
import { useRouter } from 'next/navigation';
import { createProject } from '../../lib/puter.action';

const Upload = ({ onComplete }: { onComplete?: (base64: string) => void }) => {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { setProjects } = useProjects();

    const handleUploadComplete = async (base64Image: string) => {
        const newId = Date.now().toString();
        const name = `Residence ${newId}`;
        const newItem: DesignItem = {
            id: newId,
            name,
            sourceImage: base64Image,
            renderedImage: null,
            timestamp: Date.now()
        }
        const saved = await createProject({item : newItem , visibility : "private"});
        if(!saved){
            console.error("Failed to create project");
            return false;
        }
        newItem.sourceImage = saved.sourcePath || '';
        newItem.renderedImage = saved.renderedPath || null;
        setProjects((prev) => [newItem , ...prev]);


        localStorage.setItem(`project-${newId}`, JSON.stringify({
            initialImage: saved.sourcePath || '',
            initialRendered: saved.renderedPath || null,
            name
        }));

        router.push(`/visualizer/${newId}`);
        return true;
    };

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const processFile = (file: File) => {
        setFile(file);
        setStatus('uploading');
        setProgress(0);
        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            let currentProgress = 0;
            progressIntervalRef.current = setInterval(() => {
                if (mountedRef.current) {
                    currentProgress += PROGRESS_STEP;
                    setProgress(currentProgress);
                    if (currentProgress >= 100) {
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                            progressIntervalRef.current = null;
                        }
                        redirectTimeoutRef.current = setTimeout(() => {
                            if (mountedRef.current) {
                                handleUploadComplete(base64);
                                if (onComplete) onComplete(base64);
                            }
                            redirectTimeoutRef.current = null;
                        }, REDIRECT_DELAY_MS);
                    }
                }
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
                redirectTimeoutRef.current = null;
            }
        };
    }, []);

    return (
        <div className='upload'>
            {!file ? (
                <div className={`dropzone ${isDragging ? 'is-dragging' : ''}`}

                    onDragOver={(e) => { e.preventDefault(); if (isSignedIn) setIsDragging(true); }}
                    onDragLeave={() => { if (isSignedIn) setIsDragging(false); }}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (isSignedIn && e.dataTransfer.files[0]) { processFile(e.dataTransfer.files[0]); } }}>
                    <input type="file" className='drop-input' accept='.jpeg,.jpg,.png' onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); processFile(f); } }} disabled={!isSignedIn} />
                    <div className='drop-content'>
                        <div className='drop-icon'>
                            <UploadIcon size={24} />
                        </div>
                        <p>
                            {isSignedIn ? 'Click to upload or just drag and drop' : 'Sign in or register to upload'}
                        </p>
                        <p className='help'>Maximum file size is 10MB</p>
                    </div>
                </div>
            ) : (
                <div className='upload-status'>
                    <div className='status-content'>
                        <div className='status-icon'>
                            {progress === 100 ? <CheckCircle2 className='check ' /> : <ImageIcon className='image' />}
                        </div>
                        <h3 className='font-mono text-xs flex items-center content-center justify-center'>{file.name} <span><ChevronRightIcon size={16} /> </span> {filesize(file.size, { standard: "jedec" })}</h3>

                        <div className='progress'>
                            <div className='bar' style={{ width: `${progress}%` }} />
                            <p className='status-text'>
                                {progress < 100 ? 'Analyzing floor plan...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Upload