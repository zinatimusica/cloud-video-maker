import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type VideoProps = {
  template?: string;
  topBadge: string;
  line1: string;
  line2: string;
  line3: string;
  stampWord: string;
  accentColor: string;
  mediaUrl?: string;
};

const TopBadge: React.FC<{ text: string; bg: string }> = ({ text, bg }) => {
  if (!text.trim()) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: bg || '#facc15',
          color: '#000000',
          fontSize: 56,
          fontWeight: 900,
          padding: '12px 36px',
          borderRadius: 14,
          boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          maxWidth: '88%',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CaptionText: React.FC<{ text: string; bottom?: number }> = ({
  text,
  bottom = 260,
}) => {
  if (!text.trim()) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 64,
        right: 64,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: 54,
        fontWeight: 900,
        color: '#ffffff',
        textShadow:
          '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 20px rgba(0,0,0,0.85)',
        lineHeight: 1.2,
        zIndex: 40,
      }}
    >
      {text}
    </div>
  );
};

const CartoonGuy: React.FC<{
  mood: 'angry' | 'grin' | 'laugh';
  x?: number;
  y?: number;
  scale?: number;
}> = ({ mood, x = 0, y = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const bob = mood === 'laugh' ? Math.sin(frame * 0.8) * 7 : Math.sin(frame * 0.2) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + bob}px)) scale(${scale})`,
      }}
    >
      <svg width="320" height="400" viewBox="0 0 320 400">
        <path
          d="M75 230 Q160 205 245 230 L265 390 L55 390 Z"
          fill="#dc2626"
          stroke="#000"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <rect x="95" y="75" width="130" height="145" rx="42" fill="#f1c29b" stroke="#000" strokeWidth="8" />
        <path
          d="M92 125 Q90 60 160 55 Q230 60 228 125 Q210 95 160 95 Q110 95 92 125 Z"
          fill="#451a03"
          stroke="#000"
          strokeWidth="7"
        />
        {mood === 'angry' ? (
          <>
            <line x1="115" y1="125" x2="145" y2="138" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            <line x1="205" y1="125" x2="175" y2="138" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            <circle cx="132" cy="145" r="8" fill="#000" />
            <circle cx="188" cy="145" r="8" fill="#000" />
            <path d="M130 182 Q160 170 190 182 Q160 195 130 182 Z" fill="#fff" stroke="#000" strokeWidth="6" />
          </>
        ) : (
          <>
            <path d="M116 142 Q132 130 146 142" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <path d="M174 142 Q190 130 204 142" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
            <path d="M122 172 Q160 212 198 172 Z" fill="#fff" stroke="#000" strokeWidth="6" />
          </>
        )}
      </svg>
    </div>
  );
};

const DollarBurst: React.FC<{ startFrame: number; count?: number }> = ({
  startFrame,
  count = 26,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const t = frame - startFrame;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 35 }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = ((i * 137.5) % 360) * (Math.PI / 180);
        const speed = 13 + (i % 6) * 5;
        const x = 540 + Math.cos(angle) * speed * t;
        const y = 940 + Math.sin(angle) * speed * t + 0.35 * t * t;
        const rot = i * 42 + t * ((i % 2 === 0 ? 1 : -1) * 9);
        const opacity = interpolate(t, [0, 35, 65], [1, 1, 0], { extrapolateRight: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 108,
              height: 50,
              background: '#86efac',
              border: '4px solid #14532d',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 28,
              color: '#14532d',
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              opacity,
            }}
          >
            $
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const StampSlam: React.FC<{ word: string; localFrame: number }> = ({ word, localFrame }) => {
  const { fps } = useVideoConfig();
  if (!word.trim() || localFrame < 0) return null;
  const s = spring({ frame: localFrame, fps, config: { damping: 12 } });
  const scale = interpolate(s, [0, 1], [3.4, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 660,
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale}) rotate(-11deg)`,
        border: '14px solid #dc2626',
        color: '#dc2626',
        fontSize: 118,
        fontWeight: 900,
        padding: '10px 42px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        fontFamily: 'Arial, sans-serif',
        zIndex: 45,
      }}
    >
      {word}
    </div>
  );
};

