import asyncio
import json
import math
import os
import struct
import wave
import edge_tts
from gtts import gTTS
from mutagen.mp3 import MP3

DEFAULT_SCENES = [
    {
        "type": "cafe_menu",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "Six dollars for a coffee? Nah, too expensive.",
        "subtitle": "6 dollars for a coffee? Nah, too expensive.",
        "item1": "latte|$5.50",
        "item2": "COFFEE|$6.00",
        "item3": "cookie|$4.00",
    },
    {
        "type": "gym_reject",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "One hour at the gym? No time.",
        "subtitle": "1 hour at the gym? No time.",
    },
    {
        "type": "couch_hook",
        "voice": "en-US-GuyNeural",
        "spoken": "Bet you can't beat me at hoops.",
        "subtitle": "bet you can't beat me at hoops",
        "sender": "Jake",
        "reply": "oh it's ON.",
    },
    {
        "type": "phone_game",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "Just one more game. It's free by the way.",
        "subtitle": "just one more game...",
        "gameTitle": "Hoops Duel",
        "scoreLeft": "9",
        "scoreRight": "2",
        "timeLabel": "1:07 AM",
        "tired": True,
    },
    {
        "type": "imessage_chat",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "One v one. Now.",
        "subtitle": "1v1. now.",
        "sender": "Jake",
        "msg1": "bet u can't beat me at hoops 😂",
        "msg2": "1v1. now.",
        "msg3": "rematch?? 😰",
        "msg4": "same time tomorrow 😏",
    },
    {
        "type": "win_confetti",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "Four nothing, obviously.",
        "subtitle": "4-0. obviously.",
        "bigScore": "4 - 0",
        "subText": "12/14 made • 9 swishes",
    },
    {
        "type": "morning_sleep",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "Slept zero hours. Worth it.",
        "subtitle": "slept 0 hours. worth it.",
    },
    {
        "type": "brand_cta",
        "voice": "en-US-AndrewMultilingualNeural",
        "spoken": "Rival one v one skill games. Free to play. Link in bio.",
        "subtitle": "think you'd beat me? 👀",
        "brandName": "RIVL",
        "tagline": "1v1 skill games",
        "pillText": "FREE to play",
        "ctaText": "link in bio ↗",
    },
]


def make_sfx():
    sr = 44100
    # Crisp pop sound
    with wave.open("public/sfx_pop.wav", "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        frames = bytearray()
        for i in range(int(sr * 0.12)):
            t = i / sr
            freq = 320 + 680 * math.exp(-t * 28)
            env = math.exp(-t * 32)
            val = int(18000 * env * math.sin(2 * math.pi * freq * t))
            frames += struct.pack("<h", max(-32767, min(32767, val)))
        wf.writeframes(frames)

    # Smooth transition whoosh
    with wave.open("public/sfx_whoosh.wav", "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        frames = bytearray()
        for i in range(int(sr * 0.22)):
            t = i / sr
            env = math.sin(math.pi * (t / 0.22))
            freq = 140 + 220 * (t / 0.22)
            val = int(9500 * env * math.sin(2 * math.pi * freq * t))
            frames += struct.pack("<h", max(-32767, min(32767, val)))
        wf.writeframes(frames)


def fallback_words(text: str, duration: float):
    tokens = text.split()
    if not tokens:
        return []
    step = max(0.12, (duration - 0.2) / len(tokens))
    return [
        {"text": w, "start": round(0.1 + i * step, 3), "end": round(0.1 + (i + 1) * step, 3)}
        for i, w in enumerate(tokens)
    ]


async def synth_edge(text: str, voice: str, rate: str, out_mp3: str):
    comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 10_000_000.0
                dur = chunk["duration"] / 10_000_000.0
                words.append(
                    {
                        "text": chunk["text"],
                        "start": round(start, 3),
                        "end": round(start + max(0.08, dur), 3),
                    }
                )
    return words


def main():
    os.makedirs("public", exist_ok=True)
    make_sfx()

    with open("input-props.json", "r", encoding="utf-8") as f:
        props = json.load(f)

    raw_cfg = (props.get("configJson") or "").strip()
    if raw_cfg:
        try:
            props.update(json.loads(raw_cfg))
        except Exception as e:
            print("Warning parsing configJson:", e)

    scenes = props.get("scenes")
    if not isinstance(scenes, list) or len(scenes) == 0:
        scenes = DEFAULT_SCENES

    rate = props.get("voiceRate") or "+10%"
    total_frames = 0
    processed = []

    for idx, sc in enumerate(scenes):
        sc = dict(sc)
        spoken = (sc.get("spoken") or sc.get("subtitle") or "").strip()
        voice = sc.get("voice") or "en-US-AndrewMultilingualNeural"
        mp3_name = f"scene_{idx}.mp3"
        mp3_path = os.path.join("public", mp3_name)
        words = []
        audio_file = ""
        dur_sec = float(sc.get("minSeconds") or 2.8)

        if voice != "none" and spoken:
            try:
                words = asyncio.run(synth_edge(spoken, voice, rate, mp3_path))
            except Exception as e:
                print(f"Scene {idx} edge-tts fallback:", e)
                if os.path.exists(mp3_path):
                    os.remove(mp3_path)

            if not os.path.exists(mp3_path) or os.path.getsize(mp3_path) == 0:
                try:
                    gTTS(text=spoken, lang="en").save(mp3_path)
                    words = []
                except Exception as e:
                    print(f"Scene {idx} gTTS failed:", e)

            if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 0:
                audio_file = mp3_name
                audio_len = MP3(mp3_path).info.length
                dur_sec = max(dur_sec, round(audio_len + 0.45, 2))
                if not words:
                    words = fallback_words(spoken, audio_len)
        else:
            words = fallback_words(spoken, dur_sec - 0.3)

        dur_frames = max(60, int(round(dur_sec * 30)))
        sc["audioFile"] = audio_file
        sc["words"] = words
        sc["durationFrames"] = dur_frames
        sc["startFrame"] = total_frames
        total_frames += dur_frames
        processed.append(sc)

    props["scenes"] = processed
    props["totalFrames"] = total_frames
    props.setdefault("topBadge", "GUYS MATH:")
    props.setdefault("accentColor", "#facc15")
    props.setdefault("hoodieColor", "#a3e635")
    props.setdefault("captionStyle", "classic")

    with open("input-props.json", "w", encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False)

    print(f"Prepared {len(processed)} scenes, totalFrames={total_frames} ({total_frames/30:.1f}s)")


if __name__ == "__main__":
    main()
