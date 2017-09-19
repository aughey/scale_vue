<template>
<div>
  <img v-bind:src="url"/>
</div>
</template>

<script>
export default {
  props: ['notes','interval','keysig'],
  mounted: function() {
    this.drawScale();
  },
  data: function() {
      return {
        lilynotes: [],
        url: ""
      }
  },
  watch: {
    notes: function() {
      this.drawScale();
    }
  },
  methods: {
    drawScale() {
      var sharp_to_flat = {
        'C#' : 'Db',
        'D#' : 'Eb',
        'E#' : 'F',
        'F#' : 'Gb',
        'G#' : 'Ab',
        'A#' : 'Bb',
        'B#' : 'C'
      }

      var notes = this.notes;
      var interval = this.interval;

      var key = this.keysig;

      var flat_key = (key.indexOf('b') != -1);

      key = key.replace('#', 'is');
      key = key.replace('b', 'es');

      var out = []

      notes.forEach(function(n) {
        if (flat_key) {
          var check = n.replace(/[0-9]+/, '');
          if (sharp_to_flat[check]) {
            n = sharp_to_flat[check] + n.substr(2);
          }
          if (key == 'Ges' && check == 'B') {
            // One exception for a key that we never use
            n = 'Cb' +
              "'" + n.substr(1)
          }
        }
        if (key == 'F' && n.substr(0, 2) == 'A#') {
          n = 'Bb' + n.substr(2);
        }
        n = n.replace('#', 'is');
        n = n.replace('b', 'es');
        n = n.toLowerCase();
        n = n.replace('3', "");
        n = n.replace('4', "'");
        n = n.replace('5', "''");
        n = n.replace('6', "'''");
        n = n.replace('7', "''''");
        n = n + interval;
        out.push(n)
      });
      //var notes =  "d'1 e' fis' g' a' b' cis'' d''"
      var notes = out.join(' ')
      var host = "http://washucsc.org:3001";
      //var host = "";
      this.lilynotes = notes;

      var scale = this.$el.offsetWidth / 600;
      var dpi = parseInt(72 * scale);

      this.url = host + '/song.png?key=' + key.toLowerCase() + '&dpi=' + dpi + '&notes=' + encodeURIComponent(notes);
    }

  }
}
</script>
