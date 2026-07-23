<script setup lang="ts">
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#FFF7F1] via-white to-[#F0FBFA]"></div>

    <!-- Aurora blobs -->
    <div
      class="absolute -top-[15%] -left-[10%] h-[55vh] w-[55vh] rounded-full blur-[90px] animate-aurora"
      style="background: conic-gradient(from 90deg, rgba(247,124,61,0.32), rgba(249,155,109,0.14), rgba(247,124,61,0.28)); opacity: 0.75;"
    ></div>
    <div
      class="absolute -bottom-[18%] -right-[12%] h-[60vh] w-[60vh] rounded-full blur-[100px] animate-aurora-reverse"
      style="background: conic-gradient(from 210deg, rgba(85,196,189,0.32), rgba(125,217,211,0.12), rgba(85,196,189,0.26)); opacity: 0.7;"
    ></div>
    <div
      class="absolute top-[38%] left-[55%] h-[32vh] w-[32vh] rounded-full blur-[80px] animate-aurora"
      style="background: radial-gradient(circle, rgba(101,116,205,0.22), transparent 70%); animation-delay: -6s;"
    ></div>
    <div
      class="absolute top-[55%] -left-[5%] h-[28vh] w-[28vh] rounded-full blur-[70px] animate-aurora-reverse"
      style="background: radial-gradient(circle, rgba(247,124,61,0.16), transparent 70%); animation-delay: -9s;"
    ></div>

    <!-- Sparkle dots -->
    <div class="absolute top-[18%] right-[20%] h-2 w-2 rounded-full bg-primary/50 animate-float" style="animation-delay: 0.5s"></div>
    <div class="absolute top-[64%] left-[10%] h-1.5 w-1.5 rounded-full bg-secondary/60 animate-float" style="animation-delay: 1.5s"></div>
    <div class="absolute bottom-[20%] right-[28%] h-2 w-2 rounded-full bg-indigos/40 animate-float" style="animation-delay: 2.5s"></div>
    <div class="absolute top-[28%] left-[22%] h-1 w-1 rounded-full bg-primary/60 animate-float" style="animation-delay: 0.8s"></div>
    <div class="absolute top-[12%] left-[55%] h-1.5 w-1.5 rounded-full bg-secondary/50 animate-float" style="animation-delay: 3.2s"></div>

    <!-- Fine grid pattern -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="background-image: linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%);"
    ></div>

    <!-- Grain texture -->
    <div class="absolute inset-0 bg-noise opacity-[0.10] mix-blend-overlay"></div>

    <!-- Vignette for focus -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(255,255,255,0.55) 100%);"
    ></div>

    <!-- Top glow line -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
  </div>
</template>
