export default function DiscoverPage() {
  const categories = [
    { title: 'Semboller Ansiklopedisi', icon: 'menu_book', desc: 'Fincandaki sembollerin anlamlarını öğren' },
    { title: 'Tarot Rehberi', icon: 'style', desc: '78 tarot kartının detaylı anlamları' },
    { title: 'Burçlar', icon: 'stars', desc: '12 burç hakkında her şey' },
    { title: 'Fal Okuma Rehberi', icon: 'school', desc: 'Fal nasıl bakılır? Adım adım' },
  ];

  return (
    <div className="page discover-page">
      <div className="page-header">
        <h1 className="page-title">Keşfet</h1>
        <p className="page-subtitle">Öğren ve derinleş</p>
      </div>

      <div className="discover-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="discover-card locked">
            <span className="material-symbols-outlined discover-icon">{cat.icon}</span>
            <h3 className="discover-title">{cat.title}</h3>
            <p className="discover-desc">{cat.desc}</p>
            <span className="discover-badge">Yakında</span>
          </div>
        ))}
      </div>
    </div>
  );
}