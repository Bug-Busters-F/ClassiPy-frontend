import type React from "react";
import { useCallback, useRef, useState } from "react";

interface DragAndDropUploaderProps {
  onFileSelect: (file: File) => void;
}

const DragAndDropUploader: React.FC<DragAndDropUploaderProps> = ({onFileSelect,}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        preventDefaults(e);
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
        processFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(files && files.length > 0) {
            processFile(files[0])
        }
    }

    const processFile = useCallback((file: File) => {
        if (file.type !== "application/pdf") {
            alert("Por favor, selecione um arquivo PDF.");
            return;
        }
        setSelectedFile(file);
        onFileSelect(file); 
        }, [onFileSelect]
    );

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center mx-auto p-8 text-center bg-white rounded-xl border-2 border-dashed transition-colors duration-300
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} 
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input type="file"ref={fileInputRef} onChange={handleFileSelect} accept="application/pdf" className="hidden"/>
            <span className="text-blue-600 mb-5">
                <i className="fa-solid fa-file-arrow-down fa-3x"></i>
            </span>
            <p className="mt-4 text-lg font-semibold text-gray-600">
                Arraste e solte o arquivo aqui
            </p>
            <div className="my-2 flex items-center justify-center">
                <span className="mx-4 text-gray-500">ou</span>
            </div>

            <button
                type="button"
                onClick={openFileSelector}
                className="px-6 py-2 w-1/2 bg-white border-2 border-blue-600 text-blue-600 rounded-md text-base font-semibold shadow-smfocus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200">
                Selecionar Arquivo
            </button>

            {selectedFile && (
                <div className="mt-6 text-sm font-medium text-gray-800">
                <p>Arquivo selecionado: <span className="text-blue-600">{selectedFile.name}</span></p>
                </div>
            )}
        </div>
    );
};

export default DragAndDropUploader;
