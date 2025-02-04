<template>
  <div
    v-if="show"
    class="fixed top-5 right-5 flex items-center max-w-md p-4 bg-green-100 border border-green-300 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    <div class="flex-shrink-0">
      <svg
        class="w-6 h-6 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12l2 2l4-4m0 6a9 9 0 11-6-3a9 9 0 016 3z"
        />
      </svg>
    </div>
    <div class="ml-3 text-green-700">
      <p class="text-lg font-medium">Abonnement validé !</p>
      <p class="text-sm">Votre abonnement a été confirmé avec succès.</p>
    </div>
    <button
      @click="closeNotification"
      class="ml-auto text-green-500 hover:text-green-600 transition duration-200"
      aria-label="Fermer"
    >
      <svg
        class="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div v-show="!show" class="text-xl">
    <p>Votre paiement est en cours de traitement...</p>
  </div>

  <div v-show="show" class="text-xl">
    <p>Votre paiement est confirmé ! Merci pour votre confiance babynounu.</p>
  </div>

  <a :href="LinkOpenApp" id="openApp" >Open App</a>
</template>

<style>
/* Ajoute une animation pour la notification */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed {
  animation: fadeIn 0.4s ease-out;
}
</style>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const MODE: any = 'production' // 'development' ou 'production'
const URL_HOST = MODE === 'development' ? 'http://localhost:3000' : 'https://api.babynounu.com'
const LinkOpenApp = ref('')

onMounted(async () => { 
  await axios
    .post(URL_HOST + '/abonnements/comfirm', {
      userId: route.query.userId,
      transactionId: route.query.transactionId,
    })
    .then((response) => {
      if (response.status === 200) {
        show.value = true
        openBabyNounuApp()
      }
    })
})

function openBabyNounuApp() {
    const userAgent = navigator.userAgent || navigator.vendor ;
    const LinkOpenAppO:any = document.querySelector('#openApp')

    if (/android/i.test(userAgent)) {
        // Ouvrir l’application BabyNounu sur Android
        LinkOpenApp.value = 'intent://home#Intent;scheme=com.babynounu.starter;package=com.babynounu.starter;end;';
        LinkOpenAppO?.click()
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        // Ouvrir l’application BabyNounu sur iOS
        location.assign("com.babynounu.starter://home");
    } else {
        alert("Votre appareil ne supporte pas l’ouverture de l’application.");
    }
}


const show = ref(false)

// Nettoyer les écouteurs lors de la destruction du composant
// Fonction pour fermer la notification
const closeNotification = () => {
  show.value = false
}

// Fonction pour valider l'abonnement
</script>
