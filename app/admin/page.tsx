"use client";

import React, { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/components/AuthProvider";
import { StatusBadge, RequestStatus } from "@/components/StatusBadge";
import { formatEGP, formatDate } from "@/lib/format";
import { useLanguage } from "@/components/LanguageProvider";
import { LogOut, ExternalLink, RefreshCw, CheckCircle2, Radio } from "lucide-react";
import { rtdb } from "@/lib/firebase/client";
import { ref, onValue } from "firebase/database";

interface AdminTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceEGP: number;
  fullPrompt: string;
  isActive: boolean;
}

interface AdminRequest {
  id: string;
  type: "AI_TEMPLATE" | "AI_CONTENT" | "PRINT_3D" | string;
  status: RequestStatus;
  templateId?: string | null;
  name: string;
  phone: string;
  details?: string;
  address?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  printingCostEGP?: number | null;
  deliveryFeeEGP: number;
  totalEGP?: number | null;
  adminNotes?: string | null;
  createdAt?: any;
  source?: "rtdb" | "firestore";
}

function AdminDashboardContent() {
  const { user, signOut, getIdToken } = useAuth();
  const { t, lang } = useLanguage();
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rtdbLiveCount, setRtdbLiveCount] = useState<number>(0);

  // Per-request editing state
  const [editStates, setEditStates] = useState<{
    [id: string]: {
      status: RequestStatus;
      printingCostEGP: string;
      adminNotes: string;
      saving: boolean;
      saved: boolean;
    };
  }>({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/admin/requests/init", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load admin dashboard data");
      }

      const data = await res.json();
      setTemplates(data.templates || []);
      setRequests(data.requests || []);

      const initialEdits: any = {};
      (data.requests || []).forEach((req: AdminRequest) => {
        initialEdits[req.id] = {
          status: req.status,
          printingCostEGP: req.printingCostEGP ? String(req.printingCostEGP) : "",
          adminNotes: req.adminNotes || "",
          saving: false,
          saved: false,
        };
      });
      setEditStates(initialEdits);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to Firebase Realtime Database for live customer requests!
    try {
      const liveReqRef = ref(rtdb, "requests");
      const unsubscribe = onValue(liveReqRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const rtdbItems: AdminRequest[] = Object.keys(val).map((key) => {
            const item = val[key];
            return {
              id: key,
              type: item.type || "AI_TEMPLATE",
              status: item.status || "NEW",
              templateId: item.templateId || null,
              name: item.name || "",
              phone: item.phone || "",
              details: item.details || "",
              address: item.address || null,
              fileName: item.fileName || null,
              fileUrl: item.fileUrl || null,
              printingCostEGP: item.printingCostEGP || null,
              deliveryFeeEGP: item.deliveryFeeEGP || 150,
              totalEGP: item.totalEGP || (item.type === "AI_TEMPLATE" ? 400 : null),
              adminNotes: item.adminNotes || null,
              createdAt: item.createdAtIso || new Date(item.timestamp || Date.now()).toISOString(),
              source: "rtdb",
            };
          });

          setRtdbLiveCount(rtdbItems.length);

          // Merge live RTDB items with existing requests without duplicates
          setRequests((prev) => {
            const map = new Map<string, AdminRequest>();
            // Add server items
            prev.forEach((r) => map.set(r.id, r));
            // Add or overwrite with RTDB live items
            rtdbItems.forEach((r) => map.set(r.id, { ...map.get(r.id), ...r }));
            return Array.from(map.values()).sort((a, b) => {
              const tA = new Date(a.createdAt || 0).getTime();
              const tB = new Date(b.createdAt || 0).getTime();
              return tB - tA;
            });
          });

          // Ensure edit states exist for new items
          setEditStates((prev) => {
            const next = { ...prev };
            rtdbItems.forEach((r) => {
              if (!next[r.id]) {
                next[r.id] = {
                  status: r.status,
                  printingCostEGP: r.printingCostEGP ? String(r.printingCostEGP) : "",
                  adminNotes: r.adminNotes || "",
                  saving: false,
                  saved: false,
                };
              }
            });
            return next;
          });
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("RTDB listener error:", e);
    }
  }, []);

  const handleUpdate = async (id: string) => {
    const edit = editStates[id];
    if (!edit) return;

    setEditStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], saving: true, saved: false },
    }));

    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: edit.status,
          printingCostEGP: edit.printingCostEGP ? Number(edit.printingCostEGP) : null,
          adminNotes: edit.adminNotes,
        }),
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.error || "Failed to update request");
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated.data } : r))
      );

      setEditStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], saving: false, saved: true },
      }));

      setTimeout(() => {
        setEditStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], saved: false },
        }));
      }, 2500);
    } catch (err: any) {
      alert(err?.message || "Failed to save update");
      setEditStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], saving: false, saved: false },
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-12 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-lime">
              {t("adminControlCenter")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime/10 text-lime text-xs font-sans">
              <Radio className="w-3 h-3 animate-pulse" />
              Realtime Database متصل
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-cloud">
            {t("adminDashboardTitle")}
          </h1>
          <p className="text-sm text-cloud/70 font-sans mt-1">
            {lang === "ar" ? "مسجل باسم:" : "Logged in as:"}{" "}
            <span className="text-lime">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-cloud hover:bg-white/5 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {t("refresh")}
          </button>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 rounded-full bg-danger/10 border border-danger/30 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger hover:text-cloud transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t("signOut")}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger font-medium">
          {error}
        </div>
      )}

      {/* SECTION 1: TEMPLATES */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-cloud">
              {t("adminTemplatesHeading")} ({templates.length})
            </h2>
            <p className="text-sm text-cloud/70">
              {lang === "ar"
                ? "قائمة النماذج النشطة وغير النشطة مع الأوامر الهندسية الكاملة."
                : "Active and inactive branding prompts with full engineering text."}
            </p>
          </div>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-cloud/70">
            {lang === "ar" ? "لم يتم العثور على نماذج. قم بتشغيل سكربت التغذية:" : "No templates found. Run the seed script:"}{" "}
            <code className="text-lime font-sans font-medium">npm run seed</code>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-cloud"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-xl font-semibold text-cloud">
                        {tpl.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-sans uppercase ${
                          tpl.isActive ? "bg-lime text-ink font-semibold" : "bg-white/10 text-cloud/60"
                        }`}
                      >
                        {tpl.isActive
                          ? (lang === "ar" ? "نشط" : "Active")
                          : (lang === "ar" ? "غير نشط" : "Inactive")}
                      </span>
                    </div>
                    <p className="text-sm text-cloud/70 mt-1 max-w-2xl leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="font-display text-2xl font-semibold text-lime">
                      {formatEGP(tpl.priceEGP, lang)}
                    </span>
                  </div>
                </div>

                <details className="mt-4 pt-4 border-t border-white/10 group">
                  <summary className="text-xs font-sans uppercase tracking-wider text-lime cursor-pointer hover:underline">
                    {lang === "ar" ? "عرض نص الأمر الهندسي الكامل (Full Prompt)" : "View Full AI Prompt Foundation"}
                  </summary>
                  <pre
                    className="mt-3 p-4 rounded-xl bg-ink text-cloud/80 font-sans text-xs whitespace-pre-wrap leading-relaxed border border-white/10 overflow-x-auto select-all"
                    dir="ltr"
                  >
                    {tpl.fullPrompt}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: REQUESTS TABLE */}
      <section>
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-cloud">
              {t("adminRequestsHeading")} ({requests.length})
            </h2>
            <p className="text-sm text-cloud/70">
              {lang === "ar"
                ? "مراجعة استفسارات العملاء القادمة عبر Realtime Database، وحساب التكاليف وتحديث الحالات."
                : "Review inquiries from Realtime Database, calculate printing costs, and update statuses."}
            </p>
          </div>
          {rtdbLiveCount > 0 && (
            <div className="text-xs font-sans text-lime bg-lime/10 px-3 py-1.5 rounded-full border border-lime/20 inline-flex items-center gap-1.5 self-start">
              <span>●</span> {lang === "ar" ? `${rtdbLiveCount} طلبات في Realtime DB` : `${rtdbLiveCount} requests in Realtime DB`}
            </div>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-cloud/70">
            {lang === "ar" ? "لم يتم إرسال أي طلبات حتى الآن." : "No customer requests submitted yet."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
            <table className="w-full text-start text-sm text-cloud">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-cloud/60 bg-white/5 font-sans">
                <tr>
                  <th className="px-6 py-4">{lang === "ar" ? "النوع" : "Type"}</th>
                  <th className="px-6 py-4">{lang === "ar" ? "العميل" : "Customer"}</th>
                  <th className="px-6 py-4">{lang === "ar" ? "التفاصيل / الملف" : "Details / File"}</th>
                  <th className="px-6 py-4">{lang === "ar" ? "الحالة" : "Status"}</th>
                  <th className="px-6 py-4">{lang === "ar" ? "التكلفة" : "Cost"}</th>
                  <th className="px-6 py-4">{lang === "ar" ? "الإجراء" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {requests.map((req) => {
                  const edit = editStates[req.id] || {
                    status: req.status,
                    printingCostEGP: req.printingCostEGP ? String(req.printingCostEGP) : "",
                    adminNotes: req.adminNotes || "",
                    saving: false,
                    saved: false,
                  };

                  return (
                    <tr key={req.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 align-top">
                        <span
                          className={`font-sans text-xs px-2.5 py-1 rounded-full font-medium ${
                            req.type === "AI_TEMPLATE"
                              ? "bg-violet text-cloud"
                              : req.type === "AI_CONTENT"
                              ? "bg-lime text-ink font-semibold"
                              : "bg-cloud text-ink font-semibold"
                          }`}
                        >
                          {req.type === "AI_TEMPLATE"
                            ? (lang === "ar" ? "هوية بصرية" : "BRAND IDENTITY")
                            : req.type === "AI_CONTENT"
                            ? (lang === "ar" ? "ريلز ومحتوى AI" : "AI CONTENT")
                            : (lang === "ar" ? "طباعة 3D" : "3D PRINT")}
                        </span>
                        <div className="text-[11px] font-sans text-cloud/50 mt-1.5" dir="ltr">
                          {formatDate(req.createdAt, lang)}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-cloud text-base">{req.name}</div>
                        <a
                          href={`https://wa.me/${req.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="text-xs font-sans text-lime hover:underline mt-0.5 inline-block"
                        >
                          {req.phone}
                        </a>
                        {req.address && (
                          <div className="text-xs text-cloud/70 mt-1 max-w-xs">
                            <span className="text-cloud/40">{lang === "ar" ? "العنوان:" : "Ship:"}</span> {req.address}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 align-top max-w-xs">
                        {req.fileName && (
                          <div className="mb-2">
                            {req.fileUrl ? (
                              <a
                                href={req.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-sans text-lime hover:underline bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 break-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                {req.fileName}
                              </a>
                            ) : (
                              <span className="text-xs font-sans text-lime/80 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                {req.fileName}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-cloud/70 line-clamp-3 leading-relaxed">
                          {req.details || (lang === "ar" ? "بدون تعليمات خاصة" : "No special instructions")}
                        </p>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="mb-2">
                          <StatusBadge status={req.status} />
                        </div>
                        <select
                          value={edit.status}
                          onChange={(e) =>
                            setEditStates((prev) => ({
                              ...prev,
                              [req.id]: {
                                ...prev[req.id],
                                status: e.target.value as RequestStatus,
                              },
                            }))
                          }
                          className="w-full text-xs rounded-xl border border-white/10 bg-ink px-2.5 py-1.5 text-cloud outline-none focus:border-lime"
                        >
                          <option value="NEW">NEW ({lang === "ar" ? "جديد" : "New"})</option>
                          <option value="REVIEWED">REVIEWED ({lang === "ar" ? "تمت المراجعة" : "Reviewed"})</option>
                          <option value="QUOTED">QUOTED ({lang === "ar" ? "تم التسعير" : "Quoted"})</option>
                          <option value="PAID">PAID ({lang === "ar" ? "تم الدفع" : "Paid"})</option>
                          <option value="DELIVERED">DELIVERED ({lang === "ar" ? "تم التسليم" : "Delivered"})</option>
                          <option value="CANCELLED">CANCELLED ({lang === "ar" ? "ملغي" : "Cancelled"})</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 align-top font-sans">
                        {req.type === "PRINT_3D" ? (
                          <div className="space-y-1">
                            <label className="text-[10px] text-cloud/50 block">
                              {lang === "ar" ? "تكلفة الطباعة:" : "Print Cost:"}
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder="250"
                              value={edit.printingCostEGP}
                              onChange={(e) =>
                                setEditStates((prev) => ({
                                  ...prev,
                                  [req.id]: {
                                    ...prev[req.id],
                                    printingCostEGP: e.target.value,
                                  },
                                }))
                              }
                              className="w-24 text-xs rounded-xl border border-white/10 bg-ink px-2.5 py-1.5 text-cloud outline-none focus:border-lime"
                            />
                            <div className="text-[11px] text-cloud/60 mt-1">
                              {lang === "ar" ? "شحن: +150" : "Deliv: +150"}
                            </div>
                            <div className="text-xs font-semibold text-lime pt-0.5">
                              {lang === "ar" ? "الإجمالي:" : "Tot:"} {formatEGP(req.totalEGP, lang)}
                            </div>
                          </div>
                        ) : (
                          <div className="font-semibold text-lime text-base">
                            {formatEGP(400, lang)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 align-top">
                        <button
                          onClick={() => handleUpdate(req.id)}
                          disabled={edit.saving}
                          className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-1.5 text-xs font-semibold text-ink hover:bg-cloud transition disabled:opacity-50 cursor-pointer"
                        >
                          {edit.saving ? (
                            lang === "ar" ? "جارِ الحفظ..." : "Saving..."
                          ) : edit.saved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> {t("saved")}
                            </>
                          ) : (
                            t("save")
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
