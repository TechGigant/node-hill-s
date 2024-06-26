export default class Vector3 {
    x: number
    y: number
    z: number

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    fromVector(vector: Vector3) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        return this
    }

    equalsVector(vector: Vector3) {
        if (this.x === vector.x &&
            this.y === vector.y &&
            this.z === vector.z)
            return true
    }

    addVector(vector: Vector3) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
        return this
    }

    add(x: number, y: number, z: number) {
        this.x += x
        this.y += y
        this.z += z
        return this
    }

    subVector(vector: Vector3) {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
        return this
    }

    sub(x: number, y: number, z: number) {
        this.x -= x
        this.y -= y
        this.z -= z
        return this
    }

    multiplyVector(vector: Vector3) {
        this.x *= vector.x
        this.y *= vector.y
        this.z *= vector.z
        return this
    }

    multiply(x: number, y: number, z: number) {
        this.x *= x
        this.y *= y
        this.z *= z
        return this
    }

    copy() {
        return new Vector3(this.x, this.y, this.z)
    }
}
