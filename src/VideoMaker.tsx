import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type WordTiming = { text: string; start: number; end: number };

export type SceneConfig = {
  type: string;
  voice?: string;
  spoken?: string;
  subtitle?: string;
  audioFile?: string;
  words?: WordTiming[];
  durationFrames?: number;
  startFrame?: number;
  // Optional scene-specific fields
  item1?: string;
  item2?: string;
  item3?: string;
  sender?: string;
  reply?: string;
  gameTitle?: string;
  scoreLeft?: string;
  scoreRight?: string;
  timeLabel?: string;
  tired?: boolean;
  msg1?: string;
  msg2?: string;
  msg3?: string;
  msg4?: string;
  bigScore?: string;
  subText?: string;
  brandName?: string;
  tagline?: string;
  pillText?: string;
  ctaText?: string;
  chartData?: string;
  mediaUrl?: string;
};

export type ModularProps = {
  topBadge: string;
  accentColor: string;
  hoodieColor: string;
  captionStyle: string;
  totalFrames?: number;
  scenes: SceneConfig[];
};

const TopBadge: React.FC<{ text: string; bg: string }> = ({ text, bg }) => {
  if (!text || !text.trim()) return null;
  return (
    <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 80 }}>
      <div
        style={{
          backgroundColor: bg || '#facc15',
          color: '#000',
          fontSize: 54,
          fontWeight: 900,
          padding: '12px 36px',
          borderRadius: 14,
          border: '5px solid #000',
          boxShadow: '0 8px 0 rgba(0,0,0,0.35)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const SceneCaptions: React.FC<{
  words?: WordTiming[];
  subtitle?: string;
  styleType: string;
  accentColor: string;
  bottom?: number;
}> = ({ words = [], subtitle = '', styleType, accentColor, bottom = 390 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (styleType === 'none') return null;

  const sec = frame / fps;
  if (styleType === 'pop' && words.length > 0) {
    const chunks: WordTiming[][] = [];
    for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3));
    const activeChunk = chunks.find((c) => sec >= c[0].start - 0.05 && sec <= c[c.length - 1].end + 0.35);
    if (!activeChunk) return null;
    return (
      <div
        style={{
          position: 'absolute',
          bottom,
          left: 54,
          right: 54,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 14,
          zIndex: 75,
        }}
      >
        {activeChunk.map((w, i) => {
          const on = sec >= w.start && sec <= w.end + 0.12;
          return (
            <span
              key={i}
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: on ? 66 : 58,
                fontWeight: 900,
                color: on ? accentColor || '#facc15' : '#fff',
                transform: on ? 'scale(1.08)' : 'scale(1)',
                textShadow: '-5px -5px 0 #000, 5px -5px 0 #000, -5px 5px 0 #000, 5px 5px 0 #000, 0 8px 18px rgba(0,0,0,0.9)',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    );
  }

  if (!subtitle.trim()) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: 52,
        fontWeight: 900,
        color: '#ffffff',
        textShadow: '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 16px rgba(0,0,0,0.85)',
        lineHeight: 1.2,
        zIndex: 75,
      }}
    >
      {subtitle}
    </div>
  );
};

// Expressive Cel-Shaded Character matching the RIVL style
const Character: React.FC<{
  hoodieColor: string;
  mood: 'smug' | 'annoyed' | 'shocked' | 'evil' | 'tired' | 'happy' | 'sleep' | 'wave';
  holdingPhone?: boolean;
  scale?: number;
  x?: number;
  y?: number;
  logoText?: string;
}> = ({ hoodieColor, mood, holdingPhone = false, scale = 1, x = 0, y = 0, logoText = '' }) => {
  const frame = useCurrentFrame();
  const bob = mood === 'sleep' ? 0 : Math.sin(frame * 0.18) * 4;
  const waveAngle = mood === 'wave' ? Math.sin(frame * 0.35) * 18 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + bob}px)) scale(${scale})`,
        zIndex: 30,
      }}
    >
      <svg width="520" height="680" viewBox="0 0 520 680">
        {/* Left & Right Arms */}
        {mood === 'wave' ? (
          <g transform={`rotate(${waveAngle} 390 420)`}>
            <rect x="375" y="250" width="66" height="190" rx="33" fill={hoodieColor} stroke="#000" strokeWidth="7" />
            <circle cx="408" cy="245" r="30" fill="#fde0c6" stroke="#000" strokeWidth="7" />
          </g>
        ) : mood === 'annoyed' ? (
          <g transform="rotate(-35 390 440)">
            <rect x="365" y="320" width="65" height="175" rx="32" fill={hoodieColor} stroke="#000" strokeWidth="7" />
            <circle cx="397" cy="315" r="28" fill="#fde0c6" stroke="#000" strokeWidth="7" />
          </g>
        ) : (
          <rect x="370" y="380" width="68" height="210" rx="34" fill={hoodieColor} stroke="#000" strokeWidth="7" />
        )}
        <rect x="82" y="380" width="68" height="210" rx="34" fill={hoodieColor} stroke="#000" strokeWidth="7" />

        {/* Hoodie Torso */}
        <path
          d="M125 340 Q260 305 395 340 L415 650 L105 650 Z"
          fill={hoodieColor}
          stroke="#000"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* Kangaroo Pocket */}
        <path
          d="M175 495 L345 495 L360 585 L160 585 Z"
          fill={hoodieColor}
          stroke="#000"
          strokeWidth="6"
          strokeLinejoin="round"
          opacity="0.88"
        />
        {logoText && (
          <g transform="translate(232, 415)">
            <rect width="56" height="56" rx="14" fill="#111" stroke="#000" strokeWidth="4" />
            <text x="28" y="39" textAnchor="middle" fill={hoodieColor} fontSize="30" fontWeight="900" fontFamily="Arial">
              {logoText.slice(0, 2)}
            </text>
          </g>
        )}

        {/* Neck & Head */}
        <rect x="228" y="295" width="64" height="55" fill="#fde0c6" stroke="#000" strokeWidth="6" />
        <ellipse cx="260" cy="215" rx="105" ry="118" fill="#fde0c6" stroke="#000" strokeWidth="8" />

        {/* Ears */}
        <circle cx="152" cy="220" r="22" fill="#fde0c6" stroke="#000" strokeWidth="7" />
        <circle cx="368" cy="220" r="22" fill="#fde0c6" stroke="#000" strokeWidth="7" />

        {/* Cheek Blush */}
        <ellipse cx="195" cy="245" rx="18" ry="9" fill="#fca5a5" opacity="0.65" />
        <ellipse cx="325" cy="245" rx="18" ry="9" fill="#fca5a5" opacity="0.65" />

        {/* Hair */}
        <path
          d="M150 185 Q148 75 260 68 Q372 75 370 185 Q345 128 300 135 Q265 110 225 135 Q180 125 150 185 Z"
          fill="#451a03"
          stroke="#000"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        {/* Eyes & Expressions */}
        {mood === 'sleep' && (
          <>
            <path d="M185 215 Q208 232 232 215" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <path d="M288 215 Q312 232 335 215" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="260" cy="276" rx="10" ry="12" fill="#7f1d1d" stroke="#000" strokeWidth="5" />
          </>
        )}
        {mood === 'happy' || mood === 'wave' ? (
          <>
            <path d="M185 218 Q208 195 232 218" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <path d="M288 218 Q312 195 335 218" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <path d="M210 262 Q260 315 310 262 Z" fill="#fff" stroke="#000" strokeWidth="6" />
          </>
        ) : null}
        {(mood === 'smug' || mood === 'annoyed' || mood === 'evil') && (
          <>
            <ellipse cx="208" cy="212" rx="22" ry="16" fill="#fff" stroke="#000" strokeWidth="6" />
            <ellipse cx="312" cy="212" rx="22" ry="16" fill="#fff" stroke="#000" strokeWidth="6" />
            <circle cx="212" cy="214" r="8" fill="#000" />
            <circle cx="316" cy="214" r="8" fill="#000" />
            {/* Half-lids */}
            <path d="M184 202 L232 206" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            <path d="M288 206 L336 202" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            {mood === 'evil' && (
              <>
                <line x1="184" y1="180" x2="234" y2="195" stroke="#000" strokeWidth="8" strokeLinecap="round" />
                <line x1="336" y1="180" x2="286" y2="195" stroke="#000" strokeWidth="8" strokeLinecap="round" />
                <path d="M212 264 Q260 302 308 264 Z" fill="#fff" stroke="#000" strokeWidth="6" />
              </>
            )}
            {mood === 'smug' && (
              <path d="M224 274 Q265 288 300 266" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            )}
            {mood === 'annoyed' && (
              <path d="M228 282 Q260 268 292 282" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            )}
          </>
        )}
        {(mood === 'shocked' || mood === 'tired') && (
          <>
            {mood === 'tired' && (
              <>
                <path d="M186 235 Q208 248 230 235" fill="none" stroke="#6366f1" strokeWidth="8" opacity="0.55" />
                <path d="M290 235 Q312 248 334 235" fill="none" stroke="#6366f1" strokeWidth="8" opacity="0.55" />
                <path d="M162 155 Q150 180 162 190 Q174 180 162 155 Z" fill="#38bdf8" stroke="#000" strokeWidth="4" />
              </>
            )}
            <circle cx="208" cy="212" r="24" fill="#fff" stroke="#000" strokeWidth="6" />
            <circle cx="312" cy="212" r="24" fill="#fff" stroke="#000" strokeWidth="6" />
            <circle cx="208" cy="212" r="9" fill="#000" />
            <circle cx="312" cy="212" r="9" fill="#000" />
            {mood === 'shocked' ? (
              <ellipse cx="260" cy="276" rx="22" ry="26" fill="#7f1d1d" stroke="#000" strokeWidth="6" />
            ) : (
              <path d="M228 278 Q260 264 292 278" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            )}
          </>
        )}

        {/* Optional Held Smartphone */}
        {holdingPhone && (
          <g transform="translate(198, 430)">
            <rect width="124" height="205" rx="24" fill="#1e293b" stroke="#000" strokeWidth="7" />
            <rect x="12" y="18" width="100" height="168" rx="14" fill="#3b82f6" />
            <circle cx="62" cy="102" r="24" fill={hoodieColor} stroke="#000" strokeWidth="4" />
          </g>
        )}
      </svg>
    </div>
  );
};

// === INDIVIDUAL SCENE RENDERERS ===

const CafeMenuScene: React.FC<{ sc: SceneConfig; hoodieColor: string }> = ({ sc, hoodieColor }) => {
  const frame = useCurrentFrame();
  const parseItem = (raw: string | undefined, fbName: string, fbPrice: string) => {
    const [n, p] = (raw || '').split('|');
    return { name: (n || fbName).trim(), price: (p || fbPrice).trim() };
  };
  const i1 = parseItem(sc.item1, 'latte', '$5.50');
  const i2 = parseItem(sc.item2, 'COFFEE', '$6.00');
  const i3 = parseItem(sc.item3, 'cookie', '$4.00');
  const circleProgress = interpolate(frame, [15, 38], [320, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#e7d8c1',
        backgroundImage: 'repeating-linear-gradient(90deg, #e7d8c1 0 54px, #decbb0 54px 108px)',
      }}
    >
      {/* Menu Board */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 110,
          right: 110,
          backgroundColor: '#3a2c1e',
          border: '10px solid #1e150d',
          borderRadius: 24,
          padding: '32px 46px',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 44, fontWeight: 900, marginBottom: 24 }}>MENU</div>
        {[i1, i2, i3].map((it, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 42,
              fontWeight: idx === 1 ? 900 : 600,
              color: idx === 1 ? '#fde047' : '#f8fafc',
              marginBottom: 18,
              position: 'relative',
            }}
          >
            <span>{it.name}</span>
            <span>{it.price}</span>
            {idx === 1 && (
              <svg style={{ position: 'absolute', right: -22, top: -14, width: 170, height: 82 }}>
                <ellipse
                  cx="85"
                  cy="41"
                  rx="76"
                  ry="32"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="7"
                  strokeDasharray="320"
                  strokeDashoffset={circleProgress}
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Counter & Steaming Coffee */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 290, background: '#784824', borderTop: '10px solid #000' }} />
      <div
        style={{
          position: 'absolute',
          right: 140,
          bottom: 240,
          width: 90,
          height: 120,
          background: '#fff',
          border: '6px solid #000',
          borderRadius: 12,
        }}
      >
        <div style={{ width: '100%', height: 42, marginTop: 36, background: '#784824', borderTop: '5px solid #000', borderBottom: '5px solid #000' }} />
      </div>

      <Character hoodieColor={hoodieColor} mood={frame < 40 ? 'smug' : 'annoyed'} x={-120} y={240} scale={1.15} />
    </AbsoluteFill>
  );
};

const GymScene: React.FC<{ hoodieColor: string }> = ({ hoodieColor }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#cbd5e1' }}>
      {/* Mirror */}
      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 110,
          right: 110,
          height: 760,
          background: 'linear-gradient(135deg, #bae6fd, #e0f2fe)',
          border: '12px solid #475569',
          borderRadius: 28,
        }}
      />
      {/* Dumbbell Rack */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 420, background: '#334155', borderTop: '10px solid #000' }} />
      <Character hoodieColor={hoodieColor} mood={frame < 36 ? 'happy' : 'annoyed'} y={200} scale={1.1} />
    </AbsoluteFill>
  );
};

const CouchHookScene: React.FC<{ sc: SceneConfig; hoodieColor: string }> = ({ sc, hoodieColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 13 } });
  const notifY = interpolate(drop, [0, 1], [-220, 270]);

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' }}>
      {/* Starry Night Window */}
      <div
        style={{
          position: 'absolute',
          top: 290,
          right: 110,
          width: 300,
          height: 360,
          backgroundColor: '#020617',
          border: '10px solid #475569',
          borderRadius: 12,
        }}
      >
        <div style={{ position: 'absolute', top: 38, right: 42, width: 58, height: 58, borderRadius: '50%', background: '#fef08a' }} />
      </div>
      {/* Purple Couch */}
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          left: 70,
          right: 70,
          height: 360,
          backgroundColor: '#7c3aed',
          border: '10px solid #000',
          borderRadius: 42,
        }}
      />
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 270, backgroundColor: '#1e1b4b' }} />

      {/* iOS Notification Banner */}
      <div
        style={{
          position: 'absolute',
          top: notifY,
          left: 70,
          right: 70,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 28,
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          border: '4px solid #000',
          boxShadow: '0 18px 36px rgba(0,0,0,0.45)',
          zIndex: 60,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f43f5e',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
            fontWeight: 900,
            fontFamily: 'Arial',
          }}
        >
          {(sc.sender || 'J')[0]}
        </div>
        <div style={{ fontFamily: 'Arial', color: '#0f172a' }}>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{sc.sender || 'Jake'}</div>
          <div style={{ fontSize: 30 }}>{sc.subtitle || "bet you can't beat me at hoops"}</div>
        </div>
      </div>

      <Character
        hoodieColor={hoodieColor}
        mood={frame < 42 ? 'shocked' : 'evil'}
        holdingPhone
        y={190}
        scale={1.08}
      />
    </AbsoluteFill>
  );
};

const PhoneGameScene: React.FC<{ sc: SceneConfig; hoodieColor: string; accentColor: string }> = ({
  sc,
  hoodieColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const split = frame >= 52 && sc.tired;

  if (split) {
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1e1b4b, #0f172a)' }}>
        <div
          style={{
            position: 'absolute',
            top: 250,
            right: 80,
            background: '#0f172a',
            border: `4px solid ${accentColor}`,
            color: accentColor,
            padding: '12px 26px',
            borderRadius: 99,
            fontSize: 36,
            fontWeight: 900,
            fontFamily: 'Arial',
          }}
        >
          🌙 {sc.timeLabel || '3:42 AM'}
        </div>
        <Character hoodieColor={hoodieColor} mood="tired" holdingPhone y={140} scale={1.15} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #090d16 100%)' }}>
      {/* Phone Frame */}
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 110,
          right: 110,
          bottom: 180,
          backgroundColor: '#0f172a',
          border: '16px solid #1e293b',
          borderRadius: 68,
          padding: 40,
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 900, marginTop: 20 }}>{sc.gameTitle || 'Hoops Duel'}</div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, color: '#94a3b8' }}>YOU</div>
            <div style={{ fontSize: 92, fontWeight: 900, color: accentColor }}>{sc.scoreLeft || '9'}</div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#f97316' }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, color: '#94a3b8' }}>BOT</div>
            <div style={{ fontSize: 92, fontWeight: 900 }}>{sc.scoreRight || '2'}</div>
          </div>
        </div>
        <div style={{ fontSize: 120, transform: `translateY(${Math.sin(frame * 0.25) * 18}px)` }}>🏀</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#fb923c', marginBottom: 40 }}>ON FIRE 🔥</div>
      </div>

      {/* Time Pill */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          right: 70,
          background: '#0f172a',
          border: `4px solid ${accentColor}`,
          color: accentColor,
          padding: '12px 26px',
          borderRadius: 99,
          fontSize: 36,
          fontWeight: 900,
          fontFamily: 'Arial',
          zIndex: 40,
        }}
      >
        🌙 {sc.timeLabel || '1:07 AM'}
      </div>
    </AbsoluteFill>
  );
};

const IMessageScene: React.FC<{ sc: SceneConfig; hoodieColor: string }> = ({ sc, hoodieColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const msgs = [
    { text: sc.msg1 || "bet u can't beat me at hoops 😂", me: false, at: 5 },
    { text: sc.msg2 || '1v1. now.', me: true, at: 22 },
    { text: sc.msg3 || 'rematch?? 😰', me: false, at: 44 },
    { text: sc.msg4 || 'same time tomorrow 😏', me: true, at: 62 },
  ].filter((m) => m.text.trim());

  return (
    <AbsoluteFill style={{ background: '#0b0f19' }}>
      <div
        style={{
          position: 'absolute',
          top: 260,
          left: 95,
          right: 95,
          bottom: 140,
          backgroundColor: '#111827',
          border: '14px solid #1f2937',
          borderRadius: 64,
          padding: '44px 34px',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, color: '#fff', borderBottom: '2px solid #1f2937', paddingBottom: 20 }}>
          {sc.sender || 'Jake'} 🏀
        </div>
        {msgs.map((m, idx) => {
          if (frame < m.at) return null;
          const s = spring({ frame: frame - m.at, fps, config: { damping: 14 } });
          return (
            <div
              key={idx}
              style={{
                alignSelf: m.me ? 'flex-end' : 'flex-start',
                backgroundColor: m.me ? hoodieColor : '#27272a',
                color: m.me ? '#000' : '#fff',
                fontSize: 34,
                fontWeight: 700,
                padding: '20px 28px',
                borderRadius: 30,
                maxWidth: '82%',
                transform: `scale(${s})`,
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const WinConfettiScene: React.FC<{ sc: SceneConfig; hoodieColor: string; accentColor: string }> = ({
  sc,
  hoodieColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const colors = ['#f43f5e', '#facc15', '#34d399', '#38bdf8', '#a855f7'];
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1e1b4b, #090d16)' }}>
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 110,
          right: 110,
          height: 620,
          backgroundColor: '#111827',
          border: '10px solid #1f2937',
          borderRadius: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 900, color: accentColor }}>You won! 🏆</div>
        <div style={{ fontSize: 138, fontWeight: 900, margin: '10px 0' }}>{sc.bigScore || '4 - 0'}</div>
        <div style={{ fontSize: 32, color: '#94a3b8' }}>{sc.subText || '12/14 made • 9 swishes'}</div>
      </div>

      <Character hoodieColor={hoodieColor} mood="happy" y={300} scale={0.95} />

      {Array.from({ length: 36 }).map((_, i) => {
        const x = ((i * 73) % 1020) + 30;
        const y = ((frame * (10 + (i % 6) * 3) + i * 95) % 2100) - 100;
        const rot = frame * (i % 2 === 0 ? 8 : -8);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 24,
              height: 40,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${rot}deg)`,
              borderRadius: 4,
              zIndex: 60,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const MorningSleepScene: React.FC<{ hoodieColor: string }> = ({ hoodieColor }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #312e81 0%, #4c1d95 100%)' }}>
      {/* Sunrise Window */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          right: 110,
          width: 300,
          height: 360,
          background: 'linear-gradient(180deg, #fb7185, #fdba74)',
          border: '10px solid #475569',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', bottom: -30, left: 95, width: 110, height: 110, borderRadius: '50%', background: '#fef08a' }} />
      </div>
      {/* Couch */}
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          left: 70,
          right: 70,
          height: 360,
          backgroundColor: '#7c3aed',
          border: '10px solid #000',
          borderRadius: 42,
        }}
      />
      <div style={{ transform: 'rotate(90deg)', position: 'absolute', left: 160, top: 880 }}>
        <Character hoodieColor={hoodieColor} mood="sleep" holdingPhone scale={0.95} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 760 - (frame % 40),
          fontSize: 72,
          fontWeight: 900,
          color: '#94a3b8',
          fontFamily: 'Arial',
        }}
      >
        Z z z
      </div>
    </AbsoluteFill>
  );
};

