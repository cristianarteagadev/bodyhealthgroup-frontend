<template>
  <div class="row container-fluid text-start">
    <h1>Crear Noticia</h1>

    <form>
      <div class="mb-3">
        <label class="form-label"
          >Categoría: <small class="text-danger">(* requerido)</small></label
        >
        <select class="form-select" id="category_id" v-model="category_id">
          <option selected>Seleccionar</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.category_id" class="text-danger">
          <small>{{ errors.category_id }}</small>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Región:</label>
        <select class="form-select" id="region_id" v-model="region_id">
          <option selected>Seleccionar</option>
          <option v-for="region in regions" :key="region.id" :value="region.id">
            {{ region.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label"
          >Contenido de la Noticia:
          <small class="text-danger">(* requerido)</small>
        </label>
        <textarea
          class="form-control"
          v-model="message"
          v-on:input="check"
          id="content"
        ></textarea>
        <input class="input" type="hidden" v-model="limit" v-on:input="check" />
        <small :class="{ help: true, 'is-danger': remaining == 0 }">{{
          instruction
        }}</small>
        <div v-if="errors.content" class="text-danger">
          <small>{{ errors.content }}</small>
        </div>
      </div>
      <hr />
      <div>
        <h5>
          Links Externos:
          <button @click="addReference" class="btn btn-success btn-sm">
            [+] Agregar Referencia
          </button>
        </h5>

        <div
          v-for="(reference, index) in references"
          :key="index"
          class="btn-group mb-3"
        >
          <input
            v-model="reference.name"
            type="text"
            placeholder="Nombre Sitio Web"
            class="form-control"
          />
          <input
            v-model="reference.url"
            type="text"
            placeholder="Dirección de Enlace"
            class="form-control"
          />
          <button @click="removeReference(index)" class="btn btn-danger">
            Eliminar
          </button>
        </div>
      </div>
      <hr />
      <div>
        <h5>
          Tags:
          <button @click="addTag" class="btn btn-success btn-sm">
            [+] Agregar Tag
          </button>
        </h5>

        <div v-for="(tag, index) in tags" :key="index" class="btn-group mb-3">
          <input
            v-model="tag.name"
            type="text"
            placeholder="Ingrese un Tag"
            class="form-control"
          />
          <button @click="removeTag(index)" class="btn btn-danger">
            Eliminar
          </button>
        </div>
      </div>
      <hr />
      <button @click="submitForm" class="btn btn-primary">
        Guardar Noticia
      </button>
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
      limit: 255, //textarea
      message: "", //textarea
      //validar formulario
      category_id: "",
      errors: {},
      //Referencias
      references: [],
      tags: [],
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

      if (this.category_id === "") {
        this.errors.category_id = "Error: Categoría es obligatoria.";
      }

      if (this.message === "") {
        this.errors.content = "Error: Contenido de la Noticia es obligatoria.";
      }

      if (Object.keys(this.errors).length === 0) {
        // Preparando el request payload
        alert("payload");
        const payload = {
          category_id: this.category_id,
          region_id: this.region_id,
          content: this.message,
          links: this.references,
          tags: this.tags,
        };

        // Enviar POST request a la API
        this.axios
          .post("http://127.0.0.1:8000/api/posts", payload)
          .then((response) => {
            console.log("Noticia Guardada:", response);
          })
          .catch((error) => {
            console.error("Error creando la Noticia:", error);
          });
      }
    },

    //Referencias de Links Externos
    addReference(e) {
      e.preventDefault();
      this.references.push({ name: "", url: "" });
    },
    removeReference(index) {
      this.references.splice(index, 1);
    },
    //Referencias de Links Externos
    addTag(e) {
      e.preventDefault();
      this.tags.push({ name: ""});
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
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
