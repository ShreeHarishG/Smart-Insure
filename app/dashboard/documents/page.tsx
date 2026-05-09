"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface DocData { id: string; name: string; file_name: string; file_type: string; file_size: number; created_at: string; client_name?: string; client_id: string; file_url?: string; }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: "", file_name: "", file_size: 0, file_url: "", client_id: "" });

  useEffect(() => { 
    const t = setTimeout(fetchDocs, 300); 
    fetchClients();
    return () => clearTimeout(t); 
  }, [search]);

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (e) { console.error(e); }
  }

  async function fetchDocs() {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/documents${params}`);
      const data = await res.json();
      setDocs(data.documents || []);
    } catch {} finally { setLoading(false); }
  }

  async function deleteDoc(id: string) {
    if (!confirm("Delete this document?")) return;
    try { await fetch(`/api/documents/${id}`, { method: "DELETE" }); fetchDocs(); } catch {}
  }

  async function handleUpload() {
    if (!uploadForm.name || !selectedFile || !uploadForm.client_id) return alert("Please fill all fields and select a file");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("client_id", uploadForm.client_id);
      formData.append("name", uploadForm.name);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setShowUploadModal(false);
        setUploadForm({ name: "", file_name: "", file_size: 0, file_url: "", client_id: "" });
        setSelectedFile(null);
        fetchDocs();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save document metadata");
      }
    } catch (e: any) {
      alert("Error uploading document: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  const formatSize = (b: number) => b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const docColor = (t: string) => ({ PDF: "bg-rose-50 text-rose-600", IMG: "bg-amber-50 text-amber-600", DOC: "bg-indigo-50 text-indigo-600" }[t] || "bg-emerald-50 text-emerald-600");

  const totalSize = docs.reduce((a, d) => a + d.file_size, 0);
  const pdfCount = docs.filter(d => d.file_type === "PDF").length;
  const imgCount = docs.filter(d => d.file_type === "IMG").length;
  const otherCount = docs.filter(d => !["PDF", "IMG"].includes(d.file_type)).length;

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-navy mb-2">Document <span className="text-primary">Vault</span></h1>
          <p className="text-slate-500 font-medium italic">Securely manage and access all insurance-related documents in one place.</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95">
          + Upload Document
        </button>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="bg-slate-50/40 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-primary outline-none transition-all text-sm font-medium" />
              </div>
              <div className="flex items-center gap-4 hidden md:flex">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight">All Files</h2>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-navy"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </button>
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-navy"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-6 bg-slate-50/20 ${viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : ""}`}>
              {loading ? (
                <div className="col-span-full py-16 text-center text-slate-400 font-medium"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>Loading...</div>
              ) : docs.length === 0 ? (
                <div className="col-span-full py-16 text-center"><span className="text-4xl block mb-4">📂</span><p className="text-slate-400 font-bold">No documents found</p></div>
              ) : viewMode === "grid" ? (
                docs.map((doc) => (
                <div key={doc.id} className="p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl ${docColor(doc.file_type)} flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-110 transition-transform`}>{doc.file_type}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={doc.file_url && doc.file_url.length > 5 ? doc.file_url : "#"} download={doc.file_name} target="_blank" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all" title="Download Document"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></a>
                      <button onClick={() => deleteDoc(doc.id)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                  </div>
                  <h4 className="font-black text-navy text-base mb-1 truncate group-hover:text-primary transition-colors">{doc.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Owner: {doc.client_name || "—"}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400">{formatSize(doc.file_size)}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{formatDate(doc.created_at)}</span>
                  </div>
                </div>
                ))
              ) : (
                <div className="col-span-full overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">File Name</th>
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Owner</th>
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date Uploaded</th>
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Size</th>
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {docs.map(doc => (
                        <tr key={doc.id} className="hover:bg-white transition-colors group">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${docColor(doc.file_type)} flex items-center justify-center font-black text-[10px]`}>{doc.file_type}</div>
                              <span className="font-bold text-navy text-sm truncate max-w-[200px]">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-slate-500">{doc.client_name || "—"}</td>
                          <td className="py-3 px-4 text-sm font-medium text-slate-500">{formatDate(doc.created_at)}</td>
                          <td className="py-3 px-4 text-sm font-medium text-slate-500">{formatSize(doc.file_size)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a href={doc.file_url && doc.file_url.length > 5 ? doc.file_url : "#"} download={doc.file_name} target="_blank" className="p-1.5 rounded-md bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></a>
                              <button onClick={() => deleteDoc(doc.id)} className="p-1.5 rounded-md bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
          <div className="bg-slate-50/40 p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-navy mb-8">Storage Stats</h3>
            <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
              <div className="absolute top-0 left-0 h-full bg-[#1E88E5] rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalSize / (2 * 1073741824)) * 100, 100)}%` }}></div>
            </div>
            <div className="flex items-center justify-between mb-10">
              <div><p className="text-2xl font-black text-navy leading-none">{(totalSize / 1048576).toFixed(1)} MB</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Used</p></div>
              <div className="text-right"><p className="text-2xl font-black text-slate-300 leading-none">2.0 GB</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Limit</p></div>
            </div>
            <div className="space-y-5">
              {[{ label: "PDF Documents", count: pdfCount, color: "bg-rose-500" }, { label: "Images", count: imgCount, color: "bg-amber-500" }, { label: "Other Formats", count: otherCount, color: "bg-indigo-500" }].map(i => (
                <div key={i.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className={`w-2.5 h-2.5 rounded-full ${i.color}`}></div><span className="text-xs font-black text-navy">{i.label}</span></div>
                  <span className="text-xs font-black text-slate-400">{i.count} Files</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-navy">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-navy transition-colors">✕</button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Client</label>
                <select value={uploadForm.client_id} onChange={e => setUploadForm({...uploadForm, client_id: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-navy appearance-none">
                  <option value="">Select a Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Document Name</label>
                <input type="text" placeholder="e.g. Health Insurance Policy 2024" value={uploadForm.name} onChange={e => setUploadForm({...uploadForm, name: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-navy" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Attach File</label>
                <input 
                  type="file" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setUploadForm({...uploadForm, file_name: file.name, file_size: file.size});
                    }
                  }} 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-navy file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer text-sm" 
                />
                {uploadForm.file_name && (
                  <p className="text-xs text-emerald-500 font-bold mt-2 ml-1">Selected: {uploadForm.file_name} ({(uploadForm.file_size / 1024).toFixed(1)} KB)</p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 rounded-xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleUpload} disabled={uploading || !uploadForm.name || !selectedFile || !uploadForm.client_id} className="flex-1 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all disabled:opacity-50">{uploading ? "Uploading..." : "Upload File"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
