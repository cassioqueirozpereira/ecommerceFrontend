'use client';

// Trigger rebuild on Vercel
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ImageIcon, Package, ChevronDown, AlertCircle, Loader2, Upload, CheckCircle2, Clock, CheckCheck, XCircle, Eye } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/ui/FormField';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuthStore } from '@/store/authStore';
import { createProduct, getCloudinarySignature, getAdminPendingPixOrders, approvePixOrder, rejectPixOrder } from '@/lib/api';
import { toast } from 'sonner';

interface VariantForm {
  id: string;
  sku: string;
  name: string;
  price: string;
  stock: string;
}

const CATEGORIES = [
  { id: 1, name: 'Perfumes', slug: 'perfumes' },
  { id: 2, name: 'Cuidados com a pele', slug: 'cuidados-com-a-pele' },
  { id: 3, name: 'Cuidados com o corpo', slug: 'cuidados-com-o-corpo' },
  { id: 4, name: 'Cuidados com o cabelo', slug: 'cuidados-com-o-cabelo' },
  { id: 5, name: 'Acessórios', slug: 'acessorios' },
];

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob returned null'));
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

const inputClass =
  'w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian text-sm focus:outline-none focus:border-obsidian transition-colors rounded-none placeholder-graphite/40';
const labelClass =
  'block text-[10px] font-semibold uppercase tracking-widest text-graphite mb-1.5';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [images, setImages] = useState<string[]>(['']);
  const [variants, setVariants] = useState<VariantForm[]>([
    { id: uid(), sku: '', name: '', price: '', stock: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const [isUploading, setIsUploading] = useState(false);

  // Pix pending orders
  const [pixOrders, setPixOrders] = useState<any[]>([]);
  const [loadingPixOrders, setLoadingPixOrders] = useState(false);
  const [pixActionId, setPixActionId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && token) {
      fetchPixOrders();
    }
  }, [mounted, isAuthenticated, token]);

  // Auto-generate slug from name
  useEffect(() => {
    setSlug(generateSlug(name));
  }, [name]);

  const fetchPixOrders = async () => {
    if (!token) return;
    setLoadingPixOrders(true);
    try {
      const orders = await getAdminPendingPixOrders(token);
      setPixOrders(orders);
    } catch {
      // non-admin users will get 403, silently ignore
    } finally {
      setLoadingPixOrders(false);
    }
  };


  const handleApprove = async (orderId: string) => {
    if (!token) return;
    setPixActionId(orderId);
    try {
      await approvePixOrder(orderId, token);
      toast.success('Pedido aprovado!');
      setPixOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      toast.error(err.message || 'Erro ao aprovar pedido');
    } finally {
      setPixActionId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!token) return;
    setPixActionId(orderId);
    try {
      await rejectPixOrder(orderId, token);
      toast.success('Pedido rejeitado e estoque restaurado.');
      setPixOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      toast.error(err.message || 'Erro ao rejeitar pedido');
    } finally {
      setPixActionId(null);
    }
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-graphite/40" size={32} />
      </div>
    );
  }

  // --- Image helpers ---
  const addImage = () => setImages((prev) => [...prev, '']);
  const updateImage = (idx: number, val: string) =>
    setImages((prev) => prev.map((img, i) => (i === idx ? val : img)));
  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!token) {
      toast.error('Você precisa estar logado para enviar imagens.');
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        toast.info(`Processando e enviando ${file.name}...`);
        
        // 1. Obter assinatura do backend
        const signatureData = await getCloudinarySignature(token);
        
        // 2. Comprimir imagem para WebP no lado cliente (Canvas API)
        const compressedBlob = await compressImage(file, 1200, 0.85);
        
        // 3. Montar formData para Cloudinary
        const formData = new FormData();
        formData.append('file', compressedBlob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);

        // 4. Upload direto para Cloudinary
        const res = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || 'Falha no upload para o Cloudinary');
        }

        const data = await res.json();
        return data.secure_url;
      } catch (err: any) {
        console.error(err);
        toast.error(`Erro no upload de ${file.name}: ${err.message}`);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url): url is string => url !== null);

    if (validUrls.length > 0) {
      setImages((prev) => {
        const cleanPrev = prev.filter((img) => img.trim() !== '');
        return [...cleanPrev, ...validUrls];
      });
      toast.success(`${validUrls.length} imagem(ns) enviada(s) com sucesso!`);
    }
    setIsUploading(false);
    e.target.value = '';
  };

  // --- Variant helpers ---
  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { id: uid(), sku: '', name: '', price: '', stock: '' },
    ]);
  const updateVariant = (id: string, field: keyof VariantForm, val: string) =>
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  const removeVariant = (id: string) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double-submit (double-click or rapid re-render)
    if (isSubmittingRef.current) {
      console.warn('[Admin] Submit ignorado: já existe um envio em andamento.');
      return;
    }

    if (!token) {
      toast.error('Sessão expirada. Faça login novamente.');
      router.push('/login');
      return;
    }

    const validImages = images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Adicione ao menos uma URL de imagem.');
      return;
    }
    if (variants.some((v) => !v.sku || !v.name || !v.price || !v.stock)) {
      toast.error('Preencha todos os campos das variantes.');
      return;
    }

    const category = CATEGORIES.find((c) => c.id === categoryId)!;

    const payload = {
      name,
      slug,
      description,
      basePrice: parseFloat(basePrice),
      promotionalPrice: promotionalPrice ? parseFloat(promotionalPrice) : null,
      images: validImages,
      category: { id: category.id, name: category.name, slug: category.slug },
      variants: variants.map(({ sku, name: vName, price, stock }) => ({
        sku,
        name: vName,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      })),
    };

    console.log('[Admin] Enviando payload:', JSON.stringify(payload, null, 2));

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      await createProduct(payload, token);
      toast.success('Produto criado com sucesso!');
      // Reset form
      setName('');
      setDescription('');
      setBasePrice('');
      setPromotionalPrice('');
      setCategoryId(1);
      setImages(['']);
      setVariants([{ id: uid(), sku: '', name: '', price: '', stock: '' }]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto';
      console.error('[Admin] Erro ao criar produto:', message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-[80vh] bg-ivory py-12">
      <Container className="max-w-3xl">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-obsidian/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-obsidian text-ivory flex items-center justify-center text-xs font-bold tracking-wider">
              {user?.firstName?.[0] ?? 'A'}
            </div>
            <span className="text-xs text-graphite uppercase tracking-widest font-semibold">
              Painel Admin
            </span>
          </div>
          <h1 className="font-serif text-4xl text-obsidian tracking-tight">
            Novo Produto
          </h1>
          <p className="text-graphite text-sm mt-1.5">
            Preencha os dados abaixo para adicionar um produto ao catálogo.
          </p>
        </div>

        {/* ── Pix Pending Orders Panel ── */}
        {(loadingPixOrders || pixOrders.length > 0) && (
          <section className="mb-12 pb-12 border-b border-obsidian/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-graphite flex items-center gap-2">
                <Clock size={14} className="text-amber-600" />
                Pedidos Pix Pendentes
                {pixOrders.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                    {pixOrders.length}
                  </span>
                )}
              </h2>
              <button
                onClick={fetchPixOrders}
                className="text-xs text-graphite hover:text-obsidian transition-colors underline"
              >
                Atualizar
              </button>
            </div>

            {loadingPixOrders ? (
              <div className="flex items-center gap-2 text-graphite text-sm">
                <Loader2 size={16} className="animate-spin" /> Carregando pedidos...
              </div>
            ) : (
              <div className="space-y-4">
                {pixOrders.map((order: any) => (
                  <div key={order.id} className="border border-amber-200 bg-amber-50/50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-xs font-bold text-obsidian uppercase tracking-wide">
                          {order.payerName || '—'}
                        </p>
                        <p className="text-xs text-graphite font-mono">
                          CPF: {order.payerCpf || '—'} · Tel: {order.payerPhone || '—'}
                        </p>
                        <p className="text-xs text-graphite/60 truncate">
                          Pedido #{order.id?.slice(0, 8)}...
                        </p>
                        <p className="text-sm font-semibold text-obsidian">
                          R$ {Number(order.total ?? 0).toFixed(2)}
                        </p>
                      </div>

                      {order.pixReceiptUrl && (
                        <button
                          onClick={() => setPreviewUrl(previewUrl === order.pixReceiptUrl ? null : order.pixReceiptUrl)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs bg-white border border-graphite/20 rounded-lg hover:border-obsidian transition-colors flex-shrink-0"
                        >
                          <Eye size={14} />
                          Comprovante
                        </button>
                      )}
                    </div>

                    {previewUrl === order.pixReceiptUrl && (
                      <div className="rounded-lg overflow-hidden border border-graphite/20">
                        <img
                          src={order.pixReceiptUrl}
                          alt="Comprovante"
                          className="w-full max-h-72 object-contain bg-white"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={pixActionId === order.id}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                      >
                        {pixActionId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCheck size={14} />
                        )}
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={pixActionId === order.id}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-red-300 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                      >
                        {pixActionId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Section: Basic Info */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <Package size={14} />
              Informações Básicas
            </h2>
            <div className="space-y-8">
              <FormField
                id="prod-name"
                label="Nome do Produto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Perfume Noir Intense"
                variant="admin"
                required
              />

              <div>
                <label className={labelClass} htmlFor="prod-slug">
                  Slug{' '}
                  <span className="normal-case text-graphite/50 font-normal tracking-normal">
                    (gerado automaticamente)
                  </span>
                </label>
                <input
                  id="prod-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="perfume-noir-intense"
                  className={`${inputClass} text-graphite`}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="prod-desc">Descrição</label>
                <textarea
                  id="prod-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uma descrição atraente do produto..."
                  className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian text-sm focus:outline-none focus:border-obsidian transition-colors rounded-none placeholder-graphite/40 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelClass} htmlFor="prod-category">Categoria</label>
                <div className="relative">
                  <select
                    id="prod-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-transparent border-b border-obsidian/20 px-0 py-3 text-obsidian text-sm focus:outline-none focus:border-obsidian transition-colors rounded-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite/50 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Pricing */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <span className="text-base font-serif leading-none">R$</span>
              Preços
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                id="prod-price"
                label="Preço Base (R$)"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="319.90"
                variant="admin"
                required
              />
              <FormField
                id="prod-promo"
                label="Preço Promocional (R$)"
                type="number"
                value={promotionalPrice}
                onChange={(e) => setPromotionalPrice(e.target.value)}
                placeholder="279.90"
                variant="admin"
              />
            </div>
          </section>

          {/* Section: Images */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <ImageIcon size={14} />
              Imagens do Produto
            </h2>

            {/* Selector files area */}
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-obsidian/20 rounded-xl cursor-pointer hover:bg-obsidian/[0.01] hover:border-obsidian/40 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-graphite/60 animate-spin mb-2" />
                      <p className="text-xs text-graphite font-medium">Enviando imagens...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-graphite/60 mb-2" />
                      <p className="text-xs text-graphite font-medium">Selecione fotos da galeria ou arraste aqui</p>
                      <p className="text-[10px] text-graphite/40 mt-1">PNG, JPG ou WEBP (comprime automaticamente)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images List (with URLs and custom uploads) */}
            <div className="space-y-4">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {img && (
                    <div className="h-10 w-10 rounded-md overflow-hidden border border-graphite/10 flex-shrink-0 bg-graphite/5">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    placeholder={`URL da Imagem ${idx + 1}`}
                    className={`${inputClass} flex-1`}
                  />
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-graphite/40 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addImage}
              className="mt-4 flex items-center gap-2 text-xs text-graphite hover:text-obsidian transition-colors font-medium uppercase tracking-widest"
            >
              <Plus size={14} /> Adicionar URL manual (Caso tenha o link da imagem)
            </button>
          </section>

          {/* Section: Variants */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <span className="text-base font-serif leading-none">≡</span>
              Variantes
            </h2>
            <p className="text-xs text-graphite/60 mb-6 -mt-3">
              Adicione ao menos uma variante (tamanho, cor, etc.)
            </p>
            <div className="space-y-6">
              {variants.map((v, idx) => (
                <div key={v.id} className="p-5 border border-obsidian/10 rounded-lg bg-obsidian/[0.015] relative">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-graphite">
                      Variante {idx + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="text-graphite/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className={labelClass}>Nome da Variante</label>
                      <input
                        type="text"
                        required
                        value={v.name}
                        onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                        placeholder="Ex: 50ml"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SKU (Código do produto)</label>
                      <input
                        type="text"
                        required
                        value={v.sku}
                        onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                        placeholder="Ex: NOIR-50ML"
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={v.price}
                        onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                        placeholder="319.90"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Estoque</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={v.stock}
                        onChange={(e) => updateVariant(v.id, 'stock', e.target.value)}
                        placeholder="10"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="mt-5 flex items-center gap-2 text-xs text-graphite hover:text-obsidian transition-colors font-medium uppercase tracking-widest"
            >
              <Plus size={14} /> Adicionar variante
            </button>
          </section>

          {/* Info box */}
          <div className="flex gap-3 p-4 border border-champagne/30 rounded-lg bg-champagne/5">
            <AlertCircle size={16} className="text-champagne flex-shrink-0 mt-0.5" />
            <p className="text-xs text-graphite/70 leading-relaxed">
              <strong className="text-obsidian">Permissão necessária:</strong> Esta ação requer que sua conta tenha o papel <code className="bg-obsidian/5 px-1 rounded text-obsidian">ROLE_ADMIN</code> no banco de dados. Contas comuns receberão um erro 403.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-obsidian/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-graphite hover:text-obsidian transition-colors underline underline-offset-2"
            >
              ← Voltar para a loja
            </button>
            <LoadingButton
              type="submit"
              size="lg"
              isLoading={isLoading}
              loadingText="Criando produto..."
              className="min-w-[220px]"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Publicar Produto
              </span>
            </LoadingButton>
          </div>
        </form>
      </Container>
    </div>
  );
}
