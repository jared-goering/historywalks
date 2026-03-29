import * as THREE from "three";
import type { ControlsState } from "@/types";

const MOVE_SPEED = 5;
const SPRINT_MULTIPLIER = 2.5;
const MOUSE_SENSITIVITY = 0.002;
const EYE_HEIGHT = 1.7;

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private euler = new THREE.Euler(0, 0, 0, "YXZ");
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private keys: ControlsState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  };
  private isLocked = false;
  private onMovementCallback: (() => void) | null = null;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.camera.position.y = EYE_HEIGHT;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onPointerLockChange = this.onPointerLockChange.bind(this);
    this.onClick = this.onClick.bind(this);

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.addEventListener("click", this.onClick);
  }

  onMovement(callback: () => void) {
    this.onMovementCallback = callback;
  }

  private onClick() {
    if (!this.isLocked) {
      this.domElement.requestPointerLock();
    }
  }

  private onPointerLockChange() {
    this.isLocked = document.pointerLockElement === this.domElement;
  }

  private onKeyDown(e: KeyboardEvent) {
    const prev = this.anyMovement();
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.shift = true;
        break;
    }
    if (!prev && this.anyMovement()) {
      this.onMovementCallback?.();
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.shift = false;
        break;
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isLocked) return;

    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= e.movementX * MOUSE_SENSITIVITY;
    this.euler.x -= e.movementY * MOUSE_SENSITIVITY;
    this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);

    this.onMovementCallback?.();
  }

  private anyMovement(): boolean {
    return (
      this.keys.forward ||
      this.keys.backward ||
      this.keys.left ||
      this.keys.right
    );
  }

  update(delta: number) {
    const speed = this.keys.shift ? MOVE_SPEED * SPRINT_MULTIPLIER : MOVE_SPEED;

    this.direction.set(0, 0, 0);

    if (this.keys.forward) this.direction.z -= 1;
    if (this.keys.backward) this.direction.z += 1;
    if (this.keys.left) this.direction.x -= 1;
    if (this.keys.right) this.direction.x += 1;

    if (this.direction.lengthSq() === 0) return;

    this.direction.normalize();
    this.direction.applyQuaternion(this.camera.quaternion);
    // Keep movement horizontal (no flying)
    this.direction.y = 0;
    this.direction.normalize();

    this.velocity.copy(this.direction).multiplyScalar(speed * delta);
    this.camera.position.add(this.velocity);
    // Maintain eye height
    this.camera.position.y = EYE_HEIGHT;
  }

  dispose() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.removeEventListener("click", this.onClick);
  }
}
