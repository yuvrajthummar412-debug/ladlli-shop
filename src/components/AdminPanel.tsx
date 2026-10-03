import React, { useState, useRef } from 'react';
import { 
  X, BarChart3, Package, ShoppingCart, Users, Plus, Edit2, Trash2, 
  DollarSign, ArrowUpRight, Camera, Image as ImageIcon, Clipboard, Star, Check, Link, UploadCloud
} from 'lucide-react';
import { Product, Order, Customer } from '../types/index.ts';

// Intelligent in-browser image compressor for mobile and desktop uploads
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1400;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onAddProduct: (newProd: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered') => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  customers,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'orders' | 'customers'>('metrics');
  
  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'outerwear',
    price: 9500,
    fitType: 'Relaxed Tailored',
    description: '',
    materials: ['100% Super 130s Wool'],
    careInstructions: ['Dry clean only'],
    sizes: [
      { size: 'S', quantity: 5 },
      { size: 'M', quantity: 8 },
      { size: 'L', quantity: 6 },
      { size: 'XL', quantity: 4 },
      { size: 'XXL', quantity: 2 },
    ],
    colors: [
      { name: 'Espresso Charcoal', hex: '#232227' },
      { name: 'Oatmeal Taupe', hex: '#cfc4b4' },
    ],
  });

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.fulfillmentStatus !== 'Delivered').length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalStockUnits = products.reduce(
    (acc, p) => acc + p.sizes.reduce((sAcc, s) => sAcc + s.quantity, 0),
    0
  );

  // Photo upload and gallery state for phone camera, gallery, and clipboard paste
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [photoFeedback, setPhotoFeedback] = useState<string>('');

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImages: string[] = [];
    for (const file of fileArray) {
      if (file.type.startsWith('image/')) {
        const dataUrl = await compressImageFile(file);
        newImages.push(dataUrl);
      }
    }
    if (newImages.length > 0) {
      setProductForm(prev => ({
        ...prev,
        images: [...(prev.images || []).filter(img => !img.includes('placeholder')), ...newImages]
      }));
      setPhotoFeedback(`Added ${newImages.length} photo${newImages.length > 1 ? 's' : ''} to garment gallery!`);
      setTimeout(() => setPhotoFeedback(''), 3000);
    }
  };

  const handleClipboardPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      await handleUploadFiles(imageFiles);
    } else {
      const pastedText = e.clipboardData.getData('text').trim();
      if (pastedText.match(/^https?:\/\/.*\.(jpeg|jpg|png|webp|avif|gif)(\?.*)?$/i) || pastedText.startsWith('data:image/')) {
        e.preventDefault();
        setProductForm(prev => ({
          ...prev,
          images: [...(prev.images || []).filter(img => !img.includes('placeholder')), pastedText]
        }));
        setPhotoFeedback('Image URL pasted into garment gallery!');
        setTimeout(() => setPhotoFeedback(''), 3000);
      }
    }
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []).filter(img => !img.includes('placeholder')), urlInput.trim()]
    }));
    setUrlInput('');
    setPhotoFeedback('Image link added to gallery!');
    setTimeout(() => setPhotoFeedback(''), 3000);
  };

  const handleSetPrimaryPhoto = (index: number) => {
    setProductForm(prev => {
      const list = [...(prev.images || [])];
      const [selected] = list.splice(index, 1);
      return { ...prev, images: [selected, ...list] };
    });
    setPhotoFeedback('Set as primary storefront cover photo!');
    setTimeout(() => setPhotoFeedback(''), 2500);
  };

  const handleRemovePhoto = (index: number) => {
    setProductForm(prev => {
      const list = [...(prev.images || [])];
      list.splice(index, 1);
      return { ...prev, images: list };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = productForm.images && productForm.images.length > 0 
      ? productForm.images 
      : ['/images/placeholder.jpg'];

    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, {
        ...productForm,
        images: finalImages,
      });
      setEditingProduct(null);
    } else {
      await onAddProduct({
        ...productForm,
        sku: `LAD-${Date.now().toString().slice(-4)}`,
        rating: 5.0,
        reviewsCount: 1,
        inStock: true,
        isNew: true,
        images: finalImages,
        measurements: {
          S: { chest: '104 cm', shoulder: '45 cm', length: '72 cm' },
          M: { chest: '110 cm', shoulder: '47 cm', length: '74 cm' },
          L: { chest: '116 cm', shoulder: '49 cm', length: '76 cm' },
          XL: { chest: '122 cm', shoulder: '51 cm', length: '78 cm' },
          XXL: { chest: '128 cm', shoulder: '53 cm', length: '80 cm' },
        },
      });
      setIsCreatingProduct(false);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ 
      ...p,
      images: p.images ? [...p.images] : []
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-6 animate-fade-in">
      
      <div className="relative w-full max-w-6xl bg-[#0e0d11] border-0 sm:border border-[#272630] rounded-none sm:rounded-sm shadow-2xl overflow-hidden my-0 sm:my-4 flex flex-col h-full sm:h-auto sm:max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#212028] bg-[#131217] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl tracking-[0.2em] text-[#f2efe9]">LADLLI</span>
              <span className="text-xs uppercase tracking-widest text-gold font-sans font-light border-l border-[#f5cf68]/40 pl-2">ATELIER</span>
              <span className="gold-dot"></span>
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gold bg-[#1e1c14] px-2 py-0.5 rounded-xs border border-[#f5cf68]/30 shadow-xs hidden xs:inline-block">
              Executive Suite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 sm:p-1.5 text-[#918a7f] hover:text-white rounded-md transition-colors active:scale-95"
              aria-label="Close admin suite"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Toolbar (Target Element: Bigger, Touch-Calibrated & Mobile-Optimized) */}
        <div className="px-2 sm:px-6 border-b border-[#24222d] bg-[#111014] flex items-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none min-h-[54px] sm:min-h-[52px] shrink-0">
          {[
            { id: 'metrics', label: 'Executive KPIs', mobileLabel: 'KPIs & Revenue', icon: BarChart3 },
            { id: 'products', label: 'Garment Catalog & Stock', mobileLabel: 'Garments & Stock', icon: Package },
            { id: 'orders', label: 'Consignment Orders', mobileLabel: 'Orders & Dispatch', icon: ShoppingCart },
            { id: 'customers', label: 'VIP Client Directory', mobileLabel: 'VIP Clients', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-3.5 px-3.5 sm:px-4 text-sm sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-2.5 border-b-2 whitespace-nowrap transition-all shrink-0 min-h-[48px] active:scale-[0.98] ${
                  isActive
                    ? 'border-[#f5cf68] text-gold bg-[#1e1b12]/80 sm:bg-transparent rounded-t-sm shadow-xs'
                    : 'border-transparent text-[#9f988b] hover:text-[#f2efe9] hover:bg-[#191820]/40 rounded-t-sm font-semibold'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#f5cf68]' : 'text-[#857e72]'} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: EXECUTIVE KPIS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="p-5 bg-[#141318] border border-[#24232c] rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-[#8e877c] text-xs">
                    <span>Gross Settled Revenue</span>
                    <DollarSign size={15} className="text-[#f5cf68]" />
                  </div>
                  <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-gold">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#716c63]">
                    Net settled revenue across completed customer orders
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="p-5 bg-[#141318] border border-[#24232c] rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-[#8e877c] text-xs">
                    <span>Active Orders</span>
                    <ShoppingCart size={15} className="text-[#d4a373]" />
                  </div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#f7f5ef]">
                    {activeOrders} <span className="text-xs font-normal text-[#8e877c]">/ {totalOrders} total</span>
                  </div>
                  <p className="text-[11px] text-[#716c63]">
                    In Biarritz and Mumbai dispatch queue
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="p-5 bg-[#141318] border border-[#24232c] rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-[#8e877c] text-xs">
                    <span>Average Order Value (AOV)</span>
                    <ArrowUpRight size={15} className="text-emerald-400" />
                  </div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#f7f5ef]">
                    ₹{aov.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#716c63]">
                    High-ticket luxury clientele benchmark
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="p-5 bg-[#141318] border border-[#24232c] rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-[#8e877c] text-xs">
                    <span>Available Inventory</span>
                    <Package size={15} className="text-[#d4a373]" />
                  </div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#f7f5ef]">
                    {totalStockUnits} Units
                  </div>
                  <p className="text-[11px] text-[#716c63]">
                    Across {products.length} ready-made garment lines
                  </p>
                </div>

              </div>

              {/* Ready-to-Wear Stock Overview per Garment */}
              <div className="p-5 bg-[#141318] border border-[#24232c] rounded-sm space-y-4">
                <h3 className="font-serif-display text-base text-[#f2efe9]">
                  Inventory Matrix by Ready-Made Garment
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono tabular-nums">
                    <thead>
                      <tr className="border-b border-[#25242e] text-[#8e877c] text-[11px] uppercase tracking-wider">
                        <th className="py-2">Garment Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Price</th>
                        <th className="py-2 text-center">S</th>
                        <th className="py-2 text-center">M</th>
                        <th className="py-2 text-center">L</th>
                        <th className="py-2 text-center">XL</th>
                        <th className="py-2 text-center">XXL</th>
                        <th className="py-2 text-right">Total Units</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1d24] text-[#cfc8bc]">
                      {products.map((p) => {
                        const sMap = Object.fromEntries(p.sizes.map(s => [s.size, s.quantity]));
                        const lineTotal = p.sizes.reduce((acc, s) => acc + s.quantity, 0);
                        return (
                          <tr key={p.id} className="hover:bg-[#19181f]">
                            <td className="py-2.5 font-sans font-medium text-[#f2efe9]">{p.name}</td>
                            <td className="py-2.5 text-[#8f887d] uppercase">{p.category}</td>
                            <td className="py-2.5 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 text-center">{sMap['S'] ?? 0}</td>
                            <td className="py-2.5 text-center">{sMap['M'] ?? 0}</td>
                            <td className="py-2.5 text-center">{sMap['L'] ?? 0}</td>
                            <td className="py-2.5 text-center">{sMap['XL'] ?? 0}</td>
                            <td className="py-2.5 text-center">{sMap['XXL'] ?? 0}</td>
                            <td className={`py-2.5 text-right font-bold ${lineTotal <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {lineTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display text-lg text-[#f2efe9]">Product Management</h3>
                  <p className="text-xs text-[#8f887c]">Create, modify pricing, adjust ready-made sizes, or retire pieces.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      subtitle: '',
                      category: 'outerwear',
                      price: 11000,
                      fitType: 'Regular Luxury',
                      description: 'Masterfully constructed menswear staple with fine finishings.',
                      materials: ['100% Virgin Wool'],
                      careInstructions: ['Dry clean only'],
                      sizes: [
                        { size: 'S', quantity: 5 },
                        { size: 'M', quantity: 10 },
                        { size: 'L', quantity: 8 },
                        { size: 'XL', quantity: 4 },
                        { size: 'XXL', quantity: 2 },
                      ],
                      colors: [{ name: 'Deep Onyx', hex: '#161619' }],
                    });
                    setIsCreatingProduct(true);
                  }}
                  className="px-3.5 py-2 bg-[#e5dfd3] hover:bg-white text-[#0c0c0e] text-xs font-semibold rounded-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add New Garment</span>
                </button>
              </div>

              {/* Product Edit / Create Modal */}
              {(isCreatingProduct || editingProduct) && (
                <form onSubmit={handleSaveProduct} className="p-6 bg-[#16151b] border border-[#2d2c38] rounded-sm space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#24232c]">
                    <span className="font-semibold text-sm text-[#f2efe9]">
                      {editingProduct ? `Edit Garment: ${editingProduct.name}` : 'Create New Luxury Garment'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-[#888175] hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[#a59e91] block mb-1">Product Title *</label>
                      <input
                        required
                        type="text"
                        value={productForm.name || ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[#a59e91] block mb-1">Subtitle / Material Spec *</label>
                      <input
                        required
                        type="text"
                        value={productForm.subtitle || ''}
                        onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[#a59e91] block mb-1">Category *</label>
                      <select
                        value={productForm.category || 'outerwear'}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm"
                      >
                        <option value="outerwear">Outerwear</option>
                        <option value="knitwear">Knitwear</option>
                        <option value="shirts">Shirts & Polos</option>
                        <option value="trousers">Trousers</option>
                        <option value="essentials">Essentials</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#a59e91] block mb-1">Price in INR (₹) *</label>
                      <input
                        required
                        type="number"
                        value={productForm.price || 0}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#a59e91] block mb-1">Compare At Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.compareAtPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) || undefined })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#a59e91] block mb-1">Silhouette / Fit</label>
                      <select
                        value={productForm.fitType || 'Regular Luxury'}
                        onChange={(e) => setProductForm({ ...productForm, fitType: e.target.value as any })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm"
                      >
                        <option value="Regular Luxury">Regular Luxury</option>
                        <option value="Relaxed Tailored">Relaxed Tailored</option>
                        <option value="Structured Classic">Structured Classic</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[#a59e91] block mb-1">Garment Description</label>
                      <textarea
                        rows={3}
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-[#1c1b22] border border-[#2e2d39] px-3 py-2 text-[#f2efe9] rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Stock Per Ready Size Matrix */}
                  <div className="pt-2 border-t border-[#24232c] space-y-2">
                    <span className="text-[#d8d1c3] font-medium block">
                      Ready-Made Inventory Counts (Units):
                    </span>
                    <div className="grid grid-cols-5 gap-3">
                      {productForm.sizes?.map((sz, idx) => (
                        <div key={sz.size}>
                          <label className="text-[10px] text-[#8e877c] block uppercase">Size {sz.size}</label>
                          <input
                            type="number"
                            min="0"
                            value={sz.quantity}
                            onChange={(e) => {
                              const updatedSizes = [...(productForm.sizes || [])];
                              updatedSizes[idx] = { ...sz, quantity: Math.max(0, Number(e.target.value)) };
                              setProductForm({ ...productForm, sizes: updatedSizes });
                            }}
                            className="w-full bg-[#1c1b22] border border-[#2e2d39] px-2.5 py-1.5 text-center font-mono text-[#f2efe9] rounded-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GARMENT PHOTO GALLERY & UPLOAD SECTION */}
                  <div className="pt-3 border-t border-[#24232c] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="gold-dot"></span>
                        <span className="text-[#f2efe9] font-semibold text-xs uppercase tracking-wider">
                          Garment Photo Studio & Gallery
                        </span>
                        <span className="text-[11px] text-gold font-normal">
                          ({(productForm.images || []).length} photo{(productForm.images || []).length === 1 ? '' : 's'})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9e968a] hidden sm:inline">
                        Instant phone camera capture, gallery selection, or clipboard paste
                      </span>
                    </div>

                    {/* Interactive Photo Upload Dropzone & Action Bar */}
                    <div 
                      onPaste={handleClipboardPaste}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files); }}
                      className={`p-4 rounded-sm border-2 border-dashed transition-all space-y-3 ${
                        isDragging 
                          ? 'border-[#f5cf68] bg-[#1d1b14]' 
                          : 'border-[#323140] bg-[#121116] hover:border-[#4d4a5e]'
                      }`}
                    >
                      {/* Hidden native file inputs */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUploadFiles(e.target.files);
                            e.target.value = '';
                          }
                        }}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUploadFiles(e.target.files);
                            e.target.value = '';
                          }
                        }}
                      />

                      {/* Upload Options: Phone Gallery, Phone Camera, and Paste Box */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Upload from Gallery / Files */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-[#201f29] hover:bg-[#2b2a37] text-[#f2efe9] text-xs font-semibold rounded-sm border border-[#353443] flex items-center gap-2 transition-all shadow-sm active:scale-95"
                        >
                          <ImageIcon size={14} className="text-[#f5cf68]" />
                          <span>Choose from Phone Gallery / Files</span>
                        </button>

                        {/* Take Photo with Phone Camera */}
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-3.5 py-2 bg-[#201f29] hover:bg-[#2b2a37] text-[#f2efe9] text-xs font-semibold rounded-sm border border-[#353443] flex items-center gap-2 transition-all shadow-sm active:scale-95"
                        >
                          <Camera size={14} className="text-[#f5cf68]" />
                          <span>Take Photo with Camera</span>
                        </button>

                        {/* Paste helper badge */}
                        <div 
                          tabIndex={0}
                          onPaste={handleClipboardPaste}
                          className="px-3 py-2 bg-[#17161c] border border-[#2b2a37] text-[#c4bcad] rounded-sm text-xs flex items-center gap-1.5 focus:border-[#f5cf68] focus:text-[#f2efe9] focus:outline-none cursor-pointer"
                          title="Click here and press Ctrl+V or long-press on mobile to Paste Photo"
                        >
                          <Clipboard size={13} className="text-[#f5cf68]" />
                          <span className="hidden sm:inline">Click & Paste Photo (Ctrl+V)</span>
                          <span className="sm:hidden">Tap & Paste Photo</span>
                        </div>
                      </div>

                      {/* Direct URL input bar */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[#1e1d24]">
                        <div className="relative flex-1">
                          <Link size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d776f]" />
                          <input
                            type="url"
                            placeholder="Or paste image web link (e.g. https://...jpg/png)"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrlImage(); } }}
                            className="w-full bg-[#17161c] border border-[#272633] pl-8 pr-3 py-1.5 text-xs text-[#f2efe9] rounded-sm focus:border-[#f5cf68] focus:outline-none placeholder:text-[#656056]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddUrlImage}
                          className="px-3 py-1.5 bg-[#252430] hover:bg-[#323040] text-xs font-medium text-[#f2efe9] rounded-sm transition-colors shrink-0"
                        >
                          Add Link
                        </button>
                      </div>

                      {/* Success notice */}
                      {photoFeedback && (
                        <div className="text-[11px] text-gold flex items-center gap-1.5 animate-fade-in font-medium">
                          <Check size={13} />
                          <span>{photoFeedback}</span>
                        </div>
                      )}
                    </div>

                    {/* Uploaded Gallery Grid */}
                    {productForm.images && productForm.images.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#8e877c]">
                          <span>Uploaded Garment Photos (First photo is the storefront Cover):</span>
                          <button
                            type="button"
                            onClick={() => setProductForm(prev => ({ ...prev, images: [] }))}
                            className="text-red-400 hover:underline"
                          >
                            Clear All Photos
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {productForm.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`group relative rounded-sm overflow-hidden border bg-[#100f14] aspect-[3/4] flex flex-col justify-between transition-all ${
                                idx === 0
                                  ? 'border-[#f5cf68] ring-1 ring-[#f5cf68]/60 shadow-[0_0_12px_rgba(245,207,104,0.25)]'
                                  : 'border-[#2d2c38] hover:border-[#525064]'
                              }`}
                            >
                              <img src={imgUrl} alt={`Garment ${idx + 1}`} className="w-full h-full object-cover" />

                              {/* Cover Badge or Make Cover Action */}
                              <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none">
                                {idx === 0 ? (
                                  <span className="bg-[#0c0c0e]/90 text-gold border border-[#f5cf68]/50 px-1.5 py-0.5 rounded-2xs text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                    <Star size={9} fill="currentColor" />
                                    <span>Cover</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryPhoto(idx)}
                                    className="pointer-events-auto bg-[#0c0c0e]/85 hover:bg-gold-gradient hover:text-[#0c0c0e] text-[#c4bcad] border border-white/10 px-1.5 py-0.5 rounded-2xs text-[9px] font-medium transition-all"
                                    title="Make this the main storefront photo"
                                  >
                                    Set Cover
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(idx)}
                                  className="pointer-events-auto w-6 h-6 rounded-full bg-red-950/90 hover:bg-red-850 text-red-200 flex items-center justify-center transition-colors shadow-sm"
                                  title="Remove photo"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>

                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-1.5 text-[9px] text-[#ded8ce] flex items-center justify-between">
                                <span>Angle #{idx + 1}</span>
                                {idx === 0 && <span className="text-gold font-bold">Main Storefront</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#131217] rounded-sm border border-[#23222a] text-center text-xs text-[#7d776f]">
                        No custom photos added yet. Garment will use the signature luxury studio vector artwork until you upload photos.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#24232c]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 border border-[#333240] text-[#9c9588] hover:text-[#f2efe9] rounded-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] font-bold rounded-sm transition-all shadow-[0_0_14px_rgba(245,207,104,0.3)] border border-[#fff3c4]/40"
                    >
                      Save Garment
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="bg-[#141318] border border-[#24232c] rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-[#25242e] text-[#8e877c] text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Garment</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Available Sizes</th>
                      <th className="py-3 px-4">Total Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1d24] text-[#cfc8bc]">
                    {products.map((p) => {
                      const totalUnits = p.sizes.reduce((acc, s) => acc + s.quantity, 0);
                      return (
                        <tr key={p.id} className="hover:bg-[#18171e]">
                          <td className="py-3 px-4 text-[#888176]">{p.sku}</td>
                          <td className="py-3 px-4 font-sans font-medium text-[#f2efe9]">
                            <div className="flex items-center gap-3">
                              {p.images && p.images[0] && !p.images[0].includes('placeholder') ? (
                                <img src={p.images[0]} alt={p.name} className="w-9 h-11 object-cover rounded-xs border border-[#2e2d3a] shrink-0" />
                              ) : (
                                <div className="w-9 h-11 bg-[#1c1b22] rounded-xs border border-[#2b2a37] flex items-center justify-center shrink-0 text-[#8e877c]">
                                  <Package size={14} />
                                </div>
                              )}
                              <div>
                                <span className="block font-medium">{p.name}</span>
                                <span className="text-[10px] text-[#7d776f] block font-sans">{p.subtitle}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase text-[#8f887c]">{p.category}</td>
                          <td className="py-3 px-4 font-bold text-[#f7f5ef]">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.size}
                                  className={`px-1.5 py-0.5 rounded-xs text-[10px] ${
                                    s.quantity > 0
                                      ? 'bg-[#212028] text-[#e0d9cc]'
                                      : 'bg-[#151418] text-[#55525c] line-through'
                                  }`}
                                >
                                  {s.size}:{s.quantity}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={totalUnits <= 4 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                              {totalUnits} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 hover:text-[#d4a373] text-[#8e877c] transition-colors"
                                title="Edit Garment"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 hover:text-red-400 text-[#8e877c] transition-colors"
                                title="Delete Garment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display text-lg text-[#f2efe9]">Consignment & Order Log</h3>
                  <p className="text-xs text-[#8f887c]">Live customer transactions, fulfillment progression & tracking codes.</p>
                </div>
              </div>

              <div className="bg-[#141318] border border-[#24232c] rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-[#25242e] text-[#8e877c] text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Garment Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1d24] text-[#cfc8bc]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#18171e]">
                        <td className="py-3 px-4 font-bold text-[#f2efe9]">{o.orderNumber}</td>
                        <td className="py-3 px-4 font-sans">
                          <span className="font-medium text-[#f2efe9] block">{o.customer.name}</span>
                          <span className="text-[10px] text-[#857f75] block">{o.customer.email}</span>
                        </td>
                        <td className="py-3 px-4 font-sans text-xs">
                          {o.items.map((i, idx) => (
                            <div key={idx} className="text-[#ded8ce]">
                              {i.quantity}x {i.productName} ({i.size})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#f7f5ef]">
                          ₹{o.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold tracking-wider ${
                            o.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {o.paymentStatus} · {o.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={o.fulfillmentStatus}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                            className="bg-[#1b1a20] border border-[#2e2d39] text-[#e8e2d5] text-[11px] px-2 py-1 rounded-sm focus:outline-none focus:border-[#d4a373]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-[#d4a373] text-[11px]">
                          {o.trackingNumber || 'Pending Courier'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display text-lg text-[#f2efe9]">VIP Client Directory</h3>
                  <p className="text-xs text-[#8f887c]">Registered patronage, cumulative spend & tier assignments.</p>
                </div>
              </div>

              <div className="bg-[#141318] border border-[#24232c] rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs font-mono tabular-nums">
                  <thead>
                    <tr className="border-b border-[#25242e] text-[#8e877c] text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Privilege Tier</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Cumulative Spend</th>
                      <th className="py-3 px-4">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1d24] text-[#cfc8bc]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#18171e]">
                        <td className="py-3 px-4 font-sans font-medium text-[#f2efe9]">{c.name}</td>
                        <td className="py-3 px-4">
                          <span className="text-[#ded8ce] block">{c.email}</span>
                          <span className="text-[10px] text-[#7d776f] block">{c.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold tracking-wider ${
                            c.tier === 'VIP Platinum'
                              ? 'bg-[#3b3427] text-[#e8cda1] border border-[#6b5837]'
                              : c.tier === 'VIP Gold'
                              ? 'bg-[#292620] text-[#cfb68c]'
                              : 'bg-[#1e1d24] text-[#a8a195]'
                          }`}>
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4">{c.ordersCount} consignments</td>
                        <td className="py-3 px-4 font-bold text-[#f7f5ef]">₹{c.totalSpend.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-[#8f887c]">{c.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
