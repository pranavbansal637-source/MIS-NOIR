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
  Search
} from 'lucide-react';

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
    updateProductStock,
    orders,
    updateOrderStatus,
    createPosPaymentRequest,
    activePosPaymentRequest,
    showToast,
    terminals
  } = useApp();

  const [localTab, setLocalTab] = useState(activeTab);
  const currentTab = onNavigate ? activeTab : localTab;
  const setTab = onNavigate || setLocalTab;

  // POS Cart State
  const [posCart, setPosCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Stationery' | 'Merchandise' | 'Printing'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Food' | 'Stationery' | 'Merchandise' | 'Printing'>('Food');
  const [newProdPrice, setNewProdPrice] = useState(60);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  const addItemToPos = (name: string, price: number) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: `item-${Date.now()}`, name, price, qty: 1 }];
    });
  };

  const updateCartQty = (name: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
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
    createPosPaymentRequest('Quad Cafe & Campus Store', total, itemsSummary);
    showToast('Payment request broadcast to Shop Palm Terminal. Awaiting customer palm scan...');
  };

  const handleCashCheckout = () => {
    if (posCart.length === 0) return;
    showToast(`Cash payment of ₹${total} recorded. Receipt generated!`);
    setPosCart([]);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    addProduct({
      shopId: 'canteen-main',
      shopName: 'Quad Cafe & Food Court',
      name: newProdName,
      category: newProdCategory,
      price: newProdPrice,
      stock: newProdStock,
      lowStockThreshold: 10,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
      description: newProdDesc || 'Campus store inventory item'
    });
    setShowAddModal(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.95) 0%, rgba(8, 11, 18, 0.98) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            NEXORA BUSINESS OS • CAMPUS MERCHANT CONSOLE
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC', marginTop: 2 }}>
            The Central Quad Cafe & Campus Store
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            Merchant ID: <strong style={{ color: '#F8FAFC' }}>NEXORA-MERCH-8821</strong> • Station: <strong style={{ color: '#34D399' }}>POS Counter 1 (Palm Terminal Online)</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#10B981', borderColor: 'rgba(16, 185, 129, 0.5)', gap: 6, fontWeight: 800 }}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'biz-pos', label: 'POS Checkout Register', icon: Store },
          { id: 'biz-orders', label: 'Live Orders Dispatch Feed', icon: Package },
          { id: 'biz-inventory', label: 'Products & Inventory', icon: ShoppingBag },
          { id: 'biz-dashboard', label: 'Sales & Revenue Telemetry', icon: LayoutDashboard },
          { id: 'biz-transactions', label: 'Transactions Ledger', icon: CreditCard },
          { id: 'terminals', label: 'Shop Palm Terminal', icon: Monitor },
          { id: 'biz-profile', label: 'Merchant Store Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                padding: '8px 18px',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: isActive ? 'rgba(16, 185, 129, 0.45)' : 'var(--border-color)',
                color: isActive ? '#34D399' : '#94A3B8'
              }}
            >
              <Icon size={15} color={isActive ? '#10B981' : '#64748B'} />
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
                    className="btn btn-secondary btn-sm"
                    style={{
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: activeCategory === cat ? 800 : 600,
                      backgroundColor: activeCategory === cat ? '#D1FAE5' : '#FFFFFF',
                      borderColor: activeCategory === cat ? '#059669' : '#E2E8F0',
                      color: activeCategory === cat ? '#059669' : '#475569'
                    }}
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
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addItemToPos(p.name, p.price)}
                  className="noir-card noir-card-interactive"
                  style={{
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                  />
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: 10 }}>{p.category}</span>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC', marginTop: 4 }}>
                      {p.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#10B981' }}>₹{p.price}</div>
                    <span style={{ fontSize: 11, color: p.stock < 10 ? '#EF4444' : '#94A3B8', fontWeight: 600 }}>
                      {p.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Order Register & Palm Payment */}
          <div className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC' }}>
                  Current Order Register
                </h3>
                {posCart.length > 0 && (
                  <button onClick={() => setPosCart([])} className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: '#EF4444' }}>
                    Clear Bill
                  </button>
                )}
              </div>

              {posCart.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                  <Store size={36} color="#475569" style={{ margin: '0 auto 12px' }} />
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
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 10,
                        fontSize: 13
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{i.name}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>₹{i.price} each</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateCartQty(i.name, -1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>-</button>
                        <span style={{ fontWeight: 800 }}>{i.qty}</span>
                        <button onClick={() => updateCartQty(i.name, 1)} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>+</button>
                        <strong style={{ color: '#059669', minWidth: 44, textAlign: 'right' }}>₹{i.price * i.qty}</strong>
                        <button onClick={() => removeItemFromPos(i.name)} className="btn btn-ghost btn-icon btn-sm" style={{ color: '#EF4444', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 900, marginBottom: 16 }}>
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
                    style={{ width: '100%', justifyContent: 'center', backgroundColor: '#059669', gap: 10, fontWeight: 900 }}
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
      {/* TAB 2: LIVE ORDERS DISPATCH FEED */}
      {/* ======================================================== */}
      {currentTab === 'biz-orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
                Live Canteen & Store Orders Queue
              </h2>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Incoming orders placed by students on the NEXORA Campus Marketplace
              </p>
            </div>
            <span className="badge badge-success">{orders.length} Active Orders</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map((ord) => (
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
                    <strong style={{ fontSize: 16, color: '#F8FAFC' }}>Order #{ord.id}</strong>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>by <strong style={{ color: '#F8FAFC' }}>{ord.userName}</strong></span>
                  </div>

                  <div style={{ fontSize: 14, color: '#CBD5E1', marginTop: 8, fontWeight: 600 }}>
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(' • ')}
                  </div>

                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                    Ordered: {ord.timestamp} • Total Bill: <strong style={{ color: '#10B981' }}>₹{ord.totalAmount}</strong> (Paid via NEXORA Wallet)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className={`badge ${
                      ord.status === 'READY'
                        ? 'badge-success'
                        : ord.status === 'PREPARING'
                        ? 'badge-warning'
                        : 'badge-neutral'
                    }`}
                  >
                    {ord.status}
                  </span>

                  {ord.status === 'PREPARING' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'READY')}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#059669' }}
                    >
                      Mark Ready for Pickup
                    </button>
                  )}

                  {ord.status === 'READY' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'COLLECTED')}
                      className="btn btn-secondary btn-sm"
                    >
                      Hand Over to Student
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
                Inventory & Stock Management
              </h2>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Manage campus store products, adjust live stock counts, and update retail prices
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ backgroundColor: '#10B981', gap: 6 }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div style={{ overflowX: 'auto' }} className="noir-card">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>PRODUCT</th>
                  <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 14px' }}>PRICE</th>
                  <th style={{ padding: '12px 14px' }}>STOCK LEVEL</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>STOCK ADJUSTMENT</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#F8FAFC' }}>{p.name}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 900, color: '#10B981' }}>₹{p.price}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>{p.stock} units</td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.stock <= p.lowStockThreshold ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Optimal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 10)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          +10 Stock
                        </button>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 5)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          -5 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SALES & REVENUE DASHBOARD */}
      {/* ======================================================== */}
      {currentTab === 'biz-dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="grid-3">
            <div className="noir-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>TODAY'S GROSS SALES</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#10B981', marginTop: 4 }}>₹18,450</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: 700 }}>+14.2% vs yesterday</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>ORDERS PROCESSED</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#F8FAFC', marginTop: 4 }}>138</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: 700 }}>Avg order value: ₹133</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>PALM TOUCH SETTLEMENTS</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#F59E0B', marginTop: 4 }}>98.4%</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: 700 }}>Zero biometric disputes</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TRANSACTIONS LEDGER */}
      {/* ======================================================== */}
      {currentTab === 'biz-transactions' && (
        <div className="noir-card">
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            POS & Canteen Sales Ledger
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'tx-101', customer: 'PRANAV (NR-2026-8891)', amount: 200, items: '1x Grilled Paneer Sandwich, 1x Cold Brew', time: 'Today, 10:45 AM', type: 'PALM_DEBIT' },
              { id: 'tx-102', customer: 'Aarav Sharma (NR-2026-8892)', amount: 260, items: '1x Spiral Register, 1x Pilot Gel Pens', time: 'Today, 11:05 AM', type: 'WALLET_UPI' },
              { id: 'tx-103', customer: 'Sneha Patel (NR-2026-8895)', amount: 1450, items: '1x Casio fx-991CW Calculator', time: 'Yesterday, 03:20 PM', type: 'PALM_DEBIT' }
            ].map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{tx.customer}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{tx.items}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{tx.time}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#10B981' }}>+₹{tx.amount}</div>
                  <span className="badge badge-success" style={{ fontSize: 10, marginTop: 4 }}>{tx.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SHOP PALM TERMINAL */}
      {/* ======================================================== */}
      {currentTab === 'terminals' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 14 }}>
            Connected Merchant Palm POS Terminal
          </h3>
          {(() => {
            const canteenTerm = terminals.find((t) => t.type === 'CANTEEN') || terminals[0];
            return (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Terminal Hardware ID:</span>
                  <strong>{canteenTerm ? canteenTerm.terminalCode : 'NEXORA-TERM-CANTEEN-POS'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Operating Status:</span>
                  <span className="badge badge-success">{canteenTerm ? `${canteenTerm.status} (${canteenTerm.lastPing})` : 'ONLINE'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Firmware Version:</span>
                  <strong>{canteenTerm ? canteenTerm.firmwareVersion : 'v2.4.1-palm-secure'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Assigned Station:</span>
                  <strong>{canteenTerm ? canteenTerm.locationName : 'Quad Canteen Express POS Counter 1'}</strong>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: MERCHANT PROFILE */}
      {/* ======================================================== */}
      {currentTab === 'biz-profile' && (
        <div className="noir-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main, #F8FAFC)', marginBottom: 6 }}>
            Campus Merchant Entity Profile
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18, fontSize: 13 }}>
            <div>Store Name: <strong>The Central Quad Cafe & Campus Store</strong></div>
            <div>Merchant ID: <strong>NEXORA-MERCH-8821</strong></div>
            <div>Operating License: <strong>CAMPUS-COMMERCE-2026-A1</strong></div>
            <div>Campus Location: <strong>Student Center Ground Floor</strong></div>
            <div>Store Manager: <strong>Mr. Suresh Nair</strong></div>
            <div>Direct Contact: <strong>+91 98112 99001 (pos@nexora.edu)</strong></div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PRODUCT MODAL */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Add New Campus Store Item</h3>
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
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#059669' }}>
                  Save to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
