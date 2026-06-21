"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Loader2, FileText } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Document } from "@/types";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = () => {
    api
      .get("/api/admin/documents")
      .then((res) => setDocuments(res.data))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      await api.post("/api/admin/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("PDF uploaded and processed");
      fetchDocuments();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this document? It will be removed from the vector database.")) return;
    try {
      await api.delete(`/api/admin/documents/${id}`);
      toast.success("Document deleted");
      fetchDocuments();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Documents (RAG Knowledge Base)
        </h1>
      </div>

      <div className="mb-6 bg-surface border border-border rounded-lg p-6">
        <p className="text-sm text-muted mb-4">
          Upload PDF documents to add them to the chatbot knowledge base. The content
          will be processed and stored in the vector database for RAG retrieval.
        </p>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Processing..." : "Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-3">
        {documents.length === 0 && (
          <p className="text-sm text-muted text-center py-8">
            No documents uploaded yet.
          </p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-primary flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {doc.filename}
                </h3>
                <p className="text-xs text-muted">{doc.uploaded_at}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(doc.id)}
              className="p-2 text-muted hover:text-red-400 transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
