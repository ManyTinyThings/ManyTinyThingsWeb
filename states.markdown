# States of matter

<script>
    createSimulation({
        controls: ["deltaTemperature"],
        graphs: ["energy"],
        particleGenerator: latticeParticleGenerator,
        parameters: {
            particleCount: 91,
        },
    });
</script>