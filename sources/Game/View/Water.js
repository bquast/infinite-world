import * as THREE from 'three'
import { Water as ThreeWater } from 'three/examples/jsm/objects/Water2.js'

import View from '@/View/View.js'
import State from '@/State/State.js'
import Game from '@/Game.js'

export default class Water
{
    constructor()
    {
        this.view = View.getInstance()
        this.state = State.getInstance()
        this.game = Game.getInstance()
        this.scene = this.view.scene
        
        // Create large water plane with higher resolution for more detailed waves
        const waterGeometry = new THREE.PlaneGeometry(2000, 2000, 60, 60)
        
        // Create texture loader
        const textureLoader = new THREE.TextureLoader()
        
        // Create more dramatic water material with the provided texture
        this.waterMesh = new ThreeWater(waterGeometry, {
            color: '#4fa8ff',
            scale: 8,  // Increased scale for more dramatic waves
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 2048,
            textureHeight: 2048,
            reflectivity: 0.9,  // Higher reflectivity
            distortionScale: 8.0,  // More distortion for choppier waves
            normalMap0: textureLoader.load('sources/Game/waternormals.jpg'),
            normalMap1: textureLoader.load('sources/Game/waternormals.jpg'),
            clipBias: 0.0
        })
        
        // Position water at sea level (y=0)
        this.waterMesh.position.y = 0
        this.waterMesh.rotation.x = -Math.PI * 0.5
        
        // Add water to scene
        this.scene.add(this.waterMesh)
        
        // Add debug controls
        this.setDebug()
    }

    setDebug()
    {
        if(!this.view.debug || !this.view.debug.active)
            return
            
        const folder = this.view.debug.ui.getFolder('view/water')
        
        folder
            .add(this.waterMesh.material, 'transparent')
            
        folder
            .add(this.waterMesh.material, 'opacity')
            .min(0)
            .max(1)
            .step(0.01)
            
        folder
            .add(this.waterMesh.position, 'y')
            .min(-5)
            .max(5)
            .step(0.1)
            .name('waterLevel')
            
        // Enhanced wave controls
        if (this.waterMesh.material.uniforms.config) {
            folder
                .add(this.waterMesh.material.uniforms.config.value, 'w')
                .min(0)
                .max(20)
                .step(0.1)
                .name('waveHeight')
                
            folder
                .add(this.waterMesh.material.uniforms.config.value, 'z')
                .min(0)
                .max(10)
                .step(0.1)
                .name('waveSpeed')
        }
        
        if (this.waterMesh.material.uniforms.distortionScale) {
            folder
                .add(this.waterMesh.material.uniforms.distortionScale, 'value')
                .min(0)
                .max(20)
                .step(0.1)
                .name('distortionScale')
        }
    }

    update()
    {
        // Update water animation with faster speed for more visible waves
        if (this.waterMesh.material.uniforms.time) {
            this.waterMesh.material.uniforms.time.value += 1.5/60.0
        }
        
        // Follow player position
        const playerState = this.state.player
        this.waterMesh.position.set(
            playerState.position.current[0],
            0, // Keep at elevation 0
            playerState.position.current[2]
        )
        
        // Update sun position for reflections
        if (this.state.sun && this.state.sun.position && this.waterMesh.material.uniforms.sunDirection) {
            const sunState = this.state.sun
            this.waterMesh.material.uniforms.sunDirection.value.set(
                sunState.position.x, 
                sunState.position.y,
                sunState.position.z
            ).normalize()
        }
    }
}