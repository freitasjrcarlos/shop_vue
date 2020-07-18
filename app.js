const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    car: [],
    carActive: false,
    alertMessage: "Item adicionado!",
    alert: false,
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
    clickOut({ target, currentTarget }) {
      if (target == currentTarget) {
        this.carActive = false;
      }
    },
    addItem() {
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.car.push({ id, nome, preco });
      this.createAlert(`${nome} adicionado ao carrinho.`);
    },
    removeItem(index) {
      this.car.splice(index, 1);
    },
    checkLocalStorage() {
      if (window.localStorage.car) {
        this.car = JSON.parse(window.localStorage.car);
      }
    },
    compareStock() {
      const items = this.car.filter(({ id }) => {
        if (id == this.product.id) {
          return true;
        }
      });

      this.product.estoque = this.product.estoque - items.length;
    },
    createAlert(message) {
      this.alertMessage = message;
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProductsItem(hash.replace("#", ""));
      }
    },
  },
  watch: {
    product() {
      document.title = this.product.nome || "Shop";
      const hash = this.product.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.product) {
        this.compareStock();
      }
    },
    car() {
      window.localStorage.car = JSON.stringify(this.car);
    }
  },
  created() {
    this.fetchProducts();
    this.router();
    this.checkLocalStorage();
  }
});