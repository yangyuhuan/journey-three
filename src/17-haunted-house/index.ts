import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('../assets/textures/door2/baseColor.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '../assets/textures/door2/ambientOcclusion.jpg',
)
const doorHeightTexture = textureLoader.load('../assets/textures/door2/height.png')
const doorNormalTexture = textureLoader.load('../assets/textures/door2/normal.jpg')
const doorMetalnessTexture = textureLoader.load('../assets/textures/door2/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../assets/textures/door2/roughness.jpg')

const brickColorTexture = textureLoader.load('../assets/textures/brick/baseColor.jpg')
const brickAmbientOcclusionTexture = textureLoader.load(
  '../assets/textures/brick/ambientOcclusion.jpg',
)
const brickHeightTexture = textureLoader.load('../assets/textures/brick/height.png')
const brickNormalTexture = textureLoader.load('../assets/textures/brick/normal.jpg')
const brickRoughnessTexture = textureLoader.load('../assets/textures/door2/roughness.jpg')
brickColorTexture.repeat.set(3, 3)
brickAmbientOcclusionTexture.repeat.set(3, 3)
brickHeightTexture.repeat.set(3, 3)
brickNormalTexture.repeat.set(3, 3)
brickRoughnessTexture.repeat.set(3, 3)
brickColorTexture.wrapS = THREE.RepeatWrapping
brickAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
brickHeightTexture.wrapS = THREE.RepeatWrapping
brickNormalTexture.wrapS = THREE.RepeatWrapping
brickRoughnessTexture.wrapS = THREE.RepeatWrapping

brickColorTexture.wrapT = THREE.RepeatWrapping
brickAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
brickHeightTexture.wrapT = THREE.RepeatWrapping
brickNormalTexture.wrapT = THREE.RepeatWrapping
brickRoughnessTexture.wrapT = THREE.RepeatWrapping

const floorColorTexture = textureLoader.load('../assets/textures/floor/baseColor.jpg')
const floorAmbientOcclusionTexture = textureLoader.load(
  '../assets/textures/floor/ambientOcclusion.jpg',
)
const floorHeightTexture = textureLoader.load('../assets/textures/floor/height.png')
const floorNormalTexture = textureLoader.load('../assets/textures/floor/normal.jpg')
const floorRoughnessTexture = textureLoader.load('../assets/textures/door2/roughness.jpg')
floorColorTexture.repeat.set(8, 8)
floorAmbientOcclusionTexture.repeat.set(8, 8)
floorHeightTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorRoughnessTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
floorHeightTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorRoughnessTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
floorHeightTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * object
 * */
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorAmbientOcclusionTexture,
    displacementMap: floorHeightTexture,
    displacementScale: 0.01,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
  }),
)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, 0, 0)
scene.add(plane)

// house
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    displacementMap: brickHeightTexture,
    displacementScale: 0.001,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  }),
)
walls.position.y = 1.25
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
)
house.add(walls)

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.25, 1, 4),
  new THREE.MeshStandardMaterial({
    color: '#b35f45',
  }),
)
roof.rotation.y = Math.PI / 4
roof.position.y = 2.5 + 0.5
house.add(roof)

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(3.2, 2.4, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    // alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.08,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  }),
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
)
door.position.y = 1
door.position.z = 2 + 0.001
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89c854',
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#b2b6b1',
})

for (let i = 0; i < 50; i += 1) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 6
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  grave.position.set(x, 0.3, z)
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

// light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
directionalLight.position.set(1, 0.75, 0)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3)

directionalLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

plane.receiveShadow = true

// fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 4)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.2
controls.maxDistance = 20
controls.minDistance = 4
controls.zoomSpeed = 0.3
controls.maxPolarAngle = 87 * (Math.PI / 180)

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#262837')
renderer.render(scene, camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// tick
const tick = () => {
  stats.begin()
  controls.update()

  // render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
