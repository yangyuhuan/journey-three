import * as THREE from 'three';
import stats from '../common/stats';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const cube =  new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x607d8b
  })
)
scene.add(cube)

const camera = new THREE.PerspectiveCamera( 
  45,
  window.innerWidth / window.innerHeight,
  1,
  100)
camera.position.set(1, 1, 5);
camera.lookAt(cube.position)



const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)


//OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true


const tick = () => {
  stats.begin()
  renderer.render(scene, camera)
  stats.end()

  requestAnimationFrame(tick)
}

tick()




