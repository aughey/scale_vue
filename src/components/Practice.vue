<template>
  <div class="practice">
  <div>
    Use left and right arrow keys to change first note.  Use up and down arrow keys to change the note value.
    </div>
    Pattern Type: <select id='pattern'>
      <option>Scale</option>
      <option selected>Interval</option>
    </select>
    Repeated Note: <select id='repeatednote'>
      <option selected>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
    </select>
  <div><button id="keydown">Down</button>Key: <span id='key'></span><button id="keyup">Up</button></div>
  <div><button id="countdown">Down</button>Octaves: <span id='count'></span><button id="countup">Up</button></div>
  <div><button id="intervaldown">Down</button>Interval: <span id='interval'></span><button id="intervalup">Up</button></div>
  <div>
  <img id='scale'>
  </div>
  <div class="metronome"></div>
</div>
</template>

<script>
import Tone from 'tone'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App Modified'
    }
  },
  methods: {
    clickMe () {
      console.log("Clicked");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
