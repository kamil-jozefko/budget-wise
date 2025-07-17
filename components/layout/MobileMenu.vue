<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed z-30 top-0 left-0 w-full h-full bg-white shadow-lg pt-4 px-2 flex flex-col"
    >
      <div class="flex items-center justify-between px-2 pb-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="size-6">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_6_535)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_535">
                  <rect
                    width="48"
                    height="48"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span class="text-lg font-bold text-primaryText">{{ appName }}</span>
        </div>
        <button
          class="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          @click="onClose"
        >
          <span class="sr-only">Zamknij menu</span>
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav class="flex flex-col gap-1 mt-4">
        <template
          v-for="link in links"
          :key="link.to"
        >
          <NuxtLink
            :to="link.to"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'bg-green-50 text-green-700': link.activeMatch }"
            @click="onClose"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  visible: boolean
  links: Array<{ to: string, label: string, activeMatch?: boolean }>
  onClose: () => void
}>()

const { t } = useI18n()
const appName = t('app.name')
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
