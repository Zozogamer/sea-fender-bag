const mount = document.getElementById('mechanism3d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(3.7, 2.7, 5.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4.1;
controls.maxDistance = 8;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.55;
controls.target.set(0, 0, 0);

const assembly = new THREE.Group();
scene.add(assembly);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbcc5c2,
  roughness: 0.58,
  metalness: 0.03,
  clearcoat: 0.08,
  clearcoatRoughness: 0.52
});

const edgeMaterial = new THREE.MeshStandardMaterial({
  color: 0x8e9895,
  roughness: 0.62,
  metalness: 0.02
});

const innerMaterial = new THREE.MeshStandardMaterial({
  color: 0x747d7a,
  roughness: 0.7,
  metalness: 0.02
});

function addLathe(points, material) {
  const geometry = new THREE.LatheGeometry(
    points.map(([radius, y]) => new THREE.Vector2(radius, y)),
    144
  );
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addTorus(group, radius, tube, y, material) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 128, 20), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addHelix(group, radius, yStart, height, turns, tube, material, phase = 0) {
  const points = Array.from({ length: 280 }, (_, index) => {
    const t = index / 279;
    const angle = phase + t * Math.PI * 2 * turns;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      yStart + t * height,
      Math.sin(angle) * radius
    );
  });
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 280, tube, 12, false), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

const female = new THREE.Group();
female.position.y = 1.02;
assembly.add(female);

female.add(addLathe([
  [0.68, -0.58],
  [1.12, -0.58],
  [1.16, -0.48],
  [1.16, 0.42],
  [1.08, 0.58],
  [0.70, 0.58],
  [0.70, 0.38],
  [0.84, 0.28],
  [0.84, -0.36],
  [0.68, -0.48],
  [0.68, -0.58]
], bodyMaterial));
addTorus(female, 0.78, 0.045, -0.43, innerMaterial);
addTorus(female, 0.83, 0.035, -0.26, innerMaterial);
addTorus(female, 0.83, 0.035, -0.08, innerMaterial);
addTorus(female, 0.83, 0.035, 0.10, innerMaterial);
addTorus(female, 1.12, 0.055, -0.58, edgeMaterial);
addTorus(female, 1.08, 0.05, 0.58, edgeMaterial);

const male = new THREE.Group();
male.position.y = -1.02;
assembly.add(male);

male.add(addLathe([
  [0.52, -0.70],
  [1.06, -0.70],
  [1.12, -0.58],
  [1.12, -0.28],
  [0.74, -0.22],
  [0.74, 0.72],
  [0.52, 0.72],
  [0.52, -0.70]
], bodyMaterial));
addTorus(male, 1.07, 0.055, -0.58, edgeMaterial);
addTorus(male, 0.74, 0.045, 0.72, edgeMaterial);
addHelix(male, 0.79, -0.08, 0.76, 4.2, 0.025, edgeMaterial);
addHelix(male, 0.79, -0.08, 0.76, 4.2, 0.018, bodyMaterial, Math.PI);

assembly.rotation.x = -0.18;
assembly.rotation.z = -0.28;

scene.add(new THREE.HemisphereLight(0xffffff, 0x7f8988, 1.25));

const key = new THREE.DirectionalLight(0xffffff, 1.65);
key.position.set(4, 5, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);

const fill = new THREE.DirectionalLight(0xd9ecff, 0.55);
fill.position.set(-4, 2.6, 3);
scene.add(fill);

function resize() {
  const { clientWidth, clientHeight } = mount;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  camera.updateProjectionMatrix();
}

const observer = new ResizeObserver(resize);
observer.observe(mount);
resize();

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
