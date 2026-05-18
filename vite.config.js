import { defineConfig } from 'vite'

export default defineConfig({
  // Base relativa './' permite que o site funcione perfeitamente tanto no
  // domínio personalizado (www.clicanela.com.br) quanto na URL gratuita
  // do GitHub Pages (filipevieira.github.io/clicanela/) ao mesmo tempo!
  base: './'
})
