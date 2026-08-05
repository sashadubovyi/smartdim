import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/store';
import { useCart } from '../store/cart';
import type { Product } from '../types';
import { Header } from '../components/Header';
import { MenuDrawer } from '../components/MenuDrawer';
import { ContactsModal } from '../components/ContactsModal';
import { CategoryTabs } from '../components/CategoryTabs';
import { FeaturedSlider } from '../components/FeaturedSlider';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { CartButton } from '../components/CartButton';
import { CartDrawer } from '../components/CartDrawer';
import { Advantages } from '../components/Advantages';
import { Footer } from '../components/Footer';
import { Icon } from '../components/icons/Icon';

export function Home() {
  const { content, products, categories } = useStore();
  const { add } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderText, setOrderText] = useState<string>('');
  const [toast, setToast] = useState('');

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  const filtered = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)),
    [products, activeCategory],
  );

  function addToCart(product: Product) {
    add(product.id);
    setToast(`«${product.title}» у кошику`);
    window.setTimeout(() => setToast(''), 1800);
  }

  function openContactsFor(product?: Product) {
    setOrderProduct(product ?? null);
    setOrderText('');
    setContactsOpen(true);
  }

  function handleCheckout(text: string) {
    setCartOpen(false);
    setOrderText(text);
    setOrderProduct(null);
    setContactsOpen(true);
  }

  return (
    <div className="app-shell">
      <Header title={content.siteTitle} onOpenMenu={() => setMenuOpen(true)} />

      {/* Hero */}
      <section className="mt-2 animate-fade-up">
        <span className="chip bg-mint-200 text-brand-700">{content.hero.eyebrow}</span>
        <h1 className="mt-3 text-[28px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-4xl">
          {content.hero.title}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{content.hero.subtitle}</p>
      </section>

      {/* Featured slider */}
      {featured.length > 0 && (
        <section className="mt-6">
          <FeaturedSlider products={featured} currency={content.currency} onOpen={setSelected} />
        </section>
      )}

      {/* Category filter */}
      <section className="mt-6">
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      </section>

      {/* Product grid — keyed by category so the entrance stagger replays
          without shared-layout reflow (which caused the cards to jump). */}
      <section className="mt-4">
        <div key={activeCategory} className="grid grid-cols-2 gap-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={content.currency}
              onOpen={setSelected}
              onAdd={addToCart}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-4xl bg-white p-10 text-center text-ink-soft shadow-soft ring-1 ring-mint-100">
            У цій категорії поки немає товарів.
          </div>
        )}
      </section>

      {/* Advantages */}
      <Advantages title={content.advantagesTitle} advantages={content.advantages} />

      {/* Footer */}
      <Footer content={content} onOpenContacts={() => openContactsFor()} />

      {/* Floating cart button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[460px] justify-end px-5 pb-6 sm:max-w-[520px]">
        <CartButton onClick={() => setCartOpen(true)} />
      </div>

      {/* Added-to-cart toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed inset-x-0 bottom-28 z-40 mx-auto flex w-fit max-w-[90%] items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-float"
          >
            <Icon name="check" size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <MenuDrawer
        open={menuOpen}
        categories={categories}
        activeCategory={activeCategory}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={setActiveCategory}
        onOpenContacts={() => openContactsFor()}
      />
      <ProductDetail
        product={selected}
        currency={content.currency}
        onClose={() => setSelected(null)}
        onAdd={addToCart}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
      <ContactsModal
        open={contactsOpen}
        contacts={content.contacts}
        productTitle={orderProduct?.title}
        orderText={orderText || undefined}
        onClose={() => setContactsOpen(false)}
      />
    </div>
  );
}
