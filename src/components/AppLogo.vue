<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), {
  size: 'md',
})
</script>

<template>
  <div class="flex items-center justify-center gap-3" :class="{
    'scale-90': size === 'sm',
    'scale-100': size === 'md',
    'scale-110': size === 'lg',
  }">
    <div class="relative">
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary blur-md opacity-40 animate-glow"></div>
      <div
        class="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/40 ring-1 ring-white/40"
      >
        <img src="/images/bn_logo.png" alt="BabyNounu" class="h-7 w-7 object-contain drop-shadow-sm" />
      </div>
    </div>
    <span class="font-anton text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">BabyNounu</span>
  </div>
</template>
