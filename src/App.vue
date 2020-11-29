<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@font-face {
  src: url('~@/assets/microgramma.ttf');
  font-family:'Microgramma'
}
@font-face {
  src: url('~@/assets/neue_montreal_regular.woff');
  font-family:'Neue Montreal';
  font-weight:400;
}

html {
  background: #C6AF7E;
}

body, p, h1 {
  margin: 0;
  color: white;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

svg, svg:focus {
    outline:none !important;
}
</style>
