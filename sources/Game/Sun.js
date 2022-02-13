import * as THREE from 'three'

import Game from './Game.js'

export default class Sun
{
    constructor()
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.debug = this.game.debug

        this.autoUpdate = true
        this.timeProgress = 0
        this.dayProgress = 0
        this.dayDuration = 15 // Seconds
        this.theta = Math.PI * 0.8 // All around the sphere
        this.phi = Math.PI * 0.45 // Elevation

        this.position = { x: 0, y: 0, z: 0 }

        this.setHelper()
        this.setDebug()

        this.update()
    }

    setHelper()
    {
        this.helper = new THREE.Mesh(
            new THREE.SphereGeometry(1, 16, 8),
            new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true })
        )

        this.scene.add(this.helper)
    }

    updatePosition()
    {
        const sinPhiRadius = Math.sin(this.phi)

        this.position.x = sinPhiRadius * Math.sin(this.theta)
        this.position.y = Math.cos(this.phi)
        this.position.z = sinPhiRadius * Math.cos(this.theta)
    }

    update()
    {
        const time = this.game.time

        if(this.autoUpdate)
        {
            this.timeProgress += time.delta * 0.001 / this.dayDuration
            this.dayProgress = this.timeProgress % 1
        }

        const angle = - (this.dayProgress + 0.25) * Math.PI * 2
        this.phi = (Math.sin(angle) * 0.3 + 0.5) * Math.PI
        this.theta = (Math.cos(angle) * 0.3 + 0.5) * Math.PI
        this.updatePosition()

        this.helper.position.copy(this.position).multiplyScalar(5)
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        const debugFolder = debug.ui.addFolder('sun')

        debugFolder
            .add(this, 'autoUpdate')

        debugFolder
            .add(this, 'dayProgress')
            .min(0)
            .max(1)
            .step(0.001)

        debugFolder
            .add(this, 'dayDuration')
            .min(5)
            .max(100)
            .step(1)

        debugFolder
            .add(this, 'theta')
            .min(- Math.PI)
            .max(Math.PI)
            .step(0.001)

        debugFolder
            .add(this, 'phi')
            .min(0)
            .max(Math.PI)
            .step(0.001)
    }
}