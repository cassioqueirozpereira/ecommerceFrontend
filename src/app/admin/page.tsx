'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ImageIcon, Package, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { createProduct } from '@/lib/api';
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
  { id: 2, name: 'Skincare', slug: 'skincare' },
  { id: 3, name: 'Body Care', slug: 'body-care' },
  { id: 4, name: 'Hair Care', slug: 'hair-care' },
  { id: 5, name: 'Accessories', slug: 'accessories' },
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated (client-side guard)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Auto-generate slug from name
  useEffect(() => {
    setSlug(generateSlug(name));
  }, [name]);

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
      toast.error(message);
    } finally {
      setIsLoading(false);
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

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Section: Basic Info */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <Package size={14} />
              Informações Básicas
            </h2>
            <div className="space-y-8">
              <div>
                <label className={labelClass} htmlFor="prod-name">Nome do Produto</label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Perfume Noir Intense"
                  className={inputClass}
                />
              </div>

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
              <div>
                <label className={labelClass} htmlFor="prod-price">Preço Base (R$)</label>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="319.90"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="prod-promo">
                  Preço Promocional (R$){' '}
                  <span className="normal-case font-normal tracking-normal text-graphite/50">opcional</span>
                </label>
                <input
                  id="prod-promo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={promotionalPrice}
                  onChange={(e) => setPromotionalPrice(e.target.value)}
                  placeholder="279.90"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Section: Images */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
              <ImageIcon size={14} />
              Imagens
            </h2>
            <p className="text-xs text-graphite/60 mb-4 -mt-3">
              Cole URLs públicas de imagens (Cloudinary, ImgBB, Supabase Storage, etc.)
            </p>
            <div className="space-y-4">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {img && (
                    <div className="h-10 w-10 rounded-md overflow-hidden border border-graphite/10 flex-shrink-0 bg-graphite/5">
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    placeholder={`https://res.cloudinary.com/.../imagem-${idx + 1}.jpg`}
                    className={`${inputClass} flex-1`}
                  />
                  {images.length > 1 && (
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
              <Plus size={14} /> Adicionar imagem
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
                      <label className={labelClass}>SKU</label>
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
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="min-w-[220px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Criando produto...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Publicar Produto
                </span>
              )}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
