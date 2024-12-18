// Seeded random class created based on Lehmer/Park-Miller RNG
export class Random {
    constructor(seed) {
        this.seed = seed;
        this.modulus = 2 ** 31 - 1;
        this.a = 16807;
        this.c = 0;
        this.state = seed % this.modulus;
    }

    // Generates float in range [0, 1)
    nextFloat() {
        this.state = (this.a * this.state + this.c) % this.modulus;
        return this.state / this.modulus;
    }

    // Generates int in range [0, max)
    nextInt(max) {
        return Math.floor(max * this.nextFloat());
    }
}