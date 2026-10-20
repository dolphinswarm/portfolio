#!/usr/bin/env bash
# Re-encode site videos to web-friendly H.264 MP4s.
#
# Writes to .encoded-videos/ (git-ignored) with the same folder layout as
# public/branding/videos, so originals are untouched until you review the
# results and copy them over:
#
#   bash scripts/encode-videos.sh            # encode everything
#   bash scripts/encode-videos.sh fort-knox  # only files whose path matches
#   CRF=24 bash scripts/encode-videos.sh     # higher quality, larger files
#   cp -r .encoded-videos/. public/branding/videos/
#
# Requires ffmpeg (winget install Gyan.FFmpeg).

set -euo pipefail

SRC_DIR="public/branding/videos"
OUT_DIR=".encoded-videos"
FILTER="${1:-}"

# 720p max on the short side (so portrait clips stay 720 wide), keeping aspect ratio. CRF 26 is a good size/quality tradeoff for
# clips shown on an in-scene screen; lower it for sharper output.
MAX_HEIGHT="${MAX_HEIGHT:-720}"
CRF="${CRF:-26}"
FPS="${FPS:-30}"
AUDIO_BITRATE="${AUDIO_BITRATE:-96k}"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found on PATH" >&2; exit 1; }
cd "$(dirname "$0")/.."

total_before=0
total_after=0

while IFS= read -r -d '' src; do
    rel="${src#"$SRC_DIR"/}"
    [[ -n "$FILTER" && "$rel" != *"$FILTER"* ]] && continue

    out="$OUT_DIR/$rel"
    mkdir -p "$(dirname "$out")"
    echo "==> $rel"

    # -nostdin: otherwise ffmpeg reads the loop's file list from stdin, which
    # hangs on Windows and skips files elsewhere.
    ffmpeg -nostdin -hide_banner -loglevel warning -stats -y -i "$src" \
        -vf "scale='if(gt(iw,ih),-2,min($MAX_HEIGHT,iw))':'if(gt(iw,ih),min($MAX_HEIGHT,ih),-2)',fps=$FPS" \
        -c:v libx264 -preset slow -crf "$CRF" -profile:v high -pix_fmt yuv420p \
        -c:a aac -b:a "$AUDIO_BITRATE" -ac 2 \
        -movflags +faststart \
        "$out"

    before=$(stat -c %s "$src")
    after=$(stat -c %s "$out")
    total_before=$((total_before + before))
    total_after=$((total_after + after))
    printf '    %d MB -> %d MB\n' $((before / 1048576)) $((after / 1048576))
done < <(find "$SRC_DIR" -type f -name '*.mp4' -print0 | sort -z)

printf '\nTotal: %d MB -> %d MB\n' $((total_before / 1048576)) $((total_after / 1048576))