const BrandCtaScene: React.FC<{ sc: SceneConfig; hoodieColor: string; accentColor: string }> = ({
  sc,
  hoodieColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame * 0.2) * 0.04;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, #1e293b 0%, #05070c 80%)` }}>
      <div
        style={{
          position: 'absolute',
          top: 320,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          transform: `scale(${pop})`,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 52,
            backgroundColor: hoodieColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 100,
            fontWeight: 900,
            color: '#000',
            boxShadow: `0 0 80px ${hoodieColor}55`,
          }}
        >
          {(sc.brandName || 'RIVL').slice(0, 2)}
        </div>
        <div style={{ fontSize: 128, fontWeight: 900, color: '#fff', marginTop: 26 }}>
          {sc.brandName || 'RIVL'}
        </div>
        <div style={{ fontSize: 54, fontWeight: 700, color: '#e2e8f0' }}>
          {sc.tagline || '1v1 skill games'}
        </div>
        <div style={{ fontSize: 64, marginTop: 24 }}>🏀 🎯 ⚽ 🎱</div>
        <div
          style={{
            marginTop: 34,
            backgroundColor: accentColor,
            color: '#000',
            fontSize: 48,
            fontWeight: 900,
            padding: '14px 44px',
            borderRadius: 18,
            transform: 'rotate(-3deg)',
          }}
        >
          {sc.pillText || 'FREE to play'}
        </div>
        <div
          style={{
            marginTop: 40,
            background: `linear-gradient(90deg, ${hoodieColor}, #34d399)`,
            color: '#000',
            fontSize: 52,
            fontWeight: 900,
            padding: '22px 68px',
            borderRadius: 99,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 40px ${hoodieColor}66`,
          }}
        >
          {sc.ctaText || 'link in bio ↗'}
        </div>
      </div>

      <Character hoodieColor={hoodieColor} mood="wave" x={-290} y={460} scale={0.78} logoText={sc.brandName || 'RIVL'} />
    </AbsoluteFill>
  );
};

const KineticTextScene: React.FC<{ sc: SceneConfig; accentColor: string }> = ({ sc, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(145deg, #1e1b4b, #05070e 70%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 82,
          fontWeight: 900,
          color: accentColor || '#fff',
          transform: `scale(${interpolate(s, [0, 1], [1.45, 1])})`,
          opacity: s,
        }}
      >
        {sc.subtitle || sc.spoken || 'BIG TEXT'}
      </div>
    </AbsoluteFill>
  );
};

const ChartScene: React.FC<{ sc: SceneConfig; accentColor: string }> = ({ sc, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = (sc.chartData || 'Jan:20, Feb:48, Mar:85, Apr:140')
    .split(',')
    .map((p) => {
      const [l, v] = p.split(':');
      return { label: (l || 'X').trim(), value: Math.max(1, parseFloat((v || '10').trim()) || 10) };
    })
    .slice(0, 6);
  const maxVal = Math.max(1, ...items.map((d) => d.value));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07131f',
        backgroundImage:
          'linear-gradient(rgba(34,211,238,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(34,211,238,0.08) 2px, transparent 2px)',
        backgroundSize: '64px 64px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 70,
          right: 70,
          height: 700,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          borderBottom: '6px solid #38bdf8',
          paddingBottom: 16,
          gap: 24,
        }}
      >
        {items.map((item, idx) => {
          const grow = spring({ frame: Math.max(0, frame - idx * 9), fps, config: { damping: 14 } });
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#34d399', fontSize: 36, fontWeight: 900, marginBottom: 10, fontFamily: 'Arial' }}>
                {Math.round(item.value * grow)}
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 130,
                  height: (item.value / maxVal) * 560 * grow,
                  background: `linear-gradient(180deg, ${accentColor || '#22d3ee'}, #0284c7)`,
                  borderRadius: '14px 14px 0 0',
                }}
              />
              <div style={{ position: 'absolute', bottom: -58, color: '#e2e8f0', fontSize: 32, fontWeight: 700, fontFamily: 'Arial' }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FlowMediaScene: React.FC<{ sc: SceneConfig }> = ({ sc }) => {
  const url = (sc.mediaUrl || '').trim();
  const isImage = /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #3b0764, #090d16)' }}>
      {url ? (
        isImage ? (
          <Img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <OffthreadVideo src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )
      ) : null}
    </AbsoluteFill>
  );
};

export const ModularVideo: React.FC<ModularProps> = ({
  topBadge,
  accentColor,
  hoodieColor,
  captionStyle,
  scenes,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16' }}>
      {scenes.map((sc, idx) => {
        const from = sc.startFrame || 0;
        const dur = sc.durationFrames || 90;
        return (
          <Sequence key={idx} from={from} durationInFrames={dur}>
            <AbsoluteFill>
              {sc.audioFile && <Audio src={staticFile(sc.audioFile)} />}
              {idx > 0 && <Audio src={staticFile('sfx_whoosh.wav')} volume={0.32} />}

              {sc.type === 'cafe_menu' && <CafeMenuScene sc={sc} hoodieColor={hoodieColor} />}
              {sc.type === 'gym_reject' && <GymScene hoodieColor={hoodieColor} />}
              {sc.type === 'couch_hook' && <CouchHookScene sc={sc} hoodieColor={hoodieColor} />}
              {sc.type === 'phone_game' && <PhoneGameScene sc={sc} hoodieColor={hoodieColor} accentColor={accentColor} />}
              {sc.type === 'imessage_chat' && <IMessageScene sc={sc} hoodieColor={hoodieColor} />}
              {sc.type === 'win_confetti' && <WinConfettiScene sc={sc} hoodieColor={hoodieColor} accentColor={accentColor} />}
              {sc.type === 'morning_sleep' && <MorningSleepScene hoodieColor={hoodieColor} />}
              {sc.type === 'brand_cta' && <BrandCtaScene sc={sc} hoodieColor={hoodieColor} accentColor={accentColor} />}
              {sc.type === 'kinetic_text' && <KineticTextScene sc={sc} accentColor={accentColor} />}
              {sc.type === 'bar_chart' && <ChartScene sc={sc} accentColor={accentColor} />}
              {sc.type === 'flow_media' && <FlowMediaScene sc={sc} />}

              {sc.type !== 'kinetic_text' && (
                <SceneCaptions
                  words={sc.words}
                  subtitle={sc.subtitle || sc.spoken}
                  styleType={captionStyle}
                  accentColor={accentColor}
                  bottom={sc.type === 'brand_cta' ? 140 : 350}
                />
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <TopBadge text={topBadge} bg={accentColor} />
    </AbsoluteFill>
  );
};
