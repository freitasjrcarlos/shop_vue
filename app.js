const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    car: [],
  },
  filters: {
    priceNumber(value) {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  },
  computed: {
    totalCar() {
      let total = 0;
      if (this.car.length) {
        this.car.forEach(item => {
          total += item.preco;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProducts() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.products = r;
        });
    },
    fetchProductsItem(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.product = r;
        })
    },
    openModal(id) {
      this.fetchProductsItem(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    closeModal({ target, currentTarget }) {
      if (target == currentTarget) {
        this.product = false;
      }
    },
    addItem() {
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.car.push({ id, nome, preco });
    },
    removeItem(index) {
      this.car.splice(index, 1);
    },
    checkLocalStorage() {
      if (window.localStorage.car) {
        this.car = JSON.parse(window.localStorage.car);
      }
    },
  },
  watch: {
    car() {
      window.localStorage.car = JSON.stringify(this.car);
    }
  },
  created() {
    this.fetchProducts();
    this.checkLocalStorage();
  }
});