export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale) {
      document.cookie = `i18n_redirected=${storedLocale}; path=/`
    }
  }
})
