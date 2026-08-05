import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/store';
import type { Product } from '../types';
import { Header } from '../components/Header';
import { MenuDrawer } from '../components/MenuDrawer';
import { ContactsModal } from '../components/ContactsModal';
import { CategoryTabs } from '../components/CategoryTabs';
import { FeaturedSlider } from '../components/FeaturedSlider';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { Advantages } from '../components/Advantages';
import { Footer } from '../components/Footer';
import { Icon } from '../components/icons/Icon';

export function Home() {
  const { content, products, categories } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  const filtered = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)),
    [products, activeCategory],
  );

  function openContactsFor(product?: Product) {
    setOrderProduct(product ?? null);
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

      {/* Product grid */}
      <section className="mt-4">
        <motion.div layout className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={content.currency}
                onOpen={setSelected}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="rounded-4xl bg-white p-10 text-center text-ink-soft shadow-soft">
            У цій категорії поки немає товарів.
          </div>
        )}
      </section>

      {/* Advantages */}
      <Advantages title={content.advantagesTitle} advantages={content.advantages} />

      {/* Footer */}
      <Footer content={content} onOpenContacts={() => openContactsFor()} />

      {/* Floating global contact button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[460px] justify-end px-5 pb-6 sm:max-w-[520px]">
        <motion.button
          type="button"
          onClick={() => openContactsFor()}
          aria-label="Зв’язатися"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-float"
        >
          <Icon name="phone" size={24} />
        </motion.button>
      </div>

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
        onBuy={(p) => openContactsFor(p)}
      />
      <ContactsModal
        open={contactsOpen}
        contacts={content.contacts}
        productTitle={orderProduct?.title}
        onClose={() => setContactsOpen(false)}
      />
    </div>
  );
}
