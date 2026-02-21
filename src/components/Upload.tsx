'use client'
import React, { useState } from 'react'
import { useAuth } from './AuthContext';
import { CheckCircle2, ChevronLeftCircleIcon, ChevronRightIcon, ImageIcon, Layers, UploadIcon } from 'lucide-react';
import { filesize } from 'filesize';
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../../lib/constants';

const Upload = ({ onComplete }: { onComplete?: (base64: string) => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const { isSignedIn } = useAuth();

    const processFile = (file: File) => {
        setFile(file);
        setStatus('uploading');
        setProgress(0);
        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += PROGRESS_STEP;
                setProgress(currentProgress);
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (onComplete) onComplete(base64);
                    }, REDIRECT_DELAY_MS);
                }
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    };

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