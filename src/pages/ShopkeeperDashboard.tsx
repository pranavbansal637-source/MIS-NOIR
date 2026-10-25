import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Trash2,
  Plus,
  ShoppingBag,
  Store,
  LayoutDashboard,
  Package,
  CreditCard,
  Monitor,
  User,
  Search,
  Tag,
  Bell,
  AlertTriangle,
  Edit2,
  Eye,
  History,
  X,
  FileText
} from 'lucide-react';
import type { ProductItem, CampusOrder } from '../types';

interface ShopkeeperDashboardProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  activeTab = 'biz-pos',
  onNavigate
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    orders,
    updateOrderStatus,
    createPosPaymentRequest,
    activePosPaymentRequest,
    transactions,
    shopProfile,
    updateShopProfile,
    shopOffers,
    addShopOffer,
    toggleShopOffer,
    stockMovements,
    terminals,
    openReceiptModal,
    showToast
  } = useApp();

  const [localTab, setLocalTab] = useState(activeTab);
  const currentTab = onNavigate ? activeTab : localTab;
  const setTab = onNavigate || setLocalTab;

  // POS Cart State
  const [posCart, setPosCart] = useState<{ id: string; name: string; price: number; qty: number; productId?: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Stationery' | 'Merchandise' | 'Printing'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductItem['category']>('Food');
  const [newProdPrice, setNewProdPrice] = useState(60);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ProductItem['category']>('Food');

  // Delete Confirmation Modal
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Orders Filter & Details Modal
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COLLECTED' | 'CANCELLED'>('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CampusOrder | null>(null);

  // Create Offer Modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscount, setOfferDiscount] = useState(15);
  const [offerExpiry, setOfferExpiry] = useState('2026-11-30');
  const [offerTargetCategory, setOfferTargetCategory] = useState('All');

  // Transactions Filter
  const [txSearch, setTxSearch] = useState('');
  const [txMethodFilter, setTxMethodFilter] = useState('ALL');

  // Profile Form State
  const [profileStoreName, setProfileStoreName] = useState(shopProfile.name || shopProfile.shopName || 'The Central Quad Cafe & Campus Store');
  const [profileManager, setProfileManager] = useState(shopProfile.managerName || 'Mr. Suresh Nair');
  const [profileEmail, setProfileEmail] = useState(shopProfile.email || shopProfile.contactEmail || 'canteen@nexora.edu');
  const [profilePhone, setProfilePhone] = useState(shopProfile.phone || shopProfile.contactPhone || '+91 98112 99001');
  const [profileHours, setProfileHours] = useState(shopProfile.operatingHours || '08:00 AM - 10:00 PM');
  const [profileVpa, setProfileVpa] = useState(shopProfile.upiVpa || 'merchant.quad@icici');
  const [profileLocation, setProfileLocation] = useState(shopProfile.location || 'Student Center Ground Floor');

  // ----------------------------------------------------
  // POS ACTIONS
  // ----------------------------------------------------
  const addItemToPos = (prod: ProductItem) => {
    if (prod.stock <= 0) {
      showToast(`Cannot add "${prod.name}" - Item is out of stock!`);
      return;
    }
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === prod.name);
      if (existing) {
        if (existing.qty >= prod.stock) {
          showToast(`Cannot add more "${prod.name}" - Stock limit reached (${prod.stock} units)!`);
          return prev;
        }
        return prev.map((i) => (i.name === prod.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: `item-${Date.now()}`, productId: prod.id, name: prod.name, price: prod.price, qty: 1 }];
    });
  };

  const updateCartQty = (name: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((i) => {
          if (i.name === name) {
            const prod = products.find((p) => p.id === i.productId || p.name === i.name);
            const maxAvailable = prod ? prod.stock : 999;
            const newQty = i.qty + delta;
            if (newQty > maxAvailable) {
              showToast(`Stock limit: Only ${maxAvailable} available.`);
              return i;
            }
            return { ...i, qty: newQty };
          }
          return i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const removeItemFromPos = (name: string) => {
    setPosCart((prev) => prev.filter((i) => i.name !== name));
  };

  const total = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSendPaymentRequest = () => {
    if (posCart.length === 0) return;
    const itemsSummary = posCart.map((i) => `${i.qty}x ${i.name}`).join(', ');
    createPosPaymentRequest(profileStoreName, total, itemsSummary);
    showToast('Payment request broadcast to Shop Palm Terminal. Awaiting customer contact scan...');
  };

  const handleCashCheckout = () => {
    if (posCart.length === 0) return;
    // Deduct stock for cart items
    posCart.forEach((i) => {
      if (i.productId) {
        const prod = products.find((p) => p.id === i.productId);
        if (prod) {
          updateProductStock(prod.id, Math.max(0, prod.stock - i.qty));
        }
      }
    });
    showToast(`✓ Cash / UPI payment of ₹${total} recorded. Receipt generated!`);
    setPosCart([]);
  };

  // ----------------------------------------------------
  // PRODUCT MANAGEMENT
  // ----------------------------------------------------
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    if (newProdPrice < 0 || newProdStock < 0) {
      showToast('Price and stock quantity must be positive numbers.');
      return;
    }
    addProduct({
      shopId: 'canteen-main',
      shopName: profileStoreName,
      name: newProdName.trim(),
      category: newProdCategory,
      price: newProdPrice,
      stock: newProdStock,
      lowStockThreshold: 10,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
      description: newProdDesc.trim() || 'Campus store inventory item'
    });
    setShowAddModal(false);
    setNewProdName('');
    setNewProdDesc('');
    showToast(`✓ "${newProdName}" added to store inventory.`);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditStock(p.stock);
    setEditCategory(p.category);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editPrice < 0 || editStock < 0) {
      showToast('Price and stock cannot be negative.');
      return;
    }
    updateProduct(editingProduct.id, {
      name: editName.trim(),
      price: editPrice,
      stock: editStock,
      category: editCategory
    });
    setEditingProduct(null);
    showToast(`✓ Product details updated for "${editName}".`);
  };

  const handleConfirmDelete = () => {
    if (!deletingProductId) return;
    const prod = products.find((p) => p.id === deletingProductId);
    deleteProduct(deletingProductId);
    setDeletingProductId(null);
    showToast(`Product "${prod?.name}" removed from inventory.`);
  };

  const handleAdjustStock = (p: ProductItem, delta: number) => {
    const newStock = p.stock + delta;
    if (newStock < 0) {
      showToast(`Cannot reduce stock below 0 units.`);
      return;
    }
    updateProductStock(p.id, newStock);
    showToast(`Stock updated for ${p.name}: ${newStock} units remaining.`);
  };

  // ----------------------------------------------------
  // OFFERS MANAGEMENT
  // ----------------------------------------------------
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerCode.trim()) return;
    if (offerDiscount <= 0 || offerDiscount > 90) {
      showToast('Discount must be between 1% and 90%.');
      return;
    }
    addShopOffer({
      title: offerTitle.trim(),
      code: offerCode.trim().toUpperCase(),
      discountPercentage: offerDiscount,
      validUntil: offerExpiry,
      isActive: true,
      categoryLimit: offerTargetCategory as any,
      targetCategory: offerTargetCategory
    });
    setShowOfferModal(false);
    setOfferTitle('');
    setOfferCode('');
    showToast(`✓ Offer "${offerCode}" created and activated.`);
  };

  // ----------------------------------------------------
  // PROFILE UPDATE
  // ----------------------------------------------------
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEmail.includes('@') || !profileEmail.includes('.')) {
      showToast('Please enter a valid store email address.');
      return;
    }
    if (profilePhone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit contact phone number.');
      return;
    }
    updateShopProfile({
      name: profileStoreName.trim(),
      shopName: profileStoreName.trim(),
      managerName: profileManager.trim(),
      email: profileEmail.trim(),
      contactEmail: profileEmail.trim(),
      phone: profilePhone.trim(),
      contactPhone: profilePhone.trim(),
      operatingHours: profileHours.trim(),
      upiVpa: profileVpa.trim(),
      location: profileLocation.trim()
    });
    showToast('✓ Merchant store profile updated and saved.');
  };

  // ----------------------------------------------------
  // ACCURATE TELEMETRY CALCULATIONS (Module 2.2)
  // ----------------------------------------------------
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COLLECTED').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'READY').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0) +
    transactions.reduce((sum, t) => sum + t.amount, 0);

  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'ALL') return true;
    return ord.status === orderFilter;
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.merchantName.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      Boolean(tx.itemsSummary && tx.itemsSummary.toLowerCase().includes(txSearch.toLowerCase()));
    const matchesMethod = txMethodFilter === 'ALL' || tx.type === txMethodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(5, 150, 105, 0.08) 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            NEXORA BUSINESS OS • CAMPUS MERCHANT CONSOLE
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
            {profileStoreName}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Merchant ID: <strong style={{ color: 'var(--text-primary)' }}>{shopProfile.merchantId || shopProfile.id}</strong> • Manager: <strong style={{ color: 'var(--text-primary)' }}>{profileManager}</strong> • Station: <strong style={{ color: '#059669' }}>POS Counter 1 (Online)</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#059669', borderColor: '#059669', gap: 6, fontWeight: 800 }}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'biz-pos', label: 'POS Checkout Register', icon: Store },
          { id: 'biz-orders', label: `Live Orders Queue (${pendingOrdersCount + readyOrdersCount})`, icon: Package },
          { id: 'biz-inventory', label: 'Products & Inventory', icon: ShoppingBag },
          { id: 'biz-dashboard', label: 'Sales & Revenue Telemetry', icon: LayoutDashboard },
          { id: 'biz-transactions', label: 'Transactions Ledger', icon: CreditCard },
          { id: 'biz-offers', label: `Store Deals & Offers (${shopOffers.length})`, icon: Tag },
          { id: 'biz-notifications', label: 'Store Operations Alerts', icon: Bell },
          { id: 'terminals', label: 'Shop Palm Terminal', icon: Monitor },
          { id: 'biz-profile', label: 'Store Profile & Settings', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`noir-tab-pill ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} color={isActive ? '#FFFFFF' : 'var(--text-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: POS CHECKOUT REGISTER */}
      {/* ======================================================== */}
      {currentTab === 'biz-pos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Menu & Product Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Filter Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {(['All', 'Food', 'Stationery', 'Merchandise', 'Printing'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`noir-tab-pill ${activeCategory === cat ? 'active' : ''}`}
                    style={{ fontSize: 12, padding: '5px 14px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: 220 }}>
                <input
                  type="text"
                  placeholder="Quick search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 32, fontSize: 12, height: 36 }}
                />
                <Search size={14} color="#64748B" style={{ position: 'absolute', left: 10, top: 11 }} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid-3">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addItemToPos(p)}
                    className="noir-card noir-card-interactive"
                    style={{
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      opacity: isOutOfStock ? 0.6 : 1
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                    />
                    <div>
                      <span className="badge badge-primary" style={{ fontSize: 10 }}>{p.category}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                        {p.name}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#059669' }}>₹{p.price}</div>
                      <span
                        style={{
                          fontSize: 11,
                          color: isOutOfStock ? '#DC2626' : p.stock <= p.lowStockThreshold ? '#D97706' : 'var(--text-muted)',
                          fontWeight: 700
                        }}
                      >
                        {isOutOfStock ? 'Out of stock' : `${p.stock} in stock`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Order Register & Palm Payment */}
          <div className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
                  Current Order Register
                </h3>
                {posCart.length > 0 && (
                  <button onClick={() => setPosCart([])} className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: '#DC2626' }}>
                    Clear Bill
                  </button>
                )}
              </div>

              {posCart.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                  <Store size={36} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                  Cart is empty. Click items from the catalogue to add to customer bill.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {posCart.map((i) => (
                    <div
                      key={i.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 12,
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 10,
                        fontSize: 13
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{i.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>₹{i.price} each</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateCartQty(i.name, -1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>-</button>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{i.qty}</span>
                        <button onClick={() => updateCartQty(i.name, 1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>+</button>
                        <strong style={{ color: '#059669', minWidth: 44, textAlign: 'right' }}>₹{i.price * i.qty}</strong>
                        <button onClick={() => removeItemFromPos(i.name)} className="btn btn-ghost btn-icon btn-sm" style={{ color: '#DC2626', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 900, marginBottom: 16, color: 'var(--text-primary)' }}>
                <span>Total Bill</span>
                <span style={{ color: '#059669' }}>₹{total}</span>
              </div>

              {activePosPaymentRequest ? (
                <div style={{ padding: 16, backgroundColor: '#FEF3C7', borderRadius: 12, border: '1px solid #FDE68A', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#92400E' }}>
                    📡 BROADCASTING PAYMENT REQUEST TO CANTEEN PALM TERMINAL
                  </div>
                  <div style={{ fontSize: 12, color: '#D97706', marginTop: 4 }}>
                    Waiting for student palm contact scan (₹{total})...
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={handleSendPaymentRequest}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center', backgroundColor: '#059669', borderColor: '#059669', gap: 10, fontWeight: 900 }}
                    disabled={posCart.length === 0}
                  >
                    <Send size={18} /> Request Palm Terminal Payment
                  </button>

                  <button
                    onClick={handleCashCheckout}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                    disabled={posCart.length === 0}
                  >
                    Cash / UPI Direct Settlement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE ORDERS DISPATCH QUEUE */}
      {/* ======================================================== */}
      {currentTab === 'biz-orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                Live Canteen & Store Orders Queue
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Incoming orders placed by students on the NEXORA Campus Marketplace
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
              {(['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`noir-tab-pill ${orderFilter === st ? 'active' : ''}`}
                  style={{ fontSize: 11, padding: '4px 12px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredOrders.length === 0 ? (
              <div className="noir-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                No orders matching filter "{orderFilter}".
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="noir-card"
                  style={{
                    padding: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="badge badge-primary">{ord.pickupCode}</span>
                      <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>Order #{ord.id}</strong>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        by <strong style={{ color: 'var(--text-primary)' }}>{ord.userName}</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 8, fontWeight: 600 }}>
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(' • ')}
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      Ordered: {ord.timestamp} • Total Bill: <strong style={{ color: '#059669' }}>₹{ord.totalAmount}</strong> (Paid via NEXORA Wallet)
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      className={`badge ${
                        ord.status === 'COLLECTED'
                          ? 'badge-success'
                          : ord.status === 'READY'
                          ? 'badge-success'
                          : ord.status === 'PREPARING' || ord.status === 'CONFIRMED'
                          ? 'badge-warning'
                          : ord.status === 'CANCELLED'
                          ? 'badge-danger'
                          : 'badge-neutral'
                      }`}
                      style={{ fontSize: 11, fontWeight: 800 }}
                    >
                      {ord.status}
                    </span>

                    {ord.status === 'PLACED' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'CONFIRMED')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        Confirm Order
                      </button>
                    )}

                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        Start Preparing
                      </button>
                    )}

                    {ord.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'READY')}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#059669', borderColor: '#059669', fontWeight: 800 }}
                      >
                        Mark Ready
                      </button>
                    )}

                    {ord.status === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'COLLECTED')}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8', fontWeight: 800 }}
                      >
                        Hand Over to Student
                      </button>
                    )}

                    {ord.status !== 'COLLECTED' && ord.status !== 'CANCELLED' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'CANCELLED')}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#DC2626', fontSize: 11 }}
                      >
                        Decline
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrderDetails(ord)}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="Inspect Order Items"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PRODUCTS & INVENTORY MANAGER */}
      {/* ======================================================== */}
      {currentTab === 'biz-inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                Inventory & Stock Management
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Manage campus store products, adjust live stock counts, and update retail prices
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', borderColor: '#059669', gap: 6, fontWeight: 800 }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Low Stock Warning Banner */}
          {lowStockProducts.length > 0 && (
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid #FECACA',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <AlertTriangle size={20} color="#DC2626" />
              <div style={{ fontSize: 13, color: '#991B1B' }}>
                <strong>Low Stock Alert:</strong> {lowStockProducts.length} product(s) have fallen below the 10-unit minimum threshold ({lowStockProducts.map(p => p.name).join(', ')}).
              </div>
            </div>
          )}

          {/* Catalogue Table */}
          <div style={{ overflowX: 'auto' }} className="noir-card">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)' }}>
                  <th style={{ padding: '12px 14px' }}>PRODUCT</th>
                  <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 14px' }}>PRICE</th>
                  <th style={{ padding: '12px 14px' }}>STOCK LEVEL</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>QUICK ADJUST</th>
                  <th style={{ padding: '12px 14px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      <div>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {p.id}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669' }}>₹{p.price}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.stock} units</td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.stock <= 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : p.stock <= p.lowStockThreshold ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Optimal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleAdjustStock(p, 10)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          title="Restock +10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, -5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          title="Reduce -5 units"
                        >
                          -5
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: 11, gap: 4 }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#DC2626', padding: '4px 6px' }}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stock Movement Audit Log (Module 2.4) */}
          <div className="noir-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={16} color="var(--brand-primary)" /> Recent Stock Movement Ledger
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stockMovements.slice(0, 5).map((mv) => (
                <div
                  key={mv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 8,
                    fontSize: 12
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{mv.productName}</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
                      Reason: {mv.reason} • by {mv.user || mv.userName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, color: (mv.quantityChange || 0) > 0 ? '#059669' : '#DC2626' }}>
                      {(mv.quantityChange || 0) > 0 ? `+${mv.quantityChange}` : mv.quantityChange} units
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{mv.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SALES & REVENUE DASHBOARD (Module 2.2) */}
      {/* ======================================================== */}
      {currentTab === 'biz-dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Key Metric Cards */}
          <div className="grid-4">
            <div className="noir-card" style={{ borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                TOTAL REVENUE (ALL CHANNELS)
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', marginTop: 4 }}>
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>
                Includes Palm Settlements & Wallet
              </div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #2563EB' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                TOTAL ORDERS
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
                {totalOrdersCount}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 700 }}>
                {completedOrdersCount} Completed • {pendingOrdersCount} In Queue
              </div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                INVENTORY VALUATION
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                ₹{inventoryValue.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 700 }}>
                Across {products.length} distinct SKUs
              </div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #DC2626' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                LOW STOCK WARNINGS
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: lowStockProducts.length > 0 ? '#DC2626' : '#059669', marginTop: 4 }}>
                {lowStockProducts.length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 700 }}>
                {lowStockProducts.length > 0 ? 'Requires vendor reorder' : 'All stocks optimal'}
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid-2">
            {/* Orders Status Breakdown */}
            <div className="noir-card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                Order Fulfillment Telemetry
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Completed / Picked Up', count: completedOrdersCount, color: '#059669' },
                  { label: 'Ready for Collection', count: readyOrdersCount, color: '#2563EB' },
                  { label: 'Processing / In Kitchen', count: pendingOrdersCount, color: '#D97706' },
                  { label: 'Cancelled / Declined', count: cancelledOrdersCount, color: '#DC2626' }
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: row.color }} />
                      <span style={{ color: 'var(--text-primary)' }}>{row.label}</span>
                    </div>
                    <strong style={{ color: 'var(--text-primary)' }}>{row.count} orders</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="noir-card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                Payment Method Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-primary)' }}>🖐️ NEXORA Palm Biometric Settlement:</span>
                  <strong style={{ color: '#059669' }}>88.4% of volume</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-primary)' }}>💳 Online Gateway / Card Settlement:</span>
                  <strong style={{ color: '#2563EB' }}>7.2% of volume</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-primary)' }}>💵 Cash / Direct Counter Settlement:</span>
                  <strong style={{ color: '#D97706' }}>4.4% of volume</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TRANSACTIONS LEDGER (Module 2.5) */}
      {/* ======================================================== */}
      {currentTab === 'biz-transactions' && (
        <div className="noir-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
                POS & Canteen Sales Ledger
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Live financial transactions recorded by merchant registers & palm terminal scans
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 200 }}>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 30, fontSize: 12, height: 32 }}
                />
                <Search size={13} color="#64748B" style={{ position: 'absolute', left: 8, top: 10 }} />
              </div>

              <select
                value={txMethodFilter}
                onChange={(e) => setTxMethodFilter(e.target.value)}
                className="input-field"
                style={{ fontSize: 12, height: 32, padding: '4px 8px' }}
              >
                <option value="ALL">All Methods</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>
                No transactions found.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 14,
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    fontSize: 13
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{tx.merchantName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx.itemsSummary || tx.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Ref: {tx.id} • {tx.timestamp}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#059669' }}>
                        +₹{tx.amount}
                      </div>
                      <span className="badge badge-success" style={{ fontSize: 10, marginTop: 4 }}>
                        {tx.type} • VERIFIED
                      </span>
                    </div>

                    <button
                      onClick={() => openReceiptModal(tx)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11, gap: 4 }}
                    >
                      <FileText size={12} /> Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SPECIAL OFFERS & DISCOUNTS (Module 2.6) */}
      {/* ======================================================== */}
      {currentTab === 'biz-offers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                Campus Store Deals & Seasonal Offers
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Create discount vouchers and automated promotional pricing for students & faculty
              </p>
            </div>
            <button
              onClick={() => setShowOfferModal(true)}
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', borderColor: '#059669', gap: 6, fontWeight: 800 }}
            >
              <Plus size={16} /> Create New Offer
            </button>
          </div>

          <div className="grid-2">
            {shopOffers.map((off) => (
              <div
                key={off.id}
                className="noir-card"
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${off.isActive ? '#059669' : '#94A3B8'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="badge badge-primary">{off.code}</span>
                    <span className={`badge ${off.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {off.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{off.title}</h3>
                  <div style={{ fontSize: 13, color: '#059669', fontWeight: 800, marginTop: 4 }}>
                    {off.discountPercentage}% Instant Discount
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Valid on: <strong>{off.categoryLimit || off.targetCategory || 'All'}</strong> • Expires: {off.validUntil}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Auto-applied during checkout
                  </span>
                  <button
                    onClick={() => {
                      toggleShopOffer(off.id);
                      showToast(`Offer ${off.code} ${off.isActive ? 'deactivated' : 'activated'}.`);
                    }}
                    className={`btn ${off.isActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    style={{ fontSize: 11 }}
                  >
                    {off.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: STORE OPERATIONS ALERTS (Module 2.6) */}
      {/* ======================================================== */}
      {currentTab === 'biz-notifications' && (
        <div className="noir-card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#059669" /> Merchant Store Notifications & System Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'notif-1', title: 'Low Inventory Alert', desc: `${lowStockProducts.length} product(s) are below safety buffer threshold.`, time: '10 mins ago', type: 'WARNING' },
              { id: 'notif-2', title: 'Daily T+0 POS Settlement', desc: 'Direct credit batch for yesterday\'s sales (₹18,450) completed via Escrow.', time: 'Today, 06:00 AM', type: 'SUCCESS' },
              { id: 'notif-3', title: 'Palm POS Sensor Calibration', desc: 'Touch Kiosk Counter 1 ping: 2ms response. Biometric sensor nominal.', time: 'Yesterday', type: 'INFO' }
            ].map((al) => (
              <div
                key={al.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{al.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{al.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${al.type === 'WARNING' ? 'badge-warning' : al.type === 'SUCCESS' ? 'badge-success' : 'badge-primary'}`}>
                    {al.type}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{al.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: CONNECTED SHOP PALM TERMINAL */}
      {/* ======================================================== */}
      {currentTab === 'terminals' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>
            Connected Merchant Palm POS Terminal
          </h3>
          {(() => {
            const canteenTerm = terminals.find((t) => t.type === 'CANTEEN') || terminals[0];
            return (
              <div style={{ backgroundColor: 'var(--bg-main)', padding: 18, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Terminal Hardware Code:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{canteenTerm ? canteenTerm.terminalCode : 'NEXORA-TERM-CANTEEN-POS'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Operating Status:</span>
                  <span className="badge badge-success">{canteenTerm ? `${canteenTerm.status} (${canteenTerm.lastPing})` : 'ONLINE'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Firmware Version:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{canteenTerm ? canteenTerm.firmwareVersion : 'v2.4.1-palm-secure'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Station Location:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{canteenTerm ? canteenTerm.locationName : 'Quad Canteen Express POS Counter 1'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Assigned Department:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{canteenTerm ? canteenTerm.assignedDept : 'Campus Hospitality Services'}</strong>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: MERCHANT PROFILE & SETTINGS (Module 2.1) */}
      {/* ======================================================== */}
      {currentTab === 'biz-profile' && (
        <div className="noir-card" style={{ padding: 26 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
            Campus Merchant Entity Profile & Settlement Settings
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Configure store metadata, operating hours, direct settlement UPI VPA, and contact details
          </p>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Store / Enterprise Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={profileStoreName}
                  onChange={(e) => setProfileStoreName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manager / Operator Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={profileManager}
                  onChange={(e) => setProfileManager(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Operating Hours</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={profileHours}
                  onChange={(e) => setProfileHours(e.target.value)}
                  placeholder="e.g. 08:00 AM - 10:00 PM"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Direct Settlement UPI VPA</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={profileVpa}
                  onChange={(e) => setProfileVpa(e.target.value)}
                  placeholder="e.g. merchant@icici"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Physical Location</label>
              <input
                type="text"
                required
                className="input-field"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', borderColor: '#059669', alignSelf: 'flex-start', fontWeight: 800, padding: '10px 24px' }}
            >
              Save Store Profile
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PRODUCT MODAL */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Add New Campus Store Item</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Masala Dosa or Graph Notebook"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="input-field"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                  >
                    <option value="Food">Food & Beverages</option>
                    <option value="Stationery">Stationery & Books</option>
                    <option value="Merchandise">Tech & Merch</option>
                    <option value="Printing">Printing Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="input-field"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Stock Units</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="input-field"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669', fontWeight: 800 }}>
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT PRODUCT MODAL (Module 2.4) */}
      {/* ======================================================== */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Edit Inventory Product</h3>
              <button onClick={() => setEditingProduct(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveProductEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="input-field"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                  >
                    <option value="Food">Food & Beverages</option>
                    <option value="Stationery">Stationery & Books</option>
                    <option value="Merchandise">Tech & Merch</option>
                    <option value="Printing">Printing Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="input-field"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Units</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="input-field"
                  value={editStock}
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669', fontWeight: 800 }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deletingProductId && (
        <div className="modal-backdrop" onClick={() => setDeletingProductId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, padding: 24, textAlign: 'center' }}>
            <AlertTriangle size={36} color="#DC2626" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 900 }}>Confirm Product Deletion</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              Are you sure you want to remove this item from the store catalogue? This will archive product availability.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setDeletingProductId(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger" style={{ flex: 1, fontWeight: 800 }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE OFFER MODAL */}
      {/* ======================================================== */}
      {showOfferModal && (
        <div className="modal-backdrop" onClick={() => setShowOfferModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Create Promotional Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Offer Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Mid-Term Exam Snacks Special"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Coupon Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. EXAM15"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    className="input-field"
                    value={offerDiscount}
                    onChange={(e) => setOfferDiscount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Target Category</label>
                  <select
                    className="input-field"
                    value={offerTargetCategory}
                    onChange={(e) => setOfferTargetCategory(e.target.value)}
                  >
                    <option value="All">All Items</option>
                    <option value="Food">Food & Beverages</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Merchandise">Tech & Merch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={offerExpiry}
                    onChange={(e) => setOfferExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowOfferModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669', fontWeight: 800 }}>
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ORDER DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedOrderDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Order #{selectedOrderDetails.id}</h3>
              <button onClick={() => setSelectedOrderDetails(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: 16, borderRadius: 10, border: '1px solid var(--border-color)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>Customer: <strong style={{ color: 'var(--text-primary)' }}>{selectedOrderDetails.userName}</strong></div>
              <div>Pickup Token: <span className="badge badge-primary">{selectedOrderDetails.pickupCode}</span></div>
              <div>Ordered Time: <strong style={{ color: 'var(--text-primary)' }}>{selectedOrderDetails.timestamp}</strong></div>
              <div>Status: <span className="badge badge-success">{selectedOrderDetails.status}</span></div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10, marginTop: 4 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Ordered Items:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{it.quantity}x {it.name}</span>
                      <strong style={{ color: '#059669' }}>₹{it.price * it.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900 }}>
                <span>Total Amount</span>
                <span style={{ color: '#059669' }}>₹{selectedOrderDetails.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 16, backgroundColor: '#059669', borderColor: '#059669', fontWeight: 800 }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;
