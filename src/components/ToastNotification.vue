<script setup lang="ts">
defineProps<{
  type: 'success' | 'error'
  title: string
  message?: string
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 -translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-3"
    appear
  >
    <div
      class="fixed top-5 inset-x-4 mx-auto max-w-sm z-50"
      role="alert"
    >
      <div
        class="relative flex items-start gap-4 p-5 rounded-2xl shadow-2xl backdrop-blur-xl border overflow-hidden"
        :class="{
          'bg-white/90 border-success/25 shadow-success/10': type === 'success',
          'bg-white/90 border-danger/25 shadow-danger/10': type === 'error',
        }"
      >
        <div
          class="absolute top-0 left-0 right-0 h-0.5"
          :class="type === 'success' ? 'bg-gradient-to-r from-success to-emerald-400' : 'bg-gradient-to-r from-danger to-red-400'"
        ></div>
        <div
          class="flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ring-1"
          :class="{
            'bg-success/10 ring-success/20': type === 'success',
            'bg-danger/10 ring-danger/20': type === 'error',
          }"
        >
          <i
            class="ri"
            :class="type === 'success' ? 'ri-check-double-line text-success' : 'ri-error-warning-line text-danger'"
            style="font-size: 22px;"
          ></i>
        </div>
        <div class="flex-1 min-w-0 pt-1">
          <p class="text-sm font-love font-bold text-gray-900">{{ title }}</p>
          <p v-if="message" class="mt-1 text-xs text-gray-500 leading-relaxed">{{ message }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <i class="ri ri-close-line" style="font-size: 18px;"></i>
        </button>
      </div>
    </div>
  </Transition>
</template>
