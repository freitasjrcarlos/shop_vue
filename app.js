const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false
  },
  filters: {
    priceNumber(value) {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
    }
  },
  created() {
    this.fetchProducts();
  }
});