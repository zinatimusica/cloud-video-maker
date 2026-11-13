import asyncio
import json
import os
import edge_tts
from gtts import gTTS
from mutagen.mp3 import MP3


def fallback_word_timings(text: str, duration: float):
    tokens = text.split()
    if not tokens:
        return []
    step = max(0.12, (duration - 0.3) / len(tokens))
    return [
        {
            "text": w,
            "start": round(0.15 + i * step, 3),
            "end": round(0.15 + (i + 1) * step, 3),
        }
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
    with open("input-props.json", "r", encoding="utf-8") as f:
        props = json.load(f)

    # Merge configJson from the Web App if provided
    raw_cfg = (props.get("configJson") or "").strip()
    if raw_cfg:
        try:
            cfg = json.loads(raw_cfg)
            props.update(cfg)
        except Exception as e:
            print("Warning: could not parse configJson:", e)

    template = props.get("template") or "GuysMathSkit"
    voice = props.get("voice") or "en-US-GuyNeural"
    rate = props.get("voiceRate") or "+8%"

    spoken = (props.get("voiceoverScript") or "").strip()
    if not spoken:
        parts = [props.get("line1", ""), props.get("line2", ""), props.get("line3", "")]
        spoken = " ".join([p.strip() for p in parts if p and p.strip()])

    mp3_path = "public/voiceover.mp3"
    words = []
    has_audio = False
    default_sec = 15.0 if template == "GuysMathSkit" else 12.0
    duration_sec = default_sec

    if voice != "none" and spoken:
        try:
            words = asyncio.run(synth_edge(spoken, voice, rate, mp3_path))
        except Exception as e:
            print("edge-tts failed, using gTTS fallback:", e)
            if os.path.exists(mp3_path):
                os.remove(mp3_path)

        if not os.path.exists(mp3_path) or os.path.getsize(mp3_path) == 0:
            try:
                gTTS(text=spoken, lang="en").save(mp3_path)
                words = []
            except Exception as e:
                print("gTTS fallback failed:", e)

        if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 0:
            has_audio = True
            audio_len = MP3(mp3_path).info.length
            duration_sec = max(default_sec if template == "GuysMathSkit" else 5.0, round(audio_len + 1.2, 2))
            if not words:
                words = fallback_word_timings(spoken, audio_len)
    else:
        words = fallback_word_timings(spoken, default_sec - 1.0)

    props["hasAudio"] = has_audio
    props["durationSec"] = duration_sec
    props["words"] = words

    with open("input-props.json", "w", encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False)

    print(f"Done TTS: template={template}, hasAudio={has_audio}, duration={duration_sec}s, words={len(words)}")


if __name__ == "__main__":
    main()
