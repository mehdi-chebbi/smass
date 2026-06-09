"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Newspaper,
  Settings,
  BarChart3,
  Users,
  Search,
  Save,
  X,
  Map,
  MapPin,
  Layers,
  LogOut,
  Loader2,
  Upload,
  File,
  Globe,
  CheckCircle,
  AlertCircle,
  Building,
  Briefcase,
  RefreshCw,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Download,
  BookOpen,
  GraduationCap,
  FilePlus,
  BarChart2,
  Tag,
  Folder,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, getAssetUrl } from "@/lib/api/config";

// BACKEND constant removed — API calls use apiClient (relative paths), assets use getAssetUrl

type Tab =
  | "dashboard"
  | "contents"
  | "news"
  | "publications"
  | "tenders"
  | "statistics"
  | "partners"
  | "map-layers"
  | "map-points"
  | "settings"
  | "users";
interface ToastMsg {
  id: number;
  type: "success" | "error";
  text: string;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({
  toasts,
  remove,
}: {
  toasts: ToastMsg[];
  remove: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium pointer-events-auto ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
        >
          {t.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{t.text}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM ──────────────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, message, onConfirm, onCancel }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── FILE UPLOADER (universel : image, PDF, vidéo, doc) ───────────────────────
interface UploadedFile {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  label?: string;
  labelFr?: string;
}

function FileUploader({
  accept = "*",
  label = "Cliquer pour uploader",
  hint = "",
  onUploaded,
  maxMB = 500,
}: {
  accept?: string;
  label?: string;
  hint?: string;
  onUploaded: (file: UploadedFile) => void;
  maxMB?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Fichier trop lourd (max ${maxMB}MB).`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("smas_auth_token");
      const res = await fetch('/api/upload', {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onUploaded({
        url: data.file.url,
        filename: data.file.originalName,
        mimeType: data.file.mimeType,
        size: data.file.size,
      });
    } catch (err: any) {
      setError(err.message || "Upload échoué");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1">
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Upload en cours…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Upload className="w-6 h-6" />
            <span className="text-sm font-medium text-gray-600">{label}</span>
            {hint && <span className="text-xs text-gray-400">{hint}</span>}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── IMAGE FIELD (upload OU URL) ──────────────────────────────────────────────
function ImageField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [mode, setMode] = useState<"url" | "upload">(
    value && !value.startsWith("/") ? "url" : "upload",
  );
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex rounded-lg border overflow-hidden text-xs">
          <button
            onClick={() => setMode("url")}
            className={`px-3 py-1 ${mode === "url" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <LinkIcon className="w-3 h-3 inline mr-1" />
            URL
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`px-3 py-1 ${mode === "upload" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Upload
          </button>
        </div>
      </div>
      {mode === "url" ? (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <FileUploader
          accept="image/*"
          label="Cliquer pour uploader une image"
          hint="JPG, PNG, WebP, GIF (max 10MB)"
          maxMB={10}
          onUploaded={(f) => onChange(f.url)}
        />
      )}
      {value && (
        <div className="relative rounded-lg overflow-hidden h-24 bg-gray-100">
          <img
            src={getAssetUrl(value)}
            alt="preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FILES MANAGER (pour publications et news) ────────────────────────────────
function FilesManager({
  files,
  onChange,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const mimeIcon = (mimeType: string) => {
    if (mimeType?.startsWith("image/"))
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    if (mimeType?.startsWith("video/"))
      return <Video className="w-4 h-4 text-purple-500" />;
    if (mimeType === "application/pdf")
      return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const updateLabel = (i: number, lang: "label" | "labelFr", val: string) => {
    const copy = [...files];
    copy[i] = { ...copy[i], [lang]: val };
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      <FileUploader
        accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
        label="Ajouter un fichier (image, vidéo, PDF, document)"
        hint="Max 500MB pour les vidéos, 50MB pour les autres"
        maxMB={500}
        onUploaded={(f) => onChange([...files, f])}
      />
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border"
            >
              <div className="flex items-center gap-2">
                {mimeIcon(f.mimeType)}
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {f.filename}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatSize(f.size)}
                </span>
                <a
                  href={getAssetUrl(f.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Label (EN)"
                  value={f.label || ""}
                  onChange={(e) => updateLabel(i, "label", e.target.value)}
                  className="text-xs h-7"
                />
                <Input
                  placeholder="Libellé (FR)"
                  value={f.labelFr || ""}
                  onChange={(e) => updateLabel(i, "labelFr", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-800",
    DRAFT: "bg-amber-100 text-amber-800",
    ARCHIVED: "bg-gray-100 text-gray-700",
    OPEN: "bg-blue-100 text-blue-800",
    CLOSED: "bg-red-100 text-red-800",
    AWARDED: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
    true: "bg-emerald-100 text-emerald-800",
    false: "bg-amber-100 text-amber-800",
  };
  const label =
    status === "true" ? "Published" : status === "false" ? "Draft" : status;
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100"}`}
    >
      {label}
    </span>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}

// ─── TABLE ROW ACTIONS ────────────────────────────────────────────────────────
function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="h-8 w-8 p-0"
      >
        <Edit className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [confirm, setConfirm] = useState<any>({ open: false });

  // Data
  const [contents, setContents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [mapLayers, setMapLayers] = useState<any[]>([]);
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);

  const [modal, setModal] = useState<{ type: string | null; data: any }>({
    type: null,
    data: null,
  });

  const toast = (type: "success" | "error", text: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };
  const removeToast = (id: number) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  const askDelete = (title: string, onConfirm: () => void) =>
    setConfirm({
      open: true,
      title: `Supprimer "${title}"?`,
      message: "Cette action est irréversible.",
      onConfirm,
    });

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setCurrentUser(authApi.getStoredUser());
    fetchAll();
  }, [router]);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        apiClient.get(API_ENDPOINTS.contents + "?limit=100"),
        apiClient.get(API_ENDPOINTS.newsAll),
        apiClient.get("/api/publications/all?limit=100"),
        apiClient.get(API_ENDPOINTS.tenders + "?limit=100"),
        apiClient.get(API_ENDPOINTS.statisticsAll),
        apiClient.get(API_ENDPOINTS.partnersAll),
        apiClient.get(API_ENDPOINTS.mapLayers),
        apiClient.get(API_ENDPOINTS.mapPoints),
        apiClient.get(API_ENDPOINTS.users),
        apiClient.get(API_ENDPOINTS.settings),
      ]);
      const get = (r: PromiseSettledResult<any>, key: string) =>
        r.status === "fulfilled" ? (r.value as any)[key] || [] : [];
      setContents(get(results[0], "contents"));
      setNews(get(results[1], "news"));
      setPublications(get(results[2], "publications"));
      setTenders(get(results[3], "tenders"));
      setStatistics(get(results[4], "statistics"));
      setPartners(get(results[5], "partners"));
      setMapLayers(get(results[6], "layers"));
      setMapPoints(get(results[7], "points"));
      setUsers(get(results[8], "users"));
      setSettings(get(results[9], "settings"));
    } catch (e) {
      toast("error", "Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (k: string, v: any) =>
    setModal((m) => ({ ...m, data: { ...m.data, [k]: v } }));
  const openModal = (type: string, data: any) =>
    setModal({ type, data: { ...data } });
  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    const { type, data } = modal;
    if (!data || !type) return;
    setIsSaving(true);
    try {
      const isEdit = !!data.id;
      const endpoints: Record<string, string> = {
        content: API_ENDPOINTS.contents,
        news: API_ENDPOINTS.news,
        publication: "/api/publications",
        tender: API_ENDPOINTS.tenders,
        statistic: API_ENDPOINTS.statistics,
        partner: API_ENDPOINTS.partners,
        "map-layer": API_ENDPOINTS.mapLayers,
        "map-point": API_ENDPOINTS.mapPoints,
        user: API_ENDPOINTS.users,
        setting: `${API_ENDPOINTS.settings}/${data.key}`,
      };
      const base = endpoints[type];
      if (!base) return;

      const payload = { ...data };

      if (isEdit) {
        if (type === "setting")
          await apiClient.put(base, {
            value: data.value,
            valueFr: data.valueFr,
          });
        else await apiClient.put(`${base}/${data.id}`, payload);
      } else {
        await apiClient.post(base, payload);
      }

      toast(
        "success",
        `${type} ${isEdit ? "mis à jour" : "créé"} avec succès !`,
      );
      closeModal();
      fetchAll();
    } catch (err: any) {
      toast("error", err.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    const endpoints: Record<string, string> = {
      content: API_ENDPOINTS.contents,
      news: API_ENDPOINTS.news,
      publication: "/api/publications",
      tender: API_ENDPOINTS.tenders,
      statistic: API_ENDPOINTS.statistics,
      partner: API_ENDPOINTS.partners,
      "map-layer": API_ENDPOINTS.mapLayers,
      "map-point": API_ENDPOINTS.mapPoints,
    };
    try {
      await apiClient.delete(`${endpoints[type]}/${id}`);
      toast("success", "Supprimé avec succès");
      fetchAll();
    } catch (err: any) {
      toast("error", err.message || "Erreur lors de la suppression");
    }
    setConfirm({ open: false });
  };

  // ─── NAV ──────────────────────────────────────────────────────────────────
  const navItems: {
    key: Tab;
    label: string;
    icon: any;
    adminOnly?: boolean;
  }[] = [
    { key: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { key: "news", label: "Actualités", icon: Newspaper },
    { key: "publications", label: "Publications", icon: BookOpen },
    { key: "contents", label: "Contenus", icon: FileText },
    { key: "tenders", label: "Appels d'offres", icon: Briefcase },
    { key: "statistics", label: "Statistiques", icon: BarChart2 },
    { key: "partners", label: "Partenaires", icon: Building },
    { key: "map-layers", label: "Couches carte", icon: Layers },
    { key: "map-points", label: "Points carte", icon: MapPin },
    { key: "users", label: "Utilisateurs", icon: Users, adminOnly: true },
    { key: "settings", label: "Paramètres", icon: Settings, adminOnly: true },
  ];

  const filtered = (
    arr: any[],
    fields = ["title", "titleFr", "name", "nameFr"],
  ) =>
    arr.filter(
      (item) =>
        !search ||
        fields.some((f) =>
          (item[f] || "").toLowerCase().includes(search.toLowerCase()),
        ),
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Chargement du panneau admin…
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmDialog
        {...confirm}
        onConfirm={() => confirm.onConfirm?.()}
        onCancel={() => setConfirm({ open: false })}
      />

      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r flex flex-col shrink-0 shadow-sm">
        <div className="p-5 border-b bg-gradient-to-br from-blue-700 to-blue-900">
          <h1 className="text-white font-bold text-xl">SMAS Admin</h1>
          <p className="text-blue-200 text-xs mt-0.5">
            {currentUser?.firstName} {currentUser?.lastName}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-white text-xs">
            {currentUser?.role}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems
            .filter((i) => !i.adminOnly || currentUser?.role === "ADMIN")
            .map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${activeTab === item.key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <Link href="/" target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
            >
              <Globe className="w-4 h-4" />
              Voir le site
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs text-red-600 hover:text-red-700"
            onClick={() => {
              authApi.logout();
              router.push("/admin/login");
            }}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* ─── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="font-bold text-xl text-gray-900 capitalize">
              {navItems.find((n) => n.key === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {activeTab !== "dashboard" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="pl-9 w-56 h-9"
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAll}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* ─── DASHBOARD ────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Actualités",
                    value: news.length,
                    icon: Newspaper,
                    sub: `${news.filter((n) => n.isPublished).length} publiées`,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    label: "Publications",
                    value: publications.length,
                    icon: BookOpen,
                    sub: `${publications.filter((p) => p.isPublished).length} publiées`,
                    color: "text-purple-600 bg-purple-50",
                  },
                  {
                    label: "Appels d'offres",
                    value: tenders.length,
                    icon: Briefcase,
                    sub: `${tenders.filter((t) => t.status === "OPEN").length} ouverts`,
                    color: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    label: "Contenus",
                    value: contents.length,
                    icon: FileText,
                    sub: `${contents.filter((c) => c.status === "PUBLISHED").length} publiés`,
                    color: "text-amber-600 bg-amber-50",
                  },
                ].map((s) => (
                  <Card key={s.label}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <div className={`p-2 rounded-lg ${s.color}`}>
                          <s.icon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {s.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Dernières actualités
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {news.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className="py-2.5 flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                          {n.title}
                        </span>
                        <StatusBadge
                          status={n.isPublished ? "PUBLISHED" : "DRAFT"}
                        />
                      </div>
                    ))}
                    {news.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        Aucune actualité
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Dernières publications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {publications.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="py-2.5 flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                          {p.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {p.publicationType}
                        </span>
                      </div>
                    ))}
                    {publications.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        Aucune publication
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ─── NEWS ─────────────────────────────────────────────────────── */}
          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("news", {
                      title: "",
                      slug: "",
                      content: "",
                      isPublished: false,
                      isEvent: false,
                      attachments: [],
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle actualité
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {["Titre", "Statut", "Type", "Date", ""].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered(news).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>
                            {item.titleFr && (
                              <div className="text-xs text-gray-400">
                                {item.titleFr}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={item.isPublished ? "PUBLISHED" : "DRAFT"}
                            />
                          </td>
                          <td className="px-4 py-3">
                            {item.isEvent ? (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Événement
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                Actualité
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(item.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() =>
                                openModal("news", {
                                  ...item,
                                  attachments: item.attachments
                                    ? JSON.parse(item.attachments)
                                    : [],
                                })
                              }
                              onDelete={() =>
                                askDelete(item.title, () =>
                                  handleDelete("news", item.id),
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {news.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucune actualité
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── PUBLICATIONS ─────────────────────────────────────────────── */}
          {activeTab === "publications" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("publication", {
                      title: "",
                      slug: "",
                      publicationType: "REPORT",
                      isPublished: false,
                      files: [],
                    })
                  }
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle publication
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {[
                          "Titre",
                          "Type",
                          "Fichiers",
                          "Statut",
                          "Date",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered(publications).map((item) => {
                        const files = item.files
                          ? (() => {
                              try {
                                return JSON.parse(item.files);
                              } catch {
                                return [];
                              }
                            })()
                          : [];
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {item.title}
                              </div>
                              {item.titleFr && (
                                <div className="text-xs text-gray-400">
                                  {item.titleFr}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                {item.publicationType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {files.length} fichier(s)
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge
                                status={
                                  item.isPublished ? "PUBLISHED" : "DRAFT"
                                }
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {new Date(item.createdAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <RowActions
                                onEdit={() =>
                                  openModal("publication", { ...item, files })
                                }
                                onDelete={() =>
                                  askDelete(item.title, () =>
                                    handleDelete("publication", item.id),
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {publications.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucune publication
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── CONTENTS ─────────────────────────────────────────────────── */}
          {activeTab === "contents" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("content", {
                      title: "",
                      slug: "",
                      content: "",
                      contentType: "PAGE",
                      status: "DRAFT",
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau contenu
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {["Titre", "Type", "Statut", "Date", ""].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered(contents).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.title}</div>
                            {item.titleFr && (
                              <div className="text-xs text-gray-400">
                                {item.titleFr}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {item.contentType}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(item.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => openModal("content", item)}
                              onDelete={() =>
                                askDelete(item.title, () =>
                                  handleDelete("content", item.id),
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {contents.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucun contenu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── TENDERS ─────────────────────────────────────────────────── */}
          {activeTab === "tenders" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("tender", {
                      title: "",
                      slug: "",
                      type: "SERVICE",
                      status: "OPEN",
                      deadline: "",
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel appel d'offres
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {["Titre", "Type", "Statut", "Échéance", ""].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered(tenders).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.title}</div>
                            {item.reference && (
                              <div className="text-xs text-gray-400">
                                {item.reference}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {item.type}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {item.deadline
                              ? new Date(item.deadline).toLocaleDateString(
                                  "fr-FR",
                                )
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => openModal("tender", item)}
                              onDelete={() =>
                                askDelete(item.title, () =>
                                  handleDelete("tender", item.id),
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {tenders.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucun appel d'offres
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── STATISTICS ──────────────────────────────────────────────── */}
          {activeTab === "statistics" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("statistic", {
                      label: "",
                      value: "",
                      icon: "",
                      order: 0,
                      isActive: true,
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle statistique
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.map((s) => (
                  <Card key={s.id} className="relative group">
                    <CardContent className="p-5 text-center">
                      {s.icon && <div className="text-3xl mb-2">{s.icon}</div>}
                      <div className="text-2xl font-bold text-blue-700">
                        {s.value}
                        <span className="text-base text-gray-400 ml-1">
                          {s.unit}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {s.label}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RowActions
                          onEdit={() => openModal("statistic", s)}
                          onDelete={() =>
                            askDelete(s.label, () =>
                              handleDelete("statistic", s.id),
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statistics.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    Aucune statistique
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── PARTNERS ────────────────────────────────────────────────── */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("partner", { name: "", slug: "", logo: "" })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau partenaire
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered(partners, ["name", "nameFr"]).map((p) => (
                  <Card key={p.id} className="relative group">
                    <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                      {p.logo && (
                        <img
                          src={getAssetUrl(p.logo)}
                          alt={p.name}
                          className="h-14 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div className="font-semibold text-gray-800">
                        {p.name}
                      </div>
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          className="text-xs text-blue-500 hover:underline truncate max-w-full"
                        >
                          {p.website}
                        </a>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RowActions
                          onEdit={() => openModal("partner", p)}
                          onDelete={() =>
                            askDelete(p.name, () =>
                              handleDelete("partner", p.id),
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {partners.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    Aucun partenaire
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── MAP LAYERS ──────────────────────────────────────────────── */}
          {activeTab === "map-layers" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("map-layer", {
                      name: "",
                      slug: "",
                      layerType: "POLYGON",
                      color: "#3388ff",
                      fillColor: "#3388ff",
                      fillOpacity: 0.35,
                      borderColor: "#3388ff",
                      borderOpacity: 1,
                      opacity: 0.8,
                      weight: 2,
                      showLabels: false,
                      labelField: "",
                      labelFontSize: 12,
                      categorize: false,
                      categorizeField: "",
                      geoData: '{"type":"FeatureCollection","features":[]}',
                      isVisible: true,
                      isDefault: false,
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle couche
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {["Couche", "Type", "Couleur", "Visible", ""].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mapLayers.map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{l.name}</div>
                            {l.nameFr && (
                              <div className="text-xs text-gray-400">
                                {l.nameFr}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {l.layerType}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border"
                                style={{ backgroundColor: l.color }}
                              />
                              <span className="text-xs font-mono text-gray-500">
                                {l.color}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {l.isVisible ? (
                              <Eye className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions
                              onEdit={() => openModal("map-layer", l)}
                              onDelete={() =>
                                askDelete(l.name, () =>
                                  handleDelete("map-layer", l.id),
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {mapLayers.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucune couche
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── MAP POINTS ──────────────────────────────────────────────── */}
          {activeTab === "map-points" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    openModal("map-point", {
                      name: "",
                      latitude: "",
                      longitude: "",
                      color: "#ff5722",
                      size: 10,
                      isActive: true,
                    })
                  }
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau point
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {["Nom", "Coordonnées", "Catégorie", "Couleur", ""].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered(mapPoints, ["name", "nameFr", "category"]).map(
                        (p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium">{p.name}</div>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-gray-500">
                              {Number(p.latitude).toFixed(4)},{" "}
                              {Number(p.longitude).toFixed(4)}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {p.category || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: p.color }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <RowActions
                                onEdit={() => openModal("map-point", p)}
                                onDelete={() =>
                                  askDelete(p.name, () =>
                                    handleDelete("map-point", p.id),
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ),
                      )}
                      {mapPoints.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Aucun point
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── USERS ───────────────────────────────────────────────────── */}
          {activeTab === "users" && currentUser?.role === "ADMIN" && (
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {["Nom", "Email", "Rôle", "Pays", "Statut"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {u.country}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={u.isActive ? "PUBLISHED" : "DRAFT"}
                          />
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-400"
                        >
                          Aucun utilisateur
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* ─── SETTINGS ────────────────────────────────────────────────── */}
          {activeTab === "settings" && currentUser?.role === "ADMIN" && (
            <div className="space-y-3 max-w-2xl">
              {settings.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-mono text-xs text-gray-400 mb-0.5">
                          {s.key}
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {s.value}
                        </p>
                        {s.valueFr && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            [FR] {s.valueFr}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal("setting", s)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {settings.length === 0 && (
                <p className="text-center py-12 text-gray-400">
                  Aucun paramètre
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── MODAL ────────────────────────────────────────────────────────── */}
      <Dialog
        open={!!modal.type}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal.data?.id ? "Modifier" : "Créer"} — {modal.type}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* ── NEWS FORM ──────────────────────────────────────────────── */}
            {modal.type === "news" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Titre (EN) *">
                    <Input
                      value={modal.data?.title || ""}
                      onChange={(e) => {
                        updateField("title", e.target.value);
                        if (!modal.data?.id)
                          updateField("slug", slugify(e.target.value));
                      }}
                    />
                  </FF>
                  <FF label="Titre (FR)">
                    <Input
                      value={modal.data?.titleFr || ""}
                      onChange={(e) => updateField("titleFr", e.target.value)}
                    />
                  </FF>
                </div>
                <FF label="Slug *">
                  <Input
                    value={modal.data?.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="font-mono text-sm"
                  />
                </FF>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Résumé (EN)">
                    <Textarea
                      value={modal.data?.excerpt || ""}
                      onChange={(e) => updateField("excerpt", e.target.value)}
                      rows={2}
                    />
                  </FF>
                  <FF label="Résumé (FR)">
                    <Textarea
                      value={modal.data?.excerptFr || ""}
                      onChange={(e) => updateField("excerptFr", e.target.value)}
                      rows={2}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Contenu (EN) *">
                    <Textarea
                      value={modal.data?.content || ""}
                      onChange={(e) => updateField("content", e.target.value)}
                      rows={6}
                    />
                  </FF>
                  <FF label="Contenu (FR)">
                    <Textarea
                      value={modal.data?.contentFr || ""}
                      onChange={(e) => updateField("contentFr", e.target.value)}
                      rows={6}
                    />
                  </FF>
                </div>

                {/* Image : URL ou upload */}
                <ImageField
                  label="Image principale"
                  value={modal.data?.featuredImage || ""}
                  onChange={(v) => updateField("featuredImage", v)}
                />

                {/* Pièces jointes (PDF, images, vidéos) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Pièces jointes
                  </Label>
                  <p className="text-xs text-gray-400">
                    Ajoutez des fichiers que les visiteurs pourront télécharger
                    (PDF, images, vidéos, documents…)
                  </p>
                  <FilesManager
                    files={modal.data?.attachments || []}
                    onChange={(v) => updateField("attachments", v)}
                  />
                </div>

                <div className="flex items-center gap-8 pt-2">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!!modal.data?.isPublished}
                      onCheckedChange={(v) => updateField("isPublished", v)}
                    />
                    <Label>Publier</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!!modal.data?.isEvent}
                      onCheckedChange={(v) => updateField("isEvent", v)}
                    />
                    <Label>Événement</Label>
                  </div>
                </div>
                {modal.data?.isEvent && (
                  <FF label="Date de l'événement">
                    <Input
                      type="datetime-local"
                      value={
                        modal.data?.eventDate
                          ? new Date(modal.data.eventDate)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => updateField("eventDate", e.target.value)}
                    />
                  </FF>
                )}
              </div>
            )}

            {/* ── PUBLICATION FORM ──────────────────────────────────────── */}
            {modal.type === "publication" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Titre (EN) *">
                    <Input
                      value={modal.data?.title || ""}
                      onChange={(e) => {
                        updateField("title", e.target.value);
                        if (!modal.data?.id)
                          updateField("slug", slugify(e.target.value));
                      }}
                    />
                  </FF>
                  <FF label="Titre (FR)">
                    <Input
                      value={modal.data?.titleFr || ""}
                      onChange={(e) => updateField("titleFr", e.target.value)}
                    />
                  </FF>
                </div>
                <FF label="Slug *">
                  <Input
                    value={modal.data?.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="font-mono text-sm"
                  />
                </FF>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Type de publication *">
                    <Select
                      value={modal.data?.publicationType || "REPORT"}
                      onValueChange={(v) => updateField("publicationType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REPORT">Rapport</SelectItem>
                        <SelectItem value="ADAPTATION">Adaptation</SelectItem>
                        <SelectItem value="KNOWLEDGE">Connaissance</SelectItem>
                        <SelectItem value="TRAINING">Formation</SelectItem>
                        <SelectItem value="OTHER">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FF>
                  <FF label="Date de publication">
                    <Input
                      type="date"
                      value={
                        modal.data?.date
                          ? new Date(modal.data.date).toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) => updateField("date", e.target.value)}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Description (EN)">
                    <Textarea
                      value={modal.data?.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                  <FF label="Description (FR)">
                    <Textarea
                      value={modal.data?.descriptionFr || ""}
                      onChange={(e) =>
                        updateField("descriptionFr", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Auteurs">
                    <Input
                      value={modal.data?.authors || ""}
                      onChange={(e) => updateField("authors", e.target.value)}
                      placeholder="OSS, OMVS…"
                    />
                  </FF>
                  <FF label="Langue">
                    <Input
                      value={modal.data?.language || "EN/FR"}
                      onChange={(e) => updateField("language", e.target.value)}
                      placeholder="EN/FR"
                    />
                  </FF>
                </div>

                {/* Cover image */}
                <ImageField
                  label="Image de couverture"
                  value={modal.data?.coverImage || ""}
                  onChange={(v) => updateField("coverImage", v)}
                />

                {/* Files (PDF, videos, images, docs) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Fichiers téléchargeables
                  </Label>
                  <p className="text-xs text-gray-400">
                    Ajoutez les documents que les visiteurs pourront
                    télécharger. Vous pouvez ajouter plusieurs fichiers (PDF,
                    rapport, vidéo de présentation, etc.)
                  </p>
                  <FilesManager
                    files={modal.data?.files || []}
                    onChange={(v) => updateField("files", v)}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={!!modal.data?.isPublished}
                    onCheckedChange={(v) => updateField("isPublished", v)}
                  />
                  <Label>Publier sur le site</Label>
                </div>
              </div>
            )}

            {/* ── CONTENT FORM ───────────────────────────────────────────── */}
            {modal.type === "content" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Titre (EN) *">
                    <Input
                      value={modal.data?.title || ""}
                      onChange={(e) => {
                        updateField("title", e.target.value);
                        if (!modal.data?.id)
                          updateField("slug", slugify(e.target.value));
                      }}
                    />
                  </FF>
                  <FF label="Titre (FR)">
                    <Input
                      value={modal.data?.titleFr || ""}
                      onChange={(e) => updateField("titleFr", e.target.value)}
                    />
                  </FF>
                </div>
                <FF label="Slug *">
                  <Input
                    value={modal.data?.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="font-mono text-sm"
                  />
                </FF>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Type *">
                    <Select
                      value={modal.data?.contentType || "PAGE"}
                      onValueChange={(v) => updateField("contentType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "PAGE",
                          "NEWS",
                          "REPORT",
                          "DOCUMENT",
                          "EVENT",
                          "HERO",
                          "ABOUT",
                          "COMPONENT",
                          "PARTNER",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FF>
                  <FF label="Statut *">
                    <Select
                      value={modal.data?.status || "DRAFT"}
                      onValueChange={(v) => updateField("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="PUBLISHED">Publié</SelectItem>
                        <SelectItem value="ARCHIVED">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Résumé (EN)">
                    <Textarea
                      value={modal.data?.excerpt || ""}
                      onChange={(e) => updateField("excerpt", e.target.value)}
                      rows={3}
                    />
                  </FF>
                  <FF label="Résumé (FR)">
                    <Textarea
                      value={modal.data?.excerptFr || ""}
                      onChange={(e) => updateField("excerptFr", e.target.value)}
                      rows={3}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Contenu (EN) *">
                    <Textarea
                      value={modal.data?.content || ""}
                      onChange={(e) => updateField("content", e.target.value)}
                      rows={6}
                    />
                  </FF>
                  <FF label="Contenu (FR)">
                    <Textarea
                      value={modal.data?.contentFr || ""}
                      onChange={(e) => updateField("contentFr", e.target.value)}
                      rows={6}
                    />
                  </FF>
                </div>
                <ImageField
                  label="Image principale"
                  value={modal.data?.featuredImage || ""}
                  onChange={(v) => updateField("featuredImage", v)}
                />
              </div>
            )}

            {/* ── TENDER FORM ───────────────────────────────────────────── */}
            {modal.type === "tender" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Titre (EN) *">
                    <Input
                      value={modal.data?.title || ""}
                      onChange={(e) => {
                        updateField("title", e.target.value);
                        if (!modal.data?.id)
                          updateField("slug", slugify(e.target.value));
                      }}
                    />
                  </FF>
                  <FF label="Titre (FR)">
                    <Input
                      value={modal.data?.titleFr || ""}
                      onChange={(e) => updateField("titleFr", e.target.value)}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Slug *">
                    <Input
                      value={modal.data?.slug || ""}
                      onChange={(e) => updateField("slug", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </FF>
                  <FF label="Référence">
                    <Input
                      value={modal.data?.reference || ""}
                      onChange={(e) => updateField("reference", e.target.value)}
                      placeholder="REF-2025-001"
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Type">
                    <Select
                      value={modal.data?.type || "SERVICE"}
                      onValueChange={(v) => updateField("type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SERVICE">Service</SelectItem>
                        <SelectItem value="SUPPLY">Fourniture</SelectItem>
                        <SelectItem value="WORKS">Travaux</SelectItem>
                        <SelectItem value="CONSULTANCY">Consultance</SelectItem>
                      </SelectContent>
                    </Select>
                  </FF>
                  <FF label="Statut">
                    <Select
                      value={modal.data?.status || "OPEN"}
                      onValueChange={(v) => updateField("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Ouvert</SelectItem>
                        <SelectItem value="CLOSED">Fermé</SelectItem>
                        <SelectItem value="AWARDED">Attribué</SelectItem>
                        <SelectItem value="CANCELLED">Annulé</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                      </SelectContent>
                    </Select>
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Échéance *">
                    <Input
                      type="datetime-local"
                      value={
                        modal.data?.deadline
                          ? new Date(modal.data.deadline)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => updateField("deadline", e.target.value)}
                    />
                  </FF>
                  <FF label="Date d'ouverture">
                    <Input
                      type="datetime-local"
                      value={
                        modal.data?.openingDate
                          ? new Date(modal.data.openingDate)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        updateField("openingDate", e.target.value)
                      }
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Description (EN)">
                    <Textarea
                      value={modal.data?.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                  <FF label="Description (FR)">
                    <Textarea
                      value={modal.data?.descriptionFr || ""}
                      onChange={(e) =>
                        updateField("descriptionFr", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                </div>
                <FF label="Document (PDF)">
                  <div className="space-y-2">
                    <FileUploader
                      accept="application/pdf"
                      label="Upload PDF de l'appel d'offres"
                      hint="Max 50MB"
                      maxMB={50}
                      onUploaded={(f) => updateField("documentUrl", f.url)}
                    />
                    {modal.data?.documentUrl && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                        <FileText className="w-4 h-4" />
                        <a
                          href={getAssetUrl(modal.data.documentUrl)}
                          target="_blank"
                          className="underline truncate"
                        >
                          {modal.data.documentUrl.split("/").pop()}
                        </a>
                        <button
                          onClick={() => updateField("documentUrl", "")}
                          className="ml-auto text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </FF>
                <div className="grid grid-cols-3 gap-4">
                  <FF label="Contact">
                    <Input
                      value={modal.data?.contactName || ""}
                      onChange={(e) =>
                        updateField("contactName", e.target.value)
                      }
                    />
                  </FF>
                  <FF label="Email">
                    <Input
                      type="email"
                      value={modal.data?.contactEmail || ""}
                      onChange={(e) =>
                        updateField("contactEmail", e.target.value)
                      }
                    />
                  </FF>
                  <FF label="Budget">
                    <Input
                      type="number"
                      value={modal.data?.budget || ""}
                      onChange={(e) => updateField("budget", e.target.value)}
                    />
                  </FF>
                </div>
              </div>
            )}

            {/* ── STATISTIC FORM ────────────────────────────────────────── */}
            {modal.type === "statistic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Label (EN) *">
                    <Input
                      value={modal.data?.label || ""}
                      onChange={(e) => updateField("label", e.target.value)}
                    />
                  </FF>
                  <FF label="Label (FR)">
                    <Input
                      value={modal.data?.labelFr || ""}
                      onChange={(e) => updateField("labelFr", e.target.value)}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FF label="Valeur *">
                    <Input
                      value={modal.data?.value || ""}
                      onChange={(e) => updateField("value", e.target.value)}
                    />
                  </FF>
                  <FF label="Unité (EN)">
                    <Input
                      value={modal.data?.unit || ""}
                      onChange={(e) => updateField("unit", e.target.value)}
                      placeholder="km², millions…"
                    />
                  </FF>
                  <FF label="Unité (FR)">
                    <Input
                      value={modal.data?.unitFr || ""}
                      onChange={(e) => updateField("unitFr", e.target.value)}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Icône (emoji)">
                    <Input
                      value={modal.data?.icon || ""}
                      onChange={(e) => updateField("icon", e.target.value)}
                      placeholder="💧"
                    />
                  </FF>
                  <FF label="Ordre">
                    <Input
                      type="number"
                      value={modal.data?.order || 0}
                      onChange={(e) =>
                        updateField("order", parseInt(e.target.value))
                      }
                    />
                  </FF>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={!!modal.data?.isActive}
                    onCheckedChange={(v) => updateField("isActive", v)}
                  />
                  <Label>Actif</Label>
                </div>
              </div>
            )}

            {/* ── PARTNER FORM ───────────────────────────────────────────── */}
            {modal.type === "partner" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Nom (EN) *">
                    <Input
                      value={modal.data?.name || ""}
                      onChange={(e) => {
                        updateField("name", e.target.value);
                        if (!modal.data?.id)
                          updateField("slug", slugify(e.target.value));
                      }}
                    />
                  </FF>
                  <FF label="Nom (FR)">
                    <Input
                      value={modal.data?.nameFr || ""}
                      onChange={(e) => updateField("nameFr", e.target.value)}
                    />
                  </FF>
                </div>
                <FF label="Slug *">
                  <Input
                    value={modal.data?.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="font-mono text-sm"
                  />
                </FF>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Description (EN)">
                    <Textarea
                      value={modal.data?.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                  <FF label="Description (FR)">
                    <Textarea
                      value={modal.data?.descriptionFr || ""}
                      onChange={(e) =>
                        updateField("descriptionFr", e.target.value)
                      }
                      rows={3}
                    />
                  </FF>
                </div>
                <ImageField
                  label="Logo"
                  value={modal.data?.logo || ""}
                  onChange={(v) => updateField("logo", v)}
                />
                <FF label="Site web">
                  <Input
                    type="url"
                    value={modal.data?.website || ""}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://…"
                  />
                </FF>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Ordre">
                    <Input
                      type="number"
                      value={modal.data?.order || 0}
                      onChange={(e) =>
                        updateField("order", parseInt(e.target.value))
                      }
                    />
                  </FF>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={modal.data?.isActive !== false}
                      onCheckedChange={(v) => updateField("isActive", v)}
                    />
                    <Label>Actif</Label>
                  </div>
                </div>
              </div>
            )}

            {/* ── MAP LAYER FORM ─────────────────────────────────────────── */}
            {modal.type === "map-layer" && (
              <div className="space-y-5">
                {/* ── Identité ─────────────────────────────────── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Identité
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FF label="Nom (EN) *">
                      <Input
                        value={modal.data?.name || ""}
                        onChange={(e) => {
                          updateField("name", e.target.value);
                          if (!modal.data?.id)
                            updateField("slug", slugify(e.target.value));
                        }}
                      />
                    </FF>
                    <FF label="Nom (FR)">
                      <Input
                        value={modal.data?.nameFr || ""}
                        onChange={(e) => updateField("nameFr", e.target.value)}
                      />
                    </FF>
                  </div>
                  <FF label="Slug *">
                    <Input
                      value={modal.data?.slug || ""}
                      onChange={(e) => updateField("slug", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </FF>
                  <FF label="Type de couche">
                    <Select
                      value={modal.data?.layerType || "POLYGON"}
                      onValueChange={(v) => updateField("layerType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POLYGON">Polygone</SelectItem>
                        <SelectItem value="POINT">Point</SelectItem>
                        <SelectItem value="LINE">Ligne</SelectItem>
                        <SelectItem value="VECTOR">Vecteur</SelectItem>
                        <SelectItem value="RASTER">Raster</SelectItem>
                      </SelectContent>
                    </Select>
                  </FF>
                  <FF label="Source">
                    <Input
                      value={modal.data?.source || ""}
                      onChange={(e) => updateField("source", e.target.value)}
                      placeholder="OSS, OMVS…"
                    />
                  </FF>
                </div>

                {/* ── Style de remplissage ──────────────────── */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Remplissage
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FF label="Couleur de remplissage">
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            modal.data?.fillColor ||
                            modal.data?.color ||
                            "#3388ff"
                          }
                          onChange={(e) =>
                            updateField("fillColor", e.target.value)
                          }
                          className="w-10 h-10 rounded cursor-pointer border flex-shrink-0"
                        />
                        <Input
                          value={
                            modal.data?.fillColor ||
                            modal.data?.color ||
                            "#3388ff"
                          }
                          onChange={(e) =>
                            updateField("fillColor", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                    </FF>
                    <FF label="Opacité remplissage (0–1)">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={modal.data?.fillOpacity ?? 0.35}
                          onChange={(e) =>
                            updateField(
                              "fillOpacity",
                              parseFloat(e.target.value),
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-10 text-right">
                          {(modal.data?.fillOpacity ?? 0.35).toFixed(2)}
                        </span>
                      </div>
                    </FF>
                  </div>
                </div>

                {/* ── Style de bordure ──────────────────────── */}
                <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 space-y-3">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                    Bordure
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FF label="Couleur bordure">
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            modal.data?.borderColor ||
                            modal.data?.color ||
                            "#3388ff"
                          }
                          onChange={(e) =>
                            updateField("borderColor", e.target.value)
                          }
                          className="w-10 h-10 rounded cursor-pointer border flex-shrink-0"
                        />
                        <Input
                          value={
                            modal.data?.borderColor ||
                            modal.data?.color ||
                            "#3388ff"
                          }
                          onChange={(e) =>
                            updateField("borderColor", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                    </FF>
                    <FF label="Opacité bordure (0–1)">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={modal.data?.borderOpacity ?? 1}
                          onChange={(e) =>
                            updateField(
                              "borderOpacity",
                              parseFloat(e.target.value),
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-10 text-right">
                          {(modal.data?.borderOpacity ?? 1).toFixed(2)}
                        </span>
                      </div>
                    </FF>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FF label="Épaisseur bordure (px)">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={modal.data?.weight ?? 2}
                        onChange={(e) =>
                          updateField("weight", parseInt(e.target.value))
                        }
                      />
                    </FF>
                    <FF label="Opacité globale couche (0–1)">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={modal.data?.opacity ?? 0.8}
                          onChange={(e) =>
                            updateField("opacity", parseFloat(e.target.value))
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-10 text-right">
                          {(modal.data?.opacity ?? 0.8).toFixed(2)}
                        </span>
                      </div>
                    </FF>
                  </div>
                </div>

                {/* ── Étiquettes ────────────────────────────── */}
                <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest">
                      Étiquettes
                    </p>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!modal.data?.showLabels}
                        onCheckedChange={(v) => updateField("showLabels", v)}
                      />
                      <Label className="text-sm">Afficher les étiquettes</Label>
                    </div>
                  </div>
                  {modal.data?.showLabels &&
                    (() => {
                      // Extract available fields from geoData
                      let fieldOptions: string[] = [];
                      try {
                        const geo =
                          typeof modal.data?.geoData === "string"
                            ? JSON.parse(modal.data.geoData)
                            : modal.data?.geoData;
                        const feat = geo?.features?.[0];
                        if (feat?.properties)
                          fieldOptions = Object.keys(feat.properties);
                      } catch {}
                      return (
                        <div className="grid grid-cols-2 gap-3">
                          <FF label="Champ source de l'étiquette">
                            {fieldOptions.length > 0 ? (
                              <Select
                                value={modal.data?.labelField || ""}
                                onValueChange={(v) =>
                                  updateField("labelField", v)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir un champ…" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldOptions.map((f) => (
                                    <SelectItem key={f} value={f}>
                                      {f}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={modal.data?.labelField || ""}
                                onChange={(e) =>
                                  updateField("labelField", e.target.value)
                                }
                                placeholder="ex: name, ville, code…"
                              />
                            )}
                          </FF>
                          <FF label="Taille police (px)">
                            <Input
                              type="number"
                              min="8"
                              max="32"
                              value={modal.data?.labelFontSize ?? 12}
                              onChange={(e) =>
                                updateField(
                                  "labelFontSize",
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </FF>
                        </div>
                      );
                    })()}
                </div>

                {/* ── Catégorisation ────────────────────────── */}
                <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">
                      Catégorisation
                    </p>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!modal.data?.categorize}
                        onCheckedChange={(v) => updateField("categorize", v)}
                      />
                      <Label className="text-sm">
                        Catégoriser selon un champ
                      </Label>
                    </div>
                  </div>
                  {modal.data?.categorize &&
                    (() => {
                      const PALETTE = [
                        "#e74c3c",
                        "#3498db",
                        "#2ecc71",
                        "#f39c12",
                        "#9b59b6",
                        "#1abc9c",
                        "#e67e22",
                        "#34495e",
                        "#e91e63",
                        "#00bcd4",
                        "#8bc34a",
                        "#ff5722",
                        "#607d8b",
                        "#795548",
                        "#ffc107",
                      ];
                      let fieldOptions: string[] = [];
                      let categoryPreview: { value: string; color: string }[] =
                        [];
                      try {
                        const geo =
                          typeof modal.data?.geoData === "string"
                            ? JSON.parse(modal.data.geoData)
                            : modal.data?.geoData;
                        const feats = geo?.features || [];
                        if (feats[0]?.properties)
                          fieldOptions = Object.keys(feats[0].properties);
                        if (modal.data?.categorizeField) {
                          const unique: string[] = [];
                          feats.forEach((f: any) => {
                            const v = String(
                              f?.properties?.[modal.data.categorizeField] ??
                                "N/A",
                            );
                            if (!unique.includes(v)) unique.push(v);
                          });
                          categoryPreview = unique.map((v, i) => ({
                            value: v,
                            color: PALETTE[i % PALETTE.length],
                          }));
                        }
                      } catch {}
                      return (
                        <div className="space-y-3">
                          <FF label="Champ de catégorisation">
                            {fieldOptions.length > 0 ? (
                              <Select
                                value={modal.data?.categorizeField || ""}
                                onValueChange={(v) =>
                                  updateField("categorizeField", v)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir un champ…" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldOptions.map((f) => (
                                    <SelectItem key={f} value={f}>
                                      {f}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={modal.data?.categorizeField || ""}
                                onChange={(e) =>
                                  updateField("categorizeField", e.target.value)
                                }
                                placeholder="ex: type, statut, region…"
                              />
                            )}
                          </FF>
                          {categoryPreview.length > 0 && (
                            <div className="rounded-lg border border-purple-200 bg-white p-3">
                              <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">
                                Aperçu légende ({categoryPreview.length}{" "}
                                valeurs)
                              </p>
                              <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                                {categoryPreview.map(({ value, color }) => (
                                  <div
                                    key={value}
                                    className="flex items-center gap-2"
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-sm flex-shrink-0 border border-slate-200"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span
                                      className="text-xs text-slate-600 truncate"
                                      title={value}
                                    >
                                      {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                </div>

                {/* ── Données GeoJSON / Upload ───────────────── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Données géographiques
                  </p>

                  {/* File drop zone */}
                  <div
                    className="relative border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add(
                        "border-blue-400",
                        "bg-blue-50/30",
                      );
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove(
                        "border-blue-400",
                        "bg-blue-50/30",
                      );
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove(
                        "border-blue-400",
                        "bg-blue-50/30",
                      );
                      const file = e.dataTransfer.files[0];
                      if (!file) return;
                      const name = file.name.toLowerCase();
                      if (
                        !name.endsWith(".geojson") &&
                        !name.endsWith(".json")
                      ) {
                        alert(
                          "Seuls les fichiers .geojson ou .json sont acceptés.\nPour un Shapefile, convertissez-le d'abord en GeoJSON (ex: mapshaper.org).",
                        );
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const parsed = JSON.parse(
                            ev.target?.result as string,
                          );
                          updateField("geoData", JSON.stringify(parsed));
                          // auto-set layerType from geometry
                          const geomType = (
                            parsed?.features?.[0]?.geometry?.type || ""
                          ).toUpperCase();
                          if (geomType.includes("POINT"))
                            updateField("layerType", "POINT");
                          else if (geomType.includes("LINE"))
                            updateField("layerType", "LINE");
                          else if (geomType.includes("POLYGON"))
                            updateField("layerType", "POLYGON");
                          // auto-set name from filename if empty
                          if (!modal.data?.name) {
                            const n = file.name.replace(
                              /\.(geojson|json)$/i,
                              "",
                            );
                            updateField("name", n);
                            updateField(
                              "slug",
                              n
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                            );
                          }
                        } catch {
                          alert("Fichier GeoJSON invalide.");
                        }
                      };
                      reader.readAsText(file);
                    }}
                    onClick={() =>
                      (
                        document.getElementById(
                          "geojson-file-input",
                        ) as HTMLInputElement
                      )?.click()
                    }
                  >
                    <input
                      id="geojson-file-input"
                      type="file"
                      accept=".geojson,.json"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const parsed = JSON.parse(
                              ev.target?.result as string,
                            );
                            updateField("geoData", JSON.stringify(parsed));
                            const geomType = (
                              parsed?.features?.[0]?.geometry?.type || ""
                            ).toUpperCase();
                            if (geomType.includes("POINT"))
                              updateField("layerType", "POINT");
                            else if (geomType.includes("LINE"))
                              updateField("layerType", "LINE");
                            else if (geomType.includes("POLYGON"))
                              updateField("layerType", "POLYGON");
                            if (!modal.data?.name) {
                              const n = file.name.replace(
                                /\.(geojson|json)$/i,
                                "",
                              );
                              updateField("name", n);
                              updateField(
                                "slug",
                                n
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/^-|-$/g, ""),
                              );
                            }
                          } catch {
                            alert("Fichier GeoJSON invalide.");
                          }
                        };
                        reader.readAsText(file);
                        e.target.value = "";
                      }}
                    />
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                    <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                      Glisser-déposer ou cliquer pour uploader
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      .geojson / .json acceptés
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Shapefile ? Convertissez sur{" "}
                      <a
                        href="https://mapshaper.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        mapshaper.org
                      </a>
                    </p>
                  </div>

                  {/* Stats about loaded data */}
                  {(() => {
                    try {
                      const geo =
                        typeof modal.data?.geoData === "string"
                          ? JSON.parse(modal.data.geoData)
                          : modal.data?.geoData;
                      const count = geo?.features?.length ?? 0;
                      if (count === 0) return null;
                      const geomType =
                        geo?.features?.[0]?.geometry?.type || "?";
                      const fieldCount = Object.keys(
                        geo?.features?.[0]?.properties || {},
                      ).length;
                      return (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <p className="text-xs text-emerald-700 font-medium">
                            {count} feature{count > 1 ? "s" : ""} chargée
                            {count > 1 ? "s" : ""} · Type : {geomType} ·{" "}
                            {fieldCount} champ{fieldCount > 1 ? "s" : ""}
                          </p>
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  })()}

                  {/* Raw GeoJSON textarea (collapsible) */}
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 select-none list-none flex items-center gap-1.5">
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                      Éditer le GeoJSON brut
                    </summary>
                    <FF label="">
                      <Textarea
                        value={
                          typeof modal.data?.geoData === "string"
                            ? modal.data.geoData
                            : JSON.stringify(modal.data?.geoData || {}, null, 2)
                        }
                        onChange={(e) => updateField("geoData", e.target.value)}
                        rows={7}
                        className="font-mono text-xs mt-2"
                      />
                    </FF>
                  </details>
                </div>

                {/* ── Visibilité ────────────────────────────── */}
                <div className="flex gap-6 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!modal.data?.isVisible}
                      onCheckedChange={(v) => updateField("isVisible", v)}
                    />
                    <Label>Visible par défaut</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!modal.data?.isDefault}
                      onCheckedChange={(v) => updateField("isDefault", v)}
                    />
                    <Label>Couche par défaut</Label>
                  </div>
                </div>
              </div>
            )}

            {/* ── MAP POINT FORM ─────────────────────────────────────────── */}
            {modal.type === "map-point" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Nom (EN) *">
                    <Input
                      value={modal.data?.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </FF>
                  <FF label="Nom (FR)">
                    <Input
                      value={modal.data?.nameFr || ""}
                      onChange={(e) => updateField("nameFr", e.target.value)}
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Latitude *">
                    <Input
                      type="number"
                      step="any"
                      value={modal.data?.latitude || ""}
                      onChange={(e) =>
                        updateField("latitude", parseFloat(e.target.value))
                      }
                    />
                  </FF>
                  <FF label="Longitude *">
                    <Input
                      type="number"
                      step="any"
                      value={modal.data?.longitude || ""}
                      onChange={(e) =>
                        updateField("longitude", parseFloat(e.target.value))
                      }
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FF label="Catégorie">
                    <Input
                      value={modal.data?.category || ""}
                      onChange={(e) => updateField("category", e.target.value)}
                    />
                  </FF>
                  <FF label="Couleur">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={modal.data?.color || "#ff5722"}
                        onChange={(e) => updateField("color", e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border"
                      />
                      <Input
                        value={modal.data?.color || "#ff5722"}
                        onChange={(e) => updateField("color", e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </FF>
                  <FF label="Taille">
                    <Input
                      type="number"
                      value={modal.data?.size || 10}
                      onChange={(e) =>
                        updateField("size", parseInt(e.target.value))
                      }
                    />
                  </FF>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FF label="Description (EN)">
                    <Textarea
                      value={modal.data?.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={2}
                    />
                  </FF>
                  <FF label="Description (FR)">
                    <Textarea
                      value={modal.data?.descriptionFr || ""}
                      onChange={(e) =>
                        updateField("descriptionFr", e.target.value)
                      }
                      rows={2}
                    />
                  </FF>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={modal.data?.isActive !== false}
                    onCheckedChange={(v) => updateField("isActive", v)}
                  />
                  <Label>Actif</Label>
                </div>
              </div>
            )}

            {/* ── SETTING FORM ───────────────────────────────────────────── */}
            {modal.type === "setting" && (
              <div className="space-y-4">
                <FF label="Clé">
                  <Input
                    value={modal.data?.key || ""}
                    readOnly
                    className="font-mono bg-gray-50"
                  />
                </FF>
                <FF label="Valeur (EN) *">
                  <Textarea
                    value={modal.data?.value || ""}
                    onChange={(e) => updateField("value", e.target.value)}
                    rows={3}
                  />
                </FF>
                <FF label="Valeur (FR)">
                  <Textarea
                    value={modal.data?.valueFr || ""}
                    onChange={(e) => updateField("valueFr", e.target.value)}
                    rows={3}
                  />
                </FF>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <Button variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Sauvegarde…" : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
