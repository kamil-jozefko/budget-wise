<template>
  <client-only>
    <div class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
      <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
        <transition-group
          name="fade"
          tag="div"
          class="space-y-4 max-w-md w-full"
        >
          <div
            v-for="notification in notificationStore.notifications"
            :key="notification.id"
            class="max-w-md w-full bg-white  shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div
                  v-if="notification?.icon"
                  class="flex-shrink-0 mr-3 "
                >
                  <Icon
                    :name="notification?.icon"
                    size="20px"
                  />
                </div>
                <div class="w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ notification.description }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <BaseButton
                    size="sm"
                    @click="notificationStore.removeNotification(notification.id!)"
                  >
                    <span class="sr-only">{{ $t('close') }}</span>
                    <Icon
                      name="tabler:x"
                      size="20px"
                    />
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../../stores/notification'
import BaseButton from '../ui/BaseButton.vue'

const notificationStore = useNotificationStore()
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
