const { createApp } = Vue

createApp({
    data() {
        return {
            characters: [],
            loading: false,
            searchText: '',
            nextPage: 1,
            allLoaded: false,
            searchInitiated: false // Adiciona esta variável para controlar a busca
        }
    },
    computed: {
        filteredCharacters() {
            return this.characters.filter(character => character.name.toLowerCase().includes(this.searchText.toLowerCase()))
        }
    },
    methods: {
        async fetchCharacters() {
            this.searchInitiated = true; // Define como verdadeiro quando a busca é iniciada
            if (this.allLoaded) return;

            this.loading = true;
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${this.nextPage}`);
                const data = await response.json();
                if (data.results.length === 0) {
                    this.allLoaded = true;
                } else {
                    const characterDetails = data.results.map(character => ({
                        id: character.id,
                        name: character.name,
                        image: character.image,
                        status: character.status,
                        species: character.species,
                        showDetails: true
                    }));
                    this.characters = [...this.characters, ...characterDetails];
                    this.nextPage++;
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        translateStatus(status) {
            const statusMap = {
                "Alive": "Vivo",
                "Dead": "Morto",
                "unknown": "Desconhecido"
            };
            return statusMap[status] || status;
        },
        translateSpecies(species) {
            const speciesMap = {
                "Human": "Humano",
                "Alien": "Alienígena"
            };
            return speciesMap[species] || species;
        },
        getStatusClass(status) {
            const statusClassMap = {
                "Alive": "vivo",
                "Dead": "morto",
                "unknown": "desconhecido"
            };
            return statusClassMap[status] || "";
        }
    }
}).mount("#app");
