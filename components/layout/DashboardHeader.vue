<template>
  <header class="relative bg-white shadow-sm lg:shadow-none lg:border-b lg:border-solid lg:border-b-[#f1f4f1] px-4 sm:px-8 md:px-16 lg:px-40 flex justify-center items-center">
    <div class="w-full max-w-full sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px] mx-auto">
      <div class="flex items-center justify-between h-16 gap-8">
        <div class="flex items-center gap-4 text-primaryText">
          <NuxtLink
            to="/dashboard/"
            class="flex items-center gap-4 text-primaryText hover:text-green-600 transition-colors"
          >
            <div class="size-4">
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
            <h2 class="text-primaryText text-lg font-bold leading-tight tracking-[-0.015em]">
              {{ t('app.name') }}
            </h2>
          </NuxtLink>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-9">
          <nav class="flex items-center gap-9">
            <template
              v-for="link in navigationLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-primaryText text-sm font-medium leading-normal hover:text-green-600 transition-colors"
                :class="{ 'text-green-600': link.activeMatch }"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </nav>
        </div>
        <div class="flex lg:hidden">
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            aria-expanded="false"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              v-if="!isMobileMenuOpen"
              class="block h-6 w-6"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="block h-6 w-6"
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
      </div>
    </div>

    <MobileMenu
      :visible="isMobileMenuOpen"
      :links="navigationLinks || []"
      :on-close="closeMobileMenu"
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNavigationLinks } from '@/composables/useNavigationLinks'
import MobileMenu from './MobileMenu.vue'

const { t } = useI18n()
const isMobileMenuOpen = ref(false)
const navigationLinks = useNavigationLinks()
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
