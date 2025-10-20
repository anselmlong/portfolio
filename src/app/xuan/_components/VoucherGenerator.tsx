"use client";
import React, { useRef } from "react";
import type { GiftSelections } from "./GiftSelector";

type Props = {
  selections: GiftSelections;
  onBack?: () => void;
};

export default function VoucherGenerator({ selections, onBack }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Map selection names to image URLs
  const getImageUrl = (category: string, selectionName: string | null): string | null => {
    if (!selectionName) return null;
    
    const records = [
      { name: "submarine", url: "/elements/the marias.png" },
      { name: "beerbongs and bentleys", url: "/elements/post malone.png" },
      { name: "born to die", url: "/elements/lana del rey.png" }
    ];
    const perfumes = [
      { name: "glass blooms", url: "/elements/glass blooms.png" },
      { name: "osmanthus", url: "/elements/osmanthus.png" },
      { name: "white rice", url: "/elements/white rice.png" }
    ];
    const pants = [
      { name: "BDG Barrel Jeans in White", url: "/elements/white jeans.png" },
      { name: "Yuan Wide-Leg Pants", url: "/elements/black pants.png" },
      { name: "Gen Heavy Washed Wide Cut Jeans", url: "/elements/navy jeans.png" }
    ];
    const f1 = [
      { name: "ferrari polo", url: "/elements/f1_ferrari.png" },
      { name: "mercedes polo", url: "/elements/f1_mercedes.png" },
      { name: "red bull polo", url: "/elements/f1_redbull.png" },
      { name: "williams polo", url: "/elements/f1_williams.png" },
      { name: "mercedes hoodie", url: "/elements/f1_mercedes_hoodie.png" },
      { name: "ferrari jacket", url: "/elements/f1_ferrari_jacket.png" }
    ];
    
    if (category === "vinyl") return "/elements/turntable.png";
    if (category === "record") return records.find(r => r.name === selectionName)?.url || null;
    if (category === "perfume") return perfumes.find(p => p.name === selectionName)?.url || null;
    if (category === "pants") return pants.find(p => p.name === selectionName)?.url || null;
    if (category === "f1") return f1.find(f => f.name === selectionName)?.url || null;
    return null;
  };

  // Generate a simple PNG "receipt" including selected items (excludes shopping voucher)
  const handleDownloadReceipt = async () => {
    // Compose values, preferring custom inputs
    const vinyl = selections.vinylPlayerCustom?.trim() || selections.vinylPlayer || null;
    const record = selections.recordCustom?.trim() || selections.record || null;
    const perfume = selections.perfumeCustom?.trim() || selections.perfume || null;
    const pants = selections.pantsCustom?.trim() || selections.pants || null;
    const f1 = selections.f1Custom?.trim() || selections.f1 || null;

    const items: Array<{ label: string; emoji: string; value: string; imageUrl: string | null; isCustom: boolean }> = [];
    if (vinyl) {
      items.push({ 
        label: "vinyl player", 
        emoji: "🎵", 
        value: vinyl,
        imageUrl: selections.vinylPlayerCustom?.trim() ? null : getImageUrl("vinyl", selections.vinylPlayer),
        isCustom: !!selections.vinylPlayerCustom?.trim()
      });
    }
    if (record) {
      items.push({ 
        label: "record", 
        emoji: "💿", 
        value: record,
        imageUrl: selections.recordCustom?.trim() ? null : getImageUrl("record", selections.record),
        isCustom: !!selections.recordCustom?.trim()
      });
    }
    if (perfume) {
      items.push({ 
        label: "perfume", 
        emoji: "🌸", 
        value: perfume,
        imageUrl: selections.perfumeCustom?.trim() ? null : getImageUrl("perfume", selections.perfume),
        isCustom: !!selections.perfumeCustom?.trim()
      });
    }
    if (pants) {
      items.push({ 
        label: "pants", 
        emoji: "👖", 
        value: pants,
        imageUrl: selections.pantsCustom?.trim() ? null : getImageUrl("pants", selections.pants),
        isCustom: !!selections.pantsCustom?.trim()
      });
    }
    if (f1) {
      items.push({ 
        label: "F1 merch", 
        emoji: "🏎️", 
        value: f1,
        imageUrl: selections.f1Custom?.trim() ? null : getImageUrl("f1", selections.f1),
        isCustom: !!selections.f1Custom?.trim()
      });
    }

    // Ensure we have at least a placeholder line
    const hasAny = items.length > 0;
    if (!hasAny) {
      items.push({ label: "(no selections yet)", emoji: "—", value: "", imageUrl: null, isCustom: false });
    }

    // Load all images
    const imagePromises = items.map(item => {
      if (!item.imageUrl) return Promise.resolve(null);
      return new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = item.imageUrl!;
      });
    });

    const loadedImages = await Promise.all(imagePromises);

    // Canvas sizing - increased to accommodate images
    const width = 900;
    const padding = 40;
    const lineGap = 12;
    const imgSize = 120; // thumbnail size for each product
    const itemSpacing = 20; // extra space between items
    const headerLines = 3; // title, date, divider
    // Estimate height: each item now needs space for image + text
    const estHeightPerItem = imgSize + itemSpacing;
    const lineHeight = 30;
    const estimatedHeight = padding * 2 + (headerLines * lineHeight) + (items.length * estHeightPerItem) + 100;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.max(400, estimatedHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helpers
    const maxTextWidth = width - padding * 2 - imgSize - 20; // leave space for image
    const setFont = (weight: "normal" | "bold", sizePx: number) => {
      ctx.font = `${weight} ${sizePx}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial`;
    };
    const wrapAndDraw = (text: string, x: number, y: number, lineH: number, maxW: number) => {
      const words = text.split(/\s+/);
      let line = "";
      let currY = y;
      for (let i = 0; i < words.length; i++) {
        const word = words[i] ?? "";
        const candidate = line ? line + " " + word : word;
        const widthMeasure = ctx.measureText(candidate).width;
        if (widthMeasure > maxW && line) {
          ctx.fillText(line, x, currY);
          line = word;
          currY += lineH;
        } else {
          line = candidate;
        }
      }
      if (line) ctx.fillText(line, x, currY);
      return currY;
    };

    // Background
  ctx.fillStyle = "#ffffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#ffffffff"; // slate-200
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    let y = padding;
    // Title
    ctx.fillStyle = "#0f172a"; // slate-900
    setFont("bold", 28);
    ctx.fillText("xuan's birthday: gift bundle! (coming soon!)", padding, y);
    y += lineHeight + lineGap;


    // Divider
    ctx.strokeStyle = "#cbd5e1"; // slate-300
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
    y += lineGap + 6;

    // Items - now with images
    for (let idx = 0; idx < items.length; idx++) {
      const it = items[idx]!;
      const img = loadedImages[idx];
      const itemStartY = y;

      // Draw image on the left if available
      if (img) {
        // Draw a subtle background for the image
        ctx.fillStyle = "#f8fafc"; // slate-50
        ctx.fillRect(padding, y, imgSize, imgSize);
        
        // Draw the image centered within the box
        const aspectRatio = img.width / img.height;
        let drawWidth = imgSize;
        let drawHeight = imgSize;
        if (aspectRatio > 1) {
          drawHeight = imgSize / aspectRatio;
        } else {
          drawWidth = imgSize * aspectRatio;
        }
        const imgX = padding + (imgSize - drawWidth) / 2;
        const imgY = y + (imgSize - drawHeight) / 2;
        ctx.drawImage(img, imgX, imgY, drawWidth, drawHeight);
        
        // Border around image
        ctx.strokeStyle = "#e2e8f0"; // slate-200
        ctx.lineWidth = 1;
        ctx.strokeRect(padding, y, imgSize, imgSize);
      }

      // Text content on the right
      const textX = padding + (img ? imgSize + 20 : 0);
      let textY = y + 24;

      // Label line
      setFont("bold", 18);
      ctx.fillStyle = "#1f2937"; // gray-800
      const labelLine = `${it.emoji}  ${it.label}`;
      ctx.fillText(labelLine, textX, textY);
      textY += lineHeight;

      // Value line(s)
      if (it.value) {
        setFont("normal", 16);
        ctx.fillStyle = "#0f172a"; // slate-900
        textY = wrapAndDraw(it.value, textX, textY, lineHeight - 4, maxTextWidth) + lineGap;
      }

      // Custom indicator if applicable
      if (it.isCustom) {
        setFont("normal", 14);
        ctx.fillStyle = "#64748b"; // slate-500
        ctx.fillText("(custom suggestion)", textX, textY);
        textY += lineHeight - 6;
      }

      // Move y to the bottom of this item block
      y = Math.max(itemStartY + imgSize, textY) + itemSpacing;

      // Item divider
      ctx.strokeStyle = "#e5e7eb"; // gray-200
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      y += lineGap;
    }

    // Trim canvas height to used content (optional)
    const usedHeight = Math.min(canvas.height, y + padding);
    if (usedHeight < canvas.height) {
      const trimmed = document.createElement("canvas");
      trimmed.width = canvas.width;
      trimmed.height = usedHeight;
      const tctx = trimmed.getContext("2d");
      if (tctx) tctx.drawImage(canvas, 0, 0);
      const url = trimmed.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "gift-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "gift-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 rounded-xl p-6 md:p-8 shadow-2xl border border-slate-800/30 font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="text-indigo-300 hover:text-stone-200 transition-colors text-sm mb-4"
          aria-label="Go back"
        >
          ← back
        </button>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow font-sans">
        your birthday gifts are ready! 🎉
      </h2>
  <div ref={ref} className="rounded-lg bg-white p-4 text-slate-900 font-sans">
  <ul className="list-disc pl-5 space-y-1">
          <li>
            🎵 {selections.vinylPlayerCustom && selections.vinylPlayerCustom.trim().length > 0
              ? selections.vinylPlayerCustom
              : selections.vinylPlayer ?? "(vinyl player)"}
          </li>
          <li>
            💿 {selections.recordCustom && selections.recordCustom.trim().length > 0
              ? selections.recordCustom
              : selections.record ?? "(record)"}
          </li>
          <li>
            🌸 {selections.perfumeCustom && selections.perfumeCustom.trim().length > 0
              ? selections.perfumeCustom
              : selections.perfume ?? "(perfume)"}
          </li>
          <li>
            👖 {selections.pantsCustom && selections.pantsCustom.trim().length > 0
              ? selections.pantsCustom
              : selections.pants ?? "(pants)"}
          </li>
          <li>
            🏎️ {selections.f1Custom && selections.f1Custom.trim().length > 0
              ? selections.f1Custom
              : selections.f1 ?? "(F1 merch)"}
          </li>
          <li>🎁 {selections.voucher}</li>
        </ul>
        {/* personal message removed */}
      </div>
      <div className="mt-4">
        <button
          onClick={handleDownloadReceipt}
          className="px-5 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-br from-stone-200 to-indigo-300 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200/40 font-sans"
          title="download a receipt of your selections (excludes shopping voucher)"
        >
          download receipt
        </button>
      </div>
    </section>
  );
}
