import React from 'react';

const SLIDE_HEIGHT = 160;

export default function NoAdsPromoCard() {
  const sparks = [
    // short range
    { sx: '22px', sy: '-6px', d: '0s' },
    { sx: '-28px', sy: '14px', d: '0.15s' },
    { sx: '18px', sy: '22px', d: '0.3s' },
    { sx: '-24px', sy: '-20px', d: '0.45s' },
    { sx: '12px', sy: '-28px', d: '0.6s' },
    { sx: '-14px', sy: '26px', d: '0.75s' },
    { sx: '30px', sy: '6px', d: '0.9s' },
    { sx: '-32px', sy: '-4px', d: '1.05s' },
    // medium range
    { sx: '60px', sy: '-30px', d: '1.2s' },
    { sx: '-64px', sy: '26px', d: '1.35s' },
    { sx: '48px', sy: '40px', d: '1.5s' },
    { sx: '-56px', sy: '-44px', d: '1.65s' },
    { sx: '34px', sy: '-58px', d: '1.8s' },
    { sx: '-42px', sy: '54px', d: '1.95s' },
    { sx: '72px', sy: '14px', d: '2.1s' },
    { sx: '-76px', sy: '-12px', d: '2.25s' },
    // long range (span across the card)
    { sx: '120px', sy: '-60px', d: '2.4s' },
    { sx: '-140px', sy: '70px', d: '2.55s' },
    { sx: '150px', sy: '50px', d: '2.7s' },
    { sx: '-130px', sy: '-70px', d: '2.85s' },
    { sx: '100px', sy: '-80px', d: '3s' },
    { sx: '-160px', sy: '40px', d: '3.15s' },
    { sx: '140px', sy: '0px', d: '3.3s' },
    { sx: '-120px', sy: '0px', d: '3.45s' },
  ];

  return (
    <div className={`relative w-full h-[${SLIDE_HEIGHT}px] rounded-xl overflow-hidden bg-gray-900`}> 
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes floaty {
            0% { transform: translateY(0px); opacity: .25; }
            50% { transform: translateY(-6px); opacity: .35; }
            100% { transform: translateY(0px); opacity: .25; }
          }
          @keyframes spark-pop {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            10% { opacity: 1; }
            45% { transform: translate(var(--sx), var(--sy)) scale(1); opacity: 1; }
            100% { transform: translate(calc(var(--sx) * 1.6), calc(var(--sy) * 1.6)) scale(0); opacity: 0; }
          }
          @keyframes spark-glow {
            0%, 100% { filter: drop-shadow(0 0 0px rgba(255,255,255,0.0)); }
            50% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.85)); }
          }
          @keyframes sheenSlide {
            0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
            30% { opacity: .85; }
            60% { opacity: .85; }
            100% { transform: translateX(220%) rotate(12deg); opacity: 0; }
          }
          .svmz-cta { position: relative; overflow: hidden; }
          .svmz-cta-sheen { position: absolute; top: -40%; bottom: -40%; width: 40%; left: -20%; background: linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.0) 100%); filter: blur(2px); border-radius: 9999px; pointer-events: none; }
          .svmz-cta:hover .svmz-cta-sheen { animation: sheenSlide 900ms ease-in-out forwards; }
        `}
      </style>

      {/* animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" style={{ filter: 'saturate(1.1)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(1200px 200px at 10% 120%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)' }} />

      

      {/* floating decor circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" style={{ animation: 'floaty 6s ease-in-out infinite' }} />
      <div className="absolute bottom-4 -left-6 w-16 h-16 rounded-full bg-white/10" style={{ animation: 'floaty 7s ease-in-out infinite 0.4s' }} />

      {/* sparks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {sparks.map((s, i) => (
            <span
              key={i}
              className="absolute block bg-white rounded-full"
              style={{
                width: i % 3 === 0 ? '4px' : '3px',
                height: i % 3 === 0 ? '4px' : '3px',
                marginLeft: '-1px',
                marginTop: '-1px',
                animation: `spark-pop 2.6s ease-out infinite ${s.d}, spark-glow 1.6s ease-in-out infinite ${s.d}`,
                // custom direction per spark
                '--sx': s.sx,
                '--sy': s.sy,
              }}
            />
          ))}
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-5 select-none">
        <h3 className="text-white text-[20px] leading-6 font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          Anuncie seus produtos e serviços aqui
        </h3>
        <p className="mt-2 text-white/85 text-[13px] leading-5 max-w-xs">
          Alcance milhares de clientes no seu telemóvel. Destaque sua marca com banners chamativos.
        </p>
        <div className="mt-3">
          <a
            href="/anunciar"
            className="svmz-cta inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-white text-[12px] font-extrabold select-none transition-all active:translate-y-[1px]"
            style={{
              background: 'linear-gradient(180deg, #bca7ff 0%, #8b5cf6 50%, #7c3aed 75%, #6d28d9 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.65), inset 0 -2px 4px rgba(0,0,0,0.22), 0 10px 20px rgba(124,58,237,0.35)',
              border: '1px solid rgba(255,255,255,0.28)',
              outline: '1px solid rgba(0,0,0,0.15)'
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 38%, rgba(255,255,255,0.0) 60%)',
                transform: 'translateY(-1px)'
              }}
            />
            <span className="svmz-cta-sheen" aria-hidden />
            <span className="relative z-10 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">Criar anúncio</span>
          </a>
        </div>
      </div>

      {/* bottom gradient for depth */}
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)'
      }} />
    </div>
  );
}
