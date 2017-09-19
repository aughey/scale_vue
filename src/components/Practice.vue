<template>
<div class="practice">
  <div>
    Use left and right arrow keys to change first note. Use up and down arrow keys to change the note value.
  </div>
  <v-btn v-on:click="pauseplay()">Play/Pause</v-btn>
  <v-slider v-model="bpm" min=90 max=180 thumb-label persistent-hint v-bind:label="bpmtext" hint="BPM" step="1"></v-slider>
  <v-select v-bind:items="patterns" v-model="pattern" hint="Select Pattern" single-line bottom persistent-hint></v-select>
  <v-divider/>

  <v-select v-bind:items="keys" v-model="key" hint="Select Key" single-line bottom persistent-hint></v-select>
  <v-select v-bind:items="intervals" v-model="interval" hint="Note Value" single-line bottom persistent-hint></v-select>
  <Updown prefix="Key" v-on:down="incrKey(-1)" v-on:up="incrKey(1)" />
  <v-divider/>
  <div>Root Note: {{ scale_degree }}</div>
  <Updown prefix='Root Note' v-on:down="incrNote(-1)" v-on:up="incrNote(1)" />
  <v-divider/>
  <div>Root note starts in octave (4 is middle C): {{ octave_start }}</div>
  <Updown prefix='Octave Start' v-on:down="incrOctaveStart(-1)" v-on:up="incrOctaveStart(1)" />
  <div>Number of Octaves: {{ octaves }}</div>
  <Updown prefix='Octave Count' v-on:down="incrOctaves(-1)" v-on:up="incrOctaves(1)" />
  <v-divider/>
  <v-checkbox label="Up and Down" v-model="upanddown"></v-checkbox>
  <div>
    <img id='scale'>
  </div>
  <Score v-bind:notes="notes" v-bind:keysig="key" v-bind:interval="interval_int" />
  <div class="metronome"></div>
</div>
</template>

<script>
import Tone from 'tone'
import Updown from '@/components/Updown'
import Score from '@/components/Score'
import Store from 'store'
export default {
  data() {
    return {
      patterns: ['Scale', 'Interval'],
      pattern: 'Interval',
      intervals: ['Whole Note', 'Half Note', 'Quarter Note', 'Eighth Note', "Sixteenth Note"],
      interval: 'Whole Note',
      keys: ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
      key: 'C',
      root_note: 1,
      octaves: 1,
      octave_start: 4,
      bpm: 120,
      playing: true,
      upanddown: true,
      notes: []
    }
  },
  components: {
    Updown,
    Score
  },
  computed: {
    bpmtext: function() {
      return "" + this.bpm;
    },
    interval_int: function() {
      var index = this.intervals.indexOf(this.interval);
      return parseInt(Math.pow(2, index))
    },
    scale_degree: function() {
      var names = [
        'Tonic','Supertonic','Mediant','Subdominant','Dominant','Submediant','Leading tone'
      ]
      var prefix = 'th';
      if(this.root_note == 1) {
        prefix = 'st';
      } else if(this.root_note == 2) {
        prefix = 'nd';
      } else if(this.root_note == 3) {
        prefix = 'rd';
      }
      return "" + this.root_note + prefix + " (" + names[this.root_note] + ")";
    }
  },
  mounted() {
    var self = this;

    this.synth = new Tone.Synth({
      envelope: {
        attack: 0.01,
        decay: 100,
        sustain: 1
      }
    }).toMaster();

    var saved_data = Store.get('practice_data');
    if(saved_data) {
      saved_data.forEach((d) => {
        self[d.key] = d.value;
      })
      console.log("Restored previous data");
    }

    Tone.Transport.start()

    var towatch = 'key pattern octaves octave_start interval upanddown root_note'.split(' ');

    var rebuild = function() {
      if (self.p) {
        self.p.stop();
      }
      self.p = self.createPattern();
      self.p.start();

      // Store this for later
      Store.set('practice_data', towatch.map((key) => {
        return {key: key, value: self[key]}
      }));

    }
    rebuild();

    towatch.forEach((w) => {
      this.$watch(w, rebuild);
    });
    this.$watch('bpm', function() {
      Tone.Transport.bpm.value = self.bpm;
    })
    Tone.Transport.bpm.value = self.bpm;
  },
  destroyed() {
    if (this.p) {
      this.p.stop();
    }
  },

  methods: {
    pauseplay() {
      if (!this.p) {
        return;
      }
      if (this.playing) {
        Tone.Transport.stop();
      } else {
        Tone.Transport.start();
      }
      this.playing = !this.playing;
    },
    createPattern() {
      var notes;
      if(this.pattern == 'Scale') {
         notes = this.scale();
       } else {
         notes = this.interval_pattern();
       }

      if (this.upanddown) {
        notes = notes.slice().concat(notes.slice().reverse());
      }

      var self = this;
      var pattern = new Tone.Pattern(function(time, note) {
        self.synth.triggerAttackRelease(note, "" + self.interval_int + "n", time);
      }, notes, "up");
      this.notes = notes;
      pattern.interval = "" + this.interval_int + 'n'
      return pattern;
    },
    incrList(i, cur, list) {
      var index = list.indexOf(cur);
      index = index + i;
      while (index < 0) {
        index = list.length + index;
      }
      index = index % list.length;

      return list[index];
    },
    incrInt(i, cur, max) {
      cur = cur + i;
      while (cur < 0) {
        cur = max + cur;
      }
      return cur % max;
    },
    incrKey(i) {
      this.key = this.incrList(i, this.key, this.keys);
    },
    incrNote(i) {
      this.root_note = this.incrInt(i, this.root_note - 1, 7) + 1;
    },
    incrOctaves(i) {
      var n = this.octaves + i;
      if (n < 1 || n > 3) {
        return;
      }
      this.octaves = n;
    },
    incrOctaveStart(i) {
      var n = this.octave_start + i;
      if (n < 1 || n > 5) {
        return;
      }
      this.octave_start = n;
    },
    interval_pattern() {
      var s = this.scale(1); // Force the scale to start on the root
      var repeat = s[this.root_note - 1];
      var out = [repeat];
      s.forEach(function(n) {
        if(n == repeat) {
          return;
        }
        out.push(n);
        if(n !== repeat) {
          out.push(repeat);
        }
      });
      return out;
    },
    scale(starting_note) {
      if(!starting_note) {
        starting_note = this.root_note;
      }
      var note = this.key + this.octave_start;
      var count = this.octaves;
      var pattern = [
        2,
        2,
        1,
        2,
        2,
        2,
        1
      ];
      var pattern_index = 0;

      var note = new Tone.Frequency(note);

      // Push through to find the actual starting note for this key
      for (var i = 1; i < starting_note; ++i) {
        var t = pattern[pattern_index];
        note = note.transpose(t);
        pattern_index = (pattern_index + 1) % pattern.length;
      }


      var res = [note.toNote()];
      for (var i = 0; i < count; ++i) {
        for (var p = 0; p < pattern.length; ++p) {
          var t = pattern[pattern_index];
          pattern_index = (pattern_index + 1) % pattern.length;
          note = note.transpose(t);
          res.push(note.toNote());
        }
      }
      return res;
    }
  }
}
</script>