// TEMPLATE 1: GUYS MATH COMEDY SKIT (15s = 450 frames)
export const GuysMathSkit: React.FC<VideoProps> = ({
  topBadge,
  line1,
  line2,
  line3,
  stampWord,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const zoomOut = interpolate(frame, [330, 440], [1.65, 0.58], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16' }}>
      {/* Scene 1: Clothing Rack (0 - 4s) */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)' }}>
          <CartoonGuy mood="angry" y={20} scale={1.2} />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: 540,
              background:
                'repeating-linear-gradient(90deg, #ef4444 0 42px, #3b82f6 42px 84px, #f59e0b 84px 126px, #10b981 126px 168px)',
              borderTop: '14px solid #cbd5e1',
            }}
          />
          <CaptionText text={line1} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Sports Car Showroom (4 - 9s) */}
      <Sequence from={120} durationInFrames={150}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #475569 0%, #0f172a 100%)' }}>
          <CartoonGuy mood="grin" x={180} y={-80} scale={0.95} />
          <svg viewBox="0 0 900 380" style={{ position: 'absolute', bottom: 420, left: 60, width: 960 }}>
            <path d="M80 240 Q220 110 470 115 Q680 120 820 215 L845 270 L55 270 Z" fill="#52525b" stroke="#000" strokeWidth="10" />
            <path d="M230 140 L440 135 L580 195 L200 195 Z" fill="#0f172a" />
            <circle cx="215" cy="275" r="58" fill="#18181b" stroke="#cbd5e1" strokeWidth="10" />
            <circle cx="695" cy="275" r="58" fill="#18181b" stroke="#cbd5e1" strokeWidth="10" />
          </svg>
          <CaptionText text={line2} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Sold House + Cash Explosion + Driveway Twist (9 - 15s) */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill style={{ backgroundColor: '#14532d', overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${frame >= 330 ? zoomOut : 1})`,
              transformOrigin: '50% 50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', width: 900, height: 2200, background: '#334155' }} />
            <div
              style={{
                position: 'absolute',
                top: 380,
                width: 320,
                height: 620,
                background: '#18181b',
                borderRadius: 70,
                border: '10px solid #000',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 1080,
                width: 340,
                height: 540,
                background: '#a16207',
                border: '8px solid #422006',
                padding: 24,
              }}
            >
              <div style={{ width: '100%', height: '100%', background: '#7e22ce', borderRadius: 12 }} />
            </div>
            <CartoonGuy mood="laugh" y={360} scale={0.95} />
          </div>
          <StampSlam word={stampWord} localFrame={frame - 275} />
          <DollarBurst startFrame={280} count={32} />
          <CaptionText text={line3} />
        </AbsoluteFill>
      </Sequence>

      <TopBadge text={topBadge} bg={accentColor} />
    </AbsoluteFill>
  );
};

// TEMPLATE 2: KINETIC TYPOGRAPHY REEL (12s = 360 frames)
export const KineticPromo: React.FC<VideoProps> = ({
  topBadge,
  line1,
  line2,
  line3,
  stampWord,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  const SlideWord: React.FC<{ text: string; color: string }> = ({ text, color }) => {
    const f = useCurrentFrame();
    const s = spring({ frame: f, fps, config: { damping: 14 } });
    const scale = interpolate(s, [0, 1], [1.6, 1]);
    return (
      <AbsoluteFill
        style={{
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
            color,
            transform: `scale(${scale})`,
            opacity: s,
            lineHeight: 1.15,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(145deg, #1e1b4b, #05070e 70%)' }}>
      <TopBadge text={topBadge} bg={accentColor} />
      <Sequence from={0} durationInFrames={95}>
        <SlideWord text={line1} color="#ffffff" />
      </Sequence>
      <Sequence from={95} durationInFrames={95}>
        <SlideWord text={line2} color={accentColor || '#22d3ee'} />
      </Sequence>
      <Sequence from={190} durationInFrames={95}>
        <SlideWord text={line3} color="#34d399" />
      </Sequence>
      <Sequence from={285} durationInFrames={75}>
        <SlideWord text={stampWord} color="#ffffff" />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 18,
          width: `${progress}%`,
          backgroundColor: accentColor || '#22d3ee',
        }}
      />
    </AbsoluteFill>
  );
};

// TEMPLATE 3: GOOGLE FLOW CLIP + CAPTIONS OVERLAY (10s = 300 frames)
export const FlowOverlay: React.FC<VideoProps> = ({
  topBadge,
  line1,
  line2,
  line3,
  stampWord,
  accentColor,
  mediaUrl = '',
}) => {
  const frame = useCurrentFrame();
  const cleanUrl = mediaUrl.trim();
  const isImage = /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(cleanUrl);

  const activeCaption =
    frame < 100 ? line1 : frame < 200 ? line2 : line3;

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #3b0764, #090d16)' }}>
      {cleanUrl ? (
        isImage ? (
          <Img
            src={cleanUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <OffthreadVideo
            src={cleanUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )
      ) : null}

      <TopBadge text={topBadge} bg={accentColor} />
      <CaptionText text={activeCaption} bottom={280} />
      {frame >= 225 && <StampSlam word={stampWord} localFrame={frame - 225} />}
    </AbsoluteFill>
  );
};
