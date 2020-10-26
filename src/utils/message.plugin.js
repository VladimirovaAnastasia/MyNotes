export default {
  install(Vue, options) {
    Vue.prototype.$message = function(html) {
      this.$toasted.show(html, {
        theme: "toasted-primary",
        position: "bottom-center",
        duration : 2000
      });
    };
  }
}
