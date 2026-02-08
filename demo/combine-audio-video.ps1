# Combine demo video with 6 audio tracks at specific timing
# Based on narration script timing for each act

$videoInput = "demo-video.webm"
$output = "demo-final.mp4"

# Audio files and their start times (in milliseconds)
# Act 1: 0:00-0:08 (0ms)
# Act 2: 0:08-0:23 (8000ms) 
# Act 3: 0:23-0:33 (23000ms)
# Act 4: 0:33-0:39 (33000ms)
# Act 5: 0:39-0:57 (39000ms)
# Act 6: 0:57-1:05 (57000ms)

$delays = @(
    0,      # Act 1: Dashboard (starts at 0:00)
    8000,   # Act 2: Today - Log Now (starts at 0:08)
    23000,  # Act 3: Habit Detail (starts at 0:23)
    33000,  # Act 4: Aspirations (starts at 0:33)
    39000,  # Act 5: Projects (starts at 0:39)
    57000   # Act 6: Moments (starts at 0:57)
)

# Build ffmpeg command
$filterComplex = ""
$mixInputs = ""

for ($i = 1; $i -le 6; $i++) {
    $delay = $delays[$i - 1]
    if ($delay -eq 0) {
        $filterComplex += "[$i`:a]anull[a$i]; "
    } else {
        $filterComplex += "[$i`:a]adelay=$delay|$delay[a$i]; "
    }
    $mixInputs += "[a$i]"
}

$filterComplex += "$mixInputs`amix=inputs=6:normalize=0[outa]"

Write-Host "Creating final demo video..." -ForegroundColor Cyan
Write-Host "Video: $videoInput" -ForegroundColor Yellow
Write-Host "Audio tracks:" -ForegroundColor Yellow
for ($i = 1; $i -le 6; $i++) {
    $delay = $delays[$i - 1]
    $seconds = $delay / 1000.0
    Write-Host "  - tts-audio-$i.mp3 (delay: $seconds`s)" -ForegroundColor Gray
}

# Run ffmpeg
$ffmpegArgs = @(
    "-i", $videoInput,
    "-i", "tts-audio-1.mp3",
    "-i", "tts-audio-2.mp3",
    "-i", "tts-audio-3.mp3",
    "-i", "tts-audio-4.mp3",
    "-i", "tts-audio-5.mp3",
    "-i", "tts-audio-6.mp3",
    "-filter_complex", $filterComplex,
    "-map", "0:v",
    "-map", "[outa]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-y",  # Overwrite output
    $output
)

& ffmpeg @ffmpegArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Final video created: $output" -ForegroundColor Green
    $file = Get-Item $output
    Write-Host "Size: $([math]::Round($file.Length / 1MB, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "`nError: ffmpeg failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
