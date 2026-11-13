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

export type WordTiming = {
  text: string;
  start: number;
  end: number;
};

export type VideoProps = {
  template?: string;
  topBadge: string;
  line1: string;
  line2: string;
  line3: string;
  stampWord: string;
  accentColor: string;
  captionStyle?: string;
  chartData?: string;
  mediaUrl?: string;
  hasAudio?: boolean;
  durationSec?: number;
  words?: WordTiming[];
};

const VoiceTrack: React.FC<{ hasAudio?: boolean }> = ({ hasAudio }) => {
  if (!hasAudio) return null;
  return <Audio src={staticFile('voiceover.mp3')} />;
};

const TopBadge: React.FC<{ text: string; bg: string }> = ({ text, bg }) => {
  if (!text.trim()) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 140,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          backgroundColor: bg || '#facc15',
          color: '#000000',
          fontSize: 54,
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

// Word-by-word Hormozi-style pop captions synced to voiceover timestamps
const SmartCaptions: React.FC<{
  words?: WordTiming[];
  fallbackLines: [string, string, string];
  styleType?: string;
  accentColor: string;
  bottom?: number;
}> = ({ words = [], fallbackLines, styleType = 'pop', accentColor, bottom = 240 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (styleType === 'none') return null;

  const currentSec = frame / fps;

  if (words.length > 0 && styleType === 'pop') {
    const chunkSize = 3;
    const chunks: WordTiming[][] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize));
    }

    const activeChunk =
      chunks.find(
        (c) => currentSec >= c[0].start - 0.05 && currentSec <= c[c.length - 1].end + 0.35
      ) || null;

    if (!activeChunk) return null;

    return (
      <div
        style={{
          position: 'absolute',
          bottom,
          left: 50,
          right: 50,
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          zIndex: 55,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {activeChunk.map((w, idx) => {
          const active = currentSec >= w.start && currentSec <= w.end + 0.12;
          return (
            <span
              key={idx}
              style={{
                fontSize: active ? 68 : 60,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: active ? accentColor || '#facc15' : '#ffffff',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                textShadow:
                  '-5px -5px 0 #000, 5px -5px 0 #000, -5px 5px 0 #000, 5px 5px 0 #000, 0 8px 20px rgba(0,0,0,0.9)',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    );
  }

  // Classic 3-part subtitle fallback
  const third = durationInFrames / 3;
  const text =
    frame < third
      ? fallbackLines[0]
      : frame < third * 2
      ? fallbackLines[1]
      : fallbackLines[2];
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
        fontSize: 52,
        fontWeight: 900,
        color: '#ffffff',
        textShadow:
          '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 18px rgba(0,0,0,0.85)',
        lineHeight: 1.2,
        zIndex: 55,
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
  count = 28,
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
        fontSize: 112,
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

// 1. GUYS MATH COMEDY SKIT
export const GuysMathSkit: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s1 = Math.floor(durationInFrames * 0.28);
  const s2 = Math.floor(durationInFrames * 0.6);
  const zoomStart = s2 + Math.floor((durationInFrames - s2) * 0.35);
  const zoomOut = interpolate(frame, [zoomStart, durationInFrames - 10], [1.65, 0.58], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16' }}>
      <VoiceTrack hasAudio={props.hasAudio} />
      <Sequence from={0} durationInFrames={s1}>
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
        </AbsoluteFill>
      </Sequence>
      <Sequence from={s1} durationInFrames={s2 - s1}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #475569 0%, #0f172a 100%)' }}>
          <CartoonGuy mood="grin" x={180} y={-80} scale={0.95} />
          <svg viewBox="0 0 900 380" style={{ position: 'absolute', bottom: 420, left: 60, width: 960 }}>
            <path d="M80 240 Q220 110 470 115 Q680 120 820 215 L845 270 L55 270 Z" fill="#52525b" stroke="#000" strokeWidth="10" />
            <path d="M230 140 L440 135 L580 195 L200 195 Z" fill="#0f172a" />
            <circle cx="215" cy="275" r="58" fill="#18181b" stroke="#cbd5e1" strokeWidth="10" />
            <circle cx="695" cy="275" r="58" fill="#18181b" stroke="#cbd5e1" strokeWidth="10" />
          </svg>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={s2} durationInFrames={durationInFrames - s2}>
        <AbsoluteFill style={{ backgroundColor: '#14532d', overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${frame >= zoomStart ? zoomOut : 1})`,
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
          <StampSlam word={props.stampWord} localFrame={frame - (s2 + 5)} />
          <DollarBurst startFrame={s2 + 10} count={32} />
        </AbsoluteFill>
      </Sequence>
      <TopBadge text={props.topBadge} bg={props.accentColor} />
      <SmartCaptions
        words={props.words}
        fallbackLines={[props.line1, props.line2, props.line3]}
        styleType={props.captionStyle}
        accentColor={props.accentColor}
      />
    </AbsoluteFill>
  );
};

// 2. VIRAL STORYTIME / MOTIVATIONAL REEL WITH POP CAPTIONS
export const StoryCaptions: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = Math.sin(frame * 0.04) * 60;
  const progress = (frame / durationInFrames) * 100;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 35%, #311042 0%, #090d16 75%)',
        overflow: 'hidden',
      }}
    >
      <VoiceTrack hasAudio={props.hasAudio} />
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: props.accentColor || '#facc15',
          opacity: 0.16,
          filter: 'blur(90px)',
          left: 190 + drift,
          top: 480 - drift,
        }}
      />
      <TopBadge text={props.topBadge} bg={props.accentColor} />
      <SmartCaptions
        words={props.words}
        fallbackLines={[props.line1, props.line2, props.line3]}
        styleType={props.captionStyle === 'none' ? 'pop' : props.captionStyle}
        accentColor={props.accentColor}
        bottom={780}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 16,
          width: `${progress}%`,
          backgroundColor: props.accentColor || '#facc15',
        }}
      />
    </AbsoluteFill>
  );
};

// 3. KINETIC TYPOGRAPHY REEL
export const KineticPromo: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seg = Math.floor(durationInFrames / 4);
  const progress = (frame / durationInFrames) * 100;

  const SlideWord: React.FC<{ text: string; color: string }> = ({ text, color }) => {
    const f = useCurrentFrame();
    const s = spring({ frame: f, fps, config: { damping: 14 } });
    const scale = interpolate(s, [0, 1], [1.5, 1]);
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 78,
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
      <VoiceTrack hasAudio={props.hasAudio} />
      <TopBadge text={props.topBadge} bg={props.accentColor} />
      <Sequence from={0} durationInFrames={seg}>
        <SlideWord text={props.line1} color="#ffffff" />
      </Sequence>
      <Sequence from={seg} durationInFrames={seg}>
        <SlideWord text={props.line2} color={props.accentColor || '#22d3ee'} />
      </Sequence>
      <Sequence from={seg * 2} durationInFrames={seg}>
        <SlideWord text={props.line3} color="#34d399" />
      </Sequence>
      <Sequence from={seg * 3} durationInFrames={durationInFrames - seg * 3}>
        <SlideWord text={props.stampWord || 'LINK IN BIO'} color="#ffffff" />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 16,
          width: `${progress}%`,
          backgroundColor: props.accentColor || '#22d3ee',
        }}
      />
    </AbsoluteFill>
  );
};

// 4. MANIM-STYLE ANIMATED DATA CHART EXPLAINER
export const ChartExplainer: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = (props.chartData || 'Jan:20, Feb:45, Mar:82, Apr:140')
    .split(',')
    .map((pair) => {
      const [label, val] = pair.split(':');
      return {
        label: (label || 'Item').trim(),
        value: Math.max(1, parseFloat((val || '10').trim()) || 10),
      };
    })
    .slice(0, 6);

  const maxVal = Math.max(1, ...items.map((d) => d.value));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07131f',
        backgroundImage:
          'linear-gradient(rgba(34, 211, 238, 0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(34, 211, 238, 0.08) 2px, transparent 2px)',
        backgroundSize: '64px 64px',
      }}
    >
      <VoiceTrack hasAudio={props.hasAudio} />
      <TopBadge text={props.topBadge} bg={props.accentColor} />

      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 70,
          right: 70,
          height: 760,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          borderBottom: '6px solid #38bdf8',
          paddingBottom: 20,
          gap: 24,
        }}
      >
        {items.map((item, idx) => {
          const grow = spring({ frame: Math.max(0, frame - idx * 10), fps, config: { damping: 14 } });
          const targetH = (item.value / maxVal) * 620;
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  color: '#34d399',
                  fontSize: 38,
                  fontWeight: 900,
                  marginBottom: 14,
                  fontFamily: 'Arial, sans-serif',
                  opacity: grow,
                }}
              >
                {Math.round(item.value * grow)}
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 140,
                  height: targetH * grow,
                  background: `linear-gradient(180deg, ${props.accentColor || '#22d3ee'}, #0284c7)`,
                  borderRadius: '14px 14px 0 0',
                  boxShadow: '0 0 28px rgba(34,211,238,0.35)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -64,
                  color: '#e2e8f0',
                  fontSize: 34,
                  fontWeight: 700,
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <SmartCaptions
        words={props.words}
        fallbackLines={[props.line1, props.line2, props.line3]}
        styleType={props.captionStyle}
        accentColor={props.accentColor}
        bottom={220}
      />
    </AbsoluteFill>
  );
};

// 5. GOOGLE FLOW VIDEO/IMAGE + VOICEOVER + CAPTIONS OVERLAY
export const FlowOverlay: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cleanUrl = (props.mediaUrl || '').trim();
  const isImage = /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(cleanUrl);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #3b0764, #090d16)' }}>
      <VoiceTrack hasAudio={props.hasAudio} />
      {cleanUrl ? (
        isImage ? (
          <Img src={cleanUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <OffthreadVideo src={cleanUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )
      ) : null}
      <TopBadge text={props.topBadge} bg={props.accentColor} />
      <SmartCaptions
        words={props.words}
        fallbackLines={[props.line1, props.line2, props.line3]}
        styleType={props.captionStyle}
        accentColor={props.accentColor}
        bottom={260}
      />
      {frame >= durationInFrames - 60 && (
        <StampSlam word={props.stampWord} localFrame={frame - (durationInFrames - 60)} />
      )}
    </AbsoluteFill>
  );
};
