<template>
  <div class="row container-fluid text-start">
    <h1>Crear Noticia</h1>

    <form>
      <div class="mb-3">
        <label class="form-label">Categoría: <small class="text-danger">(* requerido)</small></label>
        <select class="form-select" id="category_id">
          <option selected>Seleccionar</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <div v-if="errors.category_id" class="text-danger"><small>{{ errors.category_id }}</small></div>
      </div>
      <div class="mb-3">
        <label class="form-label">Región:</label>
        <select class="form-select" id="region_id">
          <option selected>Seleccionar</option>
          <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
        </select>
      </div>
      <div class="mb-3">
          <label class="form-label">Contenido de la Noticia: <small class="text-danger">(* requerido)</small> </label>
          <textarea class="form-control" v-model="message" v-on:input="check" id="content"></textarea>
          <input class="input" type="hidden" v-model="limit" v-on:input="check">
          <small :class="{help: true, 'is-danger': remaining==0}">{{instruction}}</small>
          <div v-if="errors.content" class="text-danger"><small>{{ errors.content }}</small></div>  
      </div>

      <button @click="submitForm" class="btn btn-primary">Guardar Noticia</button>
    </form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      categories: [],
      regions: [],
      //limitar caracteres
      limit: 255,//textarea
      message: "",//textarea
      //validar formulario
      category_id: '',
      content: '',
      errors: {}
    };
  },
  created() {
    this.getCategories();
    this.getRegions();
  },
  methods: {
    getCategories() {
      this.axios
        .get("http://127.0.0.1:8000/api/categories")
        .then((response) => {
          this.categories = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRegions() {
      this.axios
        .get("http://127.0.0.1:8000/api/regions")
        .then((response) => {
          this.regions = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dateTime(value) {
      let today = moment().startOf("day");
      let yesterday = moment().subtract(1, "days").startOf("day");

      if (moment(value).isSame(today, "d")) {
        return moment(value).format("[Hoy,] h:mm a");
      } else if (moment(value).isSame(yesterday, "d")) {
        return moment(value).format("[Ayer,] h:mm a");
      } else {
        return moment(value).format("D/MMMM/YYYY, h:mm a");
      }
    },
    check: function () {
      this.message = this.message.substr(0, this.limit);
    },
    //validar formulario
    submitForm(e) {
      e.preventDefault();
      this.errors = {};

      if (!this.category_id) {
        this.errors.category_id = 'Error: Categoría es obligatoria.';
      }

      if (!this.content) {
        this.errors.content = 'Error: Contenido de la Noticia es obligatoria.';
      }

      if (Object.keys(this.errors).length === 0) {
        // acciones posteriores del formulario
        console.log('Formulario enviado');
      }
    }
  },
  computed: {
    instruction: function () {
      return this.message == ""
        ? "Límite: " + this.limit + " caracteres."
        : "Quedan: " + this.remaining + " caracteres.";
    },
    remaining: function () {
      return this.limit - this.message.length;
    },
  },
};
</script>