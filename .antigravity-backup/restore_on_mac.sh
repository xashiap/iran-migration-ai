#!/usr/bin/env bash

# ==============================================================
# اسکریپت بازیابی خودکار تمام گفتگوها و حافظه آنتی‌گرویتی در مک
# ==============================================================

set -e

echo ""
echo "=========================================================="
echo "🚀 شروع بازیابی گفتگوهای Antigravity در macOS..."
echo "=========================================================="

TARGET_DIR="$HOME/.gemini/antigravity"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📂 پوشه هدف در مک: $TARGET_DIR"

# ۱. ساخت پوشه‌های لازم در مک
mkdir -p "$TARGET_DIR/conversations"
mkdir -p "$TARGET_DIR/brain"

# ۲. بازیابی دیتابیس خلاصه عناوین گفتگوها
if [ -f "$SCRIPT_DIR/conversation_summaries.db.zip" ]; then
    echo "📥 در حال بازیابی دیتابیس عناوین (conversation_summaries.db)..."
    unzip -o -q "$SCRIPT_DIR/conversation_summaries.db.zip" -d "$TARGET_DIR"
elif [ -f "$SCRIPT_DIR/conversation_summaries.db" ]; then
    cp -f "$SCRIPT_DIR/conversation_summaries.db" "$TARGET_DIR/conversation_summaries.db"
fi

# ۳. استخراج فایل‌های پایگاه داده تک‌تک گفتگوها
echo "📥 در حال بازیابی دیتابیس تمام گفتگوها..."
for zip_file in "$SCRIPT_DIR/conversations/"*.zip; do
    if [ -f "$zip_file" ]; then
        filename=$(basename "$zip_file")
        echo "   -> استخراج $filename..."
        unzip -o -q "$zip_file" -d "$TARGET_DIR/conversations"
    fi
done

# ۴. بازیابی تک‌تک پوشه‌های brain (رونوشت‌ها و حافظه)
echo "📥 در حال بازیابی داده‌های حافظه و رونوشت‌های جلسات (brain)..."
for b_zip in "$SCRIPT_DIR/brain/"*.zip; do
    if [ -f "$b_zip" ]; then
        folder_name=$(basename "$b_zip" .zip)
        echo "   -> استخراج brain/$folder_name..."
        mkdir -p "$TARGET_DIR/brain/$folder_name"
        unzip -o -q "$b_zip" -d "$TARGET_DIR/brain/$folder_name"
    fi
done

echo ""
echo "=========================================================="
echo "✅ بازیابی با موفقیت ۱۰۰٪ انجام شد!"
echo "💡 اکنون کافیست برنامه Antigravity را باز کنید (یا ری‌استارت نمایید)."
echo "   تمام گفتگوها در سایدبار سمت چپ نمایان خواهند شد."
echo "=========================================================="
echo ""
