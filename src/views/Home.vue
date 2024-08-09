<template>
  <div class="home">
    <header class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">Create Your Perfect Custom Card</h1>
        <p class="text-xl mb-8">Design unique cards for any occasion with our easy-to-use editor</p>
        <router-link 
          :to="{ name: 'NewProject' }" 
          class="bg-white text-blue-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
        >
          Get Started
        </router-link>
      </div>
    </header>
    <main class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-500 text-2xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Design Your Card</h3>
            <p>Use our intuitive canvas to create your unique card design</p>
          </div>
          <div class="text-center">
            <div class="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span class="text-purple-500 text-2xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Customize Envelope</h3>
            <p>Add recipient details and choose your envelope options</p>
          </div>
          <div class="text-center">
            <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span class="text-green-500 text-2xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Place Your Order</h3>
            <p>Review your design and we'll deliver your custom cards right to your door</p>
          </div>
        </div>
      </div>
    </main>
    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-semibold text-xl mb-2">Easy-to-Use Editor</h3>
            <p>Our intuitive canvas editor makes designing your card a breeze</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-semibold text-xl mb-2">High-Quality Printing</h3>
            <p>We use top-notch materials and printing techniques for the best results</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-semibold text-xl mb-2">Fast Delivery</h3>
            <p>Get your custom cards delivered quickly and securely</p>
          </div>
        </div>
      </div>
    </section>
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} Custom Card Creator. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  // You can add more component logic here as needed
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>