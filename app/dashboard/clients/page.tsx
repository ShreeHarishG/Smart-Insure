"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface ClientData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date_of_birth: string;
  address?: string;
  status: string;
  family_count?: number;
  document_count?: number;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", date_of_birth: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [total, setTotal] = useState(0);

  // Check for ?action=add in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "add") setShowAddModal(true);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/clients?${params.toString()}`);
      const data = await res.json();
      setClients(data.clients || []);
      setTotal(data.total || 0);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const debounce = setTimeout(fetchClients, 300);
    return () => clearTimeout(debounce);
  }, [fetchClients]);

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.date_of_birth) return;
    setSaving(true);
    try {
      if (editingClient) {
        await fetch(`/api/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setShowAddModal(false);
      setEditingClient(null);
      setFormData({ name: "", phone: "", email: "", date_of_birth: "", address: "" });
      fetchClients();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client? This will remove all their documents and family members.")) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch {
      // handle error
    }
  };

  const openEditModal = (client: ClientData) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
      date_of_birth: client.date_of_birth,
      address: client.address || "",
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClient(null);
    setFormData({ name: "", phone: "", email: "", date_of_birth: "", address: "" });
  };

  const formatDob = (dob: string) => {
    return new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-navy mb-2">
            Client <span className="text-primary">Directory</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Manage and track your insurance clients and their policies.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-xl shadow-navy/20 active:scale-95"
          >
            + Add New Client
          </button>
        </div>
      </header>

      <div className="bg-slate-50/40 rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search clients by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {["all", "Active", "Pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                  filter === f ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-navy"
                }`}
              >
                {f === "all" ? "All Clients" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Client Information</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Contact Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Family</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Documents</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-100 rounded-md w-32"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded-md w-24"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-6 bg-slate-100 rounded-lg w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-md w-8"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-lg w-16"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg"></div>
                        <div className="w-7 h-7 bg-slate-100 rounded-lg"></div>
                        <div className="w-7 h-7 bg-slate-100 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">👤</span>
                      No clients found. {search ? "Try a different search term." : "Add your first client to get started."}
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                          {client.name[0]}
                        </div>
                        <div>
                          <Link href={`/dashboard/clients/${client.id}`} className="block font-black text-navy text-sm group-hover:text-primary transition-colors">
                            {client.name}
                          </Link>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Born {formatDob(client.date_of_birth)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-navy">{client.phone}</p>
                        <p className="text-xs text-slate-400 font-medium">{client.email || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        client.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-navy font-black text-xs">
                          {client.family_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <Link href={`/dashboard/clients/${client.id}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{client.document_count || 0}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/clients/${client.id}`} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:text-primary hover:border-primary transition-all shadow-sm" title="View Profile">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </Link>
                        <button onClick={() => openEditModal(client)} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:text-primary hover:border-primary transition-all shadow-sm" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{total} Clients Total</p>
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-300">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-navy">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h2 className="text-3xl font-black text-navy mb-2">{editingClient ? "Edit Client" : "Add New Client"}</h2>
            <p className="text-slate-500 font-medium mb-10">{editingClient ? "Update the client's information below." : "Fill in the details to register a new insurance client."}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anil Kapoor"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@email.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-navy"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-10 pt-8 border-t border-slate-100">
              <button onClick={closeModal} className="px-8 py-4 rounded-2xl border border-slate-200 text-navy font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.phone || !formData.date_of_birth}
                className="px-10 py-4 rounded-2xl bg-navy text-white font-bold hover:bg-primary transition-all shadow-xl shadow-navy/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editingClient ? "Update Client" : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
