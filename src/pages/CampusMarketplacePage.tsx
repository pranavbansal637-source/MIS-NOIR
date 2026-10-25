import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ProductItem } from '../types';
import { ShoppingBag, Coffee, Printer, Plus, Trash2, ArrowRight } from 'lucide-react';

export const CampusMarketplacePage: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, checkoutCart, student } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Stationery' | 'Printing'>('All');
  
  // Printing Calculator state
  const [printPages, setPrintPages] = useState(4);
  const [isColor, setIsColor] = useState(false);
  const [printCopies, setPrintCopies] = useState(1);

  const pricePerPage = isColor ? 10 : 3;
  const printTotal = printPages * pricePerPage * printCopies;

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Marketplace & Canteen</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Order canteen meals, stationery supplies & instant Cloud Printing
          </p>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#FBBF24', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
          NEXORA Wallet: ₹{student.walletBalance}
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {(['All', 'Food', 'Stationery', 'Printing'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`noir-tab-pill ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat === 'Food' && <Coffee size={14} />}
            {cat === 'Printing' && <Printer size={14} />}
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1fr 340px' : '1fr', gap: 24 }}>
        {/* Main Products Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Special Cloud Printing Section */}
          {(activeCategory === 'All' || activeCategory === 'Printing') && (
            <div className="noir-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Printer size={22} color="var(--brand-primary)" />
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Instant Cloud PDF Printing</h3>
              </div>

              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">Total PDF Pages</label>
                  <input
                    type="number"
                    className="input-field"
                    value={printPages}
                    onChange={(e) => setPrintPages(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Color Mode</label>
                  <select
                    className="input-field"
                    value={isColor ? 'COLOR' : 'BW'}
                    onChange={(e) => setIsColor(e.target.value === 'COLOR')}
                  >
                    <option value="BW">Black & White (₹3 / pg)</option>
                    <option value="COLOR">Full HD Color (₹10 / pg)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Copies</label>
                  <input
                    type="number"
                    className="input-field"
                    value={printCopies}
                    onChange={(e) => setPrintCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Estimated Price:</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-primary)' }}>₹{printTotal}</div>
                </div>
                <button
                  onClick={() => {
                    const customPrint: ProductItem = {
                      id: `print-${Date.now()}`,
                      shopId: 'stationery-hub',
                      shopName: 'Library Print Hub',
                      name: `Cloud PDF Print Job (${printPages}pg, ${isColor ? 'Color' : 'B&W'})`,
                      category: 'Printing',
                      price: printTotal,
                      stock: 999,
                      lowStockThreshold: 1,
                      image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=300',
                      description: `${printPages} pages x ${printCopies} copy`
                    };
                    addToCart(customPrint);
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Add Print Job to Cart
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Catalog */}
          <div className="grid-3">
            {filteredProducts.map((p) => (
              <div key={p.id} className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                    {p.shopName}
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 6px 0' }}>{p.name}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{p.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>₹{p.price}</span>
                  <button onClick={() => addToCart(p)} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Drawer Column */}
        {cart.length > 0 && (
          <div className="noir-card" style={{ height: 'fit-content', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={18} color="var(--brand-primary)" /> Your Order Cart
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 280, overflowY: 'auto' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity} x ₹{item.product.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>₹{item.quantity * item.product.price}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="btn btn-ghost btn-icon btn-sm">
                      <Trash2 size={14} color="var(--state-danger)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--brand-primary)' }}>₹{cartTotal}</span>
              </div>
            </div>

            <button onClick={() => checkoutCart()} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Pay ₹{cartTotal} via NEXORA Wallet <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
