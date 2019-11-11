<template>
  <section class="menu-test" id = 'background'>
    <h1>ThreeJs Component</h1>
    <div style="width: 100%;
            height: 500px;
            background-color: green; ">
      <canvas style="width: 100%;
            height: 100%;" id="mainDiv"></canvas>
    </div>
  </section>
</template>

<script>
  import * as THREE from 'three'
  export default {
    name: 'ThreeJsTest',
    data () {
      return {
      }
    },
    mounted () {
      this.initThree()
    },
    methods: {
      initThree () {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xb0b0b0)
        var helper = new THREE.GridHelper(20, 20)
        helper.rotation.x = Math.PI / 2
        let canvas = document.getElementById('mainDiv')
        this.scene.add(helper)
        this.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true })
        this.renderer.setSize(canvas.width, canvas.height)

        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let material = new THREE.MeshBasicMaterial({ color: 0x00ddff })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

        this.camera.position.z = 5
        this.animate()
      },
      animate () {
        this.cube.rotation.x += 0.01
        this.cube.rotation.z += 0.01
        this.cube.rotation.y += 0.015
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.animate)
      }
    }
  }
</script>

<style scoped>

</style>
