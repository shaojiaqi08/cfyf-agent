<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div id="container"></div>
  </div>
</template>

<style lang="scss">
#container {
  width: 800px;
  height: 500px;
  border: 1px solid #ccc;
}
</style>

<script>
// @ is an alias to /src
import G6 from '@antv/g6';
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json')
    .then(res => res.json())
    .then(data => {
      data = Object.assign(data, { label: '=1==', type: 'star', x: 0, y: 0 })
      console.log(data, '====')
      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        linkCenter: true,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model').data;
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          size: [50, 26],
          type: 'rect',
          label: '++++++++',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          style: {
            fill: '#FF9900',
            stroke: '#FF9900',
          },
        },
        defaultEdge: {
          type: 'cubic-vertical',
          style: {
            stroke: '#A3B1BF',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'TB',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 80;
          },
          getHGap: function getHGap() {
            return 20;
          },
        },
      });

      graph.node(function(node) {
        let position = 'left';
        let rotate = 0;
        if (!node.children) {
          position = 'bottom';
          // rotate = Math.PI / 2;
        }
        return {
          label: node.id,
          labelCfg: {
            position,
            offset: 5,
            style: {
              rotate,
              textAlign: 'start',
            },
          },
        };
      });
      
      graph.on('node:click', function(event) {
        console.log(event, '====')
      })

      graph.data(data);
      graph.render();
      graph.fitView();
    });
    }
  }
};
</script>
